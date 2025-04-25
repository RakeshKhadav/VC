import Link from "next/link";
import { Suspense } from "react";
import ReviewFilters from "@/app/components/ui/ReviewFilters";
import VCCard from "@/app/components/reviews/VCCard";
import { connectToDatabase } from "@/lib/db/mongodb";
import VC from "@/lib/db/models/VC";

// Define VC data type for strong typing
export interface VCData {
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

// This function fetches all VCs from the database
async function getVCs(searchParams: { [key: string]: string | string[] | undefined }) {
  // Extract filter parameters
  const query = typeof searchParams?.query === 'string' ? searchParams.query : "";
  const pageParam = typeof searchParams?.page === 'string' ? searchParams.page : "1";
  const page = parseInt(pageParam) || 1;
  const limit = 9; // Show 9 VCs per page
  
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Build filter object based on search params
    const filter: any = {};
    
    // Text search if query is provided
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Count total documents for pagination
    const totalCount = await VC.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);
    
    // Sort options
    const sortBy = typeof searchParams?.sortBy === 'string' ? searchParams.sortBy : "rating";
    let sortOptions = {};
    
    switch(sortBy) {
      case 'rating':
        // Sort by calculated average rating
        sortOptions = { 
          avgResponsiveness: -1, 
          avgFairness: -1,
          avgSupport: -1
        };
        break;
      case 'reviews':
        sortOptions = { totalReviews: -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      default:
        sortOptions = { 
          avgResponsiveness: -1, 
          avgFairness: -1,
          avgSupport: -1
        };
    }
    
    // Fetch VCs with pagination
    const vcs = await VC.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    // Add calculated average rating for each VC and properly cast to VCData
    const vcsWithAvgRating: VCData[] = vcs.map((vc: any) => {
      const avgRating = (vc.totalReviews > 0 && typeof vc.avgResponsiveness === 'number' && 
                         typeof vc.avgFairness === 'number' && typeof vc.avgSupport === 'number')
        ? Number(((vc.avgResponsiveness + vc.avgFairness + vc.avgSupport) / 3).toFixed(1))
        : 0;
      
      return {
        _id: vc._id ? vc._id.toString() : '',
        name: vc.name || '',
        slug: vc.slug || '',
        website: vc.website as string | undefined,
        avgResponsiveness: typeof vc.avgResponsiveness === 'number' ? vc.avgResponsiveness : 0,
        avgFairness: typeof vc.avgFairness === 'number' ? vc.avgFairness : 0,
        avgSupport: typeof vc.avgSupport === 'number' ? vc.avgSupport : 0,
        totalReviews: typeof vc.totalReviews === 'number' ? vc.totalReviews : 0,
        avgRating,
        lastReviewDate: vc.lastReviewDate ? new Date(vc.lastReviewDate).toISOString() : undefined
      };
    });
    
    return {
      vcs: vcsWithAvgRating,
      totalCount,
      currentPage: page,
      totalPages
    };
    
  } catch (error) {
    console.error("Error fetching VCs:", error);
    return {
      vcs: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0
    };
  }
}

// Loading fallback component
function VCsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
          <div className="flex justify-between items-start">
            <div className="w-2/3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main VCs list component
async function VCsList({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Await the searchParams Promise before using it
  const resolvedSearchParams = await searchParams;
  
  // Fetch VCs from database
  const { vcs, currentPage, totalPages } = await getVCs(resolvedSearchParams);
  
  // Extract query for pagination
  const query = typeof resolvedSearchParams?.query === 'string' ? resolvedSearchParams.query : "";
  
  // Calculate pagination info
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Check if any filter is applied
  const hasFilters = Boolean(
    query || 
    (resolvedSearchParams?.sortBy && resolvedSearchParams?.sortBy !== 'rating')
  );

  // Generate additional query string for pagination URLs
  const additionalQueryParams = new URLSearchParams();
  
  // Safely process searchParams for pagination
  if (resolvedSearchParams) {
    // Extract specific parameters we know are used in our app
    const paramKeys = ['query', 'sortBy'];
    for (const key of paramKeys) {
      const value = resolvedSearchParams[key];
      if (key !== 'page' && value !== undefined) {
        additionalQueryParams.set(key, value.toString());
      }
    }
  }
  
  const queryString = additionalQueryParams.toString();
  
  return (
    <>
      {/* VCs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vcs.length > 0 ? (
          vcs.map((vc: VCData) => (
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
      {vcs.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center rounded-md">
            <Link 
              href={hasPrevPage ? `/reviews?page=${currentPage - 1}${queryString ? `&${queryString}` : ''}` : '#'} 
              className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${!hasPrevPage ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-disabled={!hasPrevPage}
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
                  href={`/reviews?page=${pageToShow}${queryString ? `&${queryString}` : ''}`}
                  className={`px-4 py-2 border-t border-b ${i < 4 ? 'border-r' : ''} border-gray-300 dark:border-gray-600 
                    ${currentPage === pageToShow ? 'bg-gray-50 dark:bg-gray-700 text-black dark:text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {pageToShow}
                </Link>
              );
            })}
            
            <Link 
              href={hasNextPage ? `/reviews?page=${currentPage + 1}${queryString ? `&${queryString}` : ''}` : '#'}
              className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-disabled={!hasNextPage}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// Main page component
export default function ReviewsPage({ 
  searchParams 
}: { 
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
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
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <input
              type="text"
              name="search"
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
        
        <div className="flex gap-4">
          <div className="w-full md:w-auto">
            <select
              name="sortBy"
              defaultValue="rating"
              className="w-full py-2 px-4 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* VCs list with suspense */}
      <Suspense fallback={<VCsLoading />}>
        <VCsList searchParams={searchParams || Promise.resolve({})} />
      </Suspense>
    </div>
  );
}