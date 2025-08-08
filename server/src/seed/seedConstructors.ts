import axios from "axios";
import { Constructor, IConstructor } from "../models";
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
    try{
        // Connect to the database
        await connectDb();
        
        const response = await axios.get<ApiResponse>('https://f1api.dev/api/current/teams');
        const data: ApiTeam[] = response.data.teams;

        const constructors: IConstructor[] = data.map((team) => ({
            constructorId: team.teamId,
            name: team.teamName,
            nationality: team.teamNationality,
            constructorsChampionships: team.constructorsChampionships,
            driversChampionships: team.driversChampionships,
            firstAppearance: team.firstAppeareance,
            url: team.url
        }));

        // Clear existing constructors (optional - remove if you want to keep existing data)
        await Constructor.deleteMany({});
        console.log("Cleared existing constructors");

        // Save all constructors to the database
        const savedConstructors = await Constructor.insertMany(constructors);
        console.log(`Successfully saved ${savedConstructors.length} constructors to the database:`);
        
        savedConstructors.forEach((constructor) => {
            console.log(`- ${constructor.name} (${constructor.constructorId}) - ${constructor.nationality}`);
        });

        // Close the database connection
        await mongoose.connection.close();
        console.log("Database connection closed");

    } catch(err){
        console.error("Error seeding constructors:", err);
        await mongoose.connection.close();
        process.exit(1);
    }
}

getConstructors();