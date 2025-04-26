import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  ssl: true,
  tls: true,
  tlsInsecure: true,                  // Most permissive
  tlsAllowInvalidCertificates: true,  // Most permissive
  directConnection: true,             // Try direct connection
  retryWrites: true,
  serverSelectionTimeoutMS: 30000,    // Longer timeout
  socketTimeoutMS: 45000,             // Longer socket timeout
  autoIndex: false,                   // Don't build indexes
  serverApi: {
    version: '1',
    strict: false,                    // Less strict
    deprecationErrors: false          // Less strict
  }
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, options)
      .then((mongoose) => {
        console.log('✅ MongoDB connected with permissive SSL');
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}
