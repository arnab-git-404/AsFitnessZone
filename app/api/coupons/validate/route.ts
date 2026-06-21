import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Coupon from '@/lib/db/models/coupon.model';
import { applyCouponSchema, getFirstZodError } from '@/lib/validations';
import { withActivityLog } from '@/lib/activityLogger';

const _POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const result = applyCouponSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: getFirstZodError(result) }, { status: 400 });
        }

        const { code, planPrice } = result.data;

        await connectDB();

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        // Generic error — don't reveal why the coupon is invalid
        const invalidResponse = () =>
            NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 400 });

        if (!coupon) return invalidResponse();

        // Check active
        if (!coupon.isActive) return invalidResponse();

        // Check expiry
        if (new Date() > new Date(coupon.expiresAt)) return invalidResponse();

        // Check usage limit
        if (coupon.maxUsage > 0 && coupon.currentUsage >= coupon.maxUsage) return invalidResponse();

        // Check minimum purchase
        if (coupon.minPurchase > 0 && planPrice < coupon.minPurchase) {
            return NextResponse.json(
                { error: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon` },
                { status: 400 }
            );
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = Math.round((planPrice * coupon.discountValue) / 100);
        } else {
            discountAmount = coupon.discountValue;
        }

        const finalPrice = Math.max(0, planPrice - discountAmount);

        return NextResponse.json(
            {
                valid: true,
                coupon: {
                    code: coupon.code,
                    discountType: coupon.discountType,
                    discountValue: coupon.discountValue,
                    discountAmount,
                },
                originalPrice: planPrice,
                finalPrice,
                savings: discountAmount,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Validate coupon error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const POST = withActivityLog('validate_coupon', _POST);
