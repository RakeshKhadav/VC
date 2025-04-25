import { clerkClient } from '@clerk/nextjs/server';

/**
 * Gets full user details from Clerk
 * @param userId - The Clerk user ID
 * @returns User object with profile information
 */
export async function getClerkUserDetails(userId: string) {
  try {
    console.log(`Fetching Clerk user details for ID: ${userId}`);
    const clerk = await clerkClient();
    
    if (!clerk) {
      console.error('Failed to initialize Clerk client');
      throw new Error('Failed to initialize Clerk client');
    }
    
    console.log('Clerk client initialized, getting user details...');
    const clerkUser = await clerk.users.getUser(userId);
    
    if (!clerkUser) {
      console.error('User not found in Clerk with ID:', userId);
      throw new Error(`User not found in Clerk with ID: ${userId}`);
    }
    
    console.log('Successfully fetched user details from Clerk:', clerkUser.id);
    
    return {
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      imageUrl: clerkUser.imageUrl,
      // You can add more fields from Clerk if needed
      createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt) : new Date()
    };
  } catch (error) {
    console.error('Error fetching user details from Clerk:', error);
    throw error;
  }
}

/**
 * Manually stores a user in the database without requiring API call
 * For use when auth middleware is having issues
 * @param userId - The Clerk user ID
 */
export async function directStoreUserInDb(userId: string) {
  const { default: mongoose } = await import('mongoose');
  const { connectToDatabase } = await import('@/lib/db/mongodb');
  const { default: User } = await import('@/lib/db/models/User');
  
  console.log('Direct store function - connecting to database...');
  try {
    await connectToDatabase();
    console.log('Direct store function - connected to database');
    
    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
      console.log('Direct store function - user already exists in database');
      return existingUser;
    }
    
    // Get user details from Clerk
    const userDetails = await getClerkUserDetails(userId);
    
    // Create new user
    const newUser = new User({
      clerkId: userId,
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      imageUrl: userDetails.imageUrl,
      plan: "free",
      reviewViews: []
    });
    
    await newUser.save();
    console.log('Direct store function - new user saved to database');
    return newUser;
  } catch (error) {
    console.error('Direct store function - error storing user:', error);
    throw error;
  }
}