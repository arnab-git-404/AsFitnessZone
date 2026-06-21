import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Program from '@/lib/db/models/program.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';

const _GET = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const programs = await Program.find().sort({ createdAt: -1 });

        return NextResponse.json({ programs }, { status: 200 });
    } catch (error: any) {
        console.error('Get programs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_programs', _GET);

const _POST = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const body = await request.json();
        const { title, description, image, features, duration, difficulty } = body;

        if (!title || !description) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
        }

        const program = await Program.create({
            title,
            description,
            image: image || '',
            features: features || [],
            duration: duration || '',
            difficulty: difficulty || '',
        });

        return NextResponse.json({ program }, { status: 201 });
    } catch (error: any) {
        console.error('Create program error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const POST = withActivityLog('create_program', _POST);
