"use client";

import { FC } from 'react';
import Link from 'next/link';
import StarRating from '@/app/components/ui/StarRating';

interface ReviewCardProps {
  id: string;
  vcName: string;
  vcSlug?: string;
  companyName?: string;
  companyIndustry?: string;
  ratings: {
    responsiveness: number;
    fairness: number;
    support: number;
  };
  reviewHeading: string;
  reviewText: string;
  pros?: string;
  cons?: string;
  datePosted: string;
  fundingStage?: string;
  showVCLink?: boolean;
  className?: string;
}

const ReviewCard: FC<ReviewCardProps> = ({
  vcName,
  vcSlug,
  companyIndustry,
  ratings,
  reviewHeading,
  reviewText,
  pros,
  cons,
  datePosted,
  fundingStage,
  showVCLink = true,
  className = '',
}) => {
  // Calculate average rating
  const averageRating = (ratings.responsiveness + ratings.fairness + ratings.support) / 3;
  
  // Format date
  const formattedDate = new Date(datePosted).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Truncate review text if too long
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      {/* Header with VC Name and Rating */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div>
          {showVCLink && vcSlug ? (
            <Link href={`/vc/${vcSlug}`} className="text-lg font-semibold hover:underline">
              {vcName}
            </Link>
          ) : (
            <h3 className="text-lg font-semibold">{vcName}</h3>
          )}
          {companyIndustry && (
            <span className="text-sm text-gray-500 dark:text-gray-400 block mt-1">
              {companyIndustry}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <StarRating value={averageRating} edit={false} />
          <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
            {averageRating.toFixed(1)}
          </span>
        </div>
      </div>
      
      {/* Review Heading */}
      <h4 className="text-xl font-semibold mb-3">{reviewHeading}</h4>
      
      {/* Review Content */}
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {truncateText(reviewText, 300)}
      </p>
      
      {/* Pros and Cons */}
      {(pros || cons) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {pros && (
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <h5 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Pros</h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">{truncateText(pros, 150)}</p>
            </div>
          )}
          {cons && (
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <h5 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Cons</h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">{truncateText(cons, 150)}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Details Footer */}
      <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            Posted {formattedDate}
          </span>
          {fundingStage && (
            <>
              <span className="hidden sm:inline">•</span>
              <span>{fundingStage} stage</span>
            </>
          )}
          <span className="hidden sm:inline">•</span>
          <span>Anonymous</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;