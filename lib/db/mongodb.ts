import mongoose from 'mongoose';

// Define connection interface for caching
interface Cached {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Define the global type
declare global {
  var mongooseCache: Cached | undefined;
}

// Initialize cached connection
const cached: Cached = global.mongooseCache || {
  conn: null,
  promise: null,
};

// If in development, attach to global to prevent reconnections during HMR
if (process.env.NODE_ENV !== 'production') {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<mongoose.Mongoose> {
  // If connection exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection string is provided, throw error
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // If no promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  }

  // Wait for connection and assign it to cache
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}