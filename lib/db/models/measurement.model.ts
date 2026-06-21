import mongoose, { Schema, model, models } from 'mongoose';

export interface IMeasurement {
    _id: string;
    userId: mongoose.Types.ObjectId;
    date: string;
    weight?: number;
    chest?: number;
    waist?: number;
    arms?: number;
    thighs?: number;
    hips?: number;
    bodyFat?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MeasurementSchema = new Schema<IMeasurement>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        date: {
            type: String,
            required: true,
        },
        weight: { type: Number },
        chest: { type: Number },
        waist: { type: Number },
        arms: { type: Number },
        thighs: { type: Number },
        hips: { type: Number },
        bodyFat: { type: Number },
        notes: { type: String, default: '' },
    },
    { timestamps: true }
);

MeasurementSchema.index({ userId: 1, date: -1 });

const Measurement = models.Measurement || model<IMeasurement>('Measurement', MeasurementSchema);
export default Measurement;
