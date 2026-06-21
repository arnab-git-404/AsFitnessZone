import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Trainer from '@/lib/db/models/trainer.model';
import User from '@/lib/db/models/user.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import bcrypt from 'bcryptjs';
import { withActivityLog } from '@/lib/activityLogger';

const _GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const trainer = await Trainer.findById(id).populate('userId', 'email');

        if (!trainer) {
            return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
        }

        const obj = trainer.toObject();
        const enriched = {
            ...obj,
            userEmail: (obj.userId as any)?.email || '',
            userId: (obj.userId as any)?._id?.toString() || obj.userId,
        };

        return NextResponse.json({ trainer: enriched }, { status: 200 });
    } catch (error: any) {
        console.error('Get trainer error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_trainer', _GET);

const _PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const body = await request.json();

        // Handle email/password update on the linked User record
        if (body.email || body.password) {
            const trainer = await Trainer.findById(id);
            if (trainer && trainer.userId) {
                const userUpdate: any = {};
                if (body.email) userUpdate.email = body.email;
                if (body.password) {
                    userUpdate.password = await bcrypt.hash(body.password, 12);
                }
                await User.findByIdAndUpdate(trainer.userId, { $set: userUpdate });
            }
        }

        // Build the update object for Trainer, handling pricing specially
        const updateData: any = { ...body };
        delete updateData.email;
        delete updateData.password;
        if (body.pricing) {
            updateData['pricing.monthly'] = body.pricing.monthly;
            updateData['pricing.quarterly'] = body.pricing.quarterly;
            updateData['pricing.sixMonths'] = body.pricing.sixMonths;
            updateData['pricing.annual'] = body.pricing.annual;
            delete updateData.pricing;
        }

        const trainer = await Trainer.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).populate('userId', 'email');

        if (!trainer) {
            return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
        }

        const obj = trainer.toObject();
        const enriched = {
            ...obj,
            userEmail: (obj.userId as any)?.email || '',
            userId: (obj.userId as any)?._id?.toString() || obj.userId,
        };

        return NextResponse.json({ trainer: enriched }, { status: 200 });
    } catch (error: any) {
        console.error('Update trainer error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const PUT = withActivityLog('update_trainer', _PUT);

const _PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const body = await request.json();

        if (body.isActive !== undefined) {
            const trainer = await Trainer.findByIdAndUpdate(
                id,
                { isActive: Boolean(body.isActive) },
                { new: true }
            ).populate('userId', 'email');

            if (!trainer) {
                return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
            }

            const obj = trainer.toObject();
            const enriched = {
                ...obj,
                userEmail: (obj.userId as any)?.email || '',
                userId: (obj.userId as any)?._id?.toString() || obj.userId,
            };

            return NextResponse.json({
                message: body.isActive ? 'Trainer activated' : 'Trainer deactivated',
                trainer: enriched,
            });
        }

        return NextResponse.json({ error: 'isActive field is required' }, { status: 400 });
    } catch (error: any) {
        console.error('Toggle trainer status error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const PATCH = withActivityLog('toggle_trainer_status', _PATCH);
