import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import ResetToken from '@/lib/db/models/resetToken.model';
import { hashPassword } from '@/lib/auth/auth';
import { resetPasswordSchema, getFirstZodError } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = resetPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: getFirstZodError(result) },
                { status: 400 }
            );
        }

        const { token, password } = result.data;

        await connectDB();

        // Find the reset token
        const resetToken = await ResetToken.findOne({ token, used: false });

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
            return NextResponse.json(
                { error: 'Reset token has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await hashPassword(password);

        // Update the user's password
        await User.findByIdAndUpdate(resetToken.userId, {
            $set: { password: hashedPassword },
        });

        // Mark the token as used
        await ResetToken.findByIdAndUpdate(resetToken._id, {
            $set: { used: true },
        });

        return NextResponse.json(
            { message: 'Password has been reset successfully. You can now log in with your new password.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
