'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dumbbell, User, LogOut, Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function UserProfile() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
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
                setFormData({
                    name: data.user.name || '',
                    email: data.user.email || '',
                    phone: data.user.phone || '',
                    age: data.user.age?.toString() || '',
                    address: data.user.address || '',
                    weight: data.user.weight?.toString() || '',
                    height: data.user.height?.toString() || '',
                    fitnessGoal: data.user.fitnessGoal || '',
                    profileImage: data.user.profileImage || '',
                });
            } else {
                router.push('/login');
            }
        } catch (error) {
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

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            // Get upload signature
            const signatureResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: 'fitnessgym/profiles' }),
            });

            if (!signatureResponse.ok) {
                throw new Error('Failed to get upload signature');
            }

            const uploadData = await signatureResponse.json();

            // Upload to Cloudinary
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
                {
                    method: 'POST',
                    body: formDataUpload,
                }
            );

            if (!cloudinaryResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const cloudinaryData = await cloudinaryResponse.json();
            setFormData({ ...formData, profileImage: cloudinaryData.secure_url });
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
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
                toast.success('Profile updated successfully');
                fetchUser();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            toast.success('Logged out successfully');
            router.push('/');
        } catch (error) {
            toast.error('Logout failed');
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
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="rounded-lg bg-primary p-2">
                            <Dumbbell className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
                            FitnessGym
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/user/dashboard">
                            <Button variant="ghost">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                        <Button variant="ghost" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Picture</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-6">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={formData.profileImage} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                            {formData.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <Label htmlFor="profileImage" className="cursor-pointer">
                                            <div className="flex items-center space-x-2 px-4 py-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors">
                                                <Upload className="h-4 w-4" />
                                                <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                                            </div>
                                            <Input
                                                id="profileImage"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            JPG, PNG or GIF. Max size 5MB.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        min="10"
                                        max="100"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="25"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="123 Main St, City, State, ZIP"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Fitness Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Fitness Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        name="weight"
                                        type="number"
                                        step="0.1"
                                        min="20"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        placeholder="70.5"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input
                                        id="height"
                                        name="height"
                                        type="number"
                                        step="0.1"
                                        min="50"
                                        value={formData.height}
                                        onChange={handleChange}
                                        placeholder="175"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                                    <Select value={formData.fitnessGoal} onValueChange={handleSelectChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your fitness goal" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fat-loss">Fat Loss</SelectItem>
                                            <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                                            <SelectItem value="general-fitness">General Fitness</SelectItem>
                                            <SelectItem value="strength">Strength</SelectItem>
                                            <SelectItem value="endurance">Endurance</SelectItem>
                                            <SelectItem value="flexibility">Flexibility</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Link href="/user/dashboard">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
