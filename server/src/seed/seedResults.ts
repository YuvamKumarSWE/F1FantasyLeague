import axios from 'axios';
import mongoose from 'mongoose';
import { connectDb } from '../config/db';
import { Race } from '../models/Race';
import { Driver } from '../models/Driver';
import { Result, IResult } from '../models/Result';

interface ApiResult {
  driver_number: number;
  position: number | null; // Allow null positions
  session_key: number;
  number_of_laps: number;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  duration: number;
  gap_to_leader: number;
  meeting_key: number;
}

// Helper function to add delay between requests
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to make API request with retry logic
const fetchWithRetry = async (url: string, maxRetries = 3, delayMs = 2000): Promise<ApiResult[]> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} for: ${url}`);
      const response = await axios.get<ApiResult[]>(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.log(`Rate limited. Waiting ${delayMs * attempt}ms before retry ${attempt}/${maxRetries}`);
        await delay(delayMs * attempt); // Exponential backoff
        continue;
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.log(`Request failed, retrying in ${delayMs}ms...`);
      await delay(delayMs);
    }
  }
  
  throw new Error('Max retries exceeded');
};

async function seedResults(): Promise<void> {
  try {
    await connectDb();

    const races = await Race.find({});
    const drivers = await Driver.find({});
    const driverMap = new Map<number, mongoose.Types.ObjectId>();

    console.log(`Found ${races.length} races and ${drivers.length} drivers`);

    // Build a map for quick lookup: driver_number → Driver._id
    for (const driver of drivers) {
      // Parse driver number from driverId format: "44_HAM" → 44
      const driverNumber = parseInt(driver.driverId.split('_')[0]);
      if (!isNaN(driverNumber)) {
        driverMap.set(driverNumber, driver._id);
      }
    }

    console.log(`Built driver map with ${driverMap.size} entries`);

    let totalResultsSeeded = 0;

    // Clear existing results to prevent duplicates
    await Result.deleteMany({});
    console.log('Cleared existing results');

    for (let i = 0; i < races.length; i++) {
      const race = races[i];
      const sessionKey = race.sessionKey;
      
      try {
        console.log(`[${i + 1}/${races.length}] Fetching results for ${race.sessionName} (session: ${sessionKey})`);
        
        const results: ApiResult[] = await fetchWithRetry(
          `https://api.openf1.org/v1/session_result?session_key=${sessionKey}`
        );
        
        if (!results || results.length === 0) {
          console.log(`No results found for session ${sessionKey}`);
          continue;
        }

        const resultDocs: IResult[] = [];

        for (const result of results) {
          const driverId = driverMap.get(result.driver_number);
          if (!driverId) {
            console.warn(
              `Driver with number ${result.driver_number} not found in session ${sessionKey}. Skipping...`
            );
            continue;
          }

          // Validate position - allow null for drivers who didn't finish with a classified position
          if (result.position !== null && (result.position < 1)) {
            console.warn(`Invalid position ${result.position} for driver ${result.driver_number} in session ${sessionKey}`);
            continue;
          }

          const newResult: IResult = {
            race: race._id,
            driver: driverId,
            position: result.position, // This can now be null
            sessionKey: result.session_key,
            dnf: result.dnf,
            dns: result.dns,
            dsq: result.dsq,
          };

          resultDocs.push(newResult);
        }

        if (resultDocs.length > 0) {
          await Result.insertMany(resultDocs);
          totalResultsSeeded += resultDocs.length;
          console.log(`✅ Seeded ${resultDocs.length} results for ${race.sessionName}`);
        } else {
          console.log(`⚠️  No valid results to seed for ${race.sessionName}`);
        }

        // Add delay between requests to avoid rate limiting
        if (i < races.length - 1) { // Don't delay after the last request
          console.log('Waiting 1 second before next request...');
          await delay(1000);
        }

      } catch (apiError: any) {
        console.error(`❌ Failed to fetch results for session ${sessionKey}:`, apiError.message);
        continue; // Continue with next race
      }
    }

    console.log(`🎉 Successfully seeded ${totalResultsSeeded} total results!`);
    
  } catch (err) {
    console.error('❌ Error seeding results:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedResults();
