import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Role from '@/lib/db/models/role.model';
import User from '@/lib/db/models/user.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { withActivityLog } from '@/lib/activityLogger';

async function handlerGET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUserFromRequest(request);
        if (!isAdmin(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const role = await Role.findById(id);
        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json({ role });
    } catch (error) {
        console.error('Error fetching role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function handlerPUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const adminUser = await getUserFromRequest(request);
        if (!isAdmin(adminUser)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const body = await request.json();
        const { name, description } = body;

        const update: Record<string, string> = {};

        if (name !== undefined) {
            const normalizedName = name.trim().toLowerCase();
            if (!normalizedName) {
                return NextResponse.json({ error: 'Role name cannot be empty' }, { status: 400 });
            }

            // Check for duplicate (excluding this role)
            const existing = await Role.findOne({ name: normalizedName, _id: { $ne: id } });
            if (existing) {
                return NextResponse.json({ error: `Role "${normalizedName}" already exists` }, { status: 409 });
            }

            update.name = normalizedName;
        }

        if (description !== undefined) {
            update.description = description.trim();
        }

        const role = await Role.findByIdAndUpdate(id, update, { new: true, runValidators: true });
        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json({ role });
    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function handlerDELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const adminUser = await getUserFromRequest(request);
        if (!isAdmin(adminUser)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        // Check if any users are using this role
        const usersWithRole = await User.countDocuments({ role: id });
        if (usersWithRole > 0) {
            return NextResponse.json({
                error: `Cannot delete role: ${usersWithRole} user(s) are assigned to this role. Reassign them first.`
            }, { status: 400 });
        }

        const role = await Role.findByIdAndDelete(id);
        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const GET = withActivityLog('view_role', handlerGET);
export const PUT = withActivityLog('update_role', handlerPUT);
export const DELETE = withActivityLog('delete_role', handlerDELETE);
