import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface IUser {
    email: string;
    passwordHash: string;
    createdAt: Date;
    fantasyPoints?: number;
    role: 'user' | 'admin';
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    passwordHash: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    fantasyPoints: {
        type: Number,
        required: false,
        default: 0,
        min: 0
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
userSchema.index({ fantasyPoints: -1 }); // Descending for leaderboards
userSchema.index({ role: 1 });

export const User = model<IUser>('User', userSchema);
export type { IUser };
