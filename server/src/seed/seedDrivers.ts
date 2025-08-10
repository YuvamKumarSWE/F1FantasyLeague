import axios from 'axios';
import mongoose from 'mongoose';
import { Driver } from '../models';
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
    await connectDb();

    const { data } = await axios.get<ApiResponse>(
      'https://f1api.dev/api/current/drivers?limit=20'
    );
    const drivers = data.drivers;

    const ops = drivers.map((d) => ({
      updateOne: {
        filter: { driverId: d.driverId }, // stable external ID
        update: {
          $set: {
            driverId: d.driverId,
            name: d.name,
            surname: d.surname,
            nationality: d.nationality,
            birthday: d.birthday,
            number: d.number,
            shortName: d.shortName,
            url: d.url || '',
            teamId: d.teamId,
            cost: getDriverCost(d.number),
          },
        },
        upsert: true,
      },
    }));

    const result = await Driver.bulkWrite(ops, { ordered: false });
    console.log(
      `Drivers upserted. matched: ${result.matchedCount}, modified: ${result.modifiedCount}, upserted: ${result.upsertedCount}`
    );
  } catch (err) {
    console.error('Error seeding drivers:', err);
  } finally {
    await mongoose.connection.close();
  }
}

seedDrivers();
