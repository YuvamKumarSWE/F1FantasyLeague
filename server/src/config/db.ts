import mongoose from "mongoose";
import dotenv from "dotenv";

// Loads environment variables from the .env file into process.env
dotenv.config(); 

export const connectDb = async () => {
    try{
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('❌ MONGO_URI environment variable is not defined');
            console.error('Available env vars:', Object.keys(process.env).filter(k => !k.includes('SECRET')));
            throw new Error('MONGO_URI environment variable is not defined');
        }
        console.log('🔄 Attempting to connect to MongoDB...');
        await mongoose.connect(uri);
        console.log("✅ DB connected to f1fantasy");
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        console.error('Error details:', err instanceof Error ? err.message : 'Unknown error');
        process.exit(1);
    }
}