import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import CheckIn from '@/lib/db/models/checkin.model';
import { getUserFromRequest } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';

const _POST = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Check if already checked in today
        const existing = await CheckIn.findOne({
            userId: tokenPayload.userId,
            date: today,
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Already checked in today', checkIn: existing },
                { status: 409 }
            );
        }

        const checkIn = await CheckIn.create({
            userId: tokenPayload.userId,
            date: today,
            checkInTime: new Date(),
        });

        return NextResponse.json({ checkIn, message: 'Checked in successfully!' }, { status: 201 });
    } catch (error: any) {
        console.error('Check-in error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const POST = withActivityLog('create_checkin', _POST);

const _GET = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();

        // Get today's check-in status
        const today = new Date().toISOString().split('T')[0];
        const todayCheckIn = await CheckIn.findOne({
            userId: tokenPayload.userId,
            date: today,
        });

        // Get recent check-ins (last 30 days)
        const recentCheckIns = await CheckIn.find({
            userId: tokenPayload.userId,
        })
            .sort({ date: -1 })
            .limit(30);

        // Calculate streak
        const allCheckIns = await CheckIn.find({
            userId: tokenPayload.userId,
        })
            .sort({ date: -1 })
            .select('date');

        let streak = 0;
        const currentDate = new Date();
        for (let i = 0; i < allCheckIns.length; i++) {
            const expectedDate = new Date(currentDate);
            expectedDate.setDate(expectedDate.getDate() - i);
            const expectedDateStr = expectedDate.toISOString().split('T')[0];

            if (allCheckIns[i].date === expectedDateStr) {
                streak++;
            } else {
                break;
            }
        }

        return NextResponse.json(
            {
                todayCheckIn: !!todayCheckIn,
                recentCheckIns,
                streak,
                totalCheckIns: allCheckIns.length,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Get check-ins error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_checkins', _GET);
