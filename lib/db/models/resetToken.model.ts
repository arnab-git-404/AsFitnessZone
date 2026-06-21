import mongoose, { Schema, model, models } from 'mongoose';

export interface IResetToken {
    _id: string;
    userId: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}

const ResetTokenSchema = new Schema<IResetToken>({        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Auto-expire tokens after 1 hour (TTL index)
ResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ResetToken = models.ResetToken || model<IResetToken>('ResetToken', ResetTokenSchema);

export default ResetToken;
