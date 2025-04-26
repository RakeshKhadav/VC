import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import StarRating from "@/app/components/ui/StarRating";
import { connectToDatabase } from "@/lib/db/mongodb";
import VC from "@/lib/db/models/VC";
import Review from "@/lib/db/models/Review";

// Define types for VC data
export interface VCData {
  _id: string;
  name: string;
  slug: string;
  website?: string;
  description?: string;
  avgResponsiveness: number;
  avgFairness: number;
  avgSupport: number;
  totalReviews: number;
  lastReviewDate?: Date;
}

export interface VCReview {
  _id: string;
  vcId: string;
  vcName: string;
  vcSlug: string;
  industry?: string;
  role?: string;
  companyLocation?: string;
  ratings: {
    responsiveness: number;
    fairness: number;
    support: number;
  };
  reviewHeading: string;
  reviewText: string;
  pros?: string;
  cons?: string;
  fundingStage?: string;
  yearOfInteraction?: string;
  createdAt: string;
}

// Fetch VC data from MongoDB
async function getVCData(slug: string): Promise<VCData | null> {
  try {
    await connectToDatabase();
    // Use as any to handle the Mongoose document type issues
    const vcDoc: any = await VC.findOne({ slug }).lean();
    
    if (!vcDoc) {
      return null;
    }
    
    // Cast MongoDB document to VCData type with proper type safety
    return {
      _id: vcDoc._id ? vcDoc._id.toString() : '',
      name: typeof vcDoc.name === 'string' ? vcDoc.name : '',
      slug: typeof vcDoc.slug === 'string' ? vcDoc.slug : '',
      website: vcDoc.website as string | undefined,
      description: vcDoc.description as string | undefined,
      avgResponsiveness: typeof vcDoc.avgResponsiveness === 'number' ? vcDoc.avgResponsiveness : 0,
      avgFairness: typeof vcDoc.avgFairness === 'number' ? vcDoc.avgFairness : 0,
      avgSupport: typeof vcDoc.avgSupport === 'number' ? vcDoc.avgSupport : 0,
      totalReviews: typeof vcDoc.totalReviews === 'number' ? vcDoc.totalReviews : 0,
      lastReviewDate: vcDoc.lastReviewDate ? new Date(vcDoc.lastReviewDate) : undefined
    };
  } catch (error) {
    console.error("Error fetching VC data:", error);
    return null;
  }
}

// Fetch reviews for a VC from MongoDB
async function getVCReviews(vcSlug: string, page = 1): Promise<{
  reviews: VCReview[];
  totalReviews: number;
  currentPage: number;
  totalPages: number;
}> {
  try {
    await connectToDatabase();
    
    const limit = 5; // Show 5 reviews per page
    
    // Count total reviews for this VC
    const totalReviews = await Review.countDocuments({ vcName: vcSlug });
    
    // Fetch reviews with pagination
    const reviewDocs = await Review.find({ vcName: vcSlug })
      .sort({ createdAt: -1 }) // Newest first
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    // Make sure reviewDocs is treated as an array
    const reviewArray = Array.isArray(reviewDocs) ? reviewDocs : [reviewDocs];
    
    // Format and properly cast reviews to ensure they match the VCReview interface
    const formattedReviews: VCReview[] = reviewArray.map(review => {
      // Ensure review is an object with expected properties
      if (!review) return null;
      
      return {
        _id: review._id ? review._id.toString() : '',
        vcId: review.vcId ? review.vcId.toString() : '',
        vcName: typeof review.vcName === 'string' ? review.vcName : '',
        vcSlug: vcSlug, // Use the slug from params
        industry: review.industry as string | undefined,
        role: review.role as string | undefined,
        companyLocation: review.companyLocation as string | undefined,
        ratings: {
          responsiveness: typeof review.ratings?.responsiveness === 'number' ? review.ratings.responsiveness : 0,
          fairness: typeof review.ratings?.fairness === 'number' ? review.ratings.fairness : 0,
          support: typeof review.ratings?.support === 'number' ? review.ratings.support : 0
        },
        reviewHeading: typeof review.reviewHeading === 'string' ? review.reviewHeading : '',
        reviewText: typeof review.reviewText === 'string' ? review.reviewText : '',
        pros: review.pros as string | undefined,
        cons: review.cons as string | undefined,
        fundingStage: review.fundingStage as string | undefined,
        yearOfInteraction: review.yearOfInteraction as string | undefined,
        createdAt: review.createdAt ? 
          (typeof review.createdAt.toISOString === 'function' ? 
            review.createdAt.toISOString() : 
            new Date(review.createdAt).toISOString()
          ) : 
          new Date().toISOString()
      };
    }).filter(Boolean) as VCReview[]; // Filter out any null values
    
    return {
      reviews: formattedReviews,
      totalReviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit)
    };
    
  } catch (error) {
    console.error("Error fetching VC reviews:", error);
    return {
      reviews: [],
      totalReviews: 0,
      currentPage: page,
      totalPages: 0
    };
  }
}

// Calculate average rating from individual ratings
function calculateAverageRating(ratings: { responsiveness: number, fairness: number, support: number }) {
  const sum = ratings.responsiveness + ratings.fairness + ratings.support;
  return Number((sum / 3).toFixed(1));
}

