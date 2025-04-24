import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import VC from '@/lib/db/models/VC';
import Review from '@/lib/db/models/Review';

// GET VC by slug with reviews information
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const searchParams = req.nextUrl.searchParams;
    const includeReviews = searchParams.get('includeReviews') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    
    // Connect to database
    await connectToDatabase();
    
    // Find the VC
    const vc = await VC.findOne({ slug });
    
    if (!vc) {
      return NextResponse.json({ error: "VC not found" }, { status: 404 });
    }
    
    // If reviews aren't requested, return just the VC data
    if (!includeReviews) {
      return NextResponse.json({ vc });
    }
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Get reviews for this VC
    const reviews = await Review.find({ vcId: vc._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalReviews = await Review.countDocuments({ vcId: vc._id });
    
    // Return combined data
    return NextResponse.json({
      vc,
      reviews,
      pagination: {
        total: totalReviews,
        page,
        limit,
        pages: Math.ceil(totalReviews / limit)
      }
    });
  } catch (error: any) {
    console.error("Error fetching VC details:", error);
    return NextResponse.json(
      { error: "Failed to fetch VC details" },
      { status: 500 }
    );
  }
}