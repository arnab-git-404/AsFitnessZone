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
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dumbbell, LogOut, LayoutDashboard, Plus, Trash2, X, Shield, Users, CalendarCheck, UserCog } from 'lucide-react';
import type { UserResponse, TrainerResponse } from '@/lib/types';

const feeTypeLabels: Record<string, string> = { monthly: 'Monthly', quarterly: 'Quarterly', sixMonths: '6 Months', annual: 'Annual' };

export default function AdminTrainerAssignments() {
    const router = useRouter(); const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [trainers, setTrainers] = useState<TrainerResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({ customerId: '', trainerId: '', feeType: 'monthly' as string, amount: 0, notes: '' });

    useEffect(() => { fetchUser(); fetchAssignments(); fetchTrainers(); }, []);

    const fetchUser = async () => {
        try { const r = await fetch('/api/auth/me'); if (r.ok) { const d = await r.json(); if (d.user.userType !== 'admin') { router.push('/user/dashboard'); return; } setUser(d.user); } else router.push('/login'); } catch { router.push('/login'); } finally { setIsLoading(false); }
    };
    const fetchAssignments = async () => {
        try { const r = await fetch('/api/admin/trainer-assignments'); if (r.ok) setAssignments((await r.json()).assignments); } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch assignments' }); }
    };
    const fetchTrainers = async () => {
        try { const r = await fetch('/api/admin/trainers'); if (r.ok) setTrainers((await r.json()).trainers); } catch { }
    };
    const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' }); router.push('/'); };
    const openCreate = () => { setForm({ customerId: '', trainerId: '', feeType: 'monthly', amount: 0, notes: '' }); setDialogOpen(true); };
    const handleFeeTypeChange = (feeType: string) => { const t = trainers.find(tr => tr._id === form.trainerId); setForm(prev => ({ ...prev, feeType, amount: (t && t.pricing) ? (t.pricing[feeType as keyof typeof t.pricing] || 0) : 0 })); };
    const handleTrainerChange = (trainerId: string) => { const t = trainers.find(tr => tr._id === trainerId); setForm(prev => ({ ...prev, trainerId, amount: (t && t.pricing) ? (t.pricing[prev.feeType as keyof typeof t.pricing] || 0) : 0 })); };
    const handleSave = async () => {
        if (!form.customerId || !form.trainerId) { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Customer ID and Trainer are required' }); return; }
        setIsSaving(true);
        try { const r = await fetch('/api/admin/trainer-assignments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Created', detail: 'Assignment created' }); setDialogOpen(false); fetchAssignments(); } else { const d = await r.json(); toastRef.current?.show({ severity: 'error', summary: 'Error', detail: d.error || 'Failed to create' }); } } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); } finally { setIsSaving(false); }
    };
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try { const r = await fetch(`/api/admin/trainer-assignments/${id}`, { method: 'DELETE' }); if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Assignment deleted' }); fetchAssignments(); } else toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete' }); } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
    };
    const handleCancel = async (id: string) => {
        if (!confirm('Cancel this assignment?')) return;
        try { const r = await fetch(`/api/admin/trainer-assignments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'cancelled' }) }); if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Cancelled', detail: 'Assignment cancelled' }); fetchAssignments(); } else toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to cancel' }); } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
    };

    const statusBody = (row: any) => {
        const severity = row.status === 'active' ? 'success' : row.status === 'cancelled' ? 'danger' : 'secondary';
        return <Tag value={row.status.charAt(0).toUpperCase() + row.status.slice(1)} severity={severity} />;
    };
    const actionsBody = (row: any) => (<div className="flex gap-2">
        {row.status === 'active' && <Button className="p-button-text p-button-rounded" icon="pi pi-times" tooltip="Cancel" onClick={() => handleCancel(row._id)} />}
        <Button className="p-button-text p-button-rounded p-button-danger" icon="pi pi-trash" onClick={() => handleDelete(row._id)} />
    </div>);
    const feeTypeOptions = [{ label: 'Monthly', value: 'monthly' }, { label: 'Quarterly', value: 'quarterly' }, { label: '6 Months', value: 'sixMonths' }, { label: 'Annual', value: 'annual' }];
    const dialogFooter = (<div className="flex justify-end gap-3"><Button className="p-button-outlined" label="Cancel" onClick={() => setDialogOpen(false)} /><Button className="bg-primary text-white border-primary" label={isSaving ? 'Saving...' : 'Create Assignment'} onClick={handleSave} disabled={isSaving} /></div>);

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
                    <Link href="/admin/activity-logs"><Button className="w-full justify-start p-button-text" label="Activity Logs" icon="pi pi-chart-bar" /></Link>
                    <Link href="/admin/trainer-assignments"><Button className="w-full justify-start bg-primary border-primary text-white" label="Trainer Assign" icon="pi pi-user-plus" /></Link>
                </nav></aside>
                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div><h1 className="text-3xl font-bold mb-2">Trainer <span className="text-primary">Assignments</span></h1><p className="text-muted-foreground">Assign customers to trainers with fee plans</p></div>
                            <Button className="bg-primary text-white border-primary" label="New Assignment" icon="pi pi-plus" onClick={openCreate} />
                        </div>
                        <Card className="!border-border/50"><div className="p-4">
                            <DataTable value={assignments} paginator rows={10} className="p-datatable-sm" emptyMessage="No assignments found.">
                                <Column header="Customer" body={(row: any) => <span className="font-medium">{row.customerName}</span>} />
                                <Column header="Trainer" body={(row: any) => row.trainerId?.name || 'Unknown'} />
                                <Column header="Fee Type" body={(row: any) => <Tag value={feeTypeLabels[row.feeType] || row.feeType} severity="secondary" />} />
                                <Column header="Amount" body={(row: any) => `₹${row.amount}`} />
                                <Column header="Start Date" body={(row: any) => new Date(row.startDate).toLocaleDateString()} className="text-xs" />
                                <Column header="End Date" body={(row: any) => new Date(row.endDate).toLocaleDateString()} className="text-xs" />
                                <Column header="Status" body={statusBody} />
                                <Column header="Actions" body={actionsBody} className="w-24" />
                            </DataTable>
                        </div></Card>
                    </div>
                </main>
            </div>
            <Dialog header="New Trainer Assignment" visible={dialogOpen} onHide={() => setDialogOpen(false)} footer={dialogFooter} className="sm:max-w-lg">
                <div className="space-y-4">
                    <div className="space-y-2"><label className="text-sm font-medium">Customer User ID *</label><InputText value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} placeholder="MongoDB User ID of the customer" className="w-full" /><p className="text-xs text-muted-foreground">Enter the User ID from the Users page</p></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Trainer *</label><Dropdown value={form.trainerId} options={trainers.map(t => ({ label: t.name, value: t._id }))} onChange={e => handleTrainerChange(e.value)} className="w-full" placeholder="Select a trainer" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Fee Type *</label><Dropdown value={form.feeType} options={feeTypeOptions} onChange={e => handleFeeTypeChange(e.value)} className="w-full" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Amount (₹)</label><InputText type="number" value={String(form.amount)} disabled className="w-full" /><p className="text-xs text-muted-foreground">Auto-calculated from trainer pricing.</p></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Notes</label><InputText value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Optional notes..." className="w-full" /></div>
                </div>
            </Dialog>
        </div>
    );
}
