"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '../common/Button';

export default function ExploreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial values from URL
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating');

  // Handle search submission
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    
    // Reset to first page when search changes
    params.delete('page');
    
    router.push(`/explore?${params.toString()}`);
  };

  // Handle search on Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle sort changes
  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSortBy) {
      params.set('sortBy', newSortBy);
    } else {
      params.delete('sortBy');
    }
    
    setSortBy(newSortBy);
    router.push(`/explore?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setQuery('');
    setSortBy('rating');
    router.push('/explore');
  };

  return (
    <div className="w-full">
      {/* Main search row: Search bar with buttons aligned on same row */}
      <div className="flex flex-row items-center gap-2">
        {/* Search bar */}
        <div className="relative flex-grow">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            placeholder="Search for VC firms or by industry..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="Search VC firms"
          />
        </div>

        {/* Search button */}
        <Button 
          variant="primary" 
          className="whitespace-nowrap px-6"
          onClick={handleSearch}
        >
          Search
        </Button>

        {/* Filter button */}
        <Button 
          variant="outline" 
          className="whitespace-nowrap flex items-center gap-1"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filter
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </div>

      {/* Expandable filter section */}
      {showFilters && (
        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Sort by</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSortChange('rating')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    sortBy === 'rating' 
                      ? 'bg-black text-white dark:bg-white dark:text-black' 
                      : 'bg-white dark:bg-gray-700'
                  }`}
                >
                  Rating
                </button>
                <button
                  onClick={() => handleSortChange('reviews')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    sortBy === 'reviews' 
                      ? 'bg-black text-white dark:bg-white dark:text-black' 
                      : 'bg-white dark:bg-gray-700'
                  }`}
                >
                  Review Count
                </button>
                <button
                  onClick={() => handleSortChange('name')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    sortBy === 'name' 
                      ? 'bg-black text-white dark:bg-white dark:text-black' 
                      : 'bg-white dark:bg-gray-700'
                  }`}
                >
                  Name
                </button>
              </div>
            </div>

            <Button 
              variant="ghost" 
              className="self-end text-sm"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}