import axios from "axios";
import { Constructor, IConstructor } from "../models";
import { connectDb } from "../config/db";
import mongoose from "mongoose";

interface ApiDriver {
    full_name: string;
    driver_number: number;
    name_acronym: string;
    team_name: string;
    team_colour: string;
    first_name: string;
    last_name: string;
    headshot_url: string;
    country_code: string;
    session_key: number;
    meeting_key: number;
}



const getConstructors = async (): Promise<void> => {
    try{
        // Connect to the database
        await connectDb();
        
        const response = await axios.get<ApiDriver[]>('https://api.openf1.org/v1/drivers?&session_key=9951');
        const data : ApiDriver[] = response.data;

        const constructorMap = new Map<string, IConstructor>();
        
        data.forEach((element) => {
            // Only add if we haven't seen this team_name before
            if (!constructorMap.has(element.team_name)) {
                const obj: IConstructor = {
                    constructorId: element.team_name,
                    name: element.team_name,
                    nationality: " ",
                    team_colour: element.team_colour
                }
                constructorMap.set(element.team_name, obj);
            }
        });
        
        const uniqueConstructors : IConstructor[] = Array.from(constructorMap.values());

        // Clear existing constructors (optional - remove if you want to keep existing data)
        await Constructor.deleteMany({});
        console.log("Cleared existing constructors");

        // Save all unique constructors to the database
        const savedConstructors = await Constructor.insertMany(uniqueConstructors);
        console.log(`Successfully saved ${savedConstructors.length} constructors to the database:`);
        
        savedConstructors.forEach((constructor) => {
            console.log(`- ${constructor.name} (${constructor.constructorId})`);
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