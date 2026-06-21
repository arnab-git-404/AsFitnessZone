import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Program from '@/lib/db/models/program.model';

export async function GET() {
    try {
        await connectDB();
        const programs = await Program.find({ isActive: true }).sort({ createdAt: -1 });

        return NextResponse.json({ programs }, { status: 200 });
    } catch (error: any) {
        console.error('Get public programs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
