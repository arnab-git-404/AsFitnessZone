'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dumbbell, LogOut, LayoutDashboard, CalendarCheck, Flame, TrendingUp, Shield } from 'lucide-react';
import type { UserResponse } from '@/lib/types';

interface CheckInRecord { _id: string; userId: { _id: string; name: string; email: string }; date: string; checkInTime: string; }
interface CheckInStats { todayCheckIns: number; monthlyActiveUsers: number; totalCheckIns: number; }

export default function AdminAttendance() {
    const router = useRouter(); const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
    const [stats, setStats] = useState<CheckInStats>({ todayCheckIns: 0, monthlyActiveUsers: 0, totalCheckIns: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { fetchUser(); fetchCheckIns(); }, []);

    const fetchUser = async () => {
        try { const r = await fetch('/api/auth/me'); if (r.ok) { const d = await r.json(); if (d.user.userType !== 'admin') { router.push('/user/dashboard'); return; } setUser(d.user); } else router.push('/login'); } catch { router.push('/login'); } finally { setIsLoading(false); }
    };
    const fetchCheckIns = async () => {
        try { const r = await fetch('/api/admin/checkins'); if (r.ok) { const d = await r.json(); setCheckIns(d.checkIns); setStats(d.stats); } } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch attendance' }); }
    };
    const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' }); router.push('/'); };

    if (isLoading) return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><Dumbbell className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" /><p className="text-muted-foreground">Loading...</p></div></div>);

    return (
        <div className="min-h-screen bg-background">
            <Toast ref={toastRef} />
            <header className="border-b border-border bg-card"><div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2"><div className="rounded-lg bg-primary p-2"><Dumbbell className="h-6 w-6 text-white" /></div><span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">FitnessGym Admin</span></Link>
                <div className="flex items-center space-x-4"><span className="text-sm text-muted-foreground">Admin: {user?.customer?.name || user?.email}</span><Button className="p-button-text" onClick={handleLogout} label="Logout" icon="pi pi-sign-out" /></div>
            </div></header>
            <div className="flex">
                <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)]"><nav className="p-4 space-y-2">
                    <Link href="/admin/dashboard"><Button className="w-full justify-start p-button-text" label="Dashboard" icon="pi pi-th-large" /></Link>
                    <Link href="/admin/users"><Button className="w-full justify-start p-button-text" label="Users" icon="pi pi-users" /></Link>
                    <Link href="/admin/trainers"><Button className="w-full justify-start p-button-text" label="Trainers" icon="pi pi-user-edit" /></Link>
                    <Link href="/admin/roles"><Button className="w-full justify-start p-button-text" label="Roles" icon="pi pi-shield" /></Link>
                    <Link href="/admin/gallery"><Button className="w-full justify-start p-button-text" label="Gallery" icon="pi pi-images" /></Link>
                    <Link href="/admin/activity-logs"><Button className="w-full justify-start p-button-text" label="Activity Logs" icon="pi pi-chart-bar" /></Link>
                    <Link href="/admin/attendance"><Button className="w-full justify-start bg-primary border-primary text-white" label="Attendance" icon="pi pi-calendar" /></Link>
                </nav></aside>
                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div><h1 className="text-3xl font-bold mb-2">Attendance <span className="text-primary">Overview</span></h1><p className="text-muted-foreground">Track member check-ins and attendance trends</p></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="!border-border/50"><div className="p-6">
                                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-muted-foreground">Today&apos;s Check-ins</span><CalendarCheck className="h-4 w-4 text-green-500" /></div>
                                <div className="text-3xl font-bold text-green-500">{stats.todayCheckIns}</div>
                                <p className="text-xs text-muted-foreground mt-1">Members checked in today</p>
                            </div></Card>
                            <Card className="!border-border/50"><div className="p-6">
                                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-muted-foreground">Monthly Active</span><Flame className="h-4 w-4 text-orange-500" /></div>
                                <div className="text-3xl font-bold text-orange-500">{stats.monthlyActiveUsers}</div>
                                <p className="text-xs text-muted-foreground mt-1">Unique members this month</p>
                            </div></Card>
                            <Card className="!border-border/50"><div className="p-6">
                                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-muted-foreground">Recent Check-ins</span><TrendingUp className="h-4 w-4 text-muted-foreground" /></div>
                                <div className="text-3xl font-bold">{stats.totalCheckIns}</div>
                                <p className="text-xs text-muted-foreground mt-1">Last 100 records shown</p>
                            </div></Card>
                        </div>

                        <Card className="!border-border/50"><div className="p-4">
                            <h2 className="text-lg font-semibold mb-4">Recent Check-in Records</h2>
                            <DataTable value={checkIns} paginator rows={10} className="p-datatable-sm" emptyMessage="No check-in records found. Members can check in from their dashboard.">
                                <Column header="Member" body={(row: CheckInRecord) => <span className="font-medium">{row.userId?.name || 'Unknown'}</span>} />
                                <Column header="Email" body={(row: CheckInRecord) => row.userId?.email || '-'} />
                                <Column header="Date" body={(row: CheckInRecord) => new Date(row.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} />
                                <Column header="Time" body={(row: CheckInRecord) => new Date(row.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} />
                            </DataTable>
                        </div></Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
