'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dumbbell, LogOut, Search } from 'lucide-react';
import type { UserResponse, TrainerResponse } from '@/lib/types';

interface TrainerForm {
  name: string; bio: string; certifications: string; experience: string;
  specializations: string; image: string; email: string; password: string;
  pricingMonthly: string; pricingQuarterly: string; pricingSixMonths: string; pricingAnnual: string;
}

const emptyForm: TrainerForm = {
    name: '', bio: '', certifications: '', experience: '', specializations: '', image: '',
    email: '', password: '', pricingMonthly: '', pricingQuarterly: '', pricingSixMonths: '', pricingAnnual: '',
};

export default function AdminTrainers() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [trainers, setTrainers] = useState<TrainerResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<TrainerForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { fetchUser(); fetchTrainers(); }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) { const data = await response.json();
                if (data.user.userType !== 'admin') { router.push('/user/dashboard'); return; }
                setUser(data.user); } else { router.push('/login'); }
        } catch { router.push('/login'); } finally { setIsLoading(false); }
    };

    const fetchTrainers = async () => {
        try { const response = await fetch('/api/admin/trainers');
            if (response.ok) { const data = await response.json(); setTrainers(data.trainers); }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch trainers' }); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' });
        router.push('/');
    };

    const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
    const openEdit = (trainer: TrainerResponse) => {
        setEditingId(trainer._id);
        setForm({
            name: trainer.name, bio: trainer.bio, certifications: trainer.certifications.join(', '),
            experience: trainer.experience, specializations: trainer.specializations.join(', '),
            image: trainer.image, email: (trainer as any).userEmail || '', password: '',
            pricingMonthly: trainer.pricing?.monthly?.toString() || '',
            pricingQuarterly: trainer.pricing?.quarterly?.toString() || '',
            pricingSixMonths: trainer.pricing?.sixMonths?.toString() || '',
            pricingAnnual: trainer.pricing?.annual?.toString() || '',
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.bio) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Name and bio are required' }); return;
        }
        if (!editingId && (!form.email || !form.password)) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Email and password are required for new trainers' }); return;
        }
        setIsSaving(true);
        const { pricingMonthly, pricingQuarterly, pricingSixMonths, pricingAnnual, email, password, ...restForm } = form;
        const payload: any = {
            ...restForm, email, ...(editingId ? {} : { password }),
            certifications: form.certifications.split(',').map(c => c.trim()).filter(Boolean),
            specializations: form.specializations.split(',').map(s => s.trim()).filter(Boolean),
            pricing: { monthly: parseFloat(pricingMonthly) || 0, quarterly: parseFloat(pricingQuarterly) || 0, sixMonths: parseFloat(pricingSixMonths) || 0, annual: parseFloat(pricingAnnual) || 0 },
        };
        try {
            const response = await fetch(
                editingId ? `/api/admin/trainers/${editingId}` : '/api/admin/trainers',
                { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
            );
            if (response.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Saved', detail: editingId ? 'Trainer updated' : 'Trainer created' });
                setDialogOpen(false); fetchTrainers();
            } else { const data = await response.json(); toastRef.current?.show({ severity: 'error', summary: 'Error', detail: data.error || 'Failed to save' }); }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
        finally { setIsSaving(false); }
    };

    const handleToggleStatus = async (row: TrainerResponse) => {
        const newStatus = row.isActive === false; // if inactive → activate, otherwise → deactivate
        try {
            const r = await fetch(`/api/admin/trainers/${row._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: newStatus }),
            });
            if (r.ok) {
                toastRef.current?.show({ severity: 'success', summary: newStatus ? 'Activated' : 'Deactivated', detail: `${row.name} ${newStatus ? 'activated' : 'deactivated'}` });
                fetchTrainers();
            } else {
                const data = await r.json();
                toastRef.current?.show({ severity: 'error', summary: 'Error', detail: data.error || 'Failed to toggle status' });
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
    };

    const handleExport = async () => {
        try {
            const r = await fetch('/api/admin/trainers/export');
            if (r.ok) {
                const blob = await r.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `trainers-export-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toastRef.current?.show({ severity: 'success', summary: 'Exported', detail: 'Trainers exported to CSV' });
            } else {
                toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to export trainers' });
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to export trainers' }); }
    };

    const filteredTrainers = trainers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t as any).userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const pricingBody = (row: TrainerResponse) => (
        <div className="text-xs space-y-0.5">
            {row.pricing?.monthly > 0 && <div>M: ₹{row.pricing.monthly}</div>}
            {row.pricing?.quarterly > 0 && <div>Q: ₹{row.pricing.quarterly}</div>}
            {row.pricing?.sixMonths > 0 && <div>6M: ₹{row.pricing.sixMonths}</div>}
            {row.pricing?.annual > 0 && <div>Y: ₹{row.pricing.annual}</div>}
            {(!row.pricing || Object.values(row.pricing).every(v => !v)) && <span className="text-muted-foreground">Not set</span>}
        </div>
    );

    const statusBody = (row: TrainerResponse) => {
        const active = row.isActive !== false;
        return (
            <Tag
                value={active ? 'Active' : 'Inactive'}
                severity={active ? 'success' : 'danger'}
                className="cursor-pointer"
                onClick={() => handleToggleStatus(row)}
            />
        );
    };

    const actionsBody = (row: TrainerResponse) => (
        <div className="flex gap-2">
            <Button className="p-button-text p-button-rounded" icon="pi pi-pencil" onClick={() => openEdit(row)} tooltip="Edit trainer" />
            <Button
                className={`p-button-text p-button-rounded ${row.isActive !== false ? 'p-button-danger' : 'p-button-success'}`}
                icon={row.isActive !== false ? 'pi pi-ban' : 'pi pi-check-circle'}
                onClick={() => handleToggleStatus(row)}
                tooltip={row.isActive !== false ? 'Deactivate' : 'Activate'}
            />
        </div>
    );

    const dialogFooter = (
        <div className="flex justify-end gap-3">
            <Button className="p-button-outlined" label="Cancel" onClick={() => setDialogOpen(false)} />
            <Button className="bg-primary text-white border-primary" label={isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'} onClick={handleSave} disabled={isSaving} />
        </div>
    );

    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><Dumbbell className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" /><p className="text-muted-foreground">Loading...</p></div></div>);
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
                        <Link href="/admin/leads"><Button className="w-full justify-start p-button-text" label="Leads" icon="pi pi-comments" /></Link>
                        <Link href="/admin/programs"><Button className="w-full justify-start p-button-text" label="Programs" icon="pi pi-star" /></Link>
                        <Link href="/admin/trainers"><Button className="w-full justify-start bg-primary border-primary text-white" label="Trainers" icon="pi pi-user-edit" /></Link>
                        <Link href="/admin/roles"><Button className="w-full justify-start p-button-text" label="Roles" icon="pi pi-shield" /></Link>
                        <Link href="/admin/gallery"><Button className="w-full justify-start p-button-text" label="Gallery" icon="pi pi-images" /></Link>
                        <Link href="/admin/attendance"><Button className="w-full justify-start p-button-text" label="Attendance" icon="pi pi-calendar" /></Link>
                        <Link href="/admin/activity-logs"><Button className="w-full justify-start p-button-text" label="Activity Logs" icon="pi pi-chart-bar" /></Link>
                    </nav>
                </aside>
                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div><h1 className="text-3xl font-bold mb-2">Trainer <span className="text-primary">Management</span></h1><p className="text-muted-foreground">Manage fitness trainers and their credentials</p></div>
                            <div className="flex gap-3">
                                <Button className="p-button-outlined" label="Export CSV" icon="pi pi-download" onClick={handleExport} />
                                <Button className="bg-primary text-white border-primary" label="Add Trainer" icon="pi pi-plus" onClick={openCreate} />
                            </div>
                        </div>
                        <Card className="!border-border/50">
                            <div className="p-4">
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <InputText
                                        placeholder="Search trainers by name, email, or specialization..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10"
                                    />
                                </div>
                                <DataTable value={filteredTrainers} paginator rows={10} className="p-datatable-sm" emptyMessage="No trainers found. Click 'Add Trainer' to create one.">
                                    <Column field="name" header="Name" />
                                    <Column header="Email" body={(row: any) => <span className="text-xs">{row.userEmail || 'N/A'}</span>} />
                                    <Column field="experience" header="Experience" body={(row: TrainerResponse) => row.experience || 'N/A'} />
                                    <Column header="Pricing" body={pricingBody} />
                                    <Column header="Certifications" body={(row: TrainerResponse) => <span className="max-w-[150px] truncate block">{row.certifications.join(', ')}</span>} />
                                    <Column header="Specializations" body={(row: TrainerResponse) => <span className="max-w-[150px] truncate block">{row.specializations.join(', ')}</span>} />
                                    <Column header="Status" body={statusBody} />
                                    <Column header="Actions" body={actionsBody} className="w-24" />
                                </DataTable>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
            <Dialog header={editingId ? 'Edit Trainer' : 'Add Trainer'} visible={dialogOpen} onHide={() => setDialogOpen(false)} footer={dialogFooter} className="sm:max-w-lg">
                <div className="space-y-4">
                    {!editingId && (<><div className="space-y-2"><label className="text-sm font-medium">Email * (Login)</label><InputText type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="trainer@gym.com" className="w-full" /></div><div className="space-y-2"><label className="text-sm font-medium">Password * (Login)</label><InputText type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" className="w-full" /></div></>)}
                    <div className="space-y-2"><label className="text-sm font-medium">Name *</label><InputText value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. John Martinez" className="w-full" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Bio *</label><InputTextarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Trainer biography..." rows={3} className="w-full" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Experience</label><InputText value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="e.g. 10 years" className="w-full" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Certifications (comma-separated)</label><InputText value={form.certifications} onChange={e => setForm({...form, certifications: e.target.value})} placeholder="NASM-CPT, CSCS, ..." className="w-full" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Specializations (comma-separated)</label><InputText value={form.specializations} onChange={e => setForm({...form, specializations: e.target.value})} placeholder="Strength Training, Yoga, ..." className="w-full" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Image URL</label><InputText value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." className="w-full" /></div>
                    <div className="border-t pt-4"><label className="text-base font-semibold mb-3 block">Pricing (₹)</label><div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><label className="text-xs">Monthly</label><InputText type="number" value={form.pricingMonthly} onChange={e => setForm({...form, pricingMonthly: e.target.value})} placeholder="0" className="w-full" /></div>
                        <div className="space-y-1.5"><label className="text-xs">Quarterly</label><InputText type="number" value={form.pricingQuarterly} onChange={e => setForm({...form, pricingQuarterly: e.target.value})} placeholder="0" className="w-full" /></div>
                        <div className="space-y-1.5"><label className="text-xs">6 Months</label><InputText type="number" value={form.pricingSixMonths} onChange={e => setForm({...form, pricingSixMonths: e.target.value})} placeholder="0" className="w-full" /></div>
                        <div className="space-y-1.5"><label className="text-xs">Annual</label><InputText type="number" value={form.pricingAnnual} onChange={e => setForm({...form, pricingAnnual: e.target.value})} placeholder="0" className="w-full" /></div>
                    </div></div>
                </div>
            </Dialog>
        </div>
    );
}
