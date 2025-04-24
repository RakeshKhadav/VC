import Link from "next/link";
import StarRating from "@/app/components/ui/StarRating";
import ReviewFilters from "@/app/components/ui/ReviewFilters";
import { Suspense } from "react";

// Define review data type for strong typing
export interface Review {
  id: string;
  vcName: string;
  vcSlug: string;
  companyName?: string;
  sector?: string;
  ratings: {
    responsiveness: number;
    fairness: number;
    support: number;
  };
  content: string;
  stage?: string;
  amount?: string;
  year?: string;
  anonymous: boolean;
  authorRole?: string;
  createdAt: string;
}

// Calculate average ratings for a review
const calculateAverageRating = (ratings: { responsiveness: number, fairness: number, support: number }) => {
  const sum = ratings.responsiveness + ratings.fairness + ratings.support;
  return (sum / 3).toFixed(1);
};

// This function would fetch reviews from your database
async function getReviews(searchParams: { [key: string]: string | string[] | undefined }) {
  // Extract filter parameters
  const query = typeof searchParams?.query === 'string' ? searchParams.query : "";
  const pageParam = typeof searchParams?.page === 'string' ? searchParams.page : "1";
  const page = parseInt(pageParam);
  
  // Get additional filters
  const sector = typeof searchParams?.sector === 'string' ? searchParams.sector : "";
  const stage = typeof searchParams?.stage === 'string' ? searchParams.stage : "";
  const minRating = typeof searchParams?.minRating === 'string' ? searchParams.minRating : "";
  const year = typeof searchParams?.year === 'string' ? searchParams.year : "";
  const sortBy = typeof searchParams?.sortBy === 'string' ? searchParams.sortBy : "newest";
  
  // Demonstrate how these variables would be used in an actual implementation
  console.log({query, sector, stage, minRating, year, sortBy});
  
  // TODO: Replace with actual database call
  // Example implementation with a database:
  // const whereClause = {};
  //
  // if (query) {
  //   whereClause.OR = [
  //     { vcName: { contains: query, mode: 'insensitive' } },
  //     { sector: { contains: query, mode: 'insensitive' } },
  //     { content: { contains: query, mode: 'insensitive' } }
  //   ];
  // }
  //
  // if (sector) whereClause.sector = sector;
  // if (stage) whereClause.stage = stage;
  // if (minRating) whereClause.averageRating = { gte: parseFloat(minRating) };
  // if (year) whereClause.year = parseInt(year);
  //
  // const sortOrder = {};
  // switch (sortBy) {
  //   case 'newest':
  //     sortOrder.createdAt = 'desc';
  //     break;
  //   case 'oldest':
  //     sortOrder.createdAt = 'asc';
  //     break;
  //   case 'highest':
  //     sortOrder.averageRating = 'desc';
  //     break;
  //   case 'lowest':
  //     sortOrder.averageRating = 'asc';
  //     break;
  //   default:
  //     sortOrder.createdAt = 'desc';
  // }
  //  
  // return await db.reviews.findMany({
  //   where: whereClause,
  //   skip: (page - 1) * limit,
  //   take: limit,
  //   orderBy: sortOrder
  // });
  
  return {
    reviews: [],
    totalCount: 0,
    currentPage: page,
    totalPages: 0
  };
}

// Loading fallback component
function ReviewsLoading() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
          <div className="flex justify-between items-start">
            <div className="w-1/3">
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
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main review list component
async function ReviewsList({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Await the searchParams Promise before using it
  const resolvedSearchParams = await searchParams;
  
  // Fetch reviews from database
  const { reviews, currentPage, totalPages } = await getReviews(resolvedSearchParams);
  
  // Extract query for pagination
  const query = typeof resolvedSearchParams?.query === 'string' ? resolvedSearchParams.query : "";
  
  // Calculate pagination info
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Check if any filter is applied
  const hasFilters = Boolean(
    query || 
    resolvedSearchParams?.sector || 
    resolvedSearchParams?.stage || 
    resolvedSearchParams?.minRating || 
    resolvedSearchParams?.year || 
    (resolvedSearchParams?.sortBy && resolvedSearchParams?.sortBy !== 'newest')
  );

  // Generate additional query string for pagination URLs
  const additionalQueryParams = new URLSearchParams();
  
  // Safely process searchParams for pagination
  if (resolvedSearchParams) {
    // Extract specific parameters we know are used in our app
    const paramKeys = ['query', 'sector', 'stage', 'minRating', 'year', 'sortBy'];
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
      {/* Reviews list */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review: Review) => (
            <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/vc/${review.vcSlug}`} className="text-xl font-medium hover:underline">
                    {review.vcName}
                  </Link>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Reviewed {new Date(review.createdAt).toLocaleDateString()} 
                    {!review.anonymous && review.companyName && ` by ${review.companyName}`}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">
                    {calculateAverageRating(review.ratings)}
                  </span>
                  <StarRating 
                    value={parseFloat(calculateAverageRating(review.ratings))} 
                    edit={false}
                    size={18}
                  />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Responsiveness:</span>
                  <div className="flex items-center mt-1">
                    <StarRating value={review.ratings.responsiveness} edit={false} size={14} />
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Fairness:</span>
                  <div className="flex items-center mt-1">
                    <StarRating value={review.ratings.fairness} edit={false} size={14} />
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Support:</span>
                  <div className="flex items-center mt-1">
                    <StarRating value={review.ratings.support} edit={false} size={14} />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                  {review.content}
                </p>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Link href={`/vc/${review.vcSlug}`} className="text-sm text-black dark:text-white hover:underline">
                  Read more reviews for {review.vcName} →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No reviews found</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {hasFilters
                ? "No reviews match your search criteria."
                : "Be the first to write a review!"}
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
      {reviews.length > 0 && totalPages > 0 && (
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
        <h1 className="text-3xl font-bold">VC Reviews</h1>
        
        <Link 
          href="/reviews/new" 
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Write a Review
        </Link>
      </div>
      
      {/* Search and filters with Suspense boundary */}
      <Suspense fallback={<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm animate-pulse h-20"></div>}>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <ReviewFilters />
        </div>
      </Suspense>
      
      {/* Reviews list with suspense */}
      <Suspense fallback={<ReviewsLoading />}>
        <ReviewsList searchParams={searchParams || Promise.resolve({})} />
      </Suspense>
    </div>
  );
}