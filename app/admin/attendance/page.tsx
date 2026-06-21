'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Users, MessageSquare, Image as ImageIcon, LogOut, LayoutDashboard, UserCog, CalendarCheck, Flame, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner';
import type { UserResponse } from '@/lib/types';

interface CheckInRecord {
    _id: string;
    userId: { _id: string; name: string; email: string };
    date: string;
    checkInTime: string;
}

interface CheckInStats {
    todayCheckIns: number;
    monthlyActiveUsers: number;
    totalCheckIns: number;
}

export default function AdminAttendance() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
    const [stats, setStats] = useState<CheckInStats>({ todayCheckIns: 0, monthlyActiveUsers: 0, totalCheckIns: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUser();
        fetchCheckIns();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                if (data.user.userType !== 'admin') { router.push('/user/dashboard'); return; }
                setUser(data.user);
            } else { router.push('/login'); }
        } catch { router.push('/login'); }
        finally { setIsLoading(false); }
    };

    const fetchCheckIns = async () => {
        try {
            const response = await fetch('/api/admin/checkins');
            if (response.ok) {
                const data = await response.json();
                setCheckIns(data.checkIns);
                setStats(data.stats);
            }
        } catch { toast.error('Failed to fetch attendance'); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Logged out successfully');
        router.push('/');
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
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="rounded-lg bg-primary p-2"><Dumbbell className="h-6 w-6 text-primary-foreground" /></div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">FitnessGym Admin</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">Admin: {user?.customer?.name || user?.email}</span>
                        <Button variant="ghost" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)]">
                    <nav className="p-4 space-y-2">
                        <Link href="/admin/dashboard"><Button variant="ghost" className="w-full justify-start"><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</Button></Link>
                        <Link href="/admin/users"><Button variant="ghost" className="w-full justify-start"><Users className="h-4 w-4 mr-2" />Users</Button></Link>
                        <Link href="/admin/leads"><Button variant="ghost" className="w-full justify-start"><MessageSquare className="h-4 w-4 mr-2" />Leads</Button></Link>
                        <Link href="/admin/programs"><Button variant="ghost" className="w-full justify-start"><Dumbbell className="h-4 w-4 mr-2" />Programs</Button></Link>
                        <Link href="/admin/trainers"><Button variant="ghost" className="w-full justify-start"><UserCog className="h-4 w-4 mr-2" />Trainers</Button></Link>
                        <Link href="/admin/gallery"><Button variant="ghost" className="w-full justify-start"><ImageIcon className="h-4 w-4 mr-2" />Gallery</Button></Link>
                        <Link href="/admin/activity-logs"><Button variant="ghost" className="w-full justify-start"><Activity className="h-4 w-4 mr-2" />Activity Logs</Button></Link>
                        <Link href="/admin/attendance"><Button variant="default" className="w-full justify-start bg-primary"><CalendarCheck className="h-4 w-4 mr-2" />Attendance</Button></Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Attendance <span className="text-primary">Overview</span></h1>
                            <p className="text-muted-foreground">Track member check-ins and attendance trends</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
                                    <CalendarCheck className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-green-500">{stats.todayCheckIns}</div>
                                    <p className="text-xs text-muted-foreground">Members checked in today</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Monthly Active</CardTitle>
                                    <Flame className="h-4 w-4 text-orange-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-orange-500">{stats.monthlyActiveUsers}</div>
                                    <p className="text-xs text-muted-foreground">Unique members this month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Recent Check-ins</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{stats.totalCheckIns}</div>
                                    <p className="text-xs text-muted-foreground">Last 100 records shown</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Check-ins Table */}
                        <Card>
                            <CardHeader><CardTitle>Recent Check-in Records</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Member</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {checkIns.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                    No check-in records found. Members can check in from their dashboard.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            checkIns.map((record) => (
                                                <TableRow key={record._id}>
                                                    <TableCell className="font-medium">{record.userId?.name || 'Unknown'}</TableCell>
                                                    <TableCell>{record.userId?.email || '-'}</TableCell>
                                                    <TableCell>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                                                    <TableCell>
                                                        {new Date(record.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
