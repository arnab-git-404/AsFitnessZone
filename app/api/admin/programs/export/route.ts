import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Program from '@/lib/db/models/program.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();

        const programs = await Program.find().sort({ createdAt: -1 }).lean();

        const headers = [
            'Program ID',
            'Title',
            'Description',
            'Duration',
            'Difficulty',
            'Features',
            'Status',
            'Image URL',
            'Created Date',
            'Last Updated',
        ];

        const rows = programs.map(p => [
            p._id.toString(),
            p.title,
            p.description,
            p.duration || '',
            p.difficulty || 'All Levels',
            p.features?.join('; ') || '',
            p.isActive !== false ? 'Active' : 'Inactive',
            p.image || '',
            new Date(p.createdAt).toISOString(),
            new Date(p.updatedAt).toISOString(),
        ]);

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
                'Content-Disposition': `attachment; filename="programs-export-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('Export programs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
