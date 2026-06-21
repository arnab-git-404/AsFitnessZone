import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Media from '@/lib/db/models/media.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const mediaItems = await Media.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name email');

        return NextResponse.json({ mediaItems }, { status: 200 });
    } catch (error: any) {
        console.error('Get media error:', error);
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
        const { type, url, publicId, category } = body;

        if (!type || !url || !publicId) {
            return NextResponse.json(
                { error: 'Type, URL, and public ID are required' },
                { status: 400 }
            );
        }

        const media = await Media.create({
            type,
            url,
            publicId,
            category: category || 'general',
            uploadedBy: tokenPayload.userId,
        });

        return NextResponse.json({ media }, { status: 201 });
    } catch (error: any) {
        console.error('Create media error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
