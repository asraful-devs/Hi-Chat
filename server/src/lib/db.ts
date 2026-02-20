import mongoose from 'mongoose';
import { ENV } from './env.ts';

export const connectDB = async () => {
    try {
        const MONGO_URI = ENV.MONGO_URI;
        if (!MONGO_URI) {
            throw new Error(
                'MONGO_URI is not defined in environment variables'
            );
        }
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('MongoDB Connection Error', error);
        process.exit(1); // 1 status code means there is an error, 0 means success
    }
};
