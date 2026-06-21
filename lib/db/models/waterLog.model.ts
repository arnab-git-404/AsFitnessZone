import mongoose, { Schema, model, models } from 'mongoose';

export interface IWaterLog {
    _id: string;
    userId: mongoose.Types.ObjectId;
    date: string;
    glasses: number;
    createdAt: Date;
    updatedAt: Date;
}

const WaterLogSchema = new Schema<IWaterLog>(
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
        glasses: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 50,
        },
    },
    { timestamps: true }
);

WaterLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const WaterLog = models.WaterLog || model<IWaterLog>('WaterLog', WaterLogSchema);
export default WaterLog;
