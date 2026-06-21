import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Coupon from '@/lib/db/models/coupon.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';

const _GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await getUserFromRequest(request);
        if (!user || !isAdmin(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        return NextResponse.json({ coupon }, { status: 200 });
    } catch (error) {
        console.error('Get coupon error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_coupon', _GET);

const _PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await getUserFromRequest(request);
        if (!user || !isAdmin(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { id } = await params;

        await connectDB();

        const updateData: Record<string, unknown> = {};

        if (body.code !== undefined) updateData.code = body.code.toUpperCase();
        if (body.description !== undefined) updateData.description = body.description;
        if (body.discountType !== undefined) updateData.discountType = body.discountType;
        if (body.discountValue !== undefined) {
            if (body.discountType === 'percentage' && body.discountValue > 100) {
                return NextResponse.json({ error: 'Percentage discount cannot exceed 100%' }, { status: 400 });
            }
            updateData.discountValue = body.discountValue;
        }
        if (body.minPurchase !== undefined) updateData.minPurchase = body.minPurchase;
        if (body.maxUsage !== undefined) updateData.maxUsage = body.maxUsage;
        if (body.expiresAt !== undefined) updateData.expiresAt = new Date(body.expiresAt);
        if (body.isActive !== undefined) updateData.isActive = body.isActive;

        const coupon = await Coupon.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        return NextResponse.json({ coupon, message: 'Coupon updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Update coupon error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const PUT = withActivityLog('update_coupon', _PUT);

const _DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await getUserFromRequest(request);
        if (!user || !isAdmin(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Coupon deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete coupon error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const DELETE = withActivityLog('delete_coupon', _DELETE);
