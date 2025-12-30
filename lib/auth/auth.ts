import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
    throw new Error('Please define JWT_SECRET in .env.local');
}

// Convert secret to Uint8Array for jose
const getSecretKey = () => new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    [key: string]: unknown;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token using jose
export async function generateToken(payload: TokenPayload): Promise<string> {
    
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(getSecretKey());
    
    return token;
}

// Verify JWT token using jose
export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      
        const { payload } = await jwtVerify(token, getSecretKey());
        
        // Validate and extract custom properties
        if (
            typeof payload.userId === 'string' &&
            typeof payload.email === 'string' &&
            typeof payload.role === 'string'
        ) {
            return {
                userId: payload.userId,
                email: payload.email,
                role: payload.role
            };
        }
        
        return null;
    } catch (error) {
        console.error('Token verification failed:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
        }
        return null;
    }
}

// Get user from request
export async function getUserFromRequest(request: NextRequest): Promise<TokenPayload | null> {
    try {
        const token = request.cookies.get('token')?.value;
        

        if (!token) {
            console.log('No token found in cookies');
            return null;
        }

        const user = await verifyToken(token);
        return user;
    } catch (error) {
        console.error('Error getting user from request:', error);
        return null;
    }
}

// Check if user is admin
export function isAdmin(user: TokenPayload | null): boolean {
    return user?.role === 'admin';
}