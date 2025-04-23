"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define interface for VC data including rating information
interface PopularVC {
  id: string;
  name: string;
  slug: string; 
  rating: number;
  reviewCount: number;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [popularVCs, setPopularVCs] = useState<PopularVC[]>([]);
  const [isLoadingVCs, setIsLoadingVCs] = useState(true);

  useEffect(() => {
    // Wait for Clerk to load and check auth status
    if (!isLoaded) return;

    async function checkAuth() {
      try {
        // Get a session token to verify auth status
        const token = await getToken();
        
        if (!isSignedIn || !token) {
          // Only redirect if we're sure the user isn't signed in
          router.push(`/sign-in?redirect_url=${encodeURIComponent('/dashboard')}`);
          return;
        }
        
        // User is authenticated
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [isLoaded, isSignedIn, router, getToken]);

  // Fetch popular VCs data
  useEffect(() => {
    async function fetchPopularVCs() {
      try {
        setIsLoadingVCs(true);
        
        // This would be replaced with an actual API call in production
        // Example: const response = await fetch('/api/vcs/popular');
        // const data = await response.json();
        // setPopularVCs(data.vcs);

        // For now, use mock data
        const mockVCs: PopularVC[] = [
          { id: '1', name: 'Sequoia Capital', slug: 'sequoia-capital', rating: 4.8, reviewCount: 243 },
          { id: '2', name: 'Andreessen Horowitz', slug: 'andreessen-horowitz', rating: 4.7, reviewCount: 189 },
          { id: '3', name: 'Y Combinator', slug: 'y-combinator', rating: 4.9, reviewCount: 278 },
          { id: '4', name: 'Accel', slug: 'accel', rating: 4.5, reviewCount: 156 },
          { id: '5', name: 'Benchmark', slug: 'benchmark', rating: 4.6, reviewCount: 132 },
        ];
        
        // Sort by rating (highest first)
        const sortedVCs = [...mockVCs].sort((a, b) => b.rating - a.rating);
        
        // Take top 4 VCs
        setPopularVCs(sortedVCs.slice(0, 4));
        setIsLoadingVCs(false);
      } catch (error) {
        console.error('Error fetching popular VCs:', error);
        setIsLoadingVCs(false);
      }
    }

    // Only fetch when user is authenticated
    if (!isLoading && isSignedIn) {
      fetchPopularVCs();
    }
  }, [isLoading, isSignedIn]);

  // Show loading state while checking auth
  if (isLoading || !isLoaded || !isSignedIn) {
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

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
          {rating.toFixed(1)} ({popularVCs.find(vc => vc.rating === rating)?.reviewCount || 0})
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.firstName || 'User'}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/reviews/new" 
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
              </svg>
              Write a New Review
            </Link>
            <Link 
              href="/user-profile" 
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
              </svg>
              View Your Profile
            </Link>
            <Link 
              href="/user-profile?tab=reviews" 
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
              </svg>
              Manage Your Reviews
            </Link>
          </div>
        </div>
        
        {/* Recent Activity Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="py-4 flex flex-col space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You haven&apos;t submitted any reviews yet.
              </p>
              <Link 
                href="/reviews/new" 
                className="text-sm font-medium text-black dark:text-white hover:underline"
              >
                Write your first review →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Popular VCs Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-4">Popular VCs</h2>
          {isLoadingVCs ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse p-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {popularVCs.map((vc) => (
                <div 
                  key={vc.id} 
                  className="p-3 flex flex-col border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{vc.name}</span>
                    <Link 
                      href={`/vc/${vc.slug}`}
                      className="text-sm text-black dark:text-white hover:underline"
                    >
                      View
                    </Link>
                  </div>
                  {renderStarRating(vc.rating)}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Reviews Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Recent Reviews</h2>
            <Link 
              href="/reviews" 
              className="text-sm font-medium text-black dark:text-white hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No reviews available yet. Check back soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}