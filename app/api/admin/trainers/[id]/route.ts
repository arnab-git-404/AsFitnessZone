import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Trainer from '@/lib/db/models/trainer.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';

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
        const trainer = await Trainer.findById(id);

        if (!trainer) {
            return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
        }

        return NextResponse.json({ trainer }, { status: 200 });
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

        const trainer = await Trainer.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });

        if (!trainer) {
            return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
        }

        return NextResponse.json({ trainer }, { status: 200 });
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
