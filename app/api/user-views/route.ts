import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import mongoose from 'mongoose';
import { getClerkUserDetails } from '@/lib/utils/clerkUtils';

// GET user's view information and limits
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    // Find user
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // Get comprehensive user information from Clerk
      const userDetails = await getClerkUserDetails(userId);
      
      // Create a new user record with complete information
      user = new User({
        clerkId: userId,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        imageUrl: userDetails.imageUrl,
        plan: "free",
        reviewViews: []
      });
      
      await user.save();
    }
    
    // Calculate monthly view stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyViews = user.reviewViews.filter(
      (view: { timestamp: Date; reviewId: mongoose.Types.ObjectId }) => new Date(view.timestamp) >= monthStart
    );
    
    const viewsThisMonth = monthlyViews.length;
    const totalViews = user.reviewViews.length;
    const hasReachedLimit = user.hasReachedMonthlyLimit();
    const remainingViews = user.plan === 'premium' ? 'unlimited' : Math.max(0, 6 - viewsThisMonth);
    
    return NextResponse.json({
      viewStats: {
        viewsThisMonth,
        totalViews,
        hasReachedLimit,
        remainingViews,
        isPremium: user.plan === 'premium',
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User',
        email: user.email
      }
    });
    
  } catch (error) {
    console.error("Error fetching user view stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user view statistics" },
      { status: 500 }
    );
  }
}

// POST record a new review view
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Get review ID from request body
    const { reviewId } = await req.json();
    
    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }
    
    // Validate review ID format
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { error: "Invalid review ID format" },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find user
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // Get comprehensive user information from Clerk
      const userDetails = await getClerkUserDetails(userId);
      
      // Create a new user record with complete information
      user = new User({
        clerkId: userId,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        imageUrl: userDetails.imageUrl,
        plan: "free",
        reviewViews: []
      });
      
      await user.save();
    }
    
    // Check if user has reached monthly limit
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
    
    // Record the view
    await user.recordReviewView(new mongoose.Types.ObjectId(reviewId));
    
    // Calculate updated stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyViews = user.reviewViews.filter(
      (view: { timestamp: Date; reviewId: mongoose.Types.ObjectId }) => new Date(view.timestamp) >= monthStart
    );
    
    const viewsThisMonth = monthlyViews.length;
    const remainingViews = user.plan === 'premium' ? 'unlimited' : Math.max(0, 6 - viewsThisMonth);
    
    return NextResponse.json({
      success: true,
      message: "Review view recorded",
      viewStats: {
        viewsThisMonth,
        remainingViews,
        hasReachedLimit: remainingViews === 0 || remainingViews === 'unlimited' ? false : false
      }
    });
    
  } catch (error) {
    console.error("Error recording review view:", error);
    return NextResponse.json(
      { error: "Failed to record review view" },
      { status: 500 }
    );
  }
}