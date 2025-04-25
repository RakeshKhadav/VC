import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { getClerkUserDetails } from '@/lib/utils/clerkUtils';

// GET current user's information including review view limits
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/users - Starting request');
    // Get userId from auth context - this is crucial for authentication
    const auth = getAuth(req);
    const userId = auth.userId;
    
    console.log('GET /api/users - Auth check:', { userId, hasUserId: !!userId });
    
    if (!userId) {
      console.log('GET /api/users - No userId found in auth');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    console.log(`GET /api/users - Authenticated userId: ${userId}`);
    console.log('GET /api/users - Connecting to database...');
    
    try {
      await connectToDatabase();
      console.log('GET /api/users - Connected to database successfully');
    } catch (dbError) {
      console.error('GET /api/users - Database connection error:', dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
    
    console.log('GET /api/users - Looking for existing user in database');
    // Find or create user in our database
    let user;
    try {
      user = await User.findOne({ clerkId: userId });
      console.log('GET /api/users - User search complete', user ? 'User found' : 'No user found');
    } catch (findError) {
      console.error('GET /api/users - Error finding user:', findError);
      return NextResponse.json(
        { error: "Failed to query user database", details: findError instanceof Error ? findError.message : String(findError) },
        { status: 500 }
      );
    }
    
    if (!user) {
      console.log('GET /api/users - Creating new user record');
      try {
        // Get comprehensive user information from Clerk
        const userDetails = await getClerkUserDetails(userId);
        console.log('GET /api/users - Retrieved user details from Clerk');
        
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
        console.log('GET /api/users - New user saved to database with ID:', user._id);
      } catch (createError) {
        console.error('GET /api/users - Error creating user:', createError);
        return NextResponse.json(
          { error: "Failed to create user record", details: createError instanceof Error ? createError.message : String(createError) },
          { status: 500 }
        );
      }
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
    
    console.log('GET /api/users - Returning user data successfully');
    return NextResponse.json({
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        plan: user.plan,
        viewsThisMonth,
        remainingViews,
        isPremium: user.plan === 'premium'
      }
    });
  } catch (error) {
    console.error("GET /api/users - Unhandled error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data", details: error instanceof Error ? error.message : String(error) },
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
  } catch (error) {
    console.error("PATCH /api/users - Unhandled error:", error);
    return NextResponse.json(
      { error: "Failed to update user data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}