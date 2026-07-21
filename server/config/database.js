import mongoose from 'mongoose';
import { getEnv } from './env.js';

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) {
    return;
  }

  const env = getEnv();

  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });

    isConnected = true;
    console.log(`✓ MongoDB connected to ${env.DB_NAME}`);
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed - Full error object:');
    console.error(error);
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
