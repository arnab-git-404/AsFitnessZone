import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Coupon from '@/lib/db/models/coupon.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { createCouponSchema, getFirstZodError } from '@/lib/validations';

export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || !isAdmin(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const coupons = await Coupon.find().sort({ createdAt: -1 });

        return NextResponse.json({ coupons }, { status: 200 });
    } catch (error) {
        console.error('Get coupons error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || !isAdmin(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const result = createCouponSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: getFirstZodError(result) }, { status: 400 });
        }

        const { code, description, discountType, discountValue, minPurchase, maxUsage, expiresAt, isActive } = result.data;

        await connectDB();

        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
        }

        if (discountType === 'percentage' && discountValue > 100) {
            return NextResponse.json({ error: 'Percentage discount cannot exceed 100%' }, { status: 400 });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            description: description || '',
            discountType,
            discountValue,
            minPurchase: minPurchase || 0,
            maxUsage: maxUsage ?? 0,
            expiresAt: new Date(expiresAt),
            isActive: isActive ?? true,
        });

        return NextResponse.json({ coupon, message: 'Coupon created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Create coupon error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
