import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface IConstructor {
    constructorId: string;
    name: string;
    nationality: string;
    budgetValue?: number;
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
        required: true
    },
    budgetValue: {
        type: Number,
        required: false,
        min: 0,
        default: 100 // Default budget value for fantasy purposes
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
constructorSchema.index({ constructorId: 1 });
constructorSchema.index({ budgetValue: 1 });

export const Constructor = model<IConstructor>('Constructor', constructorSchema);
export type { IConstructor };
