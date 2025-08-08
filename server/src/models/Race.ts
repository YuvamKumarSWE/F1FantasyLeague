import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface SessionSchedule {
  race?: Date | null;
  qualy?: Date | null;
  fp1?: Date | null;
  fp2?: Date | null;
  fp3?: Date | null;
  sprintQualy?: Date | null;
  sprintRace?: Date | null;
}

interface Circuit {
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

interface FastLap {
  time: string;
  driverId: string;
  teamId: string;
}

interface Winner {
  driverId: string;
  name: string;
  surname: string;
  country: string;
  birthday: string;
  number: number;
  shortName: string;
  url?: string;
}

interface TeamWinner {
  teamId: string;
  teamName: string;
  country: string;
  firstAppearance?: number;
  constructorsChampionships?: number;
  driversChampionships?: number;
  url?: string;
}

interface IRace {
  raceId: string;
  championshipId: string;
  raceName: string;
  year: number;
  round: number;
  laps?: number;
  url?: string;
  schedule: SessionSchedule;
  circuit: Circuit;
  fastLap?: FastLap;
  winner?: Winner;
  teamWinner?: TeamWinner;
}

const scheduleSchema = new Schema<SessionSchedule>(
  {
    race: { type: Date, default: null },
    qualy: { type: Date, default: null },
    fp1: { type: Date, default: null },
    fp2: { type: Date, default: null },
    fp3: { type: Date, default: null },
    sprintQualy: { type: Date, default: null },
    sprintRace: { type: Date, default: null }
  },
  { _id: false }
);

const circuitSchema = new Schema<Circuit>(
  {
    circuitId: { type: String, required: true },
    circuitName: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    circuitLength: { type: String },
    lapRecord: { type: String },
    firstParticipationYear: { type: Number },
    corners: { type: Number },
    fastestLapDriverId: { type: String },
    fastestLapTeamId: { type: String },
    fastestLapYear: { type: Number },
    url: { type: String }
  },
  { _id: false }
);

const fastLapSchema = new Schema<FastLap>(
  {
    time: { type: String, required: true },
    driverId: { type: String, required: true },
    teamId: { type: String, required: true }
  },
  { _id: false }
);

const winnerSchema = new Schema<Winner>(
  {
    driverId: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    country: { type: String, required: true },
    birthday: { type: String, required: true },
    number: { type: Number, required: true },
    shortName: { type: String, required: true },
    url: { type: String }
  },
  { _id: false }
);

const teamWinnerSchema = new Schema<TeamWinner>(
  {
    teamId: { type: String, required: true },
    teamName: { type: String, required: true },
    country: { type: String, required: true },
    firstAppearance: { type: Number },
    constructorsChampionships: { type: Number },
    driversChampionships: { type: Number },
    url: { type: String }
  },
  { _id: false }
);

const raceSchema = new Schema<IRace>(
  {
    raceId: { type: String, required: true, unique: true },
    championshipId: { type: String, required: true },
    raceName: { type: String, required: true },
    year: { type: Number, required: true },
    round: { type: Number, required: true },
    laps: { type: Number },
    url: { type: String },
    schedule: { type: scheduleSchema, required: true },
    circuit: { type: circuitSchema, required: true },
    fastLap: { type: fastLapSchema, required: false },
    winner: { type: winnerSchema, required: false },
    teamWinner: { type: teamWinnerSchema, required: false }
  },
  {
    timestamps: true
  }
);

// Indexes
raceSchema.index({ year: 1, round: 1 });
raceSchema.index({ championshipId: 1 });
raceSchema.index({ 'circuit.circuitId': 1 });

export const Race = model<IRace>('Race', raceSchema);
export type { IRace };
