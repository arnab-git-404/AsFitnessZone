import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Role from '@/lib/db/models/role.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';

async function handlerGET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!isAdmin(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search') || '';

        const query: Record<string, unknown> = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const roles = await Role.find(query).sort({ name: 1 });

        return NextResponse.json({ roles });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function handlerPOST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!isAdmin(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const { name, description } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
        }

        const normalizedName = name.trim().toLowerCase();

        // Check for duplicate
        const existing = await Role.findOne({ name: normalizedName });
        if (existing) {
            return NextResponse.json({ error: `Role "${normalizedName}" already exists` }, { status: 409 });
        }

        const role = await Role.create({
            name: normalizedName,
            description: description?.trim() || '',
        });

        return NextResponse.json({ role }, { status: 201 });
    } catch (error) {
        console.error('Error creating role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const GET = withActivityLog('view_roles', handlerGET);
export const POST = withActivityLog('create_role', handlerPOST);
