import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Trainer from '@/lib/db/models/trainer.model';
import TrainerAssignment from '@/lib/db/models/trainerAssignment.model';
import Customer from '@/lib/db/models/customer.model';
import User from '@/lib/db/models/user.model';
import { getUserFromRequest } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';

const _GET = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Find the trainer profile linked to this user
        const trainer = await Trainer.findOne({ userId: tokenPayload.userId });
        if (!trainer) {
            return NextResponse.json({ error: 'Trainer profile not found' }, { status: 404 });
        }

        // Get all assignments for this trainer
        const assignments = await TrainerAssignment.find({ trainerId: trainer._id })
            .sort({ createdAt: -1 });

        // Fetch customer names from Customer model
        const customerIds = assignments.map(a => a.customerId);
        const customers = await Customer.find({ userId: { $in: customerIds } }).select('name phone age fitnessGoal profileImage');

        // Fetch user emails for customers
        const users = await User.find({ _id: { $in: customerIds } }).select('email');
        const userMap = new Map(users.map(u => [u._id.toString(), u.email]));
        const customerMap = new Map(customers.map(c => [c.userId.toString(), c]));

        // Enrich assignments with customer info
        const enriched = assignments.map(a => {
            const customer = customerMap.get(a.customerId.toString());
            return {
                ...a.toObject(),
                customerName: customer?.name || 'Unknown',
                customerEmail: userMap.get(a.customerId.toString()) || '',
                customerPhone: customer?.phone || '',
                customerAge: customer?.age || null,
                customerFitnessGoal: customer?.fitnessGoal || '',
                customerProfileImage: customer?.profileImage || '',
            };
        });

        // Stats
        const now = new Date();
        const activeAssignments = enriched.filter(a => a.status === 'active');
        const expiringSoon = enriched.filter(a => {
            if (a.status !== 'active') return false;
            const daysLeft = Math.ceil((new Date(a.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return daysLeft > 0 && daysLeft <= 7;
        });

        return NextResponse.json({
            trainer: {
                _id: trainer._id,
                name: trainer.name,
                bio: trainer.bio,
                image: trainer.image,
                specializations: trainer.specializations,
                pricing: trainer.pricing,
            },
            assignments: enriched,
            stats: {
                totalCustomers: enriched.length,
                activeCustomers: activeAssignments.length,
                expiringSoon: expiringSoon.length,
                totalRevenue: activeAssignments.reduce((sum, a) => sum + a.amount, 0),
            },
        }, { status: 200 });
    } catch (error: any) {
        console.error('Trainer assignments error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_trainer_dashboard', _GET);
