import mongoose from 'mongoose';
import { processEnv } from '../config';

const MONGO_URI = processEnv.mongo_uri || '';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB', error);
    process.exit(1);
  }
};