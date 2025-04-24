import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Review from '@/lib/db/models/Review';

// GET current user's information including review view limits
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
    
    // Find or create user in our database
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // Create a new user record
      user = new User({
        clerkId: userId,
        email: "placeholder@example.com", // In production, get from Clerk API
        plan: "free",
        reviewViews: []
      });
      
      await user.save();
    }
    
    // Calculate views this month for free users
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyViews = user.reviewViews.filter(
      (view: { timestamp: Date }) => new Date(view.timestamp) >= monthStart
    );
    
    // Calculate remaining views
    const viewsThisMonth = monthlyViews.length;
    const remainingViews = user.plan === 'premium' ? 'unlimited' : Math.max(0, 6 - viewsThisMonth);
    
    return NextResponse.json({
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        plan: user.plan,
        viewsThisMonth,
        remainingViews,
        isPremium: user.plan === 'premium'
      }
    });
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

// PATCH update user information (primarily for plan upgrades)
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const data = await req.json();
    
    // Validate plan value if it's being updated
    if (data.plan && !['free', 'premium'].includes(data.plan)) {
      return NextResponse.json(
        { error: "Invalid plan value" },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find the user
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Update user data
    if (data.plan) {
      user.plan = data.plan;
    }
    
    await user.save();
    
    // Calculate views this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyViews = user.reviewViews.filter(
      (view: { timestamp: Date }) => new Date(view.timestamp) >= monthStart
    );
    
    const viewsThisMonth = monthlyViews.length;
    const remainingViews = user.plan === 'premium' ? 'unlimited' : Math.max(0, 6 - viewsThisMonth);
    
    return NextResponse.json({
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        plan: user.plan,
        viewsThisMonth,
        remainingViews,
        isPremium: user.plan === 'premium'
      }
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}