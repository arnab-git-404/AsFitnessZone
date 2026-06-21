import mongoose, { Schema, model, models } from 'mongoose';

export interface IMedia {
    _id: string;
    type: 'image' | 'video';
    url: string;
    publicId: string;
    category?: string;
    order: number;
    uploadedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
    {
        type: {
            type: String,
            enum: ['image', 'video'],
            required: [true, 'Media type is required'],
        },
        url: {
            type: String,
            required: [true, 'Media URL is required'],
        },
        publicId: {
            type: String,
            required: [true, 'Public ID is required'],
        },
        category: {
            type: String,
            default: 'general',
        },
        order: {
            type: Number,
            default: 0,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Media = models.Media || model<IMedia>('Media', MediaSchema);

export default Media;
