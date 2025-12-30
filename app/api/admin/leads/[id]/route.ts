import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Lead from '@/lib/db/models/lead.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const tokenPayload = await getUserFromRequest(request);

        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        const lead = await Lead.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!lead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ lead }, { status: 200 });
    } catch (error: any) {
        console.error('Update lead error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
