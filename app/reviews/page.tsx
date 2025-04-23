import Link from "next/link";
import StarRating from "@/app/components/ui/StarRating";

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
async function getReviews(searchQuery?: string, page: number = 1) {
  // TODO: Replace with actual database call
  // Example implementation with a database:
  // return await db.reviews.findMany({
  //   where: searchQuery ? {
  //     OR: [
  //       { vcName: { contains: searchQuery, mode: 'insensitive' } },
  //       { sector: { contains: searchQuery, mode: 'insensitive' } },
  //       { content: { contains: searchQuery, mode: 'insensitive' } }
  //     ]
  //   } : undefined,
  //   skip: (page - 1) * limit,
  //   take: limit,
  //   orderBy: { createdAt: 'desc' }
  // });
  
  return {
    reviews: [],
    totalCount: 0,
    currentPage: page,
    totalPages: 0
  };
}

export default async function ReviewsPage() {
  // Get search parameters from URL without using props or searchParams
  const url = new URL(process.env.VERCEL_URL || process.env.NEXT_PUBLIC_URL || "http://localhost:3000");
  const query = url.searchParams.get("query") || "";
  const pageParam = url.searchParams.get("page") || "1";
  const page = parseInt(pageParam);
  
  // Fetch reviews from database
  const { reviews, currentPage, totalPages } = await getReviews(query, page);
  
  // Calculate total pages for pagination
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">VC Reviews</h1>
        
        <div className="flex space-x-2">
          <Link 
            href="/reviews/new" 
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Write a Review
          </Link>
          
          <button 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Filter
          </button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
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
              {query ? `No reviews match your search for "${query}"` : "Be the first to write a review!"}
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
      {reviews.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center rounded-md">
            <Link 
              href={hasPrevPage ? `/reviews?page=${currentPage - 1}${query ? `&query=${query}` : ''}` : '#'} 
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
                  href={`/reviews?page=${pageToShow}${query ? `&query=${query}` : ''}`}
                  className={`px-4 py-2 border-t border-b ${i < 4 ? 'border-r' : ''} border-gray-300 dark:border-gray-600 
                    ${currentPage === pageToShow ? 'bg-gray-50 dark:bg-gray-700 text-black dark:text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {pageToShow}
                </Link>
              );
            })}
            
            <Link 
              href={hasNextPage ? `/reviews?page=${currentPage + 1}${query ? `&query=${query}` : ''}` : '#'}
              className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-disabled={!hasNextPage}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}