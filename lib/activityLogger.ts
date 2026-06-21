import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/db';
import ActivityLog from '@/lib/db/models/activityLog.model';

export interface LogActivityParams {
    userId?: string;
    userType: 'admin' | 'trainer' | 'gymMember' | 'anonymous';
    action: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    statusCode: number;
    responseTime: number;
    success: boolean;
    request?: NextRequest;
    details?: string;
}

/**
 * Log an activity asynchronously (fire-and-forget — never blocks the response).
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
    try {
        await connectDB();

        const ip = params.request
            ? params.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                || params.request.headers.get('x-real-ip')
                || '127.0.0.1'
            : '';

        const userAgent = params.request
            ? params.request.headers.get('user-agent') || ''
            : '';

        await ActivityLog.create({
            userId: params.userId || undefined,
            userType: params.userType,
            action: params.action,
            method: params.method,
            endpoint: params.endpoint,
            statusCode: params.statusCode,
            responseTime: Math.round(params.responseTime),
            success: params.success,
            ip,
            userAgent,
            details: params.details || '',
        });
    } catch (error) {
        // Never let logging break the main flow
        console.error('Activity log failed:', error);
    }
}

/**
 * Wraps an async route handler to automatically log the activity.
 * Measures response time, captures method/endpoint/status.
 * 
 * Usage:
 *   export const GET = withActivityLog(
 *     'view_users',
 *     async (req, tokenPayload) => { ... return NextResponse.json(...) }
 *   );
 */
export function withActivityLog(
    action: string,
    handler: (request: NextRequest, ...args: any[]) => Promise<Response>
) {
    return async (request: NextRequest, ...args: any[]): Promise<Response> => {
        const start = performance.now();
        let response: Response | undefined;
        let error: any = null;

        try {
            response = await handler(request, ...args);
            return response;
        } catch (e) {
            error = e;
            throw e;
        } finally {
            const responseTime = performance.now() - start;
            const statusCode = response?.status || (error ? 500 : 200);
            const success = statusCode < 400;

            // Try to get user info from the token (if available)
            let userId: string | undefined;
            let userType: 'admin' | 'trainer' | 'gymMember' | 'anonymous' = 'anonymous';

            try {
                const { getUserFromRequest } = await import('@/lib/auth/auth');
                const payload = await getUserFromRequest(request);
                if (payload) {
                    userId = payload.userId;
                    userType = (payload.userType as any) || 'gymMember';
                }
            } catch {
                // Silently fall back to anonymous
            }

            logActivity({
                userId,
                userType,
                action,
                method: request.method as any,
                endpoint: request.nextUrl?.pathname || '',
                statusCode,
                responseTime,
                success,
                request,
                details: error ? error.message || 'Unknown error' : undefined,
            });
        }
    };
}
