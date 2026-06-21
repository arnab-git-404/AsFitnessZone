import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'No refresh token provided' },
                { status: 401 }
            );
        }

        const user = await verifyRefreshToken(refreshToken);
        if (!user) {
            const response = NextResponse.json(
                { error: 'Invalid or expired refresh token' },
                { status: 401 }
            );
            response.cookies.delete('refreshToken');
            response.cookies.delete('accessToken');
            return response;
        }

        const newAccessToken = await generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user);

        const response = NextResponse.json(
            { message: 'Tokens refreshed successfully' },
            { status: 200 }
        );

        setAuthCookies(response, newAccessToken, newRefreshToken);

        return response;
    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
