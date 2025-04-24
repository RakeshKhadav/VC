import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Review from '@/lib/db/models/Review';
import User from '@/lib/db/models/User';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET review by ID with freemium access control
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const resolvedParams = await context.params;
    const id = resolvedParams.id;
    const { userId } = getAuth(request);
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required to view review details" },
        { status: 401 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Validate review ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }
    
    // Find the review
    const review = await Review.findById(id);
    
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    
    // Find or create user in our database
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // If this is a user's first time accessing a review, get their info from Clerk
      // and create a record in our database
      
      // In production, you'd use Clerk's API to get user email, but
      // for simplicity we'll set a placeholder
      user = new User({
        clerkId: userId,
        email: "placeholder@example.com", // In production, get from Clerk API
        plan: "free",
        reviewViews: []
      });
      
      await user.save();
    }
    
    // Check if user has reached monthly limit (for free users)
    if (user.hasReachedMonthlyLimit()) {
      return NextResponse.json(
        {
          error: "Monthly view limit reached",
          message: "You've reached your limit of 6 review views this month. Upgrade to premium for unlimited access.",
          upgradeUrl: "/upgrade"
        },
        { status: 403 }
      );
    }
    
    // Record this view
    await user.recordReviewView(review._id);
    
    // Return the review data
    return NextResponse.json({ review });
  } catch (error: Error | unknown) {
    console.error("Error accessing review:", error);
    return NextResponse.json(
      { error: "Failed to retrieve review" },
      { status: 500 }
    );
  }
}