import mongoose from 'mongoose';

export default function connectToMongoDB() {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }
    async function connect() {
        try {
          mongoose.connect(MONGODB_URI!, {})
          console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('MongoDB connection error:', error);
        }
    }
    connect()
}