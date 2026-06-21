import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import Customer from '@/lib/db/models/customer.model';
import ResetToken from '@/lib/db/models/resetToken.model';
import { forgotPasswordSchema, getFirstZodError } from '@/lib/validations';
import { sendPasswordResetEmail } from '@/lib/email';
import { withActivityLog } from '@/lib/activityLogger';

const _POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const result = forgotPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: getFirstZodError(result) },
                { status: 400 }
            );
        }

        const { email } = result.data;

        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { message: 'If an account exists with that email, a password reset link has been sent.' },
                { status: 200 }
            );
        }

        // Get customer name for the email
        const customer = await Customer.findOne({ userId: user._id });
        const userName = customer?.name || 'there';

        await ResetToken.updateMany(
            { userId: user._id, used: false },
            { $set: { used: true } }
        );

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await ResetToken.create({
            userId: user._id,
            token,
            expiresAt,
        });

        sendPasswordResetEmail({
            name: userName,
            email: user.email,
            token,
        }).catch((err) => console.error('Password reset email failed:', err));

        return NextResponse.json(
            { message: 'If an account exists with that email, a password reset link has been sent.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
};

export const POST = withActivityLog('forgot_password', _POST);
