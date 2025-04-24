import { useState, useCallback, useEffect } from 'react';

interface ReviewRatings {
  responsiveness: number;
  fairness: number;
  support: number;
}

export interface Review {
  _id: string;
  userId: string;
  vcName: string;
  vcId?: string;
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  role?: string;
  companyLocation?: string;
  ratings: ReviewRatings;
  reviewText: string;
  fundingStage?: string;
  investmentAmount?: string;
  yearOfInteraction?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UseReviewsResult {
  reviews: Review[];
  pagination: Pagination;
  isLoading: boolean;
  error: Error | null;
  fetchReviews: (params: Record<string, string | number>) => Promise<void>;
  fetchReviewById: (id: string) => Promise<Review | null>;
}

export function useReviews(initialParams: Record<string, string | number> = {}): UseReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch reviews with filters and pagination
  const fetchReviews = useCallback(async (params: Record<string, string | number> = {}) => {
    try {
      setIsLoading(true);
      
      // Build query string from params
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      
      const response = await fetch(`/api/reviews?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      
      setReviews(data.reviews);
      setPagination(data.pagination);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to fetch a single review by ID
  const fetchReviewById = useCallback(async (id: string): Promise<Review | null> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/reviews/${id}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          // This is a freemium limit case - handle it in the UI
          const errorData = await response.json();
          throw new Error(errorData.message || 'You have reached your monthly review limit');
        }
        throw new Error('Failed to fetch review');
      }
      
      const data = await response.json();
      return data.review;
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching review:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch reviews on initial load with any provided params
  useEffect(() => {
    if (Object.keys(initialParams).length > 0) {
      fetchReviews(initialParams);
    }
  }, [fetchReviews, initialParams]);

  return {
    reviews,
    pagination,
    isLoading,
    error,
    fetchReviews,
    fetchReviewById
  };
}