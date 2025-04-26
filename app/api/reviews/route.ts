import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Review from '@/lib/db/models/Review';
import VC from '@/lib/db/models/VC';

// Helper function to create a URL-friendly slug from a string
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET reviews with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const vcName = searchParams.get('vcName') || '';
    const industry = searchParams.get('industry') || '';
    const year = searchParams.get('year') || '';
    const sort = searchParams.get('sort') || 'newest';
    
    await connectToDatabase();
    
    // Build query filters
    const query: {
      vcName?: { $regex: RegExp };
      industry?: string;
      yearOfInteraction?: string;
    } = {};
    
    if (vcName) query.vcName = { $regex: new RegExp(vcName, 'i') };
    if (industry) query.industry = industry;
    if (year) query.yearOfInteraction = year;
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Determine sort order
    const sortOptions: { [key: string]: 1 | -1 } = {};
    if (sort === 'newest') {
      sortOptions.createdAt = -1;
    } else if (sort === 'highest') {
      // This relies on the virtual averageRating - we'll handle this specially
      // First fetch all reviews that match the filter
      const allMatchingReviews = await Review.find(query);
      
      // Sort them by average rating
      const sortedReviews = allMatchingReviews
        .sort((a, b) => {
          const aRating = ((a.ratings.responsiveness + a.ratings.fairness + a.ratings.support) / 3);
          const bRating = ((b.ratings.responsiveness + b.ratings.fairness + b.ratings.support) / 3);
          return bRating - aRating;
        })
        .slice(skip, skip + limit);
        
      // Calculate total for pagination
      const total = allMatchingReviews.length;
      
      return NextResponse.json({
        reviews: sortedReviews,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } else {
      sortOptions.createdAt = -1; // Default to newest
    }
    
    // For normal sorting
    const reviews = await Review.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
      
    const total = await Review.countDocuments(query);
    
    return NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: unknown) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST a new review
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    const body = await request.json();
    const {
      vcName,
      vcWebsite,
      industry,
      role,
      companyLocation,
      ratings,
      reviewHeading,
      reviewText,
      pros,
      cons,
      fundingStage,
      investmentAmount,
      yearOfInteraction
    } = body;

    // Validate required fields
    if (!vcName || !ratings || !reviewHeading || !reviewText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for existing VC or create new one
    let vcId;
    const existingVC = await VC.findOne({ name: { $regex: new RegExp(`^${vcName}$`, 'i') } });
    
    if (existingVC) {
      vcId = existingVC._id;
    } else {
      // Create new VC entry if it doesn't exist
      const newVC = new VC({
        name: vcName,
        website: vcWebsite || "",
        description: "",
        logo: "",
        location: "",
        foundedYear: null,
        industries: industry ? [industry] : [],
        numberOfReviews: 1
      });
      
      const savedVC = await newVC.save();
      vcId = savedVC._id;
    }

    // Create new review
    const newReview = new Review({
      userId,
      vcName,
      vcId,
      industry,
      role,
      companyLocation,
      ratings,
      reviewHeading,
      reviewText,
      pros,
      cons,
      fundingStage,
      investmentAmount,
      yearOfInteraction
    });

    // Save review to database
    const savedReview = await newReview.save();

    // Update VC review count
    if (existingVC) {
      existingVC.numberOfReviews = (existingVC.numberOfReviews || 0) + 1;
      await existingVC.save();
    }

    // Return success response
    return NextResponse.json({
      message: "Review created successfully",
      reviewId: savedReview._id
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Error creating review" },
      { status: 500 }
    );
  }
}