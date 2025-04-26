import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      ssl: true,
      tls: true,
      tlsInsecure: true,                  // Most permissive
      tlsAllowInvalidCertificates: true,  // Most permissive
      directConnection: true,             // Try direct connection
      serverSelectionTimeoutMS: 30000,    // Longer timeout
      socketTimeoutMS: 45000,             // Longer socket timeout
      autoIndex: false,                   // Don't build indexes
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
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

export default connectToDatabase;
