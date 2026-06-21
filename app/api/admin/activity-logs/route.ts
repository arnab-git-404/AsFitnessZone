import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import ActivityLog from '@/lib/db/models/activityLog.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';

const _GET = async (request: NextRequest) => {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
        const action = searchParams.get('action');
        const method = searchParams.get('method');
        const status = searchParams.get('status'); // 'success' | 'fail'
        const userType = searchParams.get('userType');
        const search = searchParams.get('search');

        const filter: any = {};

        if (action) filter.action = action;
        if (method) filter.method = method;
        if (status === 'success') filter.success = true;
        if (status === 'fail') filter.success = false;
        if (userType) filter.userType = userType;
        if (search) {
            filter.$or = [
                { endpoint: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } },
            ];
        }

        const [logs, total] = await Promise.all([
            ActivityLog.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            ActivityLog.countDocuments(filter),
        ]);

        // Get unique actions and methods for filter dropdowns
        const [allActions, allMethods] = await Promise.all([
            ActivityLog.distinct('action'),
            ActivityLog.distinct('method'),
        ]);

        return NextResponse.json({
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            filters: {
                actions: allActions,
                methods: allMethods,
            },
        }, { status: 200 });
    } catch (error: any) {
        console.error('Get activity logs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET = withActivityLog('view_activity_logs', _GET);
