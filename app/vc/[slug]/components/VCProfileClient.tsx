"use client";

import Link from "next/link";
import { useState } from "react";
import StarRating from "@/app/components/ui/StarRating";

// Define types for VC data
export interface VCData {
  _id: string;
  name: string;
  slug: string;
  website?: string;
  description?: string;
  avgResponsiveness: number;
  avgFairness: number;
  avgSupport: number;
  totalReviews: number;
  lastReviewDate?: Date;
}

export interface VCReview {
  _id: string;
  vcId: string;
  vcName: string;
  vcSlug: string;
  industry?: string;
  role?: string;
  companyLocation?: string;
  ratings: {
    responsiveness: number;
    fairness: number;
    support: number;
  };
  reviewHeading: string;
  reviewText: string;
  pros?: string;
  cons?: string;
  fundingStage?: string;
  yearOfInteraction?: string;
  createdAt: string;
}

// Calculate average rating from individual ratings
function calculateAverageRating(ratings: { responsiveness: number, fairness: number, support: number }) {
  const sum = ratings.responsiveness + ratings.fairness + ratings.support;
  return Number((sum / 3).toFixed(1));
}

// Define interface for ReviewsList component props
interface ReviewsListProps {
  reviews: VCReview[];
  totalReviews: number;
  vcSlug: string;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  formatDate: (dateString: string) => string;
}

