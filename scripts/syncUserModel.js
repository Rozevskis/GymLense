require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Please define MONGODB_URI in .env');
  process.exit(1);
}

async function syncUserModel() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Drop the existing users collection
    try {
      await db.collection('users').drop();
      console.log('Dropped existing users collection');
    } catch (error) {
      console.log('No existing users collection to drop');
    }

    // Create new users collection
    await db.createCollection('users');
    console.log('Created new users collection');

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('Created email index');

    console.log('Successfully synced User model with MongoDB');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

syncUserModel();
