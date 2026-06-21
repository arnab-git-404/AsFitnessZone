import mongoose, { Schema, model, models } from 'mongoose';

export interface ITrainerPricing {
    monthly: number;
    quarterly: number;
    sixMonths: number;
    annual: number;
}

export interface ITrainer {
    _id: string;
    userId?: mongoose.Types.ObjectId;
    name: string;
    bio: string;
    certifications: string[];
    experience: string;
    specializations: string[];
    image: string;
    isActive: boolean;
    pricing: ITrainerPricing;
    createdAt: Date;
    updatedAt: Date;
}

const TrainerSchema = new Schema<ITrainer>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
            sparse: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Trainer name is required'],
            trim: true,
        },
        bio: {
            type: String,
            required: [true, 'Bio is required'],
        },
        certifications: {
            type: [String],
            default: [],
        },
        experience: {
            type: String,
            default: '',
        },
        specializations: {
            type: [String],
            default: [],
        },
        image: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        pricing: {
            type: new Schema<ITrainerPricing>({
                monthly: { type: Number, default: 0, min: 0 },
                quarterly: { type: Number, default: 0, min: 0 },
                sixMonths: { type: Number, default: 0, min: 0 },
                annual: { type: Number, default: 0, min: 0 },
            }),
            default: { monthly: 0, quarterly: 0, sixMonths: 0, annual: 0 },
        },
    },
    {
        timestamps: true,
    }
);

const Trainer = models.Trainer || model<ITrainer>('Trainer', TrainerSchema);

export default Trainer;
