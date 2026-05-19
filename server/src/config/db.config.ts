import mongoose from 'mongoose';
import { env } from './env.config';
import { bootstrapAdmin } from '../utils';

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.info(`MongoDB connected: ${conn.connection.host}`);
    await bootstrapAdmin();
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
