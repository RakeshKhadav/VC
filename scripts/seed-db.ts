import { connectToDatabase } from '../lib/db/mongodb';
import VC from '../lib/db/models/VC';
import Review from '../lib/db/models/Review';
import mongoose from 'mongoose';

// Sample VC firms data
const vcData = [
  {
    name: 'Sequoia Capital',
    slug: 'sequoia-capital',
    website: 'https://www.sequoiacap.com',
    avgResponsiveness: 4.5,
    avgFairness: 4.3,
    avgSupport: 4.7,
    totalReviews: 0,
    lastReviewDate: new Date()
  },
  {
    name: 'Andreessen Horowitz',
    slug: 'andreessen-horowitz',
    website: 'https://a16z.com',
    avgResponsiveness: 4.8,
    avgFairness: 4.6,
    avgSupport: 4.7,
    totalReviews: 0,
    lastReviewDate: new Date()
  },
  {
    name: 'Y Combinator',
    slug: 'y-combinator',
    website: 'https://www.ycombinator.com',
    avgResponsiveness: 4.8,
    avgFairness: 5.0,
    avgSupport: 4.9,
    totalReviews: 0,
    lastReviewDate: new Date()
  },
  {
    name: 'Benchmark',
    slug: 'benchmark',
    website: 'https://www.benchmark.com',
    avgResponsiveness: 4.6,
    avgFairness: 4.8,
    avgSupport: 4.5,
    totalReviews: 0,
    lastReviewDate: new Date()
  },
  {
    name: 'Accel',
    slug: 'accel',
    website: 'https://www.accel.com',
    avgResponsiveness: 4.2,
    avgFairness: 4.4,
    avgSupport: 4.3,
    totalReviews: 0,
    lastReviewDate: new Date()
  }
];

// Define review type for proper typing
interface ReviewData {
  userId: string;
  vcName: string;
  vcId: mongoose.Types.ObjectId;
  companyName: string;
  companyWebsite: string;
  industry: string;
  role: string;
  companyLocation: string;
  ratings: {
    responsiveness: number;
    fairness: number;
    support: number;
  };
  reviewText: string;
  fundingStage: string;
  investmentAmount: string;
  yearOfInteraction: string;
  isAnonymous: boolean;
}

// Sample reviews data
const generateReviews = (vcs: any[]): ReviewData[] => {
  const reviews: ReviewData[] = [];
  const industries = ['SaaS', 'Fintech', 'Healthcare', 'E-commerce', 'AI/ML', 'Developer Tools'];
  const stages = ['Seed', 'Series A', 'Series B', 'Series C', 'Growth'];
  const amounts = ['$500K - $1M', '$1M - $3M', '$3M - $5M', '$5M - $10M', '$10M+'];
  const years = ['2020', '2021', '2022', '2023', '2024'];
  const roles = ['Founder/CEO', 'Co-founder/CTO', 'CFO', 'COO', 'Other Executive'];
  const locations = ['San Francisco', 'New York', 'London', 'Berlin', 'Singapore', 'Remote'];
  
  // Generate 3 reviews for each VC
  vcs.forEach(vc => {
    for (let i = 0; i < 3; i++) {
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const stage = stages[Math.floor(Math.random() * stages.length)];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      const year = years[Math.floor(Math.random() * years.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      // Generate random ratings between 3 and 5
      const responsiveness = 3 + Math.random() * 2;
      const fairness = 3 + Math.random() * 2;
      const support = 3 + Math.random() * 2;
      
      reviews.push({
        userId: `seed-user-${i}`, // This would be a Clerk user ID in production
        vcName: vc.name,
        vcId: vc._id,
        companyName: `Sample Company ${i + 1}`,
        companyWebsite: `https://example${i}.com`,
        industry,
        role,
        companyLocation: location,
        ratings: {
          responsiveness: Math.round(responsiveness * 10) / 10, // Round to 1 decimal
          fairness: Math.round(fairness * 10) / 10,
          support: Math.round(support * 10) / 10
        },
        reviewText: `This is a sample review for ${vc.name}. They were ${responsiveness > 4 ? 'very responsive' : 'somewhat responsive'} and their terms were ${fairness > 4 ? 'very fair' : 'reasonable'}. Overall, their support was ${support > 4 ? 'excellent' : 'good'}.`,
        fundingStage: stage,
        investmentAmount: amount,
        yearOfInteraction: year,
        isAnonymous: Math.random() > 0.5 // Randomly make some reviews anonymous
      });
    }
  });
  
  return reviews;
};

// Update VCs with review statistics
const updateVCStats = async (reviews: ReviewData[]): Promise<void> => {
  // Group reviews by VC ID
  const vcReviews: Record<string, ReviewData[]> = {};
  
  reviews.forEach(review => {
    const vcIdString = review.vcId.toString();
    if (!vcReviews[vcIdString]) {
      vcReviews[vcIdString] = [];
    }
    vcReviews[vcIdString].push(review);
  });
  
  // Update each VC with its review stats
  for (const [vcId, vcReviewsList] of Object.entries(vcReviews)) {
    const totalReviews = vcReviewsList.length;
    
    if (totalReviews === 0) continue;
    
    // Calculate average ratings
    const avgRatings = vcReviewsList.reduce(
      (acc, review) => {
        return {
          responsiveness: acc.responsiveness + review.ratings.responsiveness,
          fairness: acc.fairness + review.ratings.fairness,
          support: acc.support + review.ratings.support
        };
      },
      { responsiveness: 0, fairness: 0, support: 0 }
    );
    
    // Round to one decimal place
    const avgResponsiveness = Math.round((avgRatings.responsiveness / totalReviews) * 10) / 10;
    const avgFairness = Math.round((avgRatings.fairness / totalReviews) * 10) / 10;
    const avgSupport = Math.round((avgRatings.support / totalReviews) * 10) / 10;
    
    // Update the VC document
    await VC.findByIdAndUpdate(vcId, {
      totalReviews,
      avgResponsiveness,
      avgFairness,
      avgSupport,
      lastReviewDate: new Date()
    });
  }
};

// Main seeding function
async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    
    // Clear existing data
    await VC.deleteMany({});
    await Review.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Insert VCs
    const insertedVCs = await VC.insertMany(vcData);
    console.log(`Inserted ${insertedVCs.length} VCs`);
    
    // Generate and insert sample reviews
    const reviewsToInsert = generateReviews(insertedVCs);
    const insertedReviews = await Review.insertMany(reviewsToInsert);
    console.log(`Inserted ${insertedReviews.length} reviews`);
    
    // Update VCs with review statistics
    await updateVCStats(reviewsToInsert);
    console.log('Updated VC statistics');
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();