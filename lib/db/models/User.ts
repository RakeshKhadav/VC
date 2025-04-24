import mongoose, { Document, Schema } from 'mongoose';

// Define review view interface
export interface ReviewView {
  reviewId: mongoose.Types.ObjectId;
  timestamp: Date;
}

// Define user interface extending Document
export interface UserDocument extends Document {
  clerkId: string;
  email: string;
  plan: 'free' | 'premium';
  reviewViews: ReviewView[];
  createdAt: Date;
  updatedAt: Date;
  
  // Method to check if user has reached monthly limit
  hasReachedMonthlyLimit(): boolean;
  // Method to record a new review view
  recordReviewView(reviewId: mongoose.Types.ObjectId): Promise<void>;
}

// Create user schema
const UserSchema = new Schema<UserDocument>(
  {
    clerkId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    plan: { 
      type: String, 
      enum: ['free', 'premium'], 
      default: 'free' 
    },
    reviewViews: [
      {
        reviewId: {
          type: Schema.Types.ObjectId,
          ref: 'Review',
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

// Method to check if user has reached monthly limit (6 reviews for free users)
UserSchema.methods.hasReachedMonthlyLimit = function(): boolean {
  if (this.plan === 'premium') return false;
  
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Count reviews viewed this month
  const monthlyViews = this.reviewViews.filter(
    (view: ReviewView) => view.timestamp >= monthStart
  );
  
  return monthlyViews.length >= 6;
};

// Method to record a new review view
UserSchema.methods.recordReviewView = async function(reviewId: mongoose.Types.ObjectId): Promise<void> {
  this.reviewViews.push({
    reviewId,
    timestamp: new Date()
  });
  
  await this.save();
};

// Check if model exists before creating
const User = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);

export default User;