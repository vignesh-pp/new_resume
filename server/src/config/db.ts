import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_resume_db';

export let isConnectedToMongo = false;

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnectedToMongo = true;
    console.log('✅ Connected to MongoDB at', MONGODB_URI);
  } catch (err: any) {
    isConnectedToMongo = false;
    console.warn('⚠️ MongoDB connection not available. Running in In-Memory / File Storage mode.', err.message);
  }
}

