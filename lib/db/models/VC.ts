import mongoose, { Document, Schema } from 'mongoose';

// Define VC interface extending Document
export interface VCDocument extends Document {
  name: string;
  slug: string;
  website?: string;
  avgResponsiveness: number;
  avgFairness: number;
  avgSupport: number;
  totalReviews: number;
  lastReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual to get average rating
  avgRating: number;
}

// Create VC schema
const VCSchema = new Schema<VCDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    website: String,
    avgResponsiveness: {
      type: Number,
      default: 0
    },
    avgFairness: {
      type: Number,
      default: 0
    },
    avgSupport: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    lastReviewDate: {
      type: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for average overall rating
VCSchema.virtual('avgRating').get(function() {
  if (this.totalReviews === 0) return 0;
  const avg = (this.avgResponsiveness + this.avgFairness + this.avgSupport) / 3;
  return Number(avg.toFixed(1));
});

// Text search index
VCSchema.index({ name: 'text' });

// Check if model exists before creating
const VC = mongoose.models.VC || mongoose.model<VCDocument>('VC', VCSchema);

export default VC;