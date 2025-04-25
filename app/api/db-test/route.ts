import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    const connection = await connectToDatabase();
    
    return NextResponse.json({
      success: true,
      connected: connection.connection.readyState === 1,
      dbName: connection.connection.name,
      models: Object.keys(mongoose.models)
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}