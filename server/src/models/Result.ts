import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";

interface IResult {
    race: Types.ObjectId;
    driver: Types.ObjectId;
    position: number;
    
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
        required: true,
        min: 1
    },
}, {
    timestamps: true
});

// Create compound index to ensure one result per driver per race
resultSchema.index({ race: 1, driver: 1 }, { unique: true });
resultSchema.index({ race: 1, position: 1 });
resultSchema.index({ driver: 1 });

export const Result = model<IResult>('Result', resultSchema);
export type { IResult };
