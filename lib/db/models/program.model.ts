import mongoose, { Schema, model, models } from 'mongoose';

export interface IProgram {
    _id: string;
    title: string;
    description: string;
    image: string;
    features: string[];
    duration?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
    {
        title: {
            type: String,
            required: [true, 'Program title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Program description is required'],
        },
        image: {
            type: String,
            default: '',
        },
        features: {
            type: [String],
            default: [],
        },
        duration: {
            type: String,
            default: '',
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', ''],
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

const Program = models.Program || model<IProgram>('Program', ProgramSchema);

export default Program;
