import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Trainer from '@/lib/db/models/trainer.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const trainers = await Trainer.find().sort({ createdAt: -1 });

        return NextResponse.json({ trainers }, { status: 200 });
    } catch (error: any) {
        console.error('Get trainers error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const body = await request.json();
        const { name, bio, certifications, experience, specializations, image } = body;

        if (!name || !bio) {
            return NextResponse.json(
                { error: 'Name and bio are required' },
                { status: 400 }
            );
        }

        const trainer = await Trainer.create({
            name,
            bio,
            certifications: certifications || [],
            experience: experience || '',
            specializations: specializations || [],
            image: image || '',
        });

        return NextResponse.json({ trainer }, { status: 201 });
    } catch (error: any) {
        console.error('Create trainer error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
