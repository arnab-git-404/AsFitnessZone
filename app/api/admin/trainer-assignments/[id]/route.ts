import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import TrainerAssignment from '@/lib/db/models/trainerAssignment.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';
import { updateAssignmentSchema } from '@/lib/validations';
import { getFirstZodError } from '@/lib/validations';

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

        const result = updateAssignmentSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: getFirstZodError(result) },
                { status: 400 }
            );
        }

        const assignment = await TrainerAssignment.findByIdAndUpdate(
            id,
            { $set: result.data },
            { new: true, runValidators: true }
        ).populate('trainerId');

        if (!assignment) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        return NextResponse.json({ assignment }, { status: 200 });
    } catch (error: any) {
        console.error('Update assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const PUT = withActivityLog('update_trainer_assignment', _PUT);

const _DELETE = async (
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
        const assignment = await TrainerAssignment.findByIdAndDelete(id);

        if (!assignment) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Assignment deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Delete assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const DELETE = withActivityLog('delete_trainer_assignment', _DELETE);
