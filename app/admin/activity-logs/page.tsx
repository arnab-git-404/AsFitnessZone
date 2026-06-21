'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Dumbbell, Users, MessageSquare, Image as ImageIcon, LogOut, LayoutDashboard,
    UserCog, CalendarCheck, Percent, Activity, Search, ChevronLeft, ChevronRight,
    RefreshCw, Clock, UserPlus
} from 'lucide-react';
import { toast } from 'sonner';
import type { UserResponse } from '@/lib/types';

interface ActivityLogEntry {
    _id: string;
    userId?: string;
    userType: string;
    action: string;
    method: string;
    endpoint: string;
    statusCode: number;
    responseTime: number;
    success: boolean;
    ip: string;
    userAgent: string;
    details?: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const methodColors: Record<string, string> = {
    GET: 'bg-green-500/10 text-green-600 border-green-500/30',
    POST: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    PUT: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
    DELETE: 'bg-red-500/10 text-red-600 border-red-500/30',
    PATCH: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
};

export default function AdminActivityLogs() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState<{ actions: string[]; methods: string[] }>({ actions: [], methods: [] });
    const [isLoading, setIsLoading] = useState(true);

    // Filter state
    const [filterAction, setFilterAction] = useState('');
    const [filterMethod, setFilterMethod] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterUserType, setFilterUserType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) fetchLogs();
    }, [user, page, filterAction, filterMethod, filterStatus, filterUserType, searchQuery]);

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

    const fetchLogs = async () => {
        try {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('limit', '50');
            if (filterAction) params.set('action', filterAction);
            if (filterMethod) params.set('method', filterMethod);
            if (filterStatus) params.set('status', filterStatus);
            if (filterUserType) params.set('userType', filterUserType);
            if (searchQuery) params.set('search', searchQuery);

            const response = await fetch(`/api/admin/activity-logs?${params}`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs);
                setPagination(data.pagination);
                if (data.filters) setFilters(data.filters);
            }
        } catch { toast.error('Failed to fetch logs'); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Logged out successfully');
        router.push('/');
    };

    const truncateUA = (ua: string) => {
        if (!ua) return '-';
        if (ua.length > 60) return ua.slice(0, 60) + '...';
        return ua;
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
                        <Link href="/admin/trainer-assignments"><Button variant="ghost" className="w-full justify-start"><UserPlus className="h-4 w-4 mr-2" />Trainer Assign</Button></Link>
                        <Link href="/admin/gallery"><Button variant="ghost" className="w-full justify-start"><ImageIcon className="h-4 w-4 mr-2" />Gallery</Button></Link>
                        <Link href="/admin/attendance"><Button variant="ghost" className="w-full justify-start"><CalendarCheck className="h-4 w-4 mr-2" />Attendance</Button></Link>
                        <Link href="/admin/coupons"><Button variant="ghost" className="w-full justify-start"><Percent className="h-4 w-4 mr-2" />Coupons</Button></Link>
                        <Link href="/admin/activity-logs"><Button variant="default" className="w-full justify-start bg-primary"><Activity className="h-4 w-4 mr-2" />Activity Logs</Button></Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Activity <span className="text-primary">Logs</span></h1>
                                <p className="text-muted-foreground">Track all system activity, logins, and API requests</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {pagination.total} total entries
                            </div>
                        </div>

                        {/* Filters */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex flex-wrap gap-3 items-end">
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">Action</label>
                                        <Select value={filterAction} onValueChange={v => { setFilterAction(v); setPage(1); }}>
                                            <SelectTrigger className="h-9 w-36"><SelectValue placeholder="All actions" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All actions</SelectItem>
                                                {filters.actions.map(a => (
                                                    <SelectItem key={a} value={a}>{a}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">Method</label>
                                        <Select value={filterMethod} onValueChange={v => { setFilterMethod(v); setPage(1); }}>
                                            <SelectTrigger className="h-9 w-28"><SelectValue placeholder="All methods" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All methods</SelectItem>
                                                {filters.methods.map(m => (
                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">Status</label>
                                        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
                                            <SelectTrigger className="h-9 w-28"><SelectValue placeholder="All status" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All status</SelectItem>
                                                <SelectItem value="success">Success</SelectItem>
                                                <SelectItem value="fail">Failed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">User Type</label>
                                        <Select value={filterUserType} onValueChange={v => { setFilterUserType(v); setPage(1); }}>
                                            <SelectTrigger className="h-9 w-28"><SelectValue placeholder="All users" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All users</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="trainer">Trainer</SelectItem>
                                                <SelectItem value="gymMember">Member</SelectItem>
                                                <SelectItem value="anonymous">Anonymous</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1 flex-1 max-w-xs">
                                        <label className="text-xs text-muted-foreground">Search</label>
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search endpoint or details..."
                                                value={searchQuery}
                                                onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                                                className="pl-8 h-9"
                                            />
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-9" onClick={() => { setFilterAction(''); setFilterMethod(''); setFilterStatus(''); setFilterUserType(''); setSearchQuery(''); setPage(1); }}>
                                        <RefreshCw className="h-3.5 w-3.5 mr-1" /> Clear
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Logs Table */}
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-36">Time</TableHead>
                                            <TableHead className="w-16">Method</TableHead>
                                            <TableHead className="w-20">Status</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead className="max-w-xs">Endpoint</TableHead>
                                            <TableHead className="w-20">User</TableHead>
                                            <TableHead className="w-20">Time</TableHead>
                                            <TableHead className="max-w-[180px]">Device</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                                                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                    No activity logs found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            logs.map((log) => (
                                                <TableRow key={log._id} className="text-xs">
                                                    <TableCell className="whitespace-nowrap text-muted-foreground">
                                                        {new Date(log.createdAt).toLocaleString('en-US', {
                                                            month: 'short', day: 'numeric',
                                                            hour: '2-digit', minute: '2-digit',
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`text-xs font-mono ${methodColors[log.method] || ''}`}>
                                                            {log.method}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={log.success ? 'default' : 'destructive'} className="text-xs">
                                                            {log.statusCode}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{log.action}</TableCell>
                                                    <TableCell className="max-w-xs truncate font-mono text-muted-foreground" title={log.endpoint}>
                                                        {log.endpoint}
                                                    </TableCell>
                                                    <TableCell className="capitalize">{log.userType === 'gymMember' ? 'Member' : log.userType}</TableCell>
                                                    <TableCell className="text-muted-foreground">{log.responseTime}ms</TableCell>
                                                    <TableCell className="max-w-[180px] truncate text-muted-foreground" title={log.userAgent}>
                                                        {truncateUA(log.userAgent)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Page {pagination.page} of {pagination.totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page <= 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page >= pagination.totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        Next <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
