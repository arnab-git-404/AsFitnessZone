import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Program from '@/lib/db/models/program.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
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
        const program = await Program.findById(id);

        if (!program) {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }

        return NextResponse.json({ program }, { status: 200 });
    } catch (error: any) {
        console.error('Get program error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_program', _GET);

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

        const program = await Program.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });

        if (!program) {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }

        return NextResponse.json({ program }, { status: 200 });
    } catch (error: any) {
        console.error('Update program error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const PUT = withActivityLog('update_program', _PUT);

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
            const program = await Program.findByIdAndUpdate(
                id,
                { isActive: Boolean(body.isActive) },
                { new: true }
            );

            if (!program) {
                return NextResponse.json({ error: 'Program not found' }, { status: 404 });
            }

            return NextResponse.json({
                message: body.isActive ? 'Program activated' : 'Program deactivated',
                program,
            });
        }

        return NextResponse.json({ error: 'isActive field is required' }, { status: 400 });
    } catch (error: any) {
        console.error('Toggle program status error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const PATCH = withActivityLog('toggle_program_status', _PATCH);
