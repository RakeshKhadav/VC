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
    const query: Record<string, any> = {};
    
    if (vcName) query.vcName = { $regex: new RegExp(vcName, 'i') };
    if (industry) query.industry = industry;
    if (year) query.yearOfInteraction = year;
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Determine sort order
    const sortOptions: Record<string, any> = {};
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
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST a new review
export async function POST(req: NextRequest) {
  try {
    // Extract authentication details from the request
    const auth = getAuth(req);
    const { userId } = auth;
    
    // Get an anonymous ID if not authenticated
    const submitterId = userId || `anon-${Date.now()}`;
    
    console.log("Processing review submission from:", userId ? "Authenticated user" : "Anonymous user");
    
    const reviewData = await req.json();
    await connectToDatabase();
    
    console.log("Connected to database");
    
    // Validate required fields
    const requiredFields = ['vcName', 'reviewText', 'ratings'];
    for (const field of requiredFields) {
      if (!reviewData[field]) {
        console.log(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Create or retrieve VC entry
    const vcSlug = createSlug(reviewData.vcName);
    let vc = await VC.findOne({ slug: vcSlug });
    
    if (!vc) {
      console.log("Creating new VC entry:", reviewData.vcName);
      vc = new VC({
        name: reviewData.vcName,
        slug: vcSlug,
        website: reviewData.vcWebsite || '',
        avgResponsiveness: 0,
        avgFairness: 0, 
        avgSupport: 0,
        totalReviews: 0,
        lastReviewDate: new Date()
      });
      
      await vc.save();
      console.log("New VC saved with ID:", vc._id);
    } else {
      console.log("Using existing VC with ID:", vc._id);
    }
    
    // Create new review
    const review = new Review({
      userId: submitterId,
      vcName: reviewData.vcName,
      vcId: vc._id,
      companyName: reviewData.companyName,
      companyWebsite: reviewData.companyWebsite,
      industry: reviewData.industry,
      role: reviewData.role,
      companyLocation: reviewData.companyLocation,
      ratings: {
        responsiveness: reviewData.ratings.responsiveness,
        fairness: reviewData.ratings.fairness,
        support: reviewData.ratings.support
      },
      reviewText: reviewData.reviewText,
      fundingStage: reviewData.fundingStage,
      investmentAmount: reviewData.investmentAmount,
      yearOfInteraction: reviewData.yearOfInteraction,
      isAnonymous: reviewData.isAnonymous ?? true
    });
    
    console.log("Saving review to database");
    try {
      await review.save();
      console.log("Review saved successfully with ID:", review._id);
    } catch (saveError) {
      console.error("Error saving review:", saveError);
      return NextResponse.json(
        { error: "Failed to save review to database" },
        { status: 500 }
      );
    }
    
    // Update VC's rating averages
    const allVCReviews = await Review.find({ vcId: vc._id });
    const totalReviews = allVCReviews.length;
    
    // Calculate new averages
    const avgRatings = allVCReviews.reduce(
      (acc, review) => {
        return {
          responsiveness: acc.responsiveness + review.ratings.responsiveness,
          fairness: acc.fairness + review.ratings.fairness,
          support: acc.support + review.ratings.support
        };
      },
      { responsiveness: 0, fairness: 0, support: 0 }
    );
    
    // Update VC document
    try {
      await VC.findByIdAndUpdate(vc._id, {
        avgResponsiveness: +(avgRatings.responsiveness / totalReviews).toFixed(1),
        avgFairness: +(avgRatings.fairness / totalReviews).toFixed(1),
        avgSupport: +(avgRatings.support / totalReviews).toFixed(1),
        totalReviews,
        lastReviewDate: new Date()
      });
      console.log("VC ratings updated successfully");
    } catch (updateError) {
      console.error("Error updating VC ratings:", updateError);
      // We'll still return success since the review was saved
    }
    
    return NextResponse.json({ 
      success: true,
      review: review
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}