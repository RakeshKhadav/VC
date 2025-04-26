import Link from "next/link";
import { Suspense } from "react";
import ExploreFilters from "../components/ui/ExploreFilters";
import VCCard from "@/app/components/reviews/VCCard";
import { connectToDatabase } from "@/lib/db/mongodb";
import VC from "@/lib/db/models/VC";
import ExploreClientWrapper from "./client-wrapper";

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
  const limit = 12; // Show 12 VCs per page
  
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Build filter object based on search params
    const filter: Record<string, unknown> = {};
    
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
    
    // Add calculated average rating for each VC
    const vcsWithAvgRating: VCData[] = vcs.map((vc: {
      _id: { toString(): string };
      name: string;
      slug: string;
      website?: string;
      avgResponsiveness: number;
      avgFairness: number;
      avgSupport: number;
      totalReviews: number;
      lastReviewDate?: string;
    }) => {
      const avgRating = (vc.totalReviews > 0 && 
                        typeof vc.avgResponsiveness === 'number' && 
                        typeof vc.avgFairness === 'number' && 
                        typeof vc.avgSupport === 'number')
        ? Number(((vc.avgResponsiveness + vc.avgFairness + vc.avgSupport) / 3).toFixed(1))
        : 0;
      
      return {
        ...vc,
        _id: vc._id.toString(),
        avgRating
      };
    });
    
    return {
      vcs: vcsWithAvgRating,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        hasMore: page < totalPages
      },
      searchParams
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      vcs: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        hasMore: false
      },
      searchParams
    };
  }
}

export default async function ExplorePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await only the searchParams since params is not used
  const resolvedSearchParams = await searchParams;

  // Fetch VCs with resolved search params
  const { vcs, pagination } = await getVCs(resolvedSearchParams || {});
  
  // Wrap the page content with our authentication check component
  return (
    <ExploreClientWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Explore VC Firms</h1>
        
        <Suspense fallback={<div>Loading filters...</div>}>
          <ExploreFilters />
        </Suspense>
        
        {/* VC Cards - Using explicit flex column layout with full width cards */}
        {vcs.length > 0 ? (
          <div className="flex flex-col w-full mt-6 space-y-4">
            {vcs.map((vc) => (
              <div key={vc._id} className="w-full">
                <VCCard 
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No VC firms found matching your filters</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Try adjusting your filter criteria or search term</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                <Link
                  key={pageNum}
                  href={{
                    pathname: '/explore',
                    query: {
                      ...resolvedSearchParams,
                      page: pageNum.toString()
                    }
                  }}
                  className={`px-4 py-2 border ${
                    pageNum === pagination.currentPage 
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-white text-black dark:bg-gray-800 dark:text-white'
                  } rounded-md hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  {pageNum}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </ExploreClientWrapper>
  );
}