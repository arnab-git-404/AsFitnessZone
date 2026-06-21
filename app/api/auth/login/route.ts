import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import Customer from '@/lib/db/models/customer.model';
import Role from '@/lib/db/models/role.model';
import { comparePassword, generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth/auth';
import { loginSchema, getFirstZodError } from '@/lib/validations';
import { logActivity } from '@/lib/activityLogger';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: getFirstZodError(result) },
                { status: 400 }
            );
        }

        const { email, password } = result.data;
        const startTime = performance.now();

        const user = await User.findOne({ email: email.toLowerCase() }).populate('role', 'name');
        if (!user) {
            logActivity({
                userType: 'anonymous',
                action: 'login_failed',
                method: 'POST',
                endpoint: '/api/auth/login',
                statusCode: 401,
                responseTime: performance.now() - startTime,
                success: false,
                request,
                details: 'Invalid email',
            });
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            logActivity({
                userType: 'anonymous',
                action: 'login_failed',
                method: 'POST',
                endpoint: '/api/auth/login',
                statusCode: 401,
                responseTime: performance.now() - startTime,
                success: false,
                request,
                details: 'Invalid password',
            });
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const roleObj = user.role as any;
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            userType: user.userType,
            role: roleObj?._id?.toString() || '',
        };

        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        // Join customer data for the response
        const customer = await Customer.findOne({ userId: user._id });

        const response = NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user._id,
                    email: user.email,
                    userType: user.userType,
                    role: roleObj ? { _id: roleObj._id, name: roleObj.name } : null,
                    customer: customer
                        ? { name: customer.name, profileImage: customer.profileImage }
                        : null,
                },
            },
            { status: 200 }
        );

        setAuthCookies(response, accessToken, refreshToken);

        // Log successful login
        logActivity({
            userId: user._id.toString(),
            userType: user.userType as any,
            action: 'login',
            method: 'POST',
            endpoint: '/api/auth/login',
            statusCode: 200,
            responseTime: performance.now() - startTime,
            success: true,
            request,
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
