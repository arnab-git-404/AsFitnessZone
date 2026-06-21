import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Trainer from '@/lib/db/models/trainer.model';

export async function GET() {
    try {
        await connectDB();
        const trainers = await Trainer.find({ isActive: true }).sort({ createdAt: -1 });

        return NextResponse.json({ trainers }, { status: 200 });
    } catch (error: any) {
        console.error('Get public trainers error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
