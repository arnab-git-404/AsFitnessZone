import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import TrainerAssignment from '@/lib/db/models/trainerAssignment.model';
import Trainer from '@/lib/db/models/trainer.model';
import Customer from '@/lib/db/models/customer.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { assignTrainerSchema, updateAssignmentSchema } from '@/lib/validations';
import { getFirstZodError } from '@/lib/validations';
import { withActivityLog } from '@/lib/activityLogger';

const _GET = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const assignments = await TrainerAssignment.find()
            .populate('trainerId')
            .sort({ createdAt: -1 });

        // Fetch customer names from Customer model
        const customerIds = assignments.map(a => a.customerId);
        const customers = await Customer.find({ userId: { $in: customerIds } }).select('name');
        const customerMap = new Map(customers.map(c => [c.userId.toString(), c.name]));

        const enriched = assignments.map(a => ({
            ...a.toObject(),
            customerName: customerMap.get(a.customerId.toString()) || 'Unknown',
        }));

        return NextResponse.json({ assignments: enriched }, { status: 200 });
    } catch (error: any) {
        console.error('Get assignments error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_trainer_assignments', _GET);

const _POST = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const body = await request.json();

        const result = assignTrainerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: getFirstZodError(result) },
                { status: 400 }
            );
        }

        const { trainerId, feeType, amount } = result.data;

        // Verify trainer exists
        const trainer = await Trainer.findById(trainerId);
        if (!trainer) {
            return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
        }

        // Calculate dates based on fee type
        const startDate = new Date();
        const endDate = new Date(startDate);
        switch (feeType) {
            case 'monthly': endDate.setMonth(endDate.getMonth() + 1); break;
            case 'quarterly': endDate.setMonth(endDate.getMonth() + 3); break;
            case 'sixMonths': endDate.setMonth(endDate.getMonth() + 6); break;
            case 'annual': endDate.setFullYear(endDate.getFullYear() + 1); break;
        }

        // Check for existing active assignment for this customer
        // (customerId comes from body, or we'll use body.customerId for admin creation)
        const { customerId } = body;
        if (customerId) {
            const existing = await TrainerAssignment.findOne({
                customerId,
                status: 'active',
            });
            if (existing) {
                return NextResponse.json(
                    { error: 'Customer already has an active trainer assignment' },
                    { status: 409 }
                );
            }
        }

        const assignment = await TrainerAssignment.create({
            customerId: customerId || tokenPayload.userId,
            trainerId,
            feeType,
            amount,
            startDate,
            endDate,
            status: 'active',
            notes: body.notes || '',
        });

        return NextResponse.json({ assignment }, { status: 201 });
    } catch (error: any) {
        console.error('Create assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const POST = withActivityLog('create_trainer_assignment', _POST);
