import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import Customer from '@/lib/db/models/customer.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
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
}
