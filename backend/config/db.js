import mongoose from 'mongoose';
import Class from '../models/Class.js';

/**
 * Asynchronously connects to MongoDB Atlas using process.env.MONGO_URI.
 * Falls back to MONGODB_URI for backwards compatibility.
 */
export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGO_URI in environment.');
    process.exit(1);
  }

  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: process.env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);

    try {
      const syncResult = await Class.syncIndexes();
      console.log('✅ Class indexes synced:', syncResult);
    } catch (err) {
      console.warn('⚠️ Failed to sync Class indexes:', err.message);
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () =>
    console.warn('⚠️  MongoDB disconnected')
  );
};

export default connectDB;
