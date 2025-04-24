import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

export async function GET() {
  try {
    // Test database connection
    const mongoose = await connectToDatabase();
    
    return NextResponse.json({ 
      status: "Database connection successful", 
      connected: mongoose.connection.readyState === 1,
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      status: "Database connection failed", 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}