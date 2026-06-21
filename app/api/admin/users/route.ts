import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import Customer from '@/lib/db/models/customer.model';
import Role from '@/lib/db/models/role.model';
import { getUserFromRequest, isAdmin, hashPassword } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';
import { sendWelcomeEmail } from '@/lib/email';

const _GET = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);

        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const users = await User.find()
            .select('-password')
            .populate('role', 'name')
            .sort({ createdAt: -1 })
            .lean();

        // Join customer data for each user
        const userIds = users.map(u => u._id);
        const customers = await Customer.find({ userId: { $in: userIds } }).lean();
        const customerMap = new Map(customers.map(c => [c.userId.toString(), c]));

        const usersWithProfiles = users.map(u => ({
            ...u,
            customer: customerMap.get(u._id.toString()) || null,
        }));

        return NextResponse.json({ users: usersWithProfiles }, { status: 200 });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
};

const _POST = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();

        const body = await request.json();
        const { name, email, password, phone, weight, height, fitnessGoal } = body;

        // Validate required fields
        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        if (!email || !email.trim()) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }
        if (!password || password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        // Look up the gymmember role
        const gymMemberRole = await Role.findOne({ name: 'gymmember' });
        if (!gymMemberRole) {
            return NextResponse.json({ error: 'Default role not found. Run seed script first.' }, { status: 500 });
        }

        // Create User (auth record)
        const user = await User.create({
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            userType: 'gymMember',
            role: gymMemberRole._id,
        });

        // Create Customer (profile record)
        const customerData: Record<string, unknown> = {
            userId: user._id,
            name: name.trim(),
        };
        if (phone) customerData.phone = phone;
        if (weight) customerData.weight = Number(weight);
        if (height) customerData.height = Number(height);
        if (fitnessGoal) customerData.fitnessGoal = fitnessGoal;

        const customer = await Customer.create(customerData);

        // Send welcome email (non-blocking)
        sendWelcomeEmail({ name: customer.name, email: user.email }).catch((err) =>
            console.error('Welcome email failed:', err)
        );

        return NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    _id: user._id,
                    email: user.email,
                    userType: user.userType,
                    role: { _id: gymMemberRole._id, name: gymMemberRole.name },
                    customer: {
                        name: customer.name,
                        phone: customer.phone,
                        weight: customer.weight,
                        height: customer.height,
                        fitnessGoal: customer.fitnessGoal,
                    },
                    createdAt: user.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_users', _GET);
export const POST = withActivityLog('create_user', _POST);
