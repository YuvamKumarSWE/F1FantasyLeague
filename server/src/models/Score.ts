import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";

interface IScore {
    user: Types.ObjectId;
    race: Types.ObjectId;
    fantasyPick: Types.ObjectId;
    driverScores: {
        driver: Types.ObjectId;
        position: number;
        points: number;
        fastestLap: boolean;
        fantasyPoints: number;
    }[];
    totalFantasyPoints: number;
    calculatedAt: Date;
}

const scoreSchema = new Schema<IScore>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    race: {
        type: Schema.Types.ObjectId,
        ref: 'Race',
        required: true
    },
    fantasyPick: {
        type: Schema.Types.ObjectId,
        ref: 'FantasyPick',
        required: true
    },
    driverScores: [{
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'Driver',
            required: true
        },
        position: {
            type: Number,
            required: true,
            min: 1
        },
        points: {
            type: Number,
            required: true,
            min: 0
        },
        fastestLap: {
            type: Boolean,
            required: true,
            default: false
        },
        fantasyPoints: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalFantasyPoints: {
        type: Number,
        required: true,
        min: 0
    },
    calculatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create compound index to ensure one score per user per race
scoreSchema.index({ user: 1, race: 1 }, { unique: true });
scoreSchema.index({ race: 1 });
scoreSchema.index({ totalFantasyPoints: -1 }); // Descending for leaderboards
scoreSchema.index({ user: 1, totalFantasyPoints: -1 });

export const Score = model<IScore>('Score', scoreSchema);
export type { IScore };
