import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Trainer from '@/lib/db/models/trainer.model';
import User from '@/lib/db/models/user.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import bcrypt from 'bcryptjs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const trainer = await Trainer.findByIdAndDelete(id);

        if (!trainer) {
            return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Trainer deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Delete trainer error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
