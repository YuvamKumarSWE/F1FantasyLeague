import axios from "axios";
import { Constructor } from "../models";
import { connectDb } from "../config/db";
import mongoose from "mongoose";

interface ApiTeam {
  teamId: string;
  teamName: string;
  teamNationality: string;
  firstAppeareance: number;
  constructorsChampionships: number;
  driversChampionships: number;
  url: string;
}

interface ApiResponse {
  api: string;
  url: string;
  limit: number;
  offset: number;
  total: number;
  season: number;
  championshipId: string;
  teams: ApiTeam[];
}

const getConstructors = async (): Promise<void> => {
  try {
    await connectDb();

    const response = await axios.get<ApiResponse>(
      "https://f1api.dev/api/current/teams"
    );
    const data: ApiTeam[] = response.data.teams;

    const ops = data.map((team) => ({
      updateOne: {
        filter: { constructorId: team.teamId }, // stable external ID
        update: {
          $set: {
            constructorId: team.teamId,
            name: team.teamName,
            nationality: team.teamNationality,
            constructorsChampionships: team.constructorsChampionships,
            driversChampionships: team.driversChampionships,
            firstAppearance: team.firstAppeareance,
            url: team.url,
          },
        },
        upsert: true,
      },
    }));

    const result = await Constructor.bulkWrite(ops, { ordered: false });
    console.log(
      `Constructors upserted. matched: ${result.matchedCount}, modified: ${result.modifiedCount}, upserted: ${result.upsertedCount}`
    );

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error seeding constructors:", err);
    await mongoose.connection.close();
  }
};

getConstructors();