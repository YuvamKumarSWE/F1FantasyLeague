import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface IDriver {
    driverId: string;
    givenName: string;
    familyName: string;
    fullName: string;
    driverNumber: number;
    code: string;
    nationality?: string;
    dateOfBirth?: Date;
    constructorId: string;
    teamName: string;
    teamColour?: string;
    headshotUrl?: string;
    sessionKey: number;
    meetingKey: number;
}

const driverSchema = new Schema<IDriver>({
    driverId: {
        type: String,
        required: true,
        unique: true
    },
    givenName: {
        type: String,
        required: true
    },
    familyName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    driverNumber: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        maxlength: 3
    },
    nationality: {
        type: String,
        required: false
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    constructorId: {
        type: String,
        required: true
    },
    teamName: {
        type: String,
        required: true
    },
    teamColour: {
        type: String,
        required: false
    },
    headshotUrl: {
        type: String,
        required: false
    },
    sessionKey: {
        type: Number,
        required: true
    },
    meetingKey: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
driverSchema.index({ constructorId: 1 });

export const Driver = model<IDriver>('Driver', driverSchema);
export type { IDriver };