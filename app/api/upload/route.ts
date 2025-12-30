import { NextRequest, NextResponse } from 'next/server';
import { generateUploadSignature } from '@/lib/cloudinary/cloudinary';
import { getUserFromRequest } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { folder } = await request.json();

        const uploadData = await generateUploadSignature(folder || 'fitnessgym');

        return NextResponse.json(uploadData, { status: 200 });
    } catch (error: any) {
        console.error('Upload signature error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
