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

async function seedRaces(): Promise<void> {
  try {
    await connectDb();

    // Change the year below if needed
    const year = 2025;
 
    const response = await axios.get<ApiSession[]>(
      `https://api.openf1.org/v1/sessions?year=${year}`
    );

    const sessions: ApiSession[] = response.data;
    console.log(`Fetched ${sessions.length} total sessions for ${year}`);

    // Filter for actual Race sessions (ignore practice, qual, etc.)
    const raceSessions = sessions.filter(
      (session) => session.session_type === 'Race'
    );
    console.log(`Found ${raceSessions.length} race sessions to seed`);

    // Clear existing races for this year and drop old indexes
    await Race.collection.dropIndexes();
    console.log('Dropped old indexes');
    
    await Race.deleteMany({ year });
    console.log(`Cleared existing races for year ${year}`);

    const racePromises = raceSessions.map(async (session) => {
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
        year: session.year
      };

      const race = new Race(newRace);
      return await race.save();
    });

    await Promise.all(racePromises);
    console.log(`Successfully seeded ${raceSessions.length} races`);

  } catch (err: unknown) {
    console.error('Error seeding races:', err);
  } finally {
    await mongoose.connection.close();
  }
}

seedRaces();
