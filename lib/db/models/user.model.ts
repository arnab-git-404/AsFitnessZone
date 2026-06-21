import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
    _id: string;
    email: string;
    password: string;
    userType: 'gymMember' | 'admin' | 'trainer';
    role: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        userType: {
            type: String,
            enum: ['gymMember', 'admin', 'trainer'],
            required: [true, 'User type is required'],
            default: 'gymMember',
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: [true, 'Role is required'],
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = models.User || model("User", UserSchema);

export default User;
