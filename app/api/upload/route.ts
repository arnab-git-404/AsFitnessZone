import { NextRequest, NextResponse } from 'next/server';
import { generateUploadSignature } from '@/lib/cloudinary/cloudinary';
import { getUserFromRequest } from '@/lib/auth/auth';
import { uploadSignatureSchema, getFirstZodError } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const result = uploadSignatureSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: getFirstZodError(result) },
                { status: 400 }
            );
        }

        const folder = result.data.folder || 'fitnessgym';

        const uploadData = await generateUploadSignature(folder);

        return NextResponse.json(uploadData, { status: 200 });
    } catch (error: any) {
        console.error('Upload signature error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
