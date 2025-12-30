import mongoose, { Schema, model, models } from 'mongoose';

export interface IMembership {
    _id: string;
    name: string;
    duration: string;
    price: number;
    features: string[];
    isPopular: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MembershipSchema = new Schema<IMembership>(
    {
        name: {
            type: String,
            required: [true, 'Membership name is required'],
            trim: true,
        },
        duration: {
            type: String,
            required: [true, 'Duration is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be positive'],
        },
        features: {
            type: [String],
            default: [],
        },
        isPopular: {
            type: Boolean,
            default: false,
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

const Membership = models.Membership || model<IMembership>('Membership', MembershipSchema);

export default Membership;
