"use client";

import Link from "next/link";
import StarRating from "@/app/components/ui/StarRating";
import { useRouter } from "next/navigation";

export interface VCCardProps {
  id: string;
  name: string;
  slug: string;
  website?: string;
  avgResponsiveness: number;
  avgFairness: number;
  avgSupport: number;
  totalReviews: number;
  avgRating: number;
  lastReviewDate?: string;
}

export default function VCCard({ 
  name, 
  slug, 
  website,
  avgResponsiveness,
  avgFairness,
  avgSupport,
  totalReviews,
  avgRating,
  lastReviewDate
}: VCCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/vc/${slug}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="block transition-all hover:shadow-md cursor-pointer"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm h-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-medium">{name}</h3>
            {website && (
              <a 
                href={website.startsWith('http') ? website : `https://${website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-500 dark:text-gray-400 hover:underline mt-1 block"
                onClick={(e) => e.stopPropagation()}
              >
                {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2">{avgRating?.toFixed(1) || "N/A"}</span>
            <StarRating 
              value={avgRating || 0} 
              edit={false}
              size={18}
            />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Responsiveness:</span>
            <div className="flex items-center mt-1">
              <StarRating value={avgResponsiveness || 0} edit={false} size={14} />
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Fairness:</span>
            <div className="flex items-center mt-1">
              <StarRating value={avgFairness || 0} edit={false} size={14} />
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Support:</span>
            <div className="flex items-center mt-1">
              <StarRating value={avgSupport || 0} edit={false} size={14} />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
          
          <span className="text-sm text-black dark:text-white font-medium">
            View details →
          </span>
        </div>
      </div>
    </div>
  );
}