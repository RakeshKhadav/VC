import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import mongoose from 'mongoose';

// GET method to create a test user
export async function GET() {
  return createTestUser();
}

// POST route to create a test user
export async function POST() {
  return createTestUser();
}

// Shared function to create a test user
async function createTestUser() {
  try {
    await connectToDatabase();
    
    // Create a test user - in real usage, this would come from Clerk
    const testUser = new User({
      clerkId: `test_${Date.now()}`, // Use timestamp to make it unique
      email: `test${Date.now()}@example.com`,
      plan: 'free',
      reviewViews: [] 
    });
    
    await testUser.save();
    
    // Add a test review view
    const testReviewId = new mongoose.Types.ObjectId();
    await testUser.recordReviewView(testReviewId);
    
    return NextResponse.json({ 
      success: true, 
      message: "Test user created successfully",
      user: {
        id: testUser._id,
        clerkId: testUser.clerkId,
        email: testUser.email,
        plan: testUser.plan,
        reviewViews: testUser.reviewViews
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { error: 'Failed to create test user' }, 
      { status: 500 }
    );
  }
}