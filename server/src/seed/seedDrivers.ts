import axios from 'axios';
import mongoose from 'mongoose';
import { Driver, IDriver } from '../models';
import { connectDb } from '../config/db';
import { getDriverCost } from '../utils/driverCostMap';

interface ApiResponse {
    drivers: ApiDriver[];
}

interface ApiDriver {
    driverId: string;
    name: string;
    surname: string;
    nationality: string;
    birthday: string;
    number: number;
    shortName: string;
    url: string;
    teamId: string;
}

async function seedDrivers(): Promise<void> {
    try {
        // Connect to database first
        await connectDb();
        
        // Delete all existing drivers before seeding
        console.log('Deleting existing drivers...');
        const deleteResult = await Driver.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing drivers`);
        
        const response = await axios.get<ApiResponse>('https://f1api.dev/api/current/drivers?limit=20');
        const drivers: ApiDriver[] = response.data.drivers;
        
        // Use Promise.all for better performance
        const driverPromises = drivers.map(async (element: ApiDriver) => {
            const newDriver: IDriver = {
                driverId: element.driverId,
                name: element.name,
                surname: element.surname,
                nationality: element.nationality,
                birthday: element.birthday,
                number: element.number,
                shortName: element.shortName,
                url: element.url || '',
                teamId: element.teamId,
                cost: getDriverCost(element.number) // Get cost from existing map
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
