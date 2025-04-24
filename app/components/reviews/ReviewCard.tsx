"use client";

import Link from 'next/link';
import StarRating from '@/app/components/ui/StarRating';

interface Rating {
  responsiveness: number;
  fairness: number;
  support: number;
}

export interface ReviewCardProps {
  id: string;
  vcName: string;
  vcSlug: string;
  author?: string;
  companyName?: string;
  companyRole?: string;
  date: string | Date;
  content: string;
  rating: number | Rating;
  anonymous?: boolean;
}

export default function ReviewCard({
  id,
  vcName,
  vcSlug,
  author,
  companyName,
  companyRole,
  date,
  content,
  rating,
  anonymous = false
}: ReviewCardProps) {
  // Format date
  const formattedDate = date instanceof Date 
    ? date.toLocaleDateString() 
    : new Date(date).toLocaleDateString();

  // Calculate average rating if rating is an object
  const averageRating = typeof rating === 'number'
    ? rating
    : ((rating.responsiveness + rating.fairness + rating.support) / 3);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <Link href={`/vc/${vcSlug}`} className="text-xl font-medium hover:underline">
            {vcName}
          </Link>
          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <StarRating value={averageRating} edit={false} size={18} />
              <span className="ml-2">{typeof averageRating === 'number' ? averageRating.toFixed(1) : ''}</span>
            </div>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
            {!anonymous && companyName && (
              <>
                <span className="mx-2">•</span>
                <span>{companyName}</span>
              </>
            )}
            {!anonymous && companyRole && (
              <>
                <span className="mx-2">•</span>
                <span>{companyRole}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300">{content}</p>
      
      {typeof rating !== 'number' && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Responsiveness:</span>
            <div className="flex items-center mt-1">
              <StarRating value={rating.responsiveness} edit={false} size={14} />
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Fairness:</span>
            <div className="flex items-center mt-1">
              <StarRating value={rating.fairness} edit={false} size={14} />
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Support:</span>
            <div className="flex items-center mt-1">
              <StarRating value={rating.support} edit={false} size={14} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}