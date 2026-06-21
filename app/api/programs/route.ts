import { NextRequest, NextResponse } from 'next/server';
import { withActivityLog } from '@/lib/activityLogger';
import connectDB from '@/lib/db/db';
import Program from '@/lib/db/models/program.model';

const _GET = async (request: NextRequest) => {
    try {
        await connectDB();
        const programs = await Program.find({ isActive: true }).sort({ createdAt: -1 });

        return NextResponse.json({ programs }, { status: 200 });
    } catch (error: any) {
        console.error('Get public programs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_public_programs', _GET);
