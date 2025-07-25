import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface IDriver {
    driverId: string;
    givenName: string;
    familyName: string;
    code: string;
    nationality: string;
    dateOfBirth?: Date;
    constructorId: string;
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
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
driverSchema.index({ driverId: 1 });
driverSchema.index({ constructorId: 1 });

export const Driver = model<IDriver>('Driver', driverSchema);
export type { IDriver };