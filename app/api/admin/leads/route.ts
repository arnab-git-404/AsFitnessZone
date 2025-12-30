import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Lead from '@/lib/db/models/lead.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);

        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const leads = await Lead.find().sort({ createdAt: -1 });

        return NextResponse.json({ leads }, { status: 200 });
    } catch (error: any) {
        console.error('Get leads error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
