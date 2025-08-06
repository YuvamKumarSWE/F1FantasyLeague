import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";

interface IResult {
    race: Types.ObjectId;
    driver: Types.ObjectId;
    position: number | null; // Allow null positions
    sessionKey: number;
    dnf: boolean;
    dns: boolean;
    dsq: boolean;
    driverNumber?: number;
    numberOfLaps?: number;
    duration?: number;
    gapToLeader?: number;
    meetingKey?: number;
}

const resultSchema = new Schema<IResult>({
    race: {
        type: Schema.Types.ObjectId,
        ref: 'Race',
        required: true
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    position: {
        type: Number,
        required: false, // Changed to false to allow null
        min: 1,
        default: null // Allow null values
    },
    sessionKey: {
        type: Number,
        required: true
    },
    dnf: {
        type: Boolean,
        required: true,
        default: false
    },
    dns: {
        type: Boolean,
        required: true,
        default: false
    },
    dsq: {
        type: Boolean,
        required: true,
        default: false
    },
    driverNumber: {
        type: Number,
        required: false
    },
    numberOfLaps: {
        type: Number,
        required: false
    },
    duration: {
        type: Number,
        required: false
    },
    gapToLeader: {
        type: Number,
        required: false
    },
    meetingKey: {
        type: Number,
        required: false
    }
}, {
    timestamps: true
});

// Create compound index to ensure one result per driver per race
resultSchema.index({ race: 1, driver: 1 }, { unique: true });
resultSchema.index({ race: 1, position: 1 });
resultSchema.index({ driver: 1 });
resultSchema.index({ sessionKey: 1 });
resultSchema.index({ meetingKey: 1 });

export const Result = model<IResult>('Result', resultSchema);
export type { IResult };
