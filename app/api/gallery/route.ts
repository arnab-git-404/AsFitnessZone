import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Media from '@/lib/db/models/media.model';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const filter: Record<string, string> = {};
        if (category && category !== 'all') {
            filter.category = category;
        }

        // Sort by order first, then by creation date as fallback
        const mediaItems = await Media.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .select('type url category order')
            .lean();

        return NextResponse.json({ mediaItems }, { status: 200 });
    } catch (error) {
        console.error('Get public gallery error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
