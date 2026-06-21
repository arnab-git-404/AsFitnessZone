'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dumbbell, LogOut, LayoutDashboard, Plus, Pencil, Trash2, CalendarCheck, Shield } from 'lucide-react';
import type { UserResponse, CouponResponse } from '@/lib/types';

const discountTypeOptions = [
    { label: 'Percentage (%)', value: 'percentage' },
    { label: 'Fixed (₹)', value: 'fixed' },
];

interface CouponForm { code: string; description: string; discountType: string; discountValue: number; minPurchase: number; maxUsage: number; expiresAt: string; isActive: boolean; }
const emptyForm: CouponForm = { code: '', description: '', discountType: 'percentage', discountValue: 10, minPurchase: 0, maxUsage: 0, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isActive: true };

export default function AdminCoupons() {
    const router = useRouter(); const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [coupons, setCoupons] = useState<CouponResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<CouponForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { fetchUser(); fetchCoupons(); }, []);

    const fetchUser = async () => {
        try { const r = await fetch('/api/auth/me'); if (r.ok) { const d = await r.json(); if (d.user.userType !== 'admin') { router.push('/user/dashboard'); return; } setUser(d.user); } else router.push('/login'); } catch { router.push('/login'); } finally { setIsLoading(false); }
    };
    const fetchCoupons = async () => {
        try { const r = await fetch('/api/admin/coupons'); if (r.ok) setCoupons((await r.json()).coupons); } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch coupons' }); }
    };
    const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' }); router.push('/'); };
    const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
    const openEdit = (c: CouponResponse) => { setEditingId(c._id); setForm({ code: c.code, description: c.description, discountType: c.discountType, discountValue: c.discountValue, minPurchase: c.minPurchase, maxUsage: c.maxUsage, expiresAt: new Date(c.expiresAt).toISOString().split('T')[0], isActive: c.isActive }); setDialogOpen(true); };
    const handleSave = async () => {
        if (!form.code || !form.discountValue || !form.expiresAt) { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Code, discount value, and expiry are required' }); return; }
        if (form.discountType === 'percentage' && form.discountValue > 100) { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Percentage discount cannot exceed 100%' }); return; }
        setIsSaving(true);
        try { const r = await fetch(editingId ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Saved', detail: editingId ? 'Coupon updated' : 'Coupon created' }); setDialogOpen(false); fetchCoupons(); } else { const d = await r.json(); toastRef.current?.show({ severity: 'error', summary: 'Error', detail: d.error || 'Failed to save' }); } } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); } finally { setIsSaving(false); }
    };
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try { const r = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' }); if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Coupon deleted' }); fetchCoupons(); } else toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete' }); } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
    };

    const isExpired = (date: string) => new Date(date) < new Date();
    const isFullyUsed = (c: CouponResponse) => c.maxUsage > 0 && c.currentUsage >= c.maxUsage;
    const statusBody = (row: CouponResponse) => isExpired(row.expiresAt) ? <Tag value="Expired" severity="danger" /> : isFullyUsed(row) ? <Tag value="Exhausted" severity="secondary" /> : row.isActive ? <Tag value="Active" severity="success" /> : <Tag value="Inactive" severity="secondary" />;
    const actionsBody = (row: CouponResponse) => (<div className="flex gap-2"><Button className="p-button-text p-button-rounded" icon="pi pi-pencil" onClick={() => openEdit(row)} /><Button className="p-button-text p-button-rounded p-button-danger" icon="pi pi-trash" onClick={() => handleDelete(row._id)} /></div>);
    const dialogFooter = (<div className="flex justify-end gap-3"><Button className="p-button-outlined" label="Cancel" onClick={() => setDialogOpen(false)} /><Button className="bg-primary text-white border-primary" label={isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'} onClick={handleSave} disabled={isSaving} /></div>);

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
                    <Link href="/admin/programs"><Button className="w-full justify-start p-button-text" label="Programs" icon="pi pi-star" /></Link>
                    <Link href="/admin/trainers"><Button className="w-full justify-start p-button-text" label="Trainers" icon="pi pi-user-edit" /></Link>
                    <Link href="/admin/roles"><Button className="w-full justify-start p-button-text" label="Roles" icon="pi pi-shield" /></Link>
                    <Link href="/admin/gallery"><Button className="w-full justify-start p-button-text" label="Gallery" icon="pi pi-images" /></Link>
                    <Link href="/admin/attendance"><Button className="w-full justify-start p-button-text" label="Attendance" icon="pi pi-calendar" /></Link>
                    <Link href="/admin/activity-logs"><Button className="w-full justify-start p-button-text" label="Activity Logs" icon="pi pi-chart-bar" /></Link>
                    <Link href="/admin/coupons"><Button className="w-full justify-start bg-primary border-primary text-white" label="Coupons" icon="pi pi-percentage" /></Link>
                </nav></aside>
                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div><h1 className="text-3xl font-bold mb-2">Coupon <span className="text-primary">Management</span></h1><p className="text-muted-foreground">Create and manage discount coupons</p></div>
                            <Button className="bg-primary text-white border-primary" label="Add Coupon" icon="pi pi-plus" onClick={openCreate} />
                        </div>
                        <Card className="!border-border/50"><div className="p-4">
                            <DataTable value={coupons} paginator rows={10} className="p-datatable-sm" emptyMessage="No coupons found. Click 'Add Coupon' to create one.">
                                <Column field="code" header="Code" body={(row: CouponResponse) => <span className="font-mono font-bold">{row.code}</span>} />
                                <Column header="Discount" body={(row: CouponResponse) => row.discountType === 'percentage' ? `${row.discountValue}%` : `₹${row.discountValue}`} />
                                <Column header="Usage" body={(row: CouponResponse) => row.maxUsage > 0 ? `${row.currentUsage} / ${row.maxUsage}` : `${row.currentUsage} / ∞`} />
                                <Column header="Min Purchase" body={(row: CouponResponse) => row.minPurchase > 0 ? `₹${row.minPurchase}` : 'None'} />
                                <Column header="Expires" body={(row: CouponResponse) => <span className={isExpired(row.expiresAt) ? 'text-red-500' : ''}>{new Date(row.expiresAt).toLocaleDateString()}</span>} />
                                <Column header="Status" body={statusBody} />
                                <Column header="Actions" body={actionsBody} className="w-24" />
                            </DataTable>
                        </div></Card>
                    </div>
                </main>
            </div>
            <Dialog header={editingId ? 'Edit Coupon' : 'Add Coupon'} visible={dialogOpen} onHide={() => setDialogOpen(false)} footer={dialogFooter} className="sm:max-w-lg">
                <div className="space-y-4">
                    <div className="space-y-2"><label className="text-sm font-medium">Coupon Code *</label><InputText value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER50" className="w-full" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Description</label><InputTextarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Coupon description..." rows={2} className="w-full" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-sm font-medium">Discount Type</label><Dropdown value={form.discountType} options={discountTypeOptions} onChange={e => setForm({...form, discountType: e.value})} className="w-full" /></div>
                        <div className="space-y-2"><label className="text-sm font-medium">{form.discountType === 'percentage' ? 'Discount %' : 'Discount Amount (₹)'}</label><InputText type="number" value={String(form.discountValue)} onChange={e => setForm({...form, discountValue: Number(e.target.value)})} className="w-full" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-sm font-medium">Min Purchase (₹)</label><InputText type="number" value={String(form.minPurchase)} onChange={e => setForm({...form, minPurchase: Number(e.target.value)})} className="w-full" /></div>
                        <div className="space-y-2"><label className="text-sm font-medium">Max Usage (0 = unlimited)</label><InputText type="number" value={String(form.maxUsage)} onChange={e => setForm({...form, maxUsage: Number(e.target.value)})} className="w-full" /></div>
                    </div>
                    <div className="space-y-2"><label className="text-sm font-medium">Expiry Date *</label><InputText type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} className="w-full" /></div>
                    <div className="flex items-center justify-between"><label className="text-sm font-medium">Active</label><InputSwitch checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.value})} /></div>
                </div>
            </Dialog>
        </div>
    );
}
