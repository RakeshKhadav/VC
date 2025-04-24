import { connectToDatabase } from '../lib/db/mongodb';
import VC from '../lib/db/models/VC';
import Review from '../lib/db/models/Review';
import mongoose from 'mongoose';

// Function to create a URL-friendly slug from a string
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Main function to submit a review
async function submitReview() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    
    const vcName = "Sequoia Capital";
    const vcSlug = createSlug(vcName);
    
    console.log(`Finding or creating VC: ${vcName}`);
    
    // Find existing VC or create a new one
    let vc = await VC.findOne({ slug: vcSlug });
    
    if (!vc) {
      console.log(`VC not found, creating new entry for ${vcName}`);
      vc = new VC({
        name: vcName,
        slug: vcSlug,
        website: "https://www.sequoiacap.com",
        avgResponsiveness: 0,
        avgFairness: 0,
        avgSupport: 0,
        totalReviews: 0,
        lastReviewDate: new Date()
      });
      
      await vc.save();
      console.log(`Created new VC entry with ID: ${vc._id}`);
    } else {
      console.log(`Found existing VC with ID: ${vc._id}`);
    }
    
    // Create new review
    const review = new Review({
      userId: "direct-script-user", // This would be a Clerk user ID in production
      vcName: vcName,
      vcId: vc._id,
      companyName: "Innovative Tech Solutions",
      companyWebsite: "https://example.com",
      industry: "AI/ML",
      role: "Founder/CEO",
      companyLocation: "San Francisco",
      ratings: {
        responsiveness: 4.5,
        fairness: 4.2,
        support: 4.7
      },
      reviewText: "We had a fantastic experience with Sequoia Capital. Their team was incredibly responsive to our questions and concerns. The terms were fair and they provided excellent support post-investment. They introduced us to key industry contacts that accelerated our growth. Highly recommend working with them if you get the chance.",
      fundingStage: "Series A",
      investmentAmount: "$3M - $5M",
      yearOfInteraction: "2025",
      isAnonymous: false
    });
    
    console.log("Saving review to database...");
    await review.save();
    console.log(`Review saved successfully with ID: ${review._id}`);
    
    // Update VC's rating averages
    const allVCReviews = await Review.find({ vcId: vc._id });
    const totalReviews = allVCReviews.length;
    
    console.log(`Updating VC ratings based on ${totalReviews} total reviews`);
    
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
    
    console.log("VC ratings updated successfully");
    console.log("Review submission completed successfully!");
    
  } catch (error) {
    console.error('Error submitting review:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the submission function
submitReview();