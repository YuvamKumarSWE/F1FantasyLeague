import axios from 'axios';
import mongoose from 'mongoose';
import { connectDb } from '../config/db';
import { Race } from '../models/Race';
import { Driver } from '../models/Driver';
import { Result, IResult } from '../models/Result';

interface ApiResult {
  driver_number: number;
  position: number;
  session_key: number;
}

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

    for (const race of races) {
      const sessionKey = race.sessionKey;
      
      try {
        console.log(`Fetching results for ${race.sessionName} (session: ${sessionKey})`);
        
        const response = await axios.get<ApiResult[]>(
          `https://api.openf1.org/v1/session_result?session_key=${sessionKey}`
        );

        const results: ApiResult[] = response.data;
        
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

          // Validate position
          if (!result.position || result.position < 1) {
            console.warn(`Invalid position ${result.position} for driver ${result.driver_number} in session ${sessionKey}`);
            continue;
          }

          const newResult: IResult = {
            race: race._id,
            driver: driverId,
            position: result.position,
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

      } catch (apiError) {
        console.error(`❌ Failed to fetch results for session ${sessionKey}:`, apiError);
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
