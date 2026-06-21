import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken, generateRefreshToken, setAuthCookies } from './lib/auth/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Routes that don't require middleware processing
    const isPublicPage =
        pathname === '/login' ||
        pathname === '/signup' ||
        pathname === '/forgot-password' ||
        pathname.startsWith('/reset-password/');
    if (isPublicPage) {
        return NextResponse.next();
    }

    // Determine if this is a protected route
    const isUserRoute = pathname.startsWith('/user');
    const isAdminRoute = pathname.startsWith('/admin');
    const isTrainerRoute = pathname.startsWith('/trainer');
    const isApiRoute = pathname.startsWith('/api');

    // Protected routes check
    if (isUserRoute || isAdminRoute || isTrainerRoute || isApiRoute) {
        // Try access token first
        const accessToken = request.cookies.get('accessToken')?.value;
        let user = accessToken ? await verifyAccessToken(accessToken) : null;

        // If access token expired, try refresh token
        if (!user) {
            const refreshToken = request.cookies.get('refreshToken')?.value;
            if (refreshToken) {
                user = await verifyRefreshToken(refreshToken);
                if (user) {
                    // Token rotation — issue new tokens
                    const newAccessToken = await generateAccessToken(user);
                    const newRefreshToken = await generateRefreshToken(user);
                    const response = NextResponse.next();
                    setAuthCookies(response, newAccessToken, newRefreshToken);
                    // For API routes, pass user info via header so route handlers can use it
                    if (isApiRoute) {
                        response.headers.set('x-user-id', user.userId);
                        response.headers.set('x-user-type', user.userType);
                        response.headers.set('x-user-email', user.email);
                    }
                    return response;
                }
            }
        }

        // For API routes, pass user info via headers if authenticated
        if (isApiRoute && user) {
            const response = NextResponse.next();
            response.headers.set('x-user-id', user.userId);
            response.headers.set('x-user-type', user.userType);
            response.headers.set('x-user-email', user.email);
            return response;
        }

        // Not authenticated — redirect or 401 for API
        if (!user) {
            if (isApiRoute) {
                const response = NextResponse.json(
                    { error: 'Not authenticated' },
                    { status: 401 }
                );
                return response;
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Admin route — check admin userType
        if (isAdminRoute && user.userType !== 'admin') {
            if (pathname.startsWith('/api/admin')) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            return NextResponse.redirect(new URL('/user/dashboard', request.url));
        }

        // Trainer route — check trainer userType
        if (isTrainerRoute && user.userType !== 'trainer') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/user/:path*',
        '/admin/:path*',
        '/trainer/:path*',
        '/api/auth/me/:path*',
        '/api/auth/refresh/:path*',
        '/api/user/:path*',
        '/api/trainer/:path*',
        '/api/admin/:path*',
    ],
};
