"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ViewStats {
  viewsThisMonth: number;
  totalViews: number;
  hasReachedLimit: boolean;
  remainingViews: number | 'unlimited';
  isPremium: boolean;
}

export default function ViewLimits() {
  const [viewStats, setViewStats] = useState<ViewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchViewStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user-views');
        
        if (!response.ok) {
          throw new Error('Failed to fetch view limits');
        }
        
        const data = await response.json();
        setViewStats(data.viewStats);
      } catch (err) {
        setError('Unable to load your view statistics');
        console.error('Error fetching view stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchViewStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading view statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-gray-800 dark:border-red-900">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!viewStats) {
    return null;
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-medium text-lg mb-2">Review View Limits</h3>
      
      {viewStats.isPremium ? (
        <div>
          <p className="text-green-600 dark:text-green-400 font-medium">
            Premium Plan
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            You have unlimited access to all reviews. 
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Total views: {viewStats.totalViews}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            Free Plan
          </p>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">Monthly Views</span>
              <span className="font-medium">{viewStats.viewsThisMonth}/6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className={`h-2 rounded-full ${viewStats.hasReachedLimit ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(100, (viewStats.viewsThisMonth / 6) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-sm mt-3">
            {typeof viewStats.remainingViews === 'number' ? (
              viewStats.remainingViews > 0 ? (
                <span className="text-gray-600 dark:text-gray-300">
                  You have <span className="font-medium">{viewStats.remainingViews}</span> review views remaining this month.
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">
                  You've reached your monthly limit of 6 review views.
                </span>
              )
            ) : (
              <span className="text-gray-600 dark:text-gray-300">
                You have unlimited views.
              </span>
            )}
          </p>
          
          {viewStats.hasReachedLimit && (
            <button 
              onClick={() => router.push('/upgrade')}
              className="mt-3 w-full text-center bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      )}
    </div>
  );
}