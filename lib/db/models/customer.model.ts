import mongoose, { Schema, model, models } from 'mongoose';

export interface ICustomer {
    _id: string;
    userId: mongoose.Types.ObjectId;
    name: string;
    phone?: string;
    age?: number;
    address?: string;
    weight?: number;
    height?: number;
    fitnessGoal?: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
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
    },
    {
        timestamps: true,
    }
);

const Customer = models.Customer || model<ICustomer>('Customer', CustomerSchema);

export default Customer;
