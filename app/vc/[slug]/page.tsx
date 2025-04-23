import Link from "next/link";
import { notFound } from "next/navigation";
import StarRating from "@/app/components/ui/StarRating";
import { Review } from "@/app/reviews/page";

// Define types for VC data
export interface VCData {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  description?: string;
  averageRating: number;
  totalReviews: number;
  ratings: {
    responsiveness: number;
    fairness: number;
    support: number;
  };
}

export interface VCReview {
  id: string;
  date: string;
  rating: number;
  content: string;
  author: string;
  ratings?: {
    responsiveness: number;
    fairness: number;
    support: number;
  };
  companyName?: string;
  companyRole?: string;
}

// These functions would fetch data from your database
async function getVCData(slug: string): Promise<VCData | null> {
  // TODO: Replace with actual database call
  // Example implementation with a database:
  // return await db.vcs.findUnique({
  //   where: { slug },
  //   select: {
  //     id: true,
  //     name: true,
  //     slug: true,
  //     logo: true,
  //     website: true,
  //     description: true,
  //     averageRating: true,
  //     totalReviews: true,
  //     ratings: true
  //   }
  // });
  
  return null;
}

async function getVCReviews(vcId: string, page = 1, limit = 5): Promise<{
  reviews: VCReview[];
  totalReviews: number;
  currentPage: number;
  totalPages: number;
}> {
  // TODO: Replace with actual database call
  // Example implementation with a database:
  // const totalReviews = await db.reviews.count({ where: { vcId } });
  // const reviews = await db.reviews.findMany({
  //   where: { vcId },
  //   orderBy: { createdAt: 'desc' },
  //   skip: (page - 1) * limit,
  //   take: limit,
  //   select: {
  //     id: true,
  //     createdAt: true,
  //     rating: true,
  //     content: true,
  //     author: true,
  //     companyName: true,
  //     companyRole: true,
  //     ratings: true
  //   }
  // });
  
  // return {
  //   reviews,
  //   totalReviews,
  //   currentPage: page,
  //   totalPages: Math.ceil(totalReviews / limit)
  // };
  
  return {
    reviews: [],
    totalReviews: 0,
    currentPage: page,
    totalPages: 0
  };
}

export default async function VCProfilePage({ 
  params,
  searchParams 
}: { 
  params: { slug: string },
  searchParams?: { page?: string }
}) {
  const page = parseInt(searchParams?.page || "1");
  
  // Fetch VC data from database
  const vcData = await getVCData(params.slug);
  
  if (!vcData) {
    notFound();
  }
  
  // Fetch reviews for this VC
  const { reviews, totalReviews, currentPage, totalPages } = await getVCReviews(vcData.id, page);
  
  // Calculate pagination info
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/reviews" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          ← Back to All VCs
        </Link>
      </div>
      
      {/* VC Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            {vcData.logo && <img src={vcData.logo} alt={vcData.name} className="w-full h-full object-cover" />}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{vcData.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {vcData.description || "No description available"}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              {vcData.website && (
                <Link 
                  href={vcData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-black dark:text-white hover:underline flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
                  </svg>
                  Website
                </Link>
              )}
              
              <div className="flex items-center">
                <div className="flex">
                  <StarRating 
                    value={vcData.averageRating} 
                    edit={false}
                    size={18}
                  />
                </div>
                <span className="ml-2 text-lg font-medium">{vcData.averageRating.toFixed(1)}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600 dark:text-gray-300">{vcData.totalReviews} reviews</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link href={`/reviews/new?vc=${params.slug}`} className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-block">
              Write a Review
            </Link>
          </div>
        </div>
      </div>
      
      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Responsiveness</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.ratings.responsiveness} edit={false} size={24} />
            </div>
            <span className="text-xl font-medium ml-2">{vcData.ratings.responsiveness.toFixed(1)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">How quickly they respond to communications and requests</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Fairness</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.ratings.fairness} edit={false} size={24} />
            </div>
            <span className="text-xl font-medium ml-2">{vcData.ratings.fairness.toFixed(1)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">How fair their term sheets and negotiations are</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Support</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.ratings.support} edit={false} size={24} />
            </div>
            <span className="text-xl font-medium ml-2">{vcData.ratings.support.toFixed(1)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">The level of support and guidance provided post-investment</p>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Reviews ({totalReviews})</h2>
        
        {reviews.length > 0 ? (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                <div className="mb-3">
                  <div className="flex items-center mb-2">
                    <StarRating value={review.rating} edit={false} size={20} />
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{review.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                    {review.companyName && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{review.companyName}</span>
                      </>
                    )}
                    {review.companyRole && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{review.companyRole}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                
                {review.ratings && (
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
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to leave a review!</p>
            <div className="mt-4">
              <Link 
                href={`/reviews/new?vc=${params.slug}`} 
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-block"
              >
                Write a Review
              </Link>
            </div>
          </div>
        )}
        
        {/* Pagination for reviews */}
        {reviews.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center rounded-md">
              <Link 
                href={hasPrevPage ? `/vc/${params.slug}?page=${currentPage - 1}` : '#'} 
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
                    href={`/vc/${params.slug}?page=${pageToShow}`}
                    className={`px-4 py-2 border-t border-b ${i < 4 ? 'border-r' : ''} border-gray-300 dark:border-gray-600 
                      ${currentPage === pageToShow ? 'bg-gray-50 dark:bg-gray-700 text-black dark:text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {pageToShow}
                  </Link>
                );
              })}
              
              <Link 
                href={hasNextPage ? `/vc/${params.slug}?page=${currentPage + 1}` : '#'}
                className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={!hasNextPage}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}