import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Measurement from '@/lib/db/models/measurement.model';
import { getUserFromRequest } from '@/lib/auth/auth';
import { createMeasurementSchema, getFirstZodError } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const result = createMeasurementSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: getFirstZodError(result) }, { status: 400 });
        }

        await connectDB();

        const { date, weight, chest, waist, arms, thighs, hips, bodyFat, notes } = result.data;

        const measurement = await Measurement.findOneAndUpdate(
            { userId: user.userId, date },
            {
                $set: {
                    userId: user.userId,
                    date,
                    weight: weight ?? undefined,
                    chest: chest ?? undefined,
                    waist: waist ?? undefined,
                    arms: arms ?? undefined,
                    thighs: thighs ?? undefined,
                    hips: hips ?? undefined,
                    bodyFat: bodyFat ?? undefined,
                    notes: notes || '',
                },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ measurement, message: 'Measurements saved!' }, { status: 201 });
    } catch (error) {
        console.error('Save measurement error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = Math.min(Number(searchParams.get('limit')) || 30, 100);

        await connectDB();

        const measurements = await Measurement.find({ userId: user.userId })
            .sort({ date: -1 })
            .limit(limit);

        return NextResponse.json({ measurements }, { status: 200 });
    } catch (error) {
        console.error('Get measurements error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
