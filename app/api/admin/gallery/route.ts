import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Media from '@/lib/db/models/media.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';

const _GET = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        // Sort by order first, then by creation date as fallback
        const mediaItems = await Media.find()
            .sort({ order: 1, createdAt: -1 })
            .populate('uploadedBy', 'name email');

        return NextResponse.json({ mediaItems }, { status: 200 });
    } catch (error: any) {
        console.error('Get media error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_gallery', _GET);

const _POST = async (request: NextRequest) => {
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

        // Auto-assign order: next number within the same category
        const lastInCategory = await Media.findOne({ category: category || 'general' })
            .sort({ order: -1 })
            .select('order');

        const nextOrder = (lastInCategory?.order ?? 0) + 1;

        const media = await Media.create({
            type,
            url,
            publicId,
            category: category || 'general',
            order: nextOrder,
            uploadedBy: tokenPayload.userId,
        });

        return NextResponse.json({ media }, { status: 201 });
    } catch (error: any) {
        console.error('Create media error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const POST = withActivityLog('create_gallery_item', _POST);