// Client component for expandable reviews
function ReviewsList({ 
  reviews, 
  totalReviews, 
  vcSlug, 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPrevPage, 
  formatDate 
}: ReviewsListProps) {
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  
  const toggleReview = (reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };
  
  // Calculate average rating from individual ratings
  const calculateReviewRating = (ratings: { responsiveness: number, fairness: number, support: number }) => {
    const sum = ratings.responsiveness + ratings.fairness + ratings.support;
    return Number((sum / 3).toFixed(1));
  };
  
  return (
    <>
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Review Header - Always Visible */}
              <div className="bg-white dark:bg-gray-800 p-4">
                <div className="flex items-start">
                  {/* Anonymous Icon */}
                  <div className="mr-4 mt-1">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{review.reviewHeading}</h3>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>Anonymous</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(review.createdAt)}</span>
                          
                          {review.role && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{review.role}</span>
                            </>
                          )}
                          
                          {review.fundingStage && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Stage: {review.fundingStage}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-2 sm:mt-0">
                        <StarRating value={calculateReviewRating(review.ratings)} edit={false} size={16} />
                        <span className="ml-1 font-medium">{calculateReviewRating(review.ratings).toFixed(1)}</span>
                      </div>
                    </div>
                    
                    {/* Preview of review text - truncated */}
                    <div className="mt-3">
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {review.reviewText}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Read More Button */}
                <div className="text-center mt-3">
                  <button 
                    onClick={() => toggleReview(review._id)}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                  >
                    {expandedReviews[review._id] ? (
                      <>
                        <span>Read less</span>
                        <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Read more</span>
                        <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Expanded Content - Conditionally Visible */}
              {expandedReviews[review._id] && (
                <div className="bg-gray-50 dark:bg-gray-750 p-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Full Review Text */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Review</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{review.reviewText}</p>
                  </div>
                  
                  {/* Pros and Cons */}
                  {(review.pros || review.cons) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {review.pros && (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded border border-green-100 dark:border-green-900">
                          <h5 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Pros</h5>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{review.pros}</p>
                        </div>
                      )}
                      {review.cons && (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded border border-red-100 dark:border-red-900">
                          <h5 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Cons</h5>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{review.cons}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Detailed Ratings */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700">
                      <span className="block text-gray-500 dark:text-gray-400 mb-1">Responsiveness</span>
                      <div className="flex items-center mt-1">
                        <StarRating value={review.ratings.responsiveness} edit={false} size={14} />
                        <span className="ml-1 font-medium">{review.ratings.responsiveness.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700">
                      <span className="block text-gray-500 dark:text-gray-400 mb-1">Fairness</span>
                      <div className="flex items-center mt-1">
                        <StarRating value={review.ratings.fairness} edit={false} size={14} />
                        <span className="ml-1 font-medium">{review.ratings.fairness.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700">
                      <span className="block text-gray-500 dark:text-gray-400 mb-1">Support</span>
                      <div className="flex items-center mt-1">
                        <StarRating value={review.ratings.support} edit={false} size={14} />
                        <span className="ml-1 font-medium">{review.ratings.support.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to leave a review!</p>
          <div className="mt-4">
            <Link 
              href={`/reviews/new?vc=${vcSlug}`} 
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-block"
            >
              Write a Review
            </Link>
          </div>
        </div>
      )}
      
      {/* Pagination for reviews */}
      {reviews.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center rounded-md">
            <Link 
              href={hasPrevPage ? `/vc/${vcSlug}?page=${currentPage - 1}` : '#'} 
              className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${!hasPrevPage ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-disabled={!hasPrevPage}
            >
              Previous
            </Link>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show current page and surrounding pages
              let pageToShow: number;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
              
              return (
                <Link 
                  key={pageToShow}
                  href={`/vc/${vcSlug}?page=${pageToShow}`}
                  className={`px-4 py-2 border-t border-b ${i < 4 ? 'border-r' : ''} border-gray-300 dark:border-gray-600 
                    ${currentPage === pageToShow ? 'bg-gray-50 dark:bg-gray-700 text-black dark:text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {pageToShow}
                </Link>
              );
            })}
            
            <Link 
              href={hasNextPage ? `/vc/${vcSlug}?page=${currentPage + 1}` : '#'}
              className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-disabled={!hasNextPage}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// Page props interface
interface VCProfileClientProps {
  vcData: VCData;
  reviews: VCReview[];
  totalReviews: number;
  currentPage: number;
  totalPages: number;
  slug: string;
}

// Main client component for the VC Profile Page
export default function VCProfileClient({ 
  vcData,
  reviews,
  totalReviews,
  currentPage,
  totalPages,
  slug
}: VCProfileClientProps) {
  // Calculate pagination info
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Format dates consistently
  const formatDate = (dateString: string) => {
    // Use a stable date formatting approach for SSR/CSR compatibility
    const date = new Date(dateString);
    // Format as YYYY-MM-DD to ensure consistent rendering
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Use UTC to prevent timezone issues
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/reviews" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          ← Back to All VCs
        </Link>
      </div>
      
      {/* VC Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{vcData.name}</h1>
            {vcData.website && (
              <a 
                href={vcData.website.startsWith('http') ? vcData.website : `https://${vcData.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
              >
                {vcData.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            
            <div className="flex items-center mt-4">
              <div className="flex">
                <StarRating 
                  value={calculateAverageRating({
                    responsiveness: vcData.avgResponsiveness,
                    fairness: vcData.avgFairness,
                    support: vcData.avgSupport
                  })} 
                  edit={false}
                  size={24}
                />
              </div>
              <span className="ml-2 text-lg font-medium">
                {calculateAverageRating({
                  responsiveness: vcData.avgResponsiveness,
                  fairness: vcData.avgFairness,
                  support: vcData.avgSupport
                }).toFixed(1)}
              </span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-gray-600 dark:text-gray-300">{vcData.totalReviews} reviews</span>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-end">
            <Link 
              href={`/reviews/new?vc=${slug}`} 
              className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-block"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </div>
      
      {/* VC Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">About {vcData.name}</h2>
        <div className="prose dark:prose-invert max-w-none">
          {vcData.description ? (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{vcData.description}</p>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 italic">
              <p>No description available yet for {vcData.name}.</p>
              <p className="mt-2">This section will contain information about the firm, its investment focus, portfolio highlights, and other relevant details.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Responsiveness</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.avgResponsiveness} edit={false} size={24} />
            </div>
            <span className="text-xl font-medium ml-2">{vcData.avgResponsiveness.toFixed(1)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">How quickly they respond to communications and requests</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Fairness</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.avgFairness} edit={false} size={24} />
            </div>
            <span className="text-xl font-medium ml-2">{vcData.avgFairness.toFixed(1)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">How fair their term sheets and negotiations are</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Support</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.avgSupport} edit={false} size={24} />
            </div>
            <span className="text-xl font-medium ml-2">{vcData.avgSupport.toFixed(1)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">The level of support and guidance provided post-investment</p>
        </div>
      </div>
      
      {/* Average Rating and Reviews sections adjacent to each other */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Average Rating Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Average Rating</h2>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl font-bold">
              {calculateAverageRating({
                responsiveness: vcData.avgResponsiveness,
                fairness: vcData.avgFairness,
                support: vcData.avgSupport
              }).toFixed(1)}
            </span>
            <div className="flex items-center">
              <StarRating 
                value={calculateAverageRating({
                  responsiveness: vcData.avgResponsiveness,
                  fairness: vcData.avgFairness,
                  support: vcData.avgSupport
                })}
                edit={false}
                size={20}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                {vcData.totalReviews} {vcData.totalReviews === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <Link 
              href={`/reviews/new?vc=${slug}`} 
              className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-lg text-center font-medium inline-block transition duration-200"
            >
              Write a Review
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
              Share your experience to help other founders make informed decisions.
            </p>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-bold mb-6">Reviews ({totalReviews})</h2>
          
          {/* Client Reviews List Component */}
          <ReviewsList 
            reviews={reviews}
            totalReviews={totalReviews}
            vcSlug={slug}
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
}