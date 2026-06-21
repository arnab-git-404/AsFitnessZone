import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Trainer from '@/lib/db/models/trainer.model';
import User from '@/lib/db/models/user.model';
import Role from '@/lib/db/models/role.model';
import { getUserFromRequest, isAdmin } from '@/lib/auth/auth';
import { createTrainerSchema } from '@/lib/validations';
import { getFirstZodError } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const trainers = await Trainer.find()
            .populate('userId', 'email')
            .sort({ createdAt: -1 });

        // Attach email from populated user
        const enriched = trainers.map(t => {
            const obj = t.toObject();
            return {
                ...obj,
                userEmail: (obj.userId as any)?.email || '',
                userId: (obj.userId as any)?._id?.toString() || obj.userId,
            };
        });

        return NextResponse.json({ trainers: enriched }, { status: 200 });
    } catch (error: any) {
        console.error('Get trainers error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const tokenPayload = await getUserFromRequest(request);
        if (!tokenPayload || !isAdmin(tokenPayload)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const body = await request.json();

        const result = createTrainerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: getFirstZodError(result) },
                { status: 400 }
            );
        }

        const { email, password, name, bio, certifications, experience, specializations, image, pricing } = result.data;

        // Check if email already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'A user with this email already exists' },
                { status: 409 }
            );
        }

        // Look up trainer role
        const trainerRole = await Role.findOne({ name: 'trainer' });
        if (!trainerRole) {
            return NextResponse.json(
                { error: 'Trainer role not found. Run seed script first.' },
                { status: 500 }
            );
        }

        // Create User record with trainer userType + role ref
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            email,
            password: hashedPassword,
            userType: 'trainer',
            role: trainerRole._id,
        });

        // Create Trainer record linked to the User
        const trainer = await Trainer.create({
            userId: user._id,
            name,
            bio,
            certifications: certifications || [],
            experience: experience || '',
            specializations: specializations || [],
            image: image || '',
            pricing: {
                monthly: pricing.monthly,
                quarterly: pricing.quarterly,
                sixMonths: pricing.sixMonths,
                annual: pricing.annual,
            },
        });

        const enriched = {
            ...trainer.toObject(),
            userEmail: email,
            userId: user._id.toString(),
        };

        return NextResponse.json({ trainer: enriched }, { status: 201 });
    } catch (error: any) {
        console.error('Create trainer error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
