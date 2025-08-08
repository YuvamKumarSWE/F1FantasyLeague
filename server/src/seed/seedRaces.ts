import axios from 'axios';
import mongoose from 'mongoose';
import { Race, IRace } from '../models';
import { connectDb } from '../config/db';

interface ApiScheduleEntry {
  date: string | null;
  time: string | null;
}

interface ApiSchedule {
  race: ApiScheduleEntry;
  qualy: ApiScheduleEntry;
  fp1: ApiScheduleEntry;
  fp2: ApiScheduleEntry;
  fp3: ApiScheduleEntry;
  sprintQualy: ApiScheduleEntry;
  sprintRace: ApiScheduleEntry;
}

interface ApiFastLap {
  fast_lap: string;
  fast_lap_driver_id: string;
  fast_lap_team_id: string;
}

interface ApiCircuit {
  circuitId: string;
  circuitName: string;
  country: string;
  city: string;
  circuitLength?: string;
  lapRecord?: string;
  firstParticipationYear?: number;
  corners?: number;
  fastestLapDriverId?: string;
  fastestLapTeamId?: string;
  fastestLapYear?: number;
  url?: string;
}

interface ApiWinner {
  driverId: string;
  name: string;
  surname: string;
  country: string;
  birthday: string;
  number: number;
  shortName: string;
  url?: string;
}

interface ApiTeamWinner {
  teamId: string;
  teamName: string;
  country: string;
  firstAppearance?: number;
  constructorsChampionships?: number;
  driversChampionships?: number;
  url?: string;
}

interface ApiRace {
  raceId: string;
  championshipId: string;
  raceName: string;
  schedule: ApiSchedule;
  laps?: number;
  round: number;
  url?: string;
  fast_lap?: ApiFastLap;
  circuit: ApiCircuit;
  winner?: ApiWinner;
  teamWinner?: ApiTeamWinner;
}

interface ApiResponse {
  api: string;
  url: string;
  limit: number;
  offset: number;
  total: number;
  season: number;
  championship: {
    championshipId: string;
    championshipName: string;
    url: string;
    year: number;
  };
  races: ApiRace[];
}

function toDate(date: string | null, time: string | null): Date | null {
  if (!date || !time) return null;
  // Ensure "YYYY-MM-DDTHH:mm:ssZ"
  return new Date(`${date}T${time}`);
}

async function seedRaces(): Promise<void> {
  try {
    await connectDb();

    // Drop legacy unique index if it exists
    try {
      await Race.collection.dropIndex('sessionKey_1');
      console.log('Dropped legacy index sessionKey_1');
    } catch {
      // ignore if index doesn't exist
    }

    const { data } = await axios.get<ApiResponse>('https://f1api.dev/api/current');
    const year = data.season;

    // Clear existing races for this season
    await Race.deleteMany({ year });
    console.log(`Cleared existing races for ${year}`);

    const races: IRace[] = data.races.map((r) => ({
      raceId: r.raceId,
      championshipId: r.championshipId,
      raceName: r.raceName,
      year,
      round: r.round,
      laps: r.laps,
      url: r.url,
      schedule: {
        race: toDate(r.schedule.race.date, r.schedule.race.time),
        qualy: toDate(r.schedule.qualy.date, r.schedule.qualy.time),
        fp1: toDate(r.schedule.fp1?.date ?? null, r.schedule.fp1?.time ?? null),
        fp2: toDate(r.schedule.fp2?.date ?? null, r.schedule.fp2?.time ?? null),
        fp3: toDate(r.schedule.fp3?.date ?? null, r.schedule.fp3?.time ?? null),
        sprintQualy: toDate(r.schedule.sprintQualy?.date ?? null, r.schedule.sprintQualy?.time ?? null),
        sprintRace: toDate(r.schedule.sprintRace?.date ?? null, r.schedule.sprintRace?.time ?? null)
      },
      circuit: {
        circuitId: r.circuit.circuitId,
        circuitName: r.circuit.circuitName,
        country: r.circuit.country,
        city: r.circuit.city,
        circuitLength: r.circuit.circuitLength,
        lapRecord: r.circuit.lapRecord,
        firstParticipationYear: r.circuit.firstParticipationYear,
        corners: r.circuit.corners,
        fastestLapDriverId: r.circuit.fastestLapDriverId,
        fastestLapTeamId: r.circuit.fastestLapTeamId,
        fastestLapYear: r.circuit.fastestLapYear,
        url: r.circuit.url
      },
      fastLap:
        r.fast_lap &&
        r.fast_lap.fast_lap &&
        r.fast_lap.fast_lap_driver_id &&
        r.fast_lap.fast_lap_team_id
          ? {
              time: r.fast_lap.fast_lap,
              driverId: r.fast_lap.fast_lap_driver_id,
              teamId: r.fast_lap.fast_lap_team_id
            }
          : undefined,
      winner: r.winner
        ? {
            driverId: r.winner.driverId,
            name: r.winner.name,
            surname: r.winner.surname,
            country: r.winner.country,
            birthday: r.winner.birthday,
            number: r.winner.number,
            shortName: r.winner.shortName,
            url: r.winner.url
          }
        : undefined,
      teamWinner: r.teamWinner
        ? {
            teamId: r.teamWinner.teamId,
            teamName: r.teamWinner.teamName,
            country: r.teamWinner.country,
            firstAppearance: r.teamWinner.firstAppearance,
            constructorsChampionships: r.teamWinner.constructorsChampionships,
            driversChampionships: r.teamWinner.driversChampionships,
            url: r.teamWinner.url
          }
        : undefined
    }));

    const saved = await Race.insertMany(races, { ordered: false });
    console.log(`Seeded ${saved.length} races for ${year}`);
  } catch (err) {
    console.error('Error seeding races:', err);
  } finally {
    await mongoose.connection.close();
  }
}

seedRaces();
