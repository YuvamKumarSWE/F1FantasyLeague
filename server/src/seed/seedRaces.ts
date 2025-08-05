import axios from 'axios';
import mongoose from 'mongoose';
import { Race, IRace } from '../models';
import { connectDb } from '../config/db';

// Match OpenF1 session response shape
interface ApiSession {
  session_key: number;
  meeting_key: number;
  location: string;
  date_start: string;
  date_end: string;
  session_type: string;
  session_name: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  gmt_offset: string;
  year: number;
}

// Utility function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to make API request with retry logic
async function makeApiRequest<T>(url: string, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Making API request to: ${url} (attempt ${i + 1})`);
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
        console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
      } else {
        throw error;
      }
    }
  }
  throw new Error(`Failed to fetch data after ${retries} attempts`);
}

async function seedRaces(): Promise<void> {
  try {
    await connectDb();

    const year = 2025; 
    try {
      await Race.collection.drop();
      console.log('Dropped entire Race collection');
    } catch (error) {
      console.log('Collection does not exist or already dropped');
    }

    // Add initial delay before making requests
    console.log('Waiting 2 seconds before starting API requests...');
    await delay(2000);
 
    const sessions = await makeApiRequest<ApiSession[]>(
      `https://api.openf1.org/v1/sessions?year=${year}`
    );

    console.log(`Fetched ${sessions.length} total sessions for ${year}`);

    // Filter for actual Race sessions (ignore practice, qual, etc.)
    const raceSessions = sessions.filter(
      (session) => session.session_type === 'Race'
    );
    console.log(`Found ${raceSessions.length} race sessions to seed`);

    // Process races one by one with delays to avoid rate limiting
    const savedRaces = [];
    for (let i = 0; i < raceSessions.length; i++) {
      const session = raceSessions[i];
      
      console.log(`Processing race ${i + 1}/${raceSessions.length}: ${session.session_name} - ${session.country_name}`);
      
      const newRace: IRace = {
        dateStart: new Date(session.date_start),
        dateEnd: new Date(session.date_end),
        sessionType: session.session_type,
        sessionName: session.session_name,
        countryKey: session.country_key,
        countryCode: session.country_code,
        countryName: session.country_name,
        circuitKey: session.circuit_key,
        circuitShortName: session.circuit_short_name,
        gmtOffset: session.gmt_offset,
        year: session.year,
        sessionKey: session.session_key,
        meetingKey: session.meeting_key
      };

      const race = new Race(newRace);
      const savedRace = await race.save();
      savedRaces.push(savedRace);

      // Add delay between database operations
      if (i < raceSessions.length - 1) {
        console.log('Waiting 500ms before next operation...');
        await delay(500);
      }
    }

    console.log(`Successfully seeded ${savedRaces.length} races`);

  } catch (err: unknown) {
    console.error('Error seeding races:', err);
    if (err instanceof Error) {
      console.error('Error details:', err.message);
    }
  } finally {
    await mongoose.connection.close();
  }
}

seedRaces();
