import mongoose, { Schema, model, models } from 'mongoose';

export interface IWorkout {
    _id: string;
    userId: mongoose.Types.ObjectId;
    date: string;
    exercises: Array<{
        name: string;
        sets: number;
        reps: number;
        weight: number;
        notes?: string;
    }>;
    duration?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const WorkoutSchema = new Schema<IWorkout>(
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
        exercises: [
            {
                name: { type: String, required: true },
                sets: { type: Number, required: true, min: 1 },
                reps: { type: Number, required: true, min: 1 },
                weight: { type: Number, required: true, min: 0 },
                notes: { type: String, default: '' },
            },
        ],
        duration: {
            type: Number,
            min: 0,
        },
        notes: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

WorkoutSchema.index({ userId: 1, date: -1 });

const Workout = models.Workout || model<IWorkout>('Workout', WorkoutSchema);
export default Workout;
