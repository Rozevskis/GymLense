import { MongoClient } from 'mongodb';

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
  serverApi: {
    version: '1',
    strict: false,                    // Less strict
    deprecationErrors: false          // Less strict
  }
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
