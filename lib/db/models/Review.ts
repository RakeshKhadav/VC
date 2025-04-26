import mongoose, { Document, Schema } from 'mongoose';

// Define ratings interface
export interface Ratings {
  responsiveness: number;
  fairness: number;
  support: number;
}

// Define review interface extending Document
export interface ReviewDocument extends Document {
  userId: string;
  vcName: string;
  vcId?: mongoose.Types.ObjectId;
  industry?: string;
  role?: string;
  companyLocation?: string;
  ratings: Ratings;
  reviewHeading: string;
  reviewText: string;
  pros?: string;
  cons?: string;  
  fundingStage?: string;
  investmentAmount?: string;
  yearOfInteraction?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual method to get average rating
  averageRating: number;
}

// Create review schema
const ReviewSchema = new Schema<ReviewDocument>(
  {
    userId: {
      type: String,
      required: true
    },
    vcName: {
      type: String,
      required: true,
      index: true
    },
    vcId: {
      type: Schema.Types.ObjectId,
      ref: 'VC',
      index: true
    },
    industry: String,
    role: String,
    companyLocation: String,
    ratings: {
      responsiveness: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      fairness: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      support: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    reviewHeading: {
      type: String,
      required: true
    },
    reviewText: {
      type: String,
      required: true
    },
    pros: String,
    cons: String,
    fundingStage: String,
    investmentAmount: String,
    yearOfInteraction: String
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for average rating
ReviewSchema.virtual('averageRating').get(function() {
  const { responsiveness, fairness, support } = this.ratings;
  return ((responsiveness + fairness + support) / 3).toFixed(1);
});

// Index for text search
ReviewSchema.index({ 
  vcName: 'text', 
  reviewHeading: 'text',
  reviewText: 'text',
  pros: 'text',
  cons: 'text',
  industry: 'text',
  companyLocation: 'text'
});

// Check if model exists before creating
const Review = mongoose.models.Review || mongoose.model<ReviewDocument>('Review', ReviewSchema);

export default Review;