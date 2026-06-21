'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';
import { Dumbbell, User, LogOut, Upload, ArrowLeft } from 'lucide-react';
import type { UserResponse } from '@/lib/types';

const fitnessGoalOptions = [
    { label: 'Fat Loss', value: 'fat-loss' },
    { label: 'Muscle Gain', value: 'muscle-gain' },
    { label: 'General Fitness', value: 'general-fitness' },
    { label: 'Strength', value: 'strength' },
    { label: 'Endurance', value: 'endurance' },
    { label: 'Flexibility', value: 'flexibility' },
];

export default function UserProfile() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        address: '',
        weight: '',
        height: '',
        fitnessGoal: '',
        profileImage: '',
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                const c = data.user.customer;
                setFormData({
                    name: c?.name || '',
                    email: data.user.email || '',
                    phone: c?.phone || '',
                    age: c?.age?.toString() || '',
                    address: c?.address || '',
                    weight: c?.weight?.toString() || '',
                    height: c?.height?.toString() || '',
                    fitnessGoal: c?.fitnessGoal || '',
                    profileImage: c?.profileImage || '',
                });
            } else {
                router.push('/login');
            }
        } catch {
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, fitnessGoal: value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toastRef.current?.show({ severity: 'error', summary: 'Image size must be less than 5MB' });
            return;
        }

        setIsUploading(true);

        try {
            const signatureResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: 'fitnessgym/profiles' }),
            });

            if (!signatureResponse.ok) {
                throw new Error('Failed to get upload signature');
            }

            const uploadData = await signatureResponse.json();

            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('api_key', uploadData.apiKey);
            formDataUpload.append('timestamp', uploadData.timestamp);
            formDataUpload.append('signature', uploadData.signature);
            formDataUpload.append('folder', uploadData.folder);
            if (uploadData.uploadPreset) {
                formDataUpload.append('upload_preset', uploadData.uploadPreset);
            }

            const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${uploadData.cloudName}/image/upload`,
                { method: 'POST', body: formDataUpload }
            );

            if (!cloudinaryResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const cloudinaryData = await cloudinaryResponse.json();
            setFormData({ ...formData, profileImage: cloudinaryData.secure_url });
            toastRef.current?.show({ severity: 'success', summary: 'Image uploaded successfully' });
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Failed to upload image' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    age: formData.age ? parseInt(formData.age) : undefined,
                    address: formData.address,
                    weight: formData.weight ? parseFloat(formData.weight) : undefined,
                    height: formData.height ? parseFloat(formData.height) : undefined,
                    fitnessGoal: formData.fitnessGoal,
                    profileImage: formData.profileImage,
                }),
            });

            if (response.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Profile updated successfully' });
                fetchUser();
            } else {
                const data = await response.json();
                toastRef.current?.show({ severity: 'error', summary: data.error || 'Failed to update profile' });
            }
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Something went wrong' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            toastRef.current?.show({ severity: 'success', summary: 'Logged out successfully' });
            router.push('/');
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Logout failed' });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Dumbbell className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Toast ref={toastRef} />
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="rounded-lg bg-primary p-2">
                            <Dumbbell className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
                            FitnessGym
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/user/dashboard">
                            <Button className="p-button-text"><ArrowLeft className="h-4 w-4 mr-2" />Dashboard</Button>
                        </Link>
                        <Button className="p-button-text" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            My <span className="text-primary">Profile</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your personal information and fitness details
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Image */}
                        <Card className="!border-border/50">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                                <div className="flex items-center space-x-6">
                                    <Avatar
                                        image={formData.profileImage || undefined}
                                        label={formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                                        className="w-24 h-24"
                                        style={{ backgroundColor: 'var(--p-primary-100)', color: 'var(--p-primary-700)', fontSize: '1.5rem' }}
                                    />
                                    <div className="space-y-2">
                                        <label htmlFor="profileImage" className="cursor-pointer">
                                            <div className="flex items-center space-x-2 px-4 py-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors">
                                                <Upload className="h-4 w-4" />
                                                <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                                            </div>
                                            <input
                                                id="profileImage"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                        </label>
                                        <p className="text-xs text-muted-foreground">
                                            JPG, PNG or GIF. Max size 5MB.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Personal Information */}
                        <Card className="!border-border/50">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="name">Full Name *</label>
                                        <InputText
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="email">Email *</label>
                                        <InputText
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full !bg-muted"
                                        />
                                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="phone">Phone</label>
                                        <InputText
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="age">Age</label>
                                        <InputText
                                            id="age"
                                            name="age"
                                            type="number"
                                            min="10"
                                            max="100"
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="25"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium" htmlFor="address">Address</label>
                                        <InputText
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="123 Main St, City, State, ZIP"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Fitness Details */}
                        <Card className="!border-border/50">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Fitness Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="weight">Weight (kg)</label>
                                        <InputText
                                            id="weight"
                                            name="weight"
                                            type="number"
                                            step="0.1"
                                            min="20"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            placeholder="70.5"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="height">Height (cm)</label>
                                        <InputText
                                            id="height"
                                            name="height"
                                            type="number"
                                            step="0.1"
                                            min="50"
                                            value={formData.height}
                                            onChange={handleChange}
                                            placeholder="175"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Fitness Goal</label>
                                        <Dropdown
                                            value={formData.fitnessGoal}
                                            options={fitnessGoalOptions}
                                            onChange={e => handleSelectChange(e.value)}
                                            placeholder="Select your fitness goal"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Link href="/user/dashboard">
                                <Button className="p-button-outlined" label="Cancel" />
                            </Link>
                            <Button
                                type="submit"
                                className="bg-primary border-primary text-white"
                                label={isSaving ? 'Saving...' : 'Save Changes'}
                                disabled={isSaving}
                            />
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
