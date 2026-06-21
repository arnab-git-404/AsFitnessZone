import mongoose, { Schema, model, models } from 'mongoose';

export interface ICheckIn {
    _id: string;
    userId: mongoose.Types.ObjectId;
    date: string;
    checkInTime: Date;
    createdAt: Date;
    updatedAt: Date;
}

const CheckInSchema = new Schema<ICheckIn>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        checkInTime: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate check-ins per day per user
CheckInSchema.index({ userId: 1, date: 1 }, { unique: true });

const CheckIn = models.CheckIn || model<ICheckIn>('CheckIn', CheckInSchema);

export default CheckIn;
