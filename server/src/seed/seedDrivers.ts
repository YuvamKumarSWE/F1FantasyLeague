import axios from 'axios';
import mongoose from 'mongoose';
import { Driver, IDriver } from '../models';
import { connectDb } from '../config/db';
import { getDriverCost } from '../utils/driverCostMap'; // Import cost function

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
        
        // Delete all existing drivers before seeding
        console.log('Deleting existing drivers...');
        const deleteResult = await Driver.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing drivers`);
        
        const response = await axios.get<ApiDriver[]>('https://api.openf1.org/v1/drivers?&session_key=9947');
        const drivers: ApiDriver[] = response.data;
        
        // Use Promise.all for better performance
        const driverPromises = drivers.map(async (element: ApiDriver) => {
            const dId: string = `${element.driver_number}_${element.name_acronym}`;
            
            const newDriver: IDriver = {
                driverId: dId,
                givenName: element.first_name,
                familyName: element.last_name,
                fullName: element.full_name,
                driverNumber: Number(element.driver_number), // Ensure it's a number
                code: element.name_acronym,
                nationality: element.country_code || 'Unknown',
                constructorId: element.team_name,
                teamName: element.team_name,
                teamColour: element.team_colour || '#000000',
                headshotUrl: element.headshot_url || '',
                sessionKey: Number(element.session_key), // Ensure it's a number
                meetingKey: Number(element.meeting_key), // Ensure it's a number
                cost: getDriverCost(element.driver_number) // Get cost from map
            };
            
            // Create new driver instance and save it
            const driver = new Driver(newDriver);
            return await driver.save();
        });
        
        await Promise.all(driverPromises);
        console.log(`Successfully seeded ${drivers.length} drivers with costs`);
        
    } catch (err: unknown) {
        console.error('Error seeding drivers:', err);
    } finally {
        // Close database connection
        await mongoose.connection.close();
    }
}

seedDrivers();