export default async function VCProfilePage({ 
  params,
  searchParams
}: { 
  params: { slug: string };
  searchParams?: { page?: string };
}) {
  const page = parseInt(searchParams?.page || "1");
  const slug = params.slug;
  
  // Fetch VC data from database
  const vcData = await getVCData(slug);
  
  if (!vcData) {
    notFound();
  }
  
  // Fetch reviews for this VC
  const { reviews, totalReviews, currentPage, totalPages } = await getVCReviews(slug, page);
  
  // Calculate pagination info
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Add a utility function to format dates consistently
  const formatDate = (dateString: string) => {
    // Use a stable date formatting approach for SSR/CSR compatibility
    const date = new Date(dateString);
    // Format as YYYY-MM-DD to ensure consistent rendering
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Use UTC to prevent timezone issues
    });
  };
  
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
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{vcData.name}</h1>
            {vcData.website && (
              <a 
                href={vcData.website.startsWith('http') ? vcData.website : `https://${vcData.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
              >
                {vcData.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            
            <div className="flex items-center mt-4">
              <div className="flex">
                <StarRating 
                  value={calculateAverageRating({
                    responsiveness: vcData.avgResponsiveness,
                    fairness: vcData.avgFairness,
                    support: vcData.avgSupport
                  })} 
                  edit={false}
                  size={24}
                />
              </div>
              <span className="ml-2 text-lg font-medium">
                {calculateAverageRating({
                  responsiveness: vcData.avgResponsiveness,
                  fairness: vcData.avgFairness,
                  support: vcData.avgSupport
                }).toFixed(1)}
              </span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-gray-600 dark:text-gray-300">{vcData.totalReviews} reviews</span>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-end">
            <Link 
              href={`/reviews/new?vc=${slug}`} 
              className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-block"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </div>
      
      {/* VC Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">About {vcData.name}</h2>
        <div className="prose dark:prose-invert max-w-none">
          {vcData.description ? (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{vcData.description}</p>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 italic">
              <p>No description available yet for {vcData.name}.</p>
              <p className="mt-2">This section will contain information about the firm, its investment focus, portfolio highlights, and other relevant details.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Responsiveness</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.avgResponsiveness} edit={false} size={24} />
            </div>
            <span className="text-xl font-medium ml-2">{vcData.avgResponsiveness.toFixed(1)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">How quickly they respond to communications and requests</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Fairness</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.avgFairness} edit={false} size={24} />
            </div>
            <span className="text-xl font-medium ml-2">{vcData.avgFairness.toFixed(1)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">How fair their term sheets and negotiations are</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Support</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              <StarRating value={vcData.avgSupport} edit={false} size={24} />
            </div>
            <span className="text-xl font-medium ml-2">{vcData.avgSupport.toFixed(1)}</span>
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
              <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                <div className="mb-3">
                  <div className="flex items-center mb-2">
                    <StarRating 
                      value={calculateAverageRating(review.ratings)} 
                      edit={false} 
                      size={20} 
                    />
                    <span className="ml-2 font-medium">
                      {calculateAverageRating(review.ratings).toFixed(1)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{review.reviewHeading}</h3>
                  <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(review.createdAt)}</span>
                    
                    {review.role && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{review.role}</span>
                      </>
                    )}
                    
                    {review.fundingStage && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Stage: {review.fundingStage}</span>
                      </>
                    )}
                    
                    <span className="mx-2">•</span>
                    <span>Anonymous</span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-4">{review.reviewText}</p>
                
                {/* Pros and Cons */}
                {(review.pros || review.cons) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {review.pros && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <h5 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Pros</h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{review.pros}</p>
                      </div>
                    )}
                    {review.cons && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <h5 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Cons</h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{review.cons}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Responsiveness:</span>
                    <div className="flex items-center mt-1">
                      <StarRating value={review.ratings.responsiveness} edit={false} size={14} />
                      <span className="ml-1">{review.ratings.responsiveness.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Fairness:</span>
                    <div className="flex items-center mt-1">
                      <StarRating value={review.ratings.fairness} edit={false} size={14} />
                      <span className="ml-1">{review.ratings.fairness.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Support:</span>
                    <div className="flex items-center mt-1">
                      <StarRating value={review.ratings.support} edit={false} size={14}/>
                      <span className="ml-1">{review.ratings.support.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to leave a review!</p>
            <div className="mt-4">
              <Link 
                href={`/reviews/new?vc=${slug}`} 
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
                href={hasPrevPage ? `/vc/${slug}?page=${currentPage - 1}` : '#'} 
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
                    href={`/vc/${slug}?page=${pageToShow}`}
                    className={`px-4 py-2 border-t border-b ${i < 4 ? 'border-r' : ''} border-gray-300 dark:border-gray-600 
                      ${currentPage === pageToShow ? 'bg-gray-50 dark:bg-gray-700 text-black dark:text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {pageToShow}
                  </Link>
                );
              })}
              
              <Link 
                href={hasNextPage ? `/vc/${slug}?page=${currentPage + 1}` : '#'}
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