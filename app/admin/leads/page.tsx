'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Dumbbell, MessageSquare, LogOut, LayoutDashboard, Users, CalendarCheck, Image as ImageIcon, UserCog, UserPlus, Activity, Shield } from 'lucide-react';
import type { UserResponse, LeadResponse } from '@/lib/types';

const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Converted', value: 'converted' },
    { label: 'Closed', value: 'closed' },
];

export default function AdminLeads() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [leads, setLeads] = useState<LeadResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUser();
        fetchLeads();
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

    const fetchLeads = async () => {
        try {
            const response = await fetch('/api/admin/leads');
            if (response.ok) {
                const data = await response.json();
                setLeads(data.leads);
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch leads' }); }
    };

    const handleStatusChange = async (leadId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/leads/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Updated', detail: 'Lead status updated' });
                fetchLeads();
            } else { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update status' }); }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' });
        router.push('/');
    };

    const statusBodyTemplate = (row: LeadResponse) => (
        <Dropdown
            value={row.status}
            options={statusOptions}
            onChange={(e) => handleStatusChange(row._id, e.value)}
            className="w-32"
        />
    );

    const dateBodyTemplate = (row: LeadResponse) => new Date(row.createdAt).toLocaleDateString();

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
                        <div className="rounded-lg bg-primary p-2"><Dumbbell className="h-6 w-6 text-white" /></div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">FitnessGym Admin</span>
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
                        <Link href="/admin/dashboard"><Button className="w-full justify-start p-button-text" label="Dashboard" icon="pi pi-th-large" /></Link>
                        <Link href="/admin/users"><Button className="w-full justify-start p-button-text" label="Users" icon="pi pi-users" /></Link>
                        <Link href="/admin/leads"><Button className="w-full justify-start bg-primary border-primary text-white" label="Leads" icon="pi pi-comments" /></Link>
                        <Link href="/admin/programs"><Button className="w-full justify-start p-button-text" label="Programs" icon="pi pi-star" /></Link>
                        <Link href="/admin/trainers"><Button className="w-full justify-start p-button-text" label="Trainers" icon="pi pi-user-edit" /></Link>
                        <Link href="/admin/roles"><Button className="w-full justify-start p-button-text" label="Roles" icon="pi pi-shield" /></Link>
                        <Link href="/admin/gallery"><Button className="w-full justify-start p-button-text" label="Gallery" icon="pi pi-images" /></Link>
                        <Link href="/admin/attendance"><Button className="w-full justify-start p-button-text" label="Attendance" icon="pi pi-calendar" /></Link>
                        <Link href="/admin/activity-logs"><Button className="w-full justify-start p-button-text" label="Activity Logs" icon="pi pi-chart-bar" /></Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Contact <span className="text-primary">Leads</span></h1>
                            <p className="text-muted-foreground">Manage and track contact form submissions</p>
                        </div>

                        <Card className="!border-border/50">
                            <div className="p-4">
                                <DataTable value={leads} paginator rows={10} className="p-datatable-sm" emptyMessage="No leads found">
                                    <Column field="name" header="Name" />
                                    <Column field="email" header="Email" />
                                    <Column field="phone" header="Phone" body={(row: LeadResponse) => row.phone || 'N/A'} />
                                    <Column field="message" header="Message" body={(row: LeadResponse) => <span className="max-w-xs truncate block">{row.message}</span>} />
                                    <Column header="Status" body={statusBodyTemplate} />
                                    <Column header="Date" body={dateBodyTemplate} />
                                </DataTable>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
