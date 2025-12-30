import mongoose, { Schema, model, models } from 'mongoose';

export interface ITrainer {
    _id: string;
    name: string;
    bio: string;
    certifications: string[];
    experience: string;
    specializations: string[];
    image: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TrainerSchema = new Schema<ITrainer>(
    {
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
    },
    {
        timestamps: true,
    }
);

const Trainer = models.Trainer || model<ITrainer>('Trainer', TrainerSchema);

export default Trainer;
