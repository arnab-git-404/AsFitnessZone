import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromRequest } from './lib/auth/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protected user routes
    if (pathname.startsWith('/user')) {
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Protected admin routes
    if (pathname.startsWith('/admin')) {
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (user.role !== 'admin') {
            return NextResponse.redirect(new URL('/user/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/user/:path*', '/admin/:path*'],
};
