import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import WaterLog from '@/lib/db/models/waterLog.model';
import { getUserFromRequest } from '@/lib/auth/auth';
import { updateWaterSchema, getFirstZodError } from '@/lib/validations';
import { withActivityLog } from '@/lib/activityLogger';

const _POST = async (request: NextRequest) => {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const result = updateWaterSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: getFirstZodError(result) }, { status: 400 });
        }

        await connectDB();

        const today = new Date().toISOString().split('T')[0];
        const { glasses } = result.data;

        const waterLog = await WaterLog.findOneAndUpdate(
            { userId: user.userId, date: today },
            { $set: { userId: user.userId, date: today, glasses } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ waterLog, message: 'Water intake updated!' }, { status: 200 });
    } catch (error) {
        console.error('Update water error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const POST = withActivityLog('update_water_intake', _POST);

const _GET = async (request: NextRequest) => {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();

        const today = new Date().toISOString().split('T')[0];

        // Today's water
        const todayLog = await WaterLog.findOne({ userId: user.userId, date: today });

        // Last 7 days for streak context
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const weekStart = sevenDaysAgo.toISOString().split('T')[0];

        const weeklyLogs = await WaterLog.find({
            userId: user.userId,
            date: { $gte: weekStart, $lte: today },
        }).sort({ date: -1 });

        // Total for this month
        const monthStart = new Date();
        monthStart.setDate(1);
        const monthStartStr = monthStart.toISOString().split('T')[0];

        const monthlyLogs = await WaterLog.find({
            userId: user.userId,
            date: { $gte: monthStartStr },
        });

        const monthlyAvg = monthlyLogs.length > 0
            ? Math.round(monthlyLogs.reduce((sum, l) => sum + l.glasses, 0) / monthlyLogs.length)
            : 0;

        return NextResponse.json({
            todayGlasses: todayLog?.glasses || 0,
            weeklyLogs,
            monthlyAverage: monthlyAvg,
            streak: weeklyLogs.filter(l => l.glasses >= 6).length,
        }, { status: 200 });
    } catch (error) {
        console.error('Get water error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_water_intake', _GET);