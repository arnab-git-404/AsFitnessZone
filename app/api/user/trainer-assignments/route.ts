import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import TrainerAssignment from '@/lib/db/models/trainerAssignment.model';
import Trainer from '@/lib/db/models/trainer.model';
import { getUserFromRequest } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';

const _GET = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const assignment = await TrainerAssignment.findOne({
            customerId: tokenPayload.userId,
            status: 'active',
        }).populate('trainerId');

        if (!assignment) {
            return NextResponse.json({ assignment: null }, { status: 200 });
        }

        return NextResponse.json({ assignment }, { status: 200 });
    } catch (error: any) {
        console.error('Get user assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_user_assignment', _GET);

const _POST = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();
        const { trainerId, feeType } = body;

        if (!trainerId || !feeType) {
            return NextResponse.json(
                { error: 'Trainer ID and fee type are required' },
                { status: 400 }
            );
        }

        const validFeeTypes = ['monthly', 'quarterly', 'sixMonths', 'annual'];
        if (!validFeeTypes.includes(feeType)) {
            return NextResponse.json({ error: 'Invalid fee type' }, { status: 400 });
        }

        // Verify trainer exists and get pricing
        const trainer = await Trainer.findById(trainerId);
        if (!trainer) {
            return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
        }

        const amount = trainer.pricing[feeType as keyof typeof trainer.pricing];
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Pricing not available for this fee type' },
                { status: 400 }
            );
        }

        // Check existing active assignment
        const existing = await TrainerAssignment.findOne({
            customerId: tokenPayload.userId,
            status: 'active',
        });
        if (existing) {
            return NextResponse.json(
                { error: 'You already have an active trainer. Please cancel it first.' },
                { status: 409 }
            );
        }

        // Calculate dates
        const startDate = new Date();
        const endDate = new Date(startDate);
        switch (feeType) {
            case 'monthly': endDate.setMonth(endDate.getMonth() + 1); break;
            case 'quarterly': endDate.setMonth(endDate.getMonth() + 3); break;
            case 'sixMonths': endDate.setMonth(endDate.getMonth() + 6); break;
            case 'annual': endDate.setFullYear(endDate.getFullYear() + 1); break;
        }

        const assignment = await TrainerAssignment.create({
            customerId: tokenPayload.userId,
            trainerId,
            feeType,
            amount,
            startDate,
            endDate,
            status: 'active',
        });

        const populated = await assignment.populate('trainerId');

        return NextResponse.json({ assignment: populated }, { status: 201 });
    } catch (error: any) {
        console.error('Create user assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const POST = withActivityLog('create_user_assignment', _POST);

const _PUT = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const assignment = await TrainerAssignment.findOneAndUpdate(
            { customerId: tokenPayload.userId, status: 'active' },
            { $set: { status: 'cancelled' } },
            { new: true }
        ).populate('trainerId');

        if (!assignment) {
            return NextResponse.json({ error: 'No active assignment found' }, { status: 404 });
        }

        return NextResponse.json({ assignment, message: 'Assignment cancelled' }, { status: 200 });
    } catch (error: any) {
        console.error('Cancel assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const PUT = withActivityLog('cancel_user_assignment', _PUT);