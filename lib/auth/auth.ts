import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('Please define JWT_SECRET in .env.local');
}

const getSecretKey = () => new TextEncoder().encode(JWT_SECRET);
const getRefreshSecretKey = () => new TextEncoder().encode(JWT_REFRESH_SECRET);

export interface TokenPayload {
    userId: string;
    email: string;
    userType: string;
    role: string;
    [key: string]: unknown;
}

const ACCESS_TOKEN_MAX_AGE = 60 * 30;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};

// ---------- Password Hashing ----------

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// ---------- Token Generation ----------

export async function generateAccessToken(payload: TokenPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30 min')
        .sign(getSecretKey());
}

export async function generateRefreshToken(payload: TokenPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(getRefreshSecretKey());
}

// ---------- Token Verification ----------

async function verifyToken(token: string, secretKey: Uint8Array): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        if (
            typeof payload.userId === 'string' &&
            typeof payload.email === 'string' &&
            typeof payload.userType === 'string'
        ) {
            return {
                userId: payload.userId,
                email: payload.email,
                userType: payload.userType,
                role: typeof payload.role === 'string' ? payload.role : '',
            };
        }
        return null;
    } catch {
        return null;
    }
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
    return verifyToken(token, getSecretKey());
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
    return verifyToken(token, getRefreshSecretKey());
}

// ---------- Cookie Helpers ----------

export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
    response.cookies.set('accessToken', accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    response.cookies.set('refreshToken', refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
}

export function clearAuthCookies(response: NextResponse) {
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
}

// ---------- User from Request ----------

export async function getUserFromRequest(request: NextRequest): Promise<TokenPayload | null> {
    const accessToken = request.cookies.get('accessToken')?.value;
    if (accessToken) {
        const user = await verifyAccessToken(accessToken);
        if (user) return user;
    }

    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (refreshToken) {
        const user = await verifyRefreshToken(refreshToken);
        if (user) return user;
    }

    const legacyToken = request.cookies.get('token')?.value;
    if (legacyToken) {
        const user = await verifyAccessToken(legacyToken);
        if (user) return user;
    }

    return null;
}

export async function getAuthenticatedUser(
    request: NextRequest
): Promise<{
    user: TokenPayload | null;
    newAccessToken?: string;
    newRefreshToken?: string;
}> {
    const accessToken = request.cookies.get('accessToken')?.value;
    if (accessToken) {
        const user = await verifyAccessToken(accessToken);
        if (user) return { user };
    }

    const legacyToken = request.cookies.get('token')?.value;
    if (legacyToken) {
        const user = await verifyAccessToken(legacyToken);
        if (user) return { user };
    }

    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (refreshToken) {
        const user = await verifyRefreshToken(refreshToken);
        if (user) {
            const newAccessToken = await generateAccessToken(user);
            const newRefreshToken = await generateRefreshToken(user);
            return { user, newAccessToken, newRefreshToken };
        }
    }

    return { user: null };
}

// ---------- Role Check ----------

export function isAdmin(user: TokenPayload | null): boolean {
    return user?.userType === 'admin';
}