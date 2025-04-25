import { NextRequest, NextResponse } from 'next/server';
import { directStoreUserInDb } from '@/lib/utils/clerkUtils';

export async function POST(req: NextRequest) {
  try {
    // Get the user ID from the request body
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    console.log(`POST /api/auth/store-user - Storing user with ID: ${userId}`);
    
    // Use the direct store function to save user to database
    const user = await directStoreUserInDb(userId);
    
    return NextResponse.json({
      success: true,
      message: "User successfully stored in database",
      userId: user.clerkId
    });
  } catch (error) {
    console.error('Error storing user:', error);
    return NextResponse.json(
      { 
        error: "Failed to store user", 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}