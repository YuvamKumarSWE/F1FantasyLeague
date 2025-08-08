import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface IDriver {
    driverId: string;
    name: string;
    surname: string;
    nationality: string;
    birthday: string;
    number: number;
    shortName: string;
    url?: string;
    teamId: string;
    cost: number;
}

const driverSchema = new Schema<IDriver>({
    driverId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    shortName: {
        type: String,
        required: true,
        maxlength: 3
    },
    url: {
        type: String,
        required: false
    },
    teamId: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    timestamps: true
});

// Create indexes for better query performance
driverSchema.index({ teamId: 1 });
driverSchema.index({ number: 1 });

export const Driver = model<IDriver>('Driver', driverSchema);
export type { IDriver };