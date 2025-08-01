import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface IRace {
    dateStart: Date;
    dateEnd: Date;
    sessionType: string;
    sessionName: string;
    countryKey: number;
    countryCode: string;
    countryName: string;
    circuitKey: number;
    circuitShortName: string;
    gmtOffset: string;
    year: number;
    sessionKey: number;
    meetingKey: number;
}

const raceSchema = new Schema<IRace>({
    dateStart: {
        type: Date,
        required: true
    },
    dateEnd: {
        type: Date,
        required: true
    },
    sessionType: {
        type: String,
        required: true
    },
    sessionName: {
        type: String,
        required: true
    },
    countryKey: {
        type: Number,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    countryName: {
        type: String,
        required: true
    },
    circuitKey: {
        type: Number,
        required: true
    },
    circuitShortName: {
        type: String,
        required: true
    },
    gmtOffset: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
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

// Create compound index for year and session
raceSchema.index({ sessionKey: 1 }, { unique: true });
raceSchema.index({ year: 1, sessionType: 1, dateStart: 1 });
raceSchema.index({ dateStart: 1 });
raceSchema.index({ countryKey: 1 });
raceSchema.index({ circuitKey: 1 });
raceSchema.index({ meetingKey: 1 });

export const Race = model<IRace>('Race', raceSchema);
export type { IRace };
