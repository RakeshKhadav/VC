import mongoose from 'mongoose';
import { connectToDatabase } from '../lib/db/mongodb';
import User from '../lib/db/models/User';

// Self-invoking async function
(async () => {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database successfully');

    // Create a test user
    console.log('Creating test user...');
    const testUser = new User({
      clerkId: `test_${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      plan: 'free',
      reviewViews: []
    });

    await testUser.save();
    console.log('Test user created with ID:', testUser._id);

    // Add a test review view
    const testReviewId = new mongoose.Types.ObjectId();
    await testUser.recordReviewView(testReviewId);
    console.log('Added test review view to user');

    console.log('Test user details:', {
      id: testUser._id,
      clerkId: testUser.clerkId,
      email: testUser.email,
      plan: testUser.plan,
      reviewViews: testUser.reviewViews
    });

    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
})();