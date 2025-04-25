"use client";

import StarRating from "@/app/components/ui/StarRating";
import { useRouter } from "next/navigation";
import Card from "@/app/components/common/Card";

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
  totalReviews,
  avgRating
}: VCCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/vc/${slug}`);
  };

  // Create card title with name and rating
  const cardTitle = (
    <div className="flex justify-between items-center w-full">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
      <div className="flex items-center">
        <StarRating 
          value={avgRating || 0} 
          edit={false}
          size={24}
        />
        {/* <span className="ml-2 font-semibold text-gray-800 dark:text-gray-200">
          {avgRating?.toFixed(1) || "N/A"}
        </span> */}
      </div>
    </div>
  );

  // Create card footer with explore button and reviews count
  const cardFooter = (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
      </div>
      <button 
        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/vc/${slug}`);
        }}
      >
        Explore VC
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );

  return (
    <div 
      onClick={handleCardClick}
      className="w-full transition-all hover:shadow-lg cursor-pointer"
    >
      <Card
        title={cardTitle}
        footer={cardFooter}
        padding="md"
        borderless={true}
        className="border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {/* Placeholder for VC description - will be populated from database */}
          <p className="line-clamp-2">VC firm specializing in early-stage investments across various sectors.</p>
        </div>
      </Card>
    </div>
  );
}