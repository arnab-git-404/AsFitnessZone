import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import User from '@/lib/db/models/user.model';
import Customer from '@/lib/db/models/customer.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();

        const users = await User.find()
            .select('-password')
            .populate('role', 'name')
            .sort({ createdAt: -1 })
            .lean();

        // Join customer data
        const userIds = users.map(u => u._id);
        const customers = await Customer.find({ userId: { $in: userIds } }).lean();
        const customerMap = new Map(customers.map(c => [c.userId.toString(), c]));

        // Build CSV rows
        const headers = [
            'User ID',
            'Email',
            'User Type',
            'Status',
            'Name',
            'Phone',
            'Age',
            'Address',
            'Weight (kg)',
            'Height (cm)',
            'Fitness Goal',
            'Profile Image',
            'Joined Date',
            'Last Updated',
        ];

        const rows = users.map(u => {
            const c = customerMap.get(u._id.toString());
            return [
                u._id.toString(),
                u.email,
                u.userType,
                u.isActive !== false ? 'Active' : 'Inactive',
                c?.name || '',
                c?.phone || '',
                c?.age?.toString() || '',
                c?.address || '',
                c?.weight?.toString() || '',
                c?.height?.toString() || '',
                c?.fitnessGoal || '',
                c?.profileImage || '',
                new Date(u.createdAt).toISOString(),
                new Date(u.updatedAt).toISOString(),
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row =>
                row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')
            ),
        ].join('\n');

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('Export users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
