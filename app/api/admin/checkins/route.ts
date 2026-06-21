import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import CheckIn from '@/lib/db/models/checkin.model';
import Customer from '@/lib/db/models/customer.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const userId = searchParams.get('userId');

        // Build query
        const query: Record<string, unknown> = {};
        if (date) query.date = date;
        if (userId) query.userId = userId;

        const checkIns = await CheckIn.find(query)
            .populate('userId', 'email')
            .sort({ date: -1 })
            .limit(100);

        // Get today's stats
        const today = new Date().toISOString().split('T')[0];
        const todayCount = await CheckIn.countDocuments({ date: today });

        // Get total unique members who checked in this month
        const monthStart = new Date();
        monthStart.setDate(1);
        const monthStartStr = monthStart.toISOString().split('T')[0];
        const monthlyActiveUsers = await CheckIn.distinct('userId', {
            date: { $gte: monthStartStr },
        });

        // Join customer names for each check-in
        const populatedCheckIns = await Promise.all(
            checkIns.map(async (ci) => {
                const ciObj = ci.toObject();
                const customer = await Customer.findOne({ userId: ci.userId?._id || ci.userId }).select('name').lean();
                return {
                    ...ciObj,
                    userId: ciObj.userId
                        ? { ...ciObj.userId, name: customer?.name || 'Unknown' }
                        : null,
                };
            })
        );

        return NextResponse.json(
            {
                checkIns: populatedCheckIns,
                stats: {
                    todayCheckIns: todayCount,
                    monthlyActiveUsers: monthlyActiveUsers.length,
                    totalCheckIns: checkIns.length,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Get admin check-ins error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
