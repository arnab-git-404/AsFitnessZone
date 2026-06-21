import mongoose, { Schema, model, models } from 'mongoose';

export interface ITrainerAssignment {
    _id: string;
    customerId: mongoose.Types.ObjectId;
    trainerId: mongoose.Types.ObjectId;
    feeType: 'monthly' | 'quarterly' | 'sixMonths' | 'annual';
    amount: number;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'expired' | 'cancelled';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TrainerAssignmentSchema = new Schema<ITrainerAssignment>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Customer ID is required'],
            index: true,
        },
        trainerId: {
            type: Schema.Types.ObjectId,
            ref: 'Trainer',
            required: [true, 'Trainer ID is required'],
            index: true,
        },
        feeType: {
            type: String,
            enum: ['monthly', 'quarterly', 'sixMonths', 'annual'],
            required: [true, 'Fee type is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount must be positive'],
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active',
        },
        notes: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

TrainerAssignmentSchema.index({ customerId: 1, status: 1 });
TrainerAssignmentSchema.index({ trainerId: 1, status: 1 });

const TrainerAssignment = models.TrainerAssignment || model<ITrainerAssignment>('TrainerAssignment', TrainerAssignmentSchema);

export default TrainerAssignment;
