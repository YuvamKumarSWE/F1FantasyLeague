import mongoose from "mongoose";
import dotenv from "dotenv";

// Loads environment variables from the .env file into process.env
dotenv.config(); 

export const connectDb = async () => {
    try{
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
        await mongoose.connect(uri);
        console.log("DB connected to f1fantasy");
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        process.exit(1);
    }
}