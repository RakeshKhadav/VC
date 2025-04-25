"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VCCard from "../components/reviews/VCCard";

interface VCData {
  _id: string;
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

// Client component for search functionality
export default function ReviewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sortBy') || 'rating');
  const [vcFirms, setVcFirms] = useState<VCData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle form submission for searching
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    
    // Build the query parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (sortOption !== 'rating') params.set('sortBy', sortOption);
    
    // Navigate to the new URL with search parameters
    router.push(`/reviews?${params.toString()}`);
  };

  // Fetch VC firms data
  useEffect(() => {
    async function fetchVcs() {
      setIsLoading(true);
      
      try {
        // Build query params
        const params = new URLSearchParams();
        const query = searchParams.get('query');
        const sortBy = searchParams.get('sortBy');
        const page = searchParams.get('page') || '1';
        
        if (query) params.set('query', query);
        if (sortBy) params.set('sortBy', sortBy);
        params.set('page', page);
        
        // Fetch data from API
        const response = await fetch(`/api/vcs?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch VC firms');
        }
        
        const data = await response.json();
        setVcFirms(data.vcs || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(parseInt(page));
      } catch (error) {
        console.error('Error fetching VC firms:', error);
        setVcFirms([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVcs();
  }, [searchParams]);

  // Calculate if filters are applied
  const hasFilters = Boolean(
    searchParams.get('query') || 
    (searchParams.get('sortBy') && searchParams.get('sortBy') !== 'rating')
  );

  // Generate pagination query string
  const getPaginationQueryString = () => {
    const params = new URLSearchParams();
    if (searchParams.get('query')) params.set('query', searchParams.get('query')!);
    if (searchParams.get('sortBy')) params.set('sortBy', searchParams.get('sortBy')!);
    return params.toString() ? `&${params.toString()}` : '';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Explore VC Firms</h1>
        
        <Link 
          href="/reviews/new" 
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Write a Review
        </Link>
      </div>
      
      {/* Filter options */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <input
              type="text"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search VC firms..."
              className="w-full py-2 px-4 pr-10 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="w-full md:w-auto">
            <select
              name="sortBy"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full py-2 px-4 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
          <button 
            type="submit"
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
      
      {/* Display VC firms */}
      {isLoading ? (
        <div className="mt-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading VC firms data...
          </p>
        </div>
      ) : (
        <>
          {/* VCs grid */}
          <div className="grid grid-cols-1 gap-6">
            {vcFirms.length > 0 ? (
              vcFirms.map((vc) => (
                <VCCard
                  key={vc._id}
                  id={vc._id}
                  name={vc.name}
                  slug={vc.slug}
                  website={vc.website}
                  avgResponsiveness={vc.avgResponsiveness}
                  avgFairness={vc.avgFairness}
                  avgSupport={vc.avgSupport}
                  totalReviews={vc.totalReviews}
                  avgRating={vc.avgRating}
                  lastReviewDate={vc.lastReviewDate}
                />
              ))
            ) : (
              <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No VCs found</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {hasFilters
                    ? "No VCs match your search criteria."
                    : "Be the first to add a VC firm!"}
                </p>
                <div className="mt-6">
                  <Link 
                    href="/reviews/new" 
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Write a Review
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {vcFirms.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center rounded-md">
                <Link 
                  href={currentPage > 1 ? `/reviews?page=${currentPage - 1}${getPaginationQueryString()}` : '#'} 
                  className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-disabled={currentPage <= 1}
                >
                  Previous
                </Link>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show current page and surrounding pages
                  let pageToShow: number;
                  if (totalPages <= 5) {
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = currentPage - 2 + i;
                  }
                  
                  return (
                    <Link 
                      key={pageToShow}
                      href={`/reviews?page=${pageToShow}${getPaginationQueryString()}`}
                      className={`px-4 py-2 border-t border-b ${i < 4 ? 'border-r' : ''} border-gray-300 dark:border-gray-600 
                        ${currentPage === pageToShow ? 'bg-gray-50 dark:bg-gray-700 text-black dark:text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      {pageToShow}
                    </Link>
                  );
                })}
                
                <Link 
                  href={currentPage < totalPages ? `/reviews?page=${currentPage + 1}${getPaginationQueryString()}` : '#'}
                  className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-disabled={currentPage >= totalPages}
                >
                  Next
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}