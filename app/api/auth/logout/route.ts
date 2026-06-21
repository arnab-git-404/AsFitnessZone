import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies, getUserFromRequest } from '@/lib/auth/auth';
import { logActivity } from '@/lib/activityLogger';

export async function POST(request: NextRequest) {
    const startTime = performance.now();
    const tokenPayload = await getUserFromRequest(request);

    const response = NextResponse.json(
        { message: 'Logged out successfully' },
        { status: 200 }
    );

    clearAuthCookies(response);

    logActivity({
        userId: tokenPayload?.userId,
        userType: (tokenPayload?.userType as any) || 'anonymous',
        action: 'logout',
        method: 'POST',
        endpoint: '/api/auth/logout',
        statusCode: 200,
        responseTime: performance.now() - startTime,
        success: true,
        request,
    });

    return response;
}
