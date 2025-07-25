import axios from 'axios';
import mongoose from 'mongoose';
import { Driver, IDriver } from '../models';
import { connectDb } from '../config/db';

// Rename to avoid conflict with Driver model
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

async function seedDrivers(): Promise<void> {
    try {
        // Connect to database first
        await connectDb();
        
        const response = await axios.get<ApiDriver[]>('https://api.openf1.org/v1/drivers?&session_key=9947');
        const drivers: ApiDriver[] = response.data;
        
        // Use Promise.all for better performance
        const driverPromises = drivers.map(async (element: ApiDriver) => {
            const dId: string = `${element.driver_number}_${element.name_acronym}`;
            
            const newDriver: IDriver = {
                driverId: dId,
                givenName: element.first_name,
                familyName: element.last_name,
                code: element.name_acronym,
                nationality: element.country_code || 'Unknown', // Use fallback when null
                constructorId: element.team_name
            };
            
            // Create new driver instance and save it
            const driver = new Driver(newDriver);
            return await driver.save();
        });
        
        await Promise.all(driverPromises);
        console.log(`Successfully seeded ${drivers.length} drivers`);
        
    } catch (err: unknown) {
        console.error('Error seeding drivers:', err);
    } finally {
        // Close database connection
        await mongoose.connection.close();
    }
}

seedDrivers();
