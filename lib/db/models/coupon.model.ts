import mongoose, { Schema, model, models } from 'mongoose';

export interface ICoupon {
    _id: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchase?: number;
    maxUsage: number;
    currentUsage: number;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: [true, 'Coupon code is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: [true, 'Discount type is required'],
        },
        discountValue: {
            type: Number,
            required: [true, 'Discount value is required'],
            min: [1, 'Discount value must be at least 1'],
        },
        minPurchase: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxUsage: {
            type: Number,
            default: 0, // 0 = unlimited
            min: 0,
        },
        currentUsage: {
            type: Number,
            default: 0,
            min: 0,
        },
        expiresAt: {
            type: Date,
            required: [true, 'Expiry date is required'],
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

// Index for fast code lookup
CouponSchema.index({ code: 1 }, { unique: true });

const Coupon = models.Coupon || model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
