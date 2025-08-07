import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";

interface IFantasyTeam {
    user: Types.ObjectId;
    race: Types.ObjectId;
    drivers: Types.ObjectId[];
    captain?: Types.ObjectId;
    points: number;
    locked: boolean;
    createdAt: Date;
}

const fantasyTeamSchema = new Schema<IFantasyTeam>({
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
    drivers: [{
        type: Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    }],
    captain: {
        type: Schema.Types.ObjectId,
        ref: 'Driver',
        required: false
    },
    points: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    locked: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create compound index to ensure one team per user per race
fantasyTeamSchema.index({ user: 1, race: 1 }, { unique: true });
fantasyTeamSchema.index({ race: 1 });
fantasyTeamSchema.index({ user: 1 });
fantasyTeamSchema.index({ points: -1 }); // Descending for leaderboards
fantasyTeamSchema.index({ locked: 1 }); // For filtering locked/unlocked teams

// Validation: Ensure exactly 5 drivers are selected
fantasyTeamSchema.pre('validate', function() {
    if (this.drivers.length !== 5) {
        throw new Error('Fantasy team must contain exactly 5 drivers');
    }
    
    // Validate captain is one of the selected drivers
    if (this.captain && !this.drivers.includes(this.captain)) {
        throw new Error('Captain must be one of the selected drivers');
    }
    
    // Ensure no duplicate drivers
    const uniqueDrivers = new Set(this.drivers.map(d => d.toString()));
    if (uniqueDrivers.size !== this.drivers.length) {
        throw new Error('Cannot select the same driver multiple times');
    }
});

// Instance method to calculate total team cost
fantasyTeamSchema.methods.calculateTeamCost = async function() {
    const Driver = mongoose.model('Driver');
    const drivers = await Driver.find({ _id: { $in: this.drivers } });
    return drivers.reduce((total, driver) => total + (driver.cost || 0), 0);
};

// Instance method to check if team is within budget
fantasyTeamSchema.methods.isWithinBudget = async function(budget: number = 100) {
    const totalCost = await this.calculateTeamCost();
    return totalCost <= budget;
};

export const FantasyTeam = model<IFantasyTeam>('FantasyTeam', fantasyTeamSchema);
export type { IFantasyTeam };