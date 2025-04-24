"use client";

import StarRating from '@/app/components/ui/StarRating';
import Card from '@/app/components/common/Card';

interface RatingCategory {
  value: number;
  label: string;
  description: string;
}

interface RatingSummaryProps {
  ratings: {
    responsiveness: number;
    fairness: number;
    support: number;
  };
}

export default function RatingSummary({ ratings }: RatingSummaryProps) {
  const ratingCategories: RatingCategory[] = [
    {
      value: ratings.responsiveness,
      label: "Responsiveness",
      description: "How quickly they respond to communications and requests"
    },
    {
      value: ratings.fairness,
      label: "Fairness",
      description: "How fair their term sheets and negotiations are"
    },
    {
      value: ratings.support,
      label: "Support",
      description: "The level of support and guidance provided post-investment"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ratingCategories.map((category) => (
        <Card key={category.label} className="h-full" padding="md">
          <h3 className="text-lg font-medium mb-4">{category.label}</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={category.value} edit={false} size={24} />
            </div>
            <span className="text-xl font-medium ml-2">{category.value.toFixed(1)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
        </Card>
      ))}
    </div>
  );
}