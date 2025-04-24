"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterOptions {
  sector: string;
  stage: string;
  minRating: string;
  year: string;
  sortBy: string;
}

export default function ReviewFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sector: '',
    stage: '',
    minRating: '',
    year: '',
    sortBy: 'newest'
  });

  // Get current query params
  const query = searchParams?.get("query") || "";
  
  // Set filter options from URL params on first render
  useEffect(() => {
    setFilterOptions({
      sector: searchParams?.get("sector") || '',
      stage: searchParams?.get("stage") || '',
      minRating: searchParams?.get("minRating") || '',
      year: searchParams?.get("year") || '',
      sortBy: searchParams?.get("sortBy") || 'newest'
    });
  }, [searchParams]);
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply filters
  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct URL with filter parameters
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (filterOptions.sector) params.set('sector', filterOptions.sector);
    if (filterOptions.stage) params.set('stage', filterOptions.stage);
    if (filterOptions.minRating) params.set('minRating', filterOptions.minRating);
    if (filterOptions.year) params.set('year', filterOptions.year);
    if (filterOptions.sortBy) params.set('sortBy', filterOptions.sortBy);
    
    // Navigate to the filtered URL
    router.push(`/reviews?${params.toString()}`);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilterOptions({
      sector: '',
      stage: '',
      minRating: '',
      year: '',
      sortBy: 'newest'
    });
    
    // Navigate to the base URL without filters
    if (query) {
      router.push(`/reviews?query=${query}`);
    } else {
      router.push('/reviews');
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <form action="/reviews" method="GET" className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                name="query"
                placeholder="Search for VC firms or by industry..."
                defaultValue={query}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
        <div className="ml-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border ${showFilters ? 'bg-gray-100 dark:bg-gray-700' : ''} border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center`}
          >
            <span>Filter</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter options - show when filter button is clicked */}
      {showFilters && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 animate-fadeIn">
          <form onSubmit={applyFilters}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Industry/Sector Filter */}
              <div>
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry / Sector
                </label>
                <select
                  id="sector"
                  name="sector"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={filterOptions.sector}
                  onChange={handleFilterChange}
                >
                  <option value="">All Sectors</option>
                  <option value="fintech">FinTech</option>
                  <option value="healthtech">HealthTech</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="saas">SaaS</option>
                  <option value="ai">AI/Machine Learning</option>
                  <option value="consumer">Consumer</option>
                  <option value="enterprise">Enterprise Software</option>
                  <option value="hardware">Hardware</option>
                  <option value="marketplaces">Marketplaces</option>
                  <option value="edtech">EdTech</option>
                  <option value="cleantech">CleanTech</option>
                </select>
              </div>
              
              {/* Funding Stage Filter */}
              <div>
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Funding Stage
                </label>
                <select
                  id="stage"
                  name="stage"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={filterOptions.stage}
                  onChange={handleFilterChange}
                >
                  <option value="">All Stages</option>
                  <option value="pre-seed">Pre-seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B</option>
                  <option value="series-c">Series C</option>
                  <option value="later-stage">Later stage</option>
                </select>
              </div>
              
              {/* Minimum Rating Filter */}
              <div>
                <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Rating
                </label>
                <select
                  id="minRating"
                  name="minRating"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={filterOptions.minRating}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Rating</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Star</option>
                </select>
              </div>
              
              {/* Year Filter */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={filterOptions.year}
                  onChange={handleFilterChange}
                >
                  <option value="">All Years</option>
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {/* Sort By Filter */}
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  name="sortBy"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={filterOptions.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Clear Filters
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}