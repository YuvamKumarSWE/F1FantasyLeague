import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface IConstructor {
    constructorId: string;
    name: string;
    nationality?: string;
    constructorsChampionships?: number;
    driversChampionships?: number;
    firstAppearance?: number;
    url?: string;
}

const constructorSchema = new Schema<IConstructor>({
    constructorId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: false
    },
    constructorsChampionships: {
        type: Number,
        required: false,
        default: 0
    },
    driversChampionships: {
        type: Number,
        required: false,
        default: 0
    },
    firstAppearance: {
        type: Number,
        required: false
    },
    url: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
// Remove duplicate of the unique path index
// constructorSchema.index({ constructorId: 1 });
constructorSchema.index({ name: 1 });

export const Constructor = model<IConstructor>('Constructor', constructorSchema);
export type { IConstructor };
