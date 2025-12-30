import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    age?: number;
    address?: string;
    weight?: number;
    height?: number;
    fitnessGoal?: string;
    profileImage?: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        phone: {
            type: String,
            trim: true,
        },
        age: {
            type: Number,
            min: [10, 'Age must be at least 10'],
            max: [100, 'Age must be less than 100'],
        },
        address: {
            type: String,
            trim: true,
        },
        weight: {
            type: Number,
            min: [20, 'Weight must be at least 20 kg'],
        },
        height: {
            type: Number,
            min: [50, 'Height must be at least 50 cm'],
        },
        fitnessGoal: {
            type: String,
            enum: ['fat-loss', 'muscle-gain', 'general-fitness', 'strength', 'endurance', 'flexibility', ''],
            default: '',
        },
        profileImage: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

const User = models.User || model<IUser>('User', UserSchema);

export default User;
