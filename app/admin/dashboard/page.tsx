'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dumbbell, Users, MessageSquare, Image as ImageIcon, LogOut, LayoutDashboard, UserCog, CalendarCheck, UserPlus, Activity, Shield } from 'lucide-react';
import type { UserResponse, AdminStats } from '@/lib/types';

export default function AdminDashboard() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [stats, setStats] = useState<AdminStats>({
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
                if (data.user.userType !== 'admin') {
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
            toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' });
            router.push('/');
        } catch (error) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Logout failed' });
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
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="rounded-lg bg-primary p-2">
                            <Dumbbell className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
                            FitnessGym Admin
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">Admin: {user?.customer?.name || user?.email}</span>
                        <Button className="p-button-text" onClick={handleLogout} label="Logout" icon="pi pi-sign-out" />
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)]">
                    <nav className="p-4 space-y-2">
                        <Link href="/admin/dashboard"><Button className="w-full justify-start bg-primary border-primary text-white" label="Dashboard" icon="pi pi-th-large" /></Link>
                        <Link href="/admin/users"><Button className="w-full justify-start p-button-text" label="Users" icon="pi pi-users" /></Link>
                        <Link href="/admin/leads"><Button className="w-full justify-start p-button-text" label="Leads" icon="pi pi-comments" /></Link>
                        <Link href="/admin/programs"><Button className="w-full justify-start p-button-text" label="Programs" icon="pi pi-star" /></Link>
                        <Link href="/admin/trainers"><Button className="w-full justify-start p-button-text" label="Trainers" icon="pi pi-user-edit" /></Link>
                        <Link href="/admin/roles"><Button className="w-full justify-start p-button-text" label="Roles" icon="pi pi-shield" /></Link>
                        <Link href="/admin/trainer-assignments"><Button className="w-full justify-start p-button-text" label="Trainer Assign" icon="pi pi-user-plus" /></Link>
                        <Link href="/admin/gallery"><Button className="w-full justify-start p-button-text" label="Gallery" icon="pi pi-images" /></Link>
                        <Link href="/admin/attendance"><Button className="w-full justify-start p-button-text" label="Attendance" icon="pi pi-calendar" /></Link>
                        <Link href="/admin/coupons"><Button className="w-full justify-start p-button-text" label="Coupons" icon="pi pi-percentage" /></Link>
                        <Link href="/admin/activity-logs"><Button className="w-full justify-start p-button-text" label="Activity Logs" icon="pi pi-chart-bar" /></Link>
                    </nav>
                </aside>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="!border-border/50">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">Total Users</span>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Active members</p>
                                </div>
                            </Card>
                            <Card className="!border-border/50">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">Contact Leads</span>
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.totalLeads}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Pending inquiries</p>
                                </div>
                            </Card>
                            <Card className="!border-border/50">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">Programs</span>
                                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.totalPrograms}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Active programs</p>
                                </div>
                            </Card>
                            <Card className="!border-border/50">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">Trainers</span>
                                        <UserCog className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.totalTrainers}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Expert trainers</p>
                                </div>
                            </Card>
                        </div>

                        <Card className="!border-border/50">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Link href="/admin/users"><Button className="w-full p-button-outlined" label="Manage Users" icon="pi pi-users" /></Link>
                                    <Link href="/admin/leads"><Button className="w-full p-button-outlined" label="View Leads" icon="pi pi-comments" /></Link>
                                    <Link href="/admin/programs"><Button className="w-full p-button-outlined" label="Add Program" icon="pi pi-star" /></Link>
                                </div>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
