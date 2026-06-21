import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import Customer from '@/lib/db/models/customer.model';
import { getUserFromRequest } from '@/lib/auth/auth';
import { updateProfileSchema, getFirstZodError } from '@/lib/validations';

export async function GET(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);

        if (!tokenPayload) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(tokenPayload.userId).select('-password');
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const customer = await Customer.findOne({ userId: user._id });

        return NextResponse.json({
            user: {
                ...user.toObject(),
                customer: customer ? customer.toObject() : null,
            },
        }, { status: 200 });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);

        if (!tokenPayload) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        await connectDB();

        const body = await request.json();
        const result = updateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: getFirstZodError(result) },
                { status: 400 }
            );
        }

        const { name, phone, age, address, weight, height, fitnessGoal, profileImage } = result.data;

        // Upsert Customer profile
        const customer = await Customer.findOneAndUpdate(
            { userId: tokenPayload.userId },
            {
                $set: {
                    userId: tokenPayload.userId,
                    ...(name !== undefined && { name }),
                    ...(phone !== undefined && { phone }),
                    ...(age !== undefined && { age }),
                    ...(address !== undefined && { address }),
                    ...(weight !== undefined && { weight }),
                    ...(height !== undefined && { height }),
                    ...(fitnessGoal !== undefined && { fitnessGoal }),
                    ...(profileImage !== undefined && { profileImage }),
                },
            },
            { upsert: true, new: true, runValidators: true }
        );

        if (!customer) {
            return NextResponse.json(
                { error: 'Failed to save profile' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: 'Profile updated successfully',
                customer,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
