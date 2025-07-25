import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";

interface IFantasyPick {
    user: Types.ObjectId;
    race: Types.ObjectId;
    driverPicks: Types.ObjectId[];
    submittedAt: Date;
    score?: number;
}

const fantasyPickSchema = new Schema<IFantasyPick>({
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
    driverPicks: [{
        type: Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    }],
    submittedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    score: {
        type: Number,
        required: false,
        min: 0
    }
}, {
    timestamps: true
});

// Create compound index to ensure one pick per user per race
fantasyPickSchema.index({ user: 1, race: 1 }, { unique: true });
fantasyPickSchema.index({ race: 1 });
fantasyPickSchema.index({ user: 1 });
fantasyPickSchema.index({ score: -1 }); // Descending for leaderboards

// Validation: Ensure driverPicks array has valid length (typically 5-10 drivers)
fantasyPickSchema.pre('validate', function() {
    if (this.driverPicks.length < 1 || this.driverPicks.length > 10) {
        throw new Error('Driver picks must contain between 1 and 10 drivers');
    }
});

export const FantasyPick = model<IFantasyPick>('FantasyPick', fantasyPickSchema);
export type { IFantasyPick };
