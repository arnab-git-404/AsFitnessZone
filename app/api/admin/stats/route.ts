import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import Lead from '@/lib/db/models/lead.model';
import Program from '@/lib/db/models/program.model';
import Trainer from '@/lib/db/models/trainer.model';
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

        const [totalUsers, totalLeads, totalPrograms, totalTrainers] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Lead.countDocuments(),
            Program.countDocuments({ isActive: true }),
            Trainer.countDocuments({ isActive: true }),
        ]);

        return NextResponse.json(
            {
                stats: {
                    totalUsers,
                    totalLeads,
                    totalPrograms,
                    totalTrainers,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Stats error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
