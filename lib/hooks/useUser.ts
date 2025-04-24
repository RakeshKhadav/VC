import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface UserReviewLimits {
  viewsThisMonth: number;
  remainingViews: number | 'unlimited';
  isPremium: boolean;
  plan: 'free' | 'premium';
}

interface UseUserResult {
  user: UserReviewLimits | null;
  isLoading: boolean;
  error: Error | null;
  canViewReview: boolean;
  upgradeRequired: boolean;
  upgradeUser: () => Promise<boolean>;
}

export function useUser(): UseUserResult {
  const { isLoaded, isSignedIn } = useAuth();
  const [user, setUser] = useState<UserReviewLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user data including review limits
  const fetchUserData = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching user data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  // Upgrade user to premium plan
  const upgradeUser = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: 'premium' }),
      });

      if (!response.ok) {
        throw new Error('Failed to upgrade plan');
      }

      const data = await response.json();
      setUser(prev => prev ? { ...prev, ...data.user } : data.user);
      return true;
    } catch (err) {
      console.error('Error upgrading user:', err);
      return false;
    }
  }, []);

  // Load user data on initial render
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Determine if user can view a review
  const canViewReview = Boolean(
    user?.isPremium || 
    (user?.remainingViews === 'unlimited' || (user?.remainingViews && user.remainingViews > 0))
  );

  // Determine if upgrade is required
  const upgradeRequired = Boolean(
    !user?.isPremium && 
    (user?.remainingViews !== 'unlimited' && user?.remainingViews !== undefined && user.remainingViews <= 0)
  );

  return {
    user,
    isLoading,
    error,
    canViewReview,
    upgradeRequired,
    upgradeUser,
  };
}