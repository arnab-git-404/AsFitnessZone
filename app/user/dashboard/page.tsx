'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, User, LogOut, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function UserDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                router.push('/login');
            }
        } catch (error) {
            router.push('/login');
        } finally {
            setIsLoading(false);
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
                        <Link href="/user/profile">
                            <Button variant="ghost">
                                <User className="h-4 w-4 mr-2" />
                                Profile
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
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome back, <span className="text-primary">{user?.name}</span>!
                        </h1>
                        <p className="text-muted-foreground">
                            Track your progress and manage your fitness journey
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {user?.weight ? `${user.weight} kg` : 'Not set'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Update in your profile
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Fitness Goal</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold capitalize">
                                    {user?.fitnessGoal ? user.fitnessGoal.replace('-', ' ') : 'Not set'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Set your goal in profile
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Keep up the great work!
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/user/profile">
                                <Button className="w-full" variant="outline">
                                    <User className="h-4 w-4 mr-2" />
                                    Update Profile
                                </Button>
                            </Link>
                            <Link href="/programs">
                                <Button className="w-full" variant="outline">
                                    <Dumbbell className="h-4 w-4 mr-2" />
                                    Browse Programs
                                </Button>
                            </Link>
                            <Link href="/trainers">
                                <Button className="w-full" variant="outline">
                                    <User className="h-4 w-4 mr-2" />
                                    View Trainers
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button className="w-full" variant="outline">
                                    <Target className="h-4 w-4 mr-2" />
                                    Contact Support
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Profile Completion */}
                    {(!user?.weight || !user?.height || !user?.fitnessGoal) && (
                        <Card className="border-primary/50 bg-primary/5">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Add your fitness details to get personalized recommendations and track your progress effectively.
                                </p>
                                <Link href="/user/profile">
                                    <Button className="bg-primary hover:bg-primary/90">
                                        Complete Profile
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
