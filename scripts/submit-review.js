// Simple script to add a review to MongoDB
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// MongoDB connection URI from environment variable
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI environment variable is not defined');
  process.exit(1);
}

const client = new MongoClient(uri);

async function submitReview() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db();
    const vcsCollection = database.collection('vcs');
    const reviewsCollection = database.collection('reviews');
    
    // Check if VC exists or create it
    const vcName = "Sequoia Capital";
    const vcSlug = vcName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    console.log(`Finding or creating VC: ${vcName}`);
    
    let vc = await vcsCollection.findOne({ slug: vcSlug });
    
    if (!vc) {
      console.log(`VC not found, creating new entry for ${vcName}`);
      vc = {
        name: vcName,
        slug: vcSlug,
        website: "https://www.sequoiacap.com",
        avgResponsiveness: 0,
        avgFairness: 0,
        avgSupport: 0,
        totalReviews: 0,
        lastReviewDate: new Date()
      };
      
      const result = await vcsCollection.insertOne(vc);
      vc._id = result.insertedId;
      console.log(`Created new VC entry with ID: ${vc._id}`);
    } else {
      console.log(`Found existing VC with ID: ${vc._id}`);
    }
    
    // Create new review
    const review = {
      userId: "direct-script-user",
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
      isAnonymous: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("Saving review to database...");
    const reviewResult = await reviewsCollection.insertOne(review);
    console.log(`Review saved successfully with ID: ${reviewResult.insertedId}`);
    
    // Update VC's rating averages
    const allVCReviews = await reviewsCollection.find({ vcId: vc._id }).toArray();
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
    await vcsCollection.updateOne(
      { _id: vc._id },
      {
        $set: {
          avgResponsiveness: +(avgRatings.responsiveness / totalReviews).toFixed(1),
          avgFairness: +(avgRatings.fairness / totalReviews).toFixed(1),
          avgSupport: +(avgRatings.support / totalReviews).toFixed(1),
          totalReviews,
          lastReviewDate: new Date()
        }
      }
    );
    
    console.log("VC ratings updated successfully");
    console.log("Review submission completed successfully!");
  } catch (error) {
    console.error('Error submitting review:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the submission function
submitReview();