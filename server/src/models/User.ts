import mongoose, { Document } from "mongoose";
import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    fantasyPoints: number;
    money: number
    role: 'user' | 'admin';
    comparePassword(candidatePassword: string): Promise<boolean>;
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
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
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
        required: true,
        default: 0,
        min: 0
    },
    money: {
        type: Number,
        required: true,
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

// Middleware to hash password before saving
userSchema.pre('save', async function (this: mongoose.Document & IUser, next) {
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error : any) {
        next(error);
    }

});

// Method to compare password for authentication
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw new Error('Password comparison failed');
    }
}

// Create indexes for better query performance
userSchema.index({ fantasyPoints: -1 }); // Descending for leaderboards
userSchema.index({ role: 1 });

export const User = model<IUser>('User', userSchema);
export type { IUser };
