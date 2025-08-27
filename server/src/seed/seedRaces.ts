import axios from 'axios';
import mongoose from 'mongoose';
import { connectDb } from '../config/db';
import { updateRaceData, dropLegacyIndexes } from '../services/raceService';

async function seedRaces(): Promise<void> {
  try {
    await connectDb();

    // Drop legacy indexes if they exist
    await dropLegacyIndexes();

    // Update race data using the shared service
    const result = await updateRaceData();
    
    console.log(`🏁 Seed completed for season ${result.season}`);
    
  } catch (err) {
    console.error('❌ Error seeding races:', err);
  } finally {
    await mongoose.connection.close();
  }
}

seedRaces();
