'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Users, MessageSquare, Image as ImageIcon, LogOut, LayoutDashboard, UserCog } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalLeads: 0,
        totalPrograms: 0,
        totalTrainers: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUser();
        fetchStats();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                if (data.user.role !== 'admin') {
                    router.push('/user/dashboard');
                    return;
                }
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

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats');
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
                            FitnessGym Admin
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">Admin: {user?.name}</span>
                        <Button variant="ghost" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)]">
                    <nav className="p-4 space-y-2">
                        <Link href="/admin/dashboard">
                            <Button variant="default" className="w-full justify-start bg-primary">
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/admin/users">
                            <Button variant="ghost" className="w-full justify-start">
                                <Users className="h-4 w-4 mr-2" />
                                Users
                            </Button>
                        </Link>
                        <Link href="/admin/leads">
                            <Button variant="ghost" className="w-full justify-start">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Leads
                            </Button>
                        </Link>
                        <Link href="/admin/programs">
                            <Button variant="ghost" className="w-full justify-start">
                                <Dumbbell className="h-4 w-4 mr-2" />
                                Programs
                            </Button>
                        </Link>
                        <Link href="/admin/trainers">
                            <Button variant="ghost" className="w-full justify-start">
                                <UserCog className="h-4 w-4 mr-2" />
                                Trainers
                            </Button>
                        </Link>
                        <Link href="/admin/gallery">
                            <Button variant="ghost" className="w-full justify-start">
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Gallery
                            </Button>
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Admin <span className="text-primary">Dashboard</span>
                            </h1>
                            <p className="text-muted-foreground">
                                Overview of your gym management system
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Active members
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Contact Leads</CardTitle>
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalLeads}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Pending inquiries
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Programs</CardTitle>
                                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalPrograms}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Active programs
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Trainers</CardTitle>
                                    <UserCog className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalTrainers}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Expert trainers
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link href="/admin/users">
                                    <Button className="w-full" variant="outline">
                                        <Users className="h-4 w-4 mr-2" />
                                        Manage Users
                                    </Button>
                                </Link>
                                <Link href="/admin/leads">
                                    <Button className="w-full" variant="outline">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        View Leads
                                    </Button>
                                </Link>
                                <Link href="/admin/programs">
                                    <Button className="w-full" variant="outline">
                                        <Dumbbell className="h-4 w-4 mr-2" />
                                        Add Program
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
