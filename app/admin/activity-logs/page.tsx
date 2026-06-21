'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dumbbell, LogOut, LayoutDashboard, Search, ChevronLeft, ChevronRight, RefreshCw, Clock } from 'lucide-react';
import type { UserResponse } from '@/lib/types';

interface ActivityLogEntry { _id: string; userId?: string; userType: string; action: string; method: string; endpoint: string; statusCode: number; responseTime: number; success: boolean; ip: string; userAgent: string; details?: string; createdAt: string; }
interface Pagination { page: number; limit: number; total: number; totalPages: number; }

const userTypeOptions = [
    { label: 'All users', value: '' }, { label: 'Admin', value: 'admin' },
    { label: 'Trainer', value: 'trainer' }, { label: 'Member', value: 'gymMember' }, { label: 'Anonymous', value: 'anonymous' },
];
const statusOptions = [{ label: 'All status', value: '' }, { label: 'Success', value: 'success' }, { label: 'Failed', value: 'fail' }];

const methodColors: Record<string, string> = { GET: '#22c55e', POST: '#3b82f6', PUT: '#f97316', DELETE: '#ef4444', PATCH: '#a855f7' };

export default function AdminActivityLogs() {
    const router = useRouter(); const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState<{ actions: string[]; methods: string[] }>({ actions: [], methods: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [filterAction, setFilterAction] = useState(''); const [filterMethod, setFilterMethod] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); const [filterUserType, setFilterUserType] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); const [page, setPage] = useState(1);

    useEffect(() => { fetchUser(); }, []);
    useEffect(() => { if (user) fetchLogs(); }, [user, page, filterAction, filterMethod, filterStatus, filterUserType, searchQuery]);

    const fetchUser = async () => {
        try { const r = await fetch('/api/auth/me'); if (r.ok) { const d = await r.json(); if (d.user.userType !== 'admin') { router.push('/user/dashboard'); return; } setUser(d.user); } else router.push('/login'); } catch { router.push('/login'); } finally { setIsLoading(false); }
    };
    const fetchLogs = async () => {
        try { const p = new URLSearchParams(); p.set('page', page.toString()); p.set('limit', '50'); if (filterAction) p.set('action', filterAction); if (filterMethod) p.set('method', filterMethod); if (filterStatus) p.set('status', filterStatus); if (filterUserType) p.set('userType', filterUserType); if (searchQuery) p.set('search', searchQuery);
            const r = await fetch(`/api/admin/activity-logs?${p}`); if (r.ok) { const d = await r.json(); setLogs(d.logs); setPagination(d.pagination); if (d.filters) setFilters(d.filters); } } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch logs' }); }
    };
    const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' }); router.push('/'); };
    const truncateUA = (ua: string) => { if (!ua) return '-'; return ua.length > 60 ? ua.slice(0, 60) + '...' : ua; };

    const methodBody = (row: ActivityLogEntry) => (
        <Tag value={row.method} style={{ backgroundColor: methodColors[row.method] || '#6b7280', color: '#fff', border: 'none' }} className="text-xs font-mono" />
    );
    const statusBody = (row: ActivityLogEntry) => (
        <Tag value={row.statusCode.toString()} severity={row.success ? 'success' : 'danger'} className="text-xs" />
    );
    const userTypeBody = (row: ActivityLogEntry) => row.userType === 'gymMember' ? 'Member' : row.userType;

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
                    <Link href="/admin/attendance"><Button className="w-full justify-start p-button-text" label="Attendance" icon="pi pi-calendar" /></Link>
                    <Link href="/admin/activity-logs"><Button className="w-full justify-start bg-primary border-primary text-white" label="Activity Logs" icon="pi pi-chart-bar" /></Link>
                </nav></aside>
                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div><h1 className="text-3xl font-bold mb-2">Activity <span className="text-primary">Logs</span></h1><p className="text-muted-foreground">Track all system activity, logins, and API requests</p></div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{pagination.total} total entries</div>
                        </div>

                        <Card className="!border-border/50"><div className="p-4">
                            <div className="flex flex-wrap gap-3 items-end">
                                <div className="space-y-1"><label className="text-xs text-muted-foreground">Action</label>
                                    <Dropdown value={filterAction} options={filters.actions.map(a => ({ label: a, value: a }))} onChange={e => { setFilterAction(e.value); setPage(1); }} className="w-36" placeholder="All actions" showClear /></div>
                                <div className="space-y-1"><label className="text-xs text-muted-foreground">Method</label>
                                    <Dropdown value={filterMethod} options={filters.methods.map(m => ({ label: m, value: m }))} onChange={e => { setFilterMethod(e.value); setPage(1); }} className="w-28" placeholder="All methods" showClear /></div>
                                <div className="space-y-1"><label className="text-xs text-muted-foreground">Status</label>
                                    <Dropdown value={filterStatus} options={statusOptions} onChange={e => { setFilterStatus(e.value); setPage(1); }} className="w-28" /></div>
                                <div className="space-y-1"><label className="text-xs text-muted-foreground">User Type</label>
                                    <Dropdown value={filterUserType} options={userTypeOptions} onChange={e => { setFilterUserType(e.value); setPage(1); }} className="w-28" /></div>
                                <div className="space-y-1 flex-1 max-w-xs"><label className="text-xs text-muted-foreground">Search</label>
                                    <InputText placeholder="Search endpoint or details..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }} className="w-full" /></div>
                                <Button className="p-button-outlined" label="Clear" icon="pi pi-refresh" onClick={() => { setFilterAction(''); setFilterMethod(''); setFilterStatus(''); setFilterUserType(''); setSearchQuery(''); setPage(1); }} />
                            </div>
                        </div></Card>

                        <Card className="!border-border/50"><div className="p-0">
                            <DataTable value={logs} className="p-datatable-sm" emptyMessage="No activity logs found">
                                <Column header="Time" body={(row: ActivityLogEntry) => new Date(row.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} className="w-36" />
                                <Column header="Method" body={methodBody} className="w-16" />
                                <Column header="Status" body={statusBody} className="w-20" />
                                <Column field="action" header="Action" />
                                <Column field="endpoint" header="Endpoint" body={(row: ActivityLogEntry) => <span className="max-w-xs truncate block font-mono text-xs" title={row.endpoint}>{row.endpoint}</span>} />
                                <Column header="User" body={userTypeBody} className="w-20" />
                                <Column header="Time" body={(row: ActivityLogEntry) => <span className="text-muted-foreground">{row.responseTime}ms</span>} className="w-20" />
                                <Column header="Device" body={(row: ActivityLogEntry) => <span className="max-w-[180px] truncate block text-muted-foreground text-xs" title={row.userAgent}>{truncateUA(row.userAgent)}</span>} className="max-w-[180px]" />
                            </DataTable>
                        </div></Card>

                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</p>
                                <div className="flex gap-2">
                                    <Button className="p-button-outlined" label="Previous" icon="pi pi-chevron-left" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} />
                                    <Button className="p-button-outlined" label="Next" icon="pi pi-chevron-right" iconPos="right" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)} />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
