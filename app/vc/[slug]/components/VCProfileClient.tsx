"use client";

import Link from "next/link";
import { useState } from "react";
import StarRating from "@/app/components/ui/StarRating";
import { motion, AnimatePresence } from "framer-motion";

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
  investmentAmount?: string; // Changed from number to string to match the data format "500k-1m"
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
            <div key={review._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Review Header - Always Visible */}
              <div className="bg-white dark:bg-gray-800 p-5">
                <div className="flex items-start">
                  {/* Anonymous Icon */}
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      {/* Left side - Anonymous and Date */}
                      <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
                        <span>Anonymous</span>
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                      
                      {/* Right side - Star Rating */}
                      <div className="flex items-center">
                        <StarRating value={calculateReviewRating(review.ratings)} edit={false} size={18} />
                      </div>
                    </div>
                    
                    {/* Tags row - Exactly matching the screenshot */}
                    <div className="flex flex-wrap gap-2 mt-3 mb-2">
                      {/* Role tag - e.g. "Founder" */}
                      {review.role && (
                        <span className="px-3 py-0.5 bg-black dark:bg-black text-white dark:text-white rounded-full text-xs">
                          {review.role}
                        </span>
                      )}
                      
                      {/* Stage tag - "Stage: seed" */}
                      {review.fundingStage && (
                        <span className="px-3 py-0.5 bg-black dark:bg-black text-white dark:text-white rounded-full text-xs">
                          Stage: {review.fundingStage}
                        </span>
                      )}
                      
                      {/* Industry Tag - "Industry: saas" */}
                      {review.industry && (
                        <span className="px-3 py-0.5 bg-black dark:bg-black text-white dark:text-white rounded-full text-xs">
                          Industry: {review.industry}
                        </span>
                      )}
                      
                      {/* Location Tag - "Location: sf" */}
                      {review.companyLocation && (
                        <span className="px-3 py-0.5 bg-black dark:bg-black text-white dark:text-white rounded-full text-xs">
                          Location: {review.companyLocation}
                        </span>
                      )}
                      
                      {/* Investment amount tag */}
                      {review.investmentAmount && review.investmentAmount.trim() !== "" && (
                        <span className="px-3 py-0.5 bg-black dark:bg-black text-white dark:text-white rounded-full text-xs">
                          Amount: {review.investmentAmount}
                        </span>
                      )}
                      
                      {/* Year of Investment Tag */}
                      {review.yearOfInteraction && review.yearOfInteraction.trim() !== "" && (
                        <span className="px-3 py-0.5 bg-black dark:bg-black text-white dark:text-white rounded-full text-xs">
                          Year: {review.yearOfInteraction}
                        </span>
                      )}
                    </div>
                    
                    {/* Review Title - BOLD */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1 mb-3">{review.reviewHeading}</h3>
                    
                    {/* Read More Button - Only shown in collapsed state */}
                    {!expandedReviews[review._id] && (
                      <div className="text-center mt-4">
                        <motion.button 
                          onClick={() => toggleReview(review._id)}
                          className="inline-flex items-center text-black dark:text-white font-medium focus:outline-none"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          Read more
                          <motion.svg 
                            className="h-5 w-5 ml-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            animate={{ y: 2 }}
                            transition={{ duration: 0.3 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Animated Expanded Content - Conditionally Visible */}
              <AnimatePresence>
                {expandedReviews[review._id] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-white dark:bg-gray-800 overflow-hidden border-t border-gray-100 dark:border-gray-700"
                  >
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="p-5"
                    >
                      {/* Detailed Ratings at top of read more section */}
                      <div className="grid grid-cols-3 gap-4 text-sm mb-6">
                        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm text-gray-600 dark:text-gray-300 mb-1">Responsiveness</span>
                          <div className="flex items-center">
                            <StarRating value={review.ratings.responsiveness} edit={false} size={16} />
                          </div>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm text-gray-600 dark:text-gray-300 mb-1">Fairness</span>
                          <div className="flex items-center">
                            <StarRating value={review.ratings.fairness} edit={false} size={16} />
                          </div>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm text-gray-600 dark:text-gray-300 mb-1">Support</span>
                          <div className="flex items-center">
                            <StarRating value={review.ratings.support} edit={false} size={16} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Review Text moved to the expanded area */}
                      <div className="mb-6">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {review.reviewText}
                        </p>
                      </div>
                      
                      {/* Pros and Cons */}
                      {(review.pros || review.cons) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {review.pros && (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2, duration: 0.3 }}
                              className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800"
                            >
                              <h5 className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">Pros</h5>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{review.pros}</p>
                            </motion.div>
                          )}
                          {review.cons && (
                            <motion.div 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3, duration: 0.3 }}
                              className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800"
                            >
                              <h5 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2">Cons</h5>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{review.cons}</p>
                            </motion.div>
                          )}
                        </div>
                      )}
                      
                      {/* Read Less Button - Now at the bottom of expanded content */}
                      <div className="text-center mt-2">
                        <motion.button 
                          onClick={() => toggleReview(review._id)}
                          className="inline-flex items-center text-black dark:text-white font-medium focus:outline-none"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          Read less
                          <motion.svg 
                            className="h-5 w-5 ml-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            animate={{ y: -2 }}
                            transition={{ duration: 0.3 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </motion.svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-750 rounded-lg">
          <div className="max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No reviews yet</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Be the first to share your experience with this VC firm.</p>
            <Link 
              href={`/reviews/new?vc=${vcSlug}`} 
              className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-block"
            >
              Write a Review
            </Link>
          </div>
        </div>
      )}
      
      {/* Pagination for reviews */}
      {reviews.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center rounded-md shadow-sm">
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
                    ${currentPage === pageToShow ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-medium' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
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
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">How quickly they respond to communications and requests</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Fairness</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.avgFairness} edit={false} size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">How fair their term sheets and negotiations are</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Support</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.avgSupport} edit={false} size={24} />
            </div>
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