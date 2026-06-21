import mongoose, { Schema, model, models } from 'mongoose';

export interface IActivityLog {
    _id: string;
    userId?: mongoose.Types.ObjectId;
    userType: 'admin' | 'trainer' | 'gymMember' | 'anonymous';
    action: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    statusCode: number;
    responseTime: number;
    success: boolean;
    ip: string;
    userAgent: string;
    details?: string;
    createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        userType: {
            type: String,
            enum: ['admin', 'trainer', 'gymMember', 'anonymous'],
            required: true,
            index: true,
        },
        action: {
            type: String,
            required: true,
            index: true,
        },
        method: {
            type: String,
            enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            required: true,
        },
        endpoint: {
            type: String,
            required: true,
            index: true,
        },
        statusCode: {
            type: Number,
            required: true,
        },
        responseTime: {
            type: Number,
            required: true,
        },
        success: {
            type: Boolean,
            required: true,
            index: true,
        },
        ip: {
            type: String,
            default: '',
        },
        userAgent: {
            type: String,
            default: '',
        },
        details: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });

const ActivityLog = models.ActivityLog || model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
