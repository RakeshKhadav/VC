import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Review from '@/lib/db/models/Review';
import VC from '@/lib/db/models/VC';
import mongoose from 'mongoose';

// Helper function to create a URL-friendly slug from a string
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// POST a new test review - NO AUTHENTICATION REQUIRED
// This is a special test endpoint that should NOT be used in production
export async function POST(req: NextRequest) {
  try {
    console.log("TEST ENDPOINT: Processing direct review submission");
    const reviewData = await req.json();
    await connectToDatabase();
    
    console.log("TEST ENDPOINT: Connected to database");
    
    // Use a test user ID
    const userId = "test-direct-submission-user";
    
    // Validate required fields
    const requiredFields = ['vcName', 'reviewText', 'ratings'];
    for (const field of requiredFields) {
      if (!reviewData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Create or retrieve VC entry
    const vcSlug = createSlug(reviewData.vcName);
    let vc = await VC.findOne({ slug: vcSlug });
    
    console.log("TEST ENDPOINT: Looking for VC with slug:", vcSlug);
    
    if (!vc) {
      console.log("TEST ENDPOINT: Creating new VC entry:", reviewData.vcName);
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
    } else {
      console.log("TEST ENDPOINT: Found existing VC with ID:", vc._id);
    }
    
    // Create new review
    const review = new Review({
      userId,
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
    
    console.log("TEST ENDPOINT: Saving review to database");
    await review.save();
    console.log("TEST ENDPOINT: Review saved with ID:", review._id);
    
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
    await VC.findByIdAndUpdate(vc._id, {
      avgResponsiveness: +(avgRatings.responsiveness / totalReviews).toFixed(1),
      avgFairness: +(avgRatings.fairness / totalReviews).toFixed(1),
      avgSupport: +(avgRatings.support / totalReviews).toFixed(1),
      totalReviews,
      lastReviewDate: new Date()
    });
    
    console.log("TEST ENDPOINT: VC ratings updated successfully");
    
    return NextResponse.json({ 
      success: true,
      review: review,
      message: "TEST MODE: Review added successfully"
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("TEST ENDPOINT: Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create test review" },
      { status: 500 }
    );
  }
}