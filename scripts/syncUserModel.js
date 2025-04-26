require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Please define MONGODB_URI in .env');
  process.exit(1);
}

async function syncUserModel() {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true
    }
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Drop existing NextAuth collections
    const collections = ['users', 'accounts', 'sessions', 'verification_tokens'];
    for (const collection of collections) {
      try {
        await db.collection(collection).drop();
        console.log(`Dropped existing ${collection} collection`);
      } catch (error) {
        console.log(`No existing ${collection} collection to drop`);
      }
    }

    // Create collections
    for (const collection of collections) {
      await db.createCollection(collection);
      console.log(`Created ${collection} collection`);
    }

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('accounts').createIndex({ provider: 1, providerAccountId: 1 }, { unique: true });
    await db.collection('sessions').createIndex({ sessionToken: 1 }, { unique: true });
    await db.collection('verification_tokens').createIndex({ identifier: 1, token: 1 }, { unique: true });

    console.log('Successfully created all indexes');
    console.log('Successfully synced NextAuth collections with MongoDB');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

syncUserModel();
