import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import Customer from '@/lib/db/models/customer.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';

const _PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const body = await request.json();
        const { name, phone, weight, height, fitnessGoal, email } = body;

        // Update the User document (email only)
        if (email) {
            const existing = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: params.id } });
            if (existing) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
            }
            await User.findByIdAndUpdate(params.id, { email: email.toLowerCase().trim() });
        }

        // Update the Customer profile
        const user = await User.findById(params.id).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const customerData: Record<string, unknown> = {};
        if (name !== undefined) customerData.name = name.trim();
        if (phone !== undefined) customerData.phone = phone;
        if (weight !== undefined) customerData.weight = weight ? Number(weight) : undefined;
        if (height !== undefined) customerData.height = height ? Number(height) : undefined;
        if (fitnessGoal !== undefined) customerData.fitnessGoal = fitnessGoal;

        if (Object.keys(customerData).length > 0) {
            await Customer.findOneAndUpdate(
                { userId: params.id },
                { $set: customerData },
                { new: true }
            );
        }

        // Fetch the updated user with customer data
        const updatedUser = await User.findById(params.id).select('-password').populate('role', 'name').lean();
        const customer = await Customer.findOne({ userId: params.id }).lean();

        return NextResponse.json({
            message: 'User updated successfully',
            user: { ...updatedUser, customer: customer || null },
        });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

const _PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const body = await request.json();

        // Toggle active status
        if (body.isActive !== undefined) {
            await User.findByIdAndUpdate(params.id, { isActive: Boolean(body.isActive) });
            const user = await User.findById(params.id).select('-password').populate('role', 'name').lean();
            const customer = await Customer.findOne({ userId: params.id }).lean();
            return NextResponse.json({
                message: body.isActive ? 'User activated' : 'User deactivated',
                user: { ...user, customer: customer || null },
            });
        }

        return NextResponse.json({ error: 'isActive field is required' }, { status: 400 });
    } catch (error) {
        console.error('Toggle user status error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const PUT = withActivityLog('update_user', _PUT);
export const PATCH = withActivityLog('toggle_user_status', _PATCH);
