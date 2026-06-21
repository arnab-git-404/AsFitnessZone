import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import Customer from '@/lib/db/models/customer.model';
import Trainer from '@/lib/db/models/trainer.model';
import { getUserFromRequest } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';
import Role from '@/lib/db/models/role.model';

const _GET = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);

        if (!tokenPayload) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(tokenPayload.userId)
            .select('-password')
            .populate({
  path: "role",
  model: Role,
})
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const enrichedUser: any = { ...user.toObject(), customer: null, trainer: null };

        if (user.userType === 'trainer') {
            const trainer = await Trainer.findOne({ userId: user._id });
            enrichedUser.trainer = trainer ? trainer.toObject() : null;
        } else {
            const customer = await Customer.findOne({ userId: user._id });
            enrichedUser.customer = customer ? customer.toObject() : null;
        }

        return NextResponse.json(
            { user: enrichedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
};

export const GET = withActivityLog('view_profile', _GET);
