"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import ViewLimits from "@/app/components/user/ViewLimits";

// Define a type for review objects
interface Review {
  id: string;
  vcName: string;
  rating: number;
  content: string;
  date: string;
}

// Helper function for consistent date formatting between server and client
const formatDate = (dateInput: string | Date) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' // Use UTC to prevent timezone issues
  });
};

// Component to handle the search params logic
function ProfileContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'reviews'>(
    tabParam === 'reviews' ? 'reviews' : 'profile'
  );
  const [reviews] = useState<Review[]>([]);
  
  useEffect(() => {
    // Wait for Clerk to load and check auth status
    if (!isLoaded) return;

    async function checkAuth() {
      try {
        // Get a session token to verify auth status
        const token = await getToken();
        
        if (!isSignedIn || !token) {
          // Only redirect if we're sure the user isn't signed in
          router.push(`/sign-in?redirect_url=${encodeURIComponent('/user-profile')}`);
          return;
        }
        
        // User is authenticated
        setIsLoading(false);
        
        // In a real app, you would fetch the user's reviews here
        // For now, we'll use an empty array
        // Example of how you might fetch reviews:
        // const response = await fetch('/api/user/reviews');
        // const data = await response.json();
        // setReviews(data.reviews);
      } catch (error) {
        console.error("Authentication error:", error);
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [isLoaded, isSignedIn, router, getToken]);

  // Show loading state while checking auth
  if (isLoading || !isLoaded || !isSignedIn || !user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderProfileContent = () => (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl font-medium mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
            <p className="text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
            <p className="text-gray-900 dark:text-gray-100">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Member Since</label>
            <p className="text-gray-900 dark:text-gray-100">
              {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </p>
          </div>
        </div>
      </section>
      
      <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Recent Reviews</h3>
          <button 
            onClick={() => setActiveTab('reviews')} 
            className="text-sm text-black dark:text-white hover:underline"
          >
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.slice(0, 2).map((review) => (
              <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{review.vcName}</h4>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">{review.content}</p>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                You haven&apos;t submitted any reviews yet.
              </p>
              <Link href="/reviews/new" className="mt-3 inline-block text-sm font-medium text-black dark:text-white hover:underline">
                Write your first review →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderReviewsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Your Submitted Reviews</h2>
        <Link href="/reviews/new" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
          Write New Review
        </Link>
      </div>
      
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg">{review.vcName}</h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                    Edit
                  </button>
                  <button className="text-sm text-red-500 hover:text-red-600">
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
              <div className="mt-3 border-t border-gray-100 dark:border-gray-700 pt-3">
                <Link href={`/vc/${review.vcName.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-black dark:text-white hover:underline">
                  View Full Review →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No reviews yet</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            You haven&apos;t submitted any reviews yet. Share your experiences with VCs to help other founders.
          </p>
          <div className="mt-6">
            <Link href="/reviews/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white">
              Write Your First Review
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Profile sidebar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm h-fit">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-4">
              {user.imageUrl ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={user.imageUrl} 
                    alt={user.firstName || 'Profile'} 
                    fill
                    sizes="(max-width: 768px) 96px, 96px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-2xl">
                  {(user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '')}
                </div>
              )}
            </div>
            <h2 className="text-xl font-medium">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex w-full items-center py-2 px-3 rounded-md ${
                  activeTab === 'profile' 
                    ? 'bg-gray-100 dark:bg-gray-900' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                </svg>
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`flex w-full items-center py-2 px-3 rounded-md ${
                  activeTab === 'reviews' 
                    ? 'bg-gray-100 dark:bg-gray-900' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                </svg>
                My Reviews
              </button>
              <Link href="/reviews/new" className="flex items-center py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                </svg>
                Write New Review
              </Link>
            </nav>
          </div>
          
          {/* View Limits Card */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
            <ViewLimits />
          </div>
        </div>
        
        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          {activeTab === 'profile' ? renderProfileContent() : renderReviewsContent()}
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingProfile() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the main component with Suspense
export default function UserProfilePage() {
  return (
    <Suspense fallback={<LoadingProfile />}>
      <ProfileContent />
    </Suspense>
  );
}