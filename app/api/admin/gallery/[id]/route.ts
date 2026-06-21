import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Media from '@/lib/db/models/media.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';
import { deleteFromCloudinary } from '@/lib/cloudinary/cloudinary';

const _GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const media = await Media.findById(id).populate('uploadedBy', 'name email');

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        return NextResponse.json({ media }, { status: 200 });
    } catch (error: any) {
        console.error('Get media error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_gallery_item', _GET);

const _PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const media = await Media.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        return NextResponse.json({ media }, { status: 200 });
    } catch (error: any) {
        console.error('Update media error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const PUT = withActivityLog('update_gallery_item', _PUT);

const _DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const media = await Media.findById(id);

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        // Delete from Cloudinary
        try {
            await deleteFromCloudinary(media.publicId);
        } catch (cloudinaryError) {
            console.error('Cloudinary deletion error:', cloudinaryError);
            // Continue even if Cloudinary deletion fails
        }

        await Media.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Media deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Delete media error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const DELETE = withActivityLog('delete_gallery_item', _DELETE);
