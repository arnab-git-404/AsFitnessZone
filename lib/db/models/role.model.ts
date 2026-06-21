import mongoose, { Schema, model, models } from 'mongoose';

export interface IRole {
    _id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: [true, 'Role name is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Role = models.Role || model<IRole>('Role', RoleSchema);

export default Role;
