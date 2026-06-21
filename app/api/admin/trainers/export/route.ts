import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Trainer from '@/lib/db/models/trainer.model';
import User from '@/lib/db/models/user.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();

        const trainers = await Trainer.find()
            .populate('userId', 'email')
            .sort({ createdAt: -1 })
            .lean();

        const headers = [
            'Trainer ID',
            'Name',
            'Email',
            'Bio',
            'Experience',
            'Certifications',
            'Specializations',
            'Status',
            'Monthly Price (₹)',
            'Quarterly Price (₹)',
            '6 Months Price (₹)',
            'Annual Price (₹)',
            'Image URL',
            'Created Date',
            'Last Updated',
        ];

        const rows = trainers.map(t => {
            const user = t.userId as any;
            const email = user?.email || '';
            return [
                t._id.toString(),
                t.name,
                email,
                t.bio,
                t.experience,
                t.certifications?.join('; ') || '',
                t.specializations?.join('; ') || '',
                t.isActive !== false ? 'Active' : 'Inactive',
                t.pricing?.monthly?.toString() || '0',
                t.pricing?.quarterly?.toString() || '0',
                t.pricing?.sixMonths?.toString() || '0',
                t.pricing?.annual?.toString() || '0',
                t.image || '',
                new Date(t.createdAt).toISOString(),
                new Date(t.updatedAt).toISOString(),
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
                'Content-Disposition': `attachment; filename="trainers-export-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('Export trainers error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
