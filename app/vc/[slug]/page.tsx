import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db/mongodb";
import VC from "@/lib/db/models/VC";
import Review from "@/lib/db/models/Review";
import VCProfileClient from "./components/VCProfileClient";

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
    
    // Fetch the document first without type assertion
    const vcDocResult = await VC.findOne({ slug }).lean();
    
    if (!vcDocResult) {
      return null;
    }
    
    // Use type-safe approach with known properties instead of explicit type annotation
    const vcDoc = vcDocResult as Record<string, unknown>;
    
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
async function getVCReviews(vcSlug: string, currentPage = 1): Promise<{
  reviews: VCReview[];
  totalReviews: number;
  currentPage: number;
  totalPages: number;
}> {
  try {
    await connectToDatabase();
    
    // First, get the VC document to get its ID - with explicit type casting to avoid TypeScript errors
    const vcDocResult = await VC.findOne({ slug: vcSlug }).lean();
    
    if (!vcDocResult) {
      console.error(`VC with slug ${vcSlug} not found`);
      return {
        reviews: [],
        totalReviews: 0,
        currentPage: 1,
        totalPages: 0
      };
    }
    
    // Use type-safe approach with known properties
    const vcDoc = vcDocResult as Record<string, unknown>;
    
    // Safely access properties with type checks
    const vcId = vcDoc._id ? vcDoc._id.toString() : '';
    const vcName = vcDoc.name || '';
    
    console.log(`Found VC ${vcName} with ID ${vcId}`);
    
    // Create a more comprehensive query to match reviews by multiple fields
    const query = {
      $or: [
        { vcId: vcId }, // Match by exact VC ID (most reliable)
        { vcId: vcDoc._id }, // Match by MongoDB ObjectId
        { vcName: vcName }, // Match by exact VC name
        { vcName: vcSlug }, // Match by slug as name
        { vcSlug: vcSlug }, // Match by slug field
      ]
    };
    
    console.log(`Searching for reviews with query:`, JSON.stringify(query));
    
    // Count total reviews for this VC
    const totalReviews = await Review.countDocuments(query);
    
    console.log(`Found ${totalReviews} total reviews for VC ${vcSlug} (${vcName})`);
    
    // Fetch ALL reviews instead of using pagination
    const reviewDocsResult = await Review.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .lean();
    
    // Cast to array explicitly to avoid TypeScript errors
    const reviewDocs = reviewDocsResult as Array<{
      _id?: { toString(): string };
      vcId?: string | { toString(): string };
      vcName?: string;
      vcSlug?: string;
      industry?: string;
      role?: string;
      companyLocation?: string;
      ratings?: {
        responsiveness: number;
        fairness: number;
        support: number;
      };
      reviewHeading?: string;
      reviewText?: string;
      pros?: string;
      cons?: string;
      fundingStage?: string;
      yearOfInteraction?: string;
      createdAt?: string | Date;
    }>;
    
    console.log(`Retrieved ${reviewDocs.length} review documents for VC ${vcSlug}`);
    
    // Format and properly cast reviews to ensure they match the VCReview interface
    const formattedReviews: VCReview[] = reviewDocs.map(review => {
      // Ensure review is an object with expected properties
      if (!review) return null;
      
      // Check if ratings exist, if not provide defaults
      const ratings = review.ratings || { responsiveness: 0, fairness: 0, support: 0 };
      
      return {
        _id: review._id ? review._id.toString() : '',
        vcId: review.vcId ? (typeof review.vcId === 'string' ? review.vcId : review.vcId.toString()) : '',
        vcName: typeof review.vcName === 'string' ? review.vcName : '',
        vcSlug: typeof review.vcSlug === 'string' ? review.vcSlug : vcSlug,
        industry: review.industry as string | undefined,
        role: review.role as string | undefined,
        companyLocation: review.companyLocation as string | undefined,
        ratings: {
          responsiveness: typeof ratings.responsiveness === 'number' ? ratings.responsiveness : 0,
          fairness: typeof ratings.fairness === 'number' ? ratings.fairness : 0,
          support: typeof ratings.support === 'number' ? ratings.support : 0
        },
        reviewHeading: typeof review.reviewHeading === 'string' ? review.reviewHeading : '',
        reviewText: typeof review.reviewText === 'string' ? review.reviewText : '',
        pros: review.pros as string | undefined,
        cons: review.cons as string | undefined,
        fundingStage: review.fundingStage as string | undefined,
        yearOfInteraction: review.yearOfInteraction as string | undefined,
        createdAt: review.createdAt ? 
          (typeof review.createdAt === 'string' ? 
            review.createdAt : 
            (typeof review.createdAt.toISOString === 'function' ? 
              review.createdAt.toISOString() : 
              new Date(review.createdAt).toISOString())
          ) : 
          new Date().toISOString()
      };
    }).filter(Boolean) as VCReview[]; // Filter out any null values
    
    console.log(`Formatted ${formattedReviews.length} reviews for VC ${vcSlug}`);
    // For debugging, log the first review if available
    if (formattedReviews.length > 0) {
      console.log('Sample first review:', JSON.stringify(formattedReviews[0], null, 2));
    }
    
    return {
      reviews: formattedReviews,
      totalReviews,
      currentPage: 1,
      totalPages: Math.ceil(totalReviews / 5) // Keep totalPages calculation for UI consistency
    };
    
  } catch (error) {
    console.error("Error fetching VC reviews:", error);
    return {
      reviews: [],
      totalReviews: 0,
      currentPage: 1,
      totalPages: 0
    };
  }
}

export default async function VCProfilePage({ 
  params,
  searchParams
}: { 
  params: { slug: string };
  searchParams?: { page?: string };
}) {
  const slug = params.slug;
  
  // Fetch VC data from database
  const vcData = await getVCData(slug);
  
  if (!vcData) {
    notFound();
  }
  
  // Get current page from query params or default to 1
  const currentPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  
  // Fetch reviews for this VC - using modified function that returns all reviews
  const { reviews, totalReviews, totalPages } = await getVCReviews(slug);
  
  // Use client component to render the full profile page
  return <VCProfileClient 
    vcData={vcData}
    reviews={reviews}
    totalReviews={totalReviews}
    currentPage={currentPage}
    totalPages={totalPages}
    slug={slug}
  />;
}