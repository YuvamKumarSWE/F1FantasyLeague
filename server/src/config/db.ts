import mongoose from "mongoose";

export const connectDb = async () => {
    try{
        const uri = process.env.MONGO_URI;
        
        // Debug logging for production
        console.log('🔍 Environment check:');
        console.log('  - NODE_ENV:', process.env.NODE_ENV);
        console.log('  - MONGO_URI exists:', !!uri);
        console.log('  - MONGO_URI starts with:', uri?.substring(0, 20));
        
        if (!uri) {
            console.error('❌ MONGO_URI environment variable is not defined');
            console.error('Available env vars:', Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')).sort());
            throw new Error('MONGO_URI environment variable is not defined');
        }

        console.log('🔄 Attempting to connect to MongoDB...');
        
        // Production-ready connection with retry logic and proper options
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        
        console.log("✅ DB connected to f1fantasy");
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        if (err instanceof Error) {
            console.error('Error name:', err.name);
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);
        }
        process.exit(1);
    }
}