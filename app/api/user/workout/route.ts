import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Workout from '@/lib/db/models/workout.model';
import { getUserFromRequest } from '@/lib/auth/auth';
import { createWorkoutSchema, getFirstZodError } from '@/lib/validations';
import { withActivityLog } from '@/lib/activityLogger';

const _POST = async (request: NextRequest) => {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const result = createWorkoutSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: getFirstZodError(result) }, { status: 400 });
        }

        await connectDB();

        const { date, exercises, duration, notes } = result.data;

        // Upsert — one workout log per user per day
        const workout = await Workout.findOneAndUpdate(
            { userId: user.userId, date },
            {
                $set: {
                    userId: user.userId,
                    date,
                    exercises,
                    duration: duration || 0,
                    notes: notes || '',
                },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ workout, message: 'Workout logged successfully!' }, { status: 201 });
    } catch (error) {
        console.error('Log workout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const POST = withActivityLog('create_workout', _POST);

const _GET = async (request: NextRequest) => {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = Math.min(Number(searchParams.get('limit')) || 30, 100);

        await connectDB();

        const workouts = await Workout.find({ userId: user.userId })
            .sort({ date: -1 })
            .limit(limit);

        return NextResponse.json({ workouts }, { status: 200 });
    } catch (error) {
        console.error('Get workouts error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_workouts', _GET);