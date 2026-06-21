import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import Customer from '@/lib/db/models/customer.model';
import Role from '@/lib/db/models/role.model';
import { hashPassword, generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth/auth';
import { signupSchema, getFirstZodError } from '@/lib/validations';
import { sendWelcomeEmail } from '@/lib/email';
import { logActivity } from '@/lib/activityLogger';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const startTime = performance.now();

        const body = await request.json();
        const result = signupSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: getFirstZodError(result) },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            logActivity({
                userType: 'anonymous',
                action: 'signup_failed',
                method: 'POST',
                endpoint: '/api/auth/signup',
                statusCode: 400,
                responseTime: performance.now() - startTime,
                success: false,
                request,
                details: 'Email already exists',
            });
            return NextResponse.json(
                { error: 'User already exists with this email' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        // Look up the gymmember role
        const gymMemberRole = await Role.findOne({ name: 'gymmember' });
        if (!gymMemberRole) {
            return NextResponse.json(
                { error: 'Default role not found. Run seed script first.' },
                { status: 500 }
            );
        }

        // Create User (auth record)
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            userType: 'gymMember',
            role: gymMemberRole._id,
        });

        // Create Customer (profile record)
        const customer = await Customer.create({
            userId: user._id,
            name,
        });

        const payload = {
            userId: user._id.toString(),
            email: user.email,
            userType: user.userType,
            role: gymMemberRole._id.toString(),
        };

        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        // Send welcome email (non-blocking)
        sendWelcomeEmail({ name: customer.name, email: user.email }).catch((err) =>
            console.error('Welcome email failed:', err)
        );

        const response = NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    userType: user.userType,
                    role: { _id: gymMemberRole._id, name: gymMemberRole.name },
                    customer: {
                        name: customer.name,
                    },
                },
            },
            { status: 201 }
        );

        setAuthCookies(response, accessToken, refreshToken);

        logActivity({
            userId: user._id.toString(),
            userType: 'gymMember',
            action: 'signup',
            method: 'POST',
            endpoint: '/api/auth/signup',
            statusCode: 201,
            responseTime: performance.now() - startTime,
            success: true,
            request,
            details: `New member: ${customer.name}`,
        });

        return response;
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
