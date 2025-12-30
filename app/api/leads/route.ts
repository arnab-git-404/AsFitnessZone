import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import Lead from '@/lib/db/models/lead.model';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, email, phone, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Create lead
        const lead = await Lead.create({
            name,
            email: email.toLowerCase(),
            phone: phone || '',
            message,
            status: 'new',
        });

        return NextResponse.json(
            {
                message: 'Lead created successfully',
                lead: {
                    id: lead._id,
                    name: lead.name,
                    email: lead.email,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Lead creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
