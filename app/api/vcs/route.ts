import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import VC from '@/lib/db/models/VC';
import Review from '@/lib/db/models/Review';

// GET VCs with pagination and sorting
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'rating';
    
    // Connect to database
    await connectToDatabase();
    
    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, 'i') } }
      ];
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Sort options
    let sortOptions: any = { avgRating: -1 }; // Default sort by rating
    switch (sort) {
      case 'name':
        sortOptions = { name: 1 };
        break;
      case 'reviews':
        sortOptions = { totalReviews: -1 };
        break;
      case 'recent':
        sortOptions = { lastReviewDate: -1 };
        break;
      // Default is rating, already set
    }
    
    // Find VCs
    const vcs = await VC.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
      
    const total = await VC.countDocuments(query);
    
    return NextResponse.json({
      vcs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error("Error fetching VCs:", error);
    return NextResponse.json(
      { error: "Failed to fetch VCs" }, 
      { status: 500 }
    );
  }
}