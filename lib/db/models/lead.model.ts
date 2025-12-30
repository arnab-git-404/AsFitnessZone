import mongoose, { Schema, model, models } from 'mongoose';

export interface ILead {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: 'new' | 'contacted' | 'converted' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
        },
        status: {
            type: String,
            enum: ['new', 'contacted', 'converted', 'closed'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

const Lead = models.Lead || model<ILead>('Lead', LeadSchema);

export default Lead;
