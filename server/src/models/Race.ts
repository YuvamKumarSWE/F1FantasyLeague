import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface IRace {
    season: string;
    round: number;
    raceName: string;
    date: Date;
    circuit?: string;
    location?: string;
    isComplete: boolean;
}

const raceSchema = new Schema<IRace>({
    season: {
        type: String,
        required: true
    },
    round: {
        type: Number,
        required: true
    },
    raceName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    circuit: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    isComplete: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

// Create compound index for season and round
raceSchema.index({ season: 1, round: 1 }, { unique: true });
raceSchema.index({ date: 1 });
raceSchema.index({ isComplete: 1 });

export const Race = model<IRace>('Race', raceSchema);
export type { IRace };
