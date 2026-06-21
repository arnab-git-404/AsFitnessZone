
/**
 * Admin Seeder
 *
 * Run: npx tsx scripts/seed.ts
 *
 * Seeds the database with default roles and an admin user.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set.');
    console.error('   Create a .env.local file with:');
    console.error('   MONGODB_URI=mongodb://localhost:27017/fitnessgym');
    process.exit(1);
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@asfitnesszone.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Define schemas inline (avoids path/dependency issues outside Next.js)
        const RoleSchema = new mongoose.Schema(
            {
                name: { type: String, required: true, unique: true, lowercase: true, trim: true },
                description: { type: String, default: '' },
            },
            { timestamps: true }
        );

        const UserSchema = new mongoose.Schema(
            {
                email: { type: String, required: true, unique: true, lowercase: true },
                password: { type: String, required: true },
                userType: {
                    type: String,
                    enum: ['gymMember', 'admin', 'trainer'],
                    required: true,
                    default: 'gymMember',
                },
                role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
            },
            { timestamps: true }
        );

        const CustomerSchema = new mongoose.Schema(
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
                name: { type: String, required: true, trim: true },
                phone: String,
                age: Number,
                address: String,
                weight: Number,
                height: Number,
                fitnessGoal: { type: String, default: '' },
                profileImage: { type: String, default: '' },
            },
            { timestamps: true }
        );

        const RoleModel = mongoose.models.Role || mongoose.model('Role', RoleSchema);
        const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
        const CustomerModel = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

        // Create default roles
        const defaultRoles = [
            { name: 'admin', description: 'System administrator with full access' },
            { name: 'trainer', description: 'Personal trainer who manages gym members' },
            { name: 'gymmember', description: 'Regular gym member' },
        ];

        const createdRoles: Record<string, string> = {};
        for (const r of defaultRoles) {
            const existing = await RoleModel.findOne({ name: r.name });
            if (existing) {
                createdRoles[r.name] = existing._id.toString();
                console.log(`📋 Role "${r.name}" already exists`);
            } else {
                const role = await RoleModel.create(r);
                createdRoles[r.name] = role._id.toString();
                console.log(`📋 Role "${r.name}" created`);
            }
        }

        // Check if admin already exists
        const existingUser = await UserModel.findOne({ email: ADMIN_EMAIL.toLowerCase() });
        if (existingUser) {
            const existingCustomer = await CustomerModel.findOne({ userId: existingUser._id });
            const adminRole = await RoleModel.findById(existingUser.role);
            console.log(`👤 Admin already exists:`);
            console.log(`   Email: ${existingUser.email}`);
            console.log(`   Name:  ${existingCustomer?.name || 'N/A'}`);
            console.log(`   UserType: ${existingUser.userType}`);
            console.log(`   Role:  ${adminRole?.name || 'N/A'}`);
            console.log('\n✨ Seed complete — no changes made.');
            await mongoose.disconnect();
            return;
        }

        // Create User (auth record)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        const adminRoleId = createdRoles['admin'];
        const user = await UserModel.create({
            email: ADMIN_EMAIL.toLowerCase(),
            password: hashedPassword,
            userType: 'admin',
            role: new mongoose.Types.ObjectId(adminRoleId),
        });

        // Create Customer (profile record)
        const customer = await CustomerModel.create({
            userId: user._id,
            name: ADMIN_NAME,
        });

        console.log(`\n✅ Admin created successfully!`);
        console.log(`   Email:    ${user.email}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log(`   UserType: ${user.userType}`);
        console.log(`   Name:     ${customer.name}`);
        console.log(`\n⚠️  Change the default admin password after first login.`);

        await mongoose.disconnect();
        console.log('\n✨ Seed complete.');
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();