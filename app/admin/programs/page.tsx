'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dumbbell, LogOut, Search } from 'lucide-react';
import type { UserResponse, ProgramResponse } from '@/lib/types';

interface ProgramForm {
  title: string;
  description: string;
  image: string;
  features: string;
  duration: string;
  difficulty: string;
}

const emptyForm: ProgramForm = { title: '', description: '', image: '', features: '', duration: '', difficulty: '' };
const difficultyOptions = [
    { label: 'Any', value: '' },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
];

export default function AdminPrograms() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [programs, setPrograms] = useState<ProgramResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<ProgramForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchUser();
        fetchPrograms();
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

    const fetchPrograms = async () => {
        try {
            const response = await fetch('/api/admin/programs');
            if (response.ok) { const data = await response.json(); setPrograms(data.programs); }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch programs' }); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' });
        router.push('/');
    };

    const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

    const openEdit = (program: ProgramResponse) => {
        setEditingId(program._id);
        setForm({
            title: program.title, description: program.description, image: program.image,
            features: program.features.join(', '), duration: program.duration, difficulty: program.difficulty,
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.title || !form.description) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Title and description are required' });
            return;
        }
        setIsSaving(true);
        const payload = { ...form, features: form.features.split(',').map(f => f.trim()).filter(Boolean) };
        try {
            const response = await fetch(
                editingId ? `/api/admin/programs/${editingId}` : '/api/admin/programs',
                { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
            );
            if (response.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Saved', detail: editingId ? 'Program updated' : 'Program created' });
                setDialogOpen(false); fetchPrograms();
            } else { const data = await response.json(); toastRef.current?.show({ severity: 'error', summary: 'Error', detail: data.error || 'Failed to save' }); }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
        finally { setIsSaving(false); }
    };

    const handleToggleStatus = async (row: ProgramResponse) => {
        const newStatus = row.isActive === false;
        try {
            const r = await fetch(`/api/admin/programs/${row._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: newStatus }),
            });
            if (r.ok) {
                toastRef.current?.show({ severity: 'success', summary: newStatus ? 'Activated' : 'Deactivated', detail: `${row.title} ${newStatus ? 'activated' : 'deactivated'}` });
                fetchPrograms();
            } else {
                const data = await r.json();
                toastRef.current?.show({ severity: 'error', summary: 'Error', detail: data.error || 'Failed to toggle status' });
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
    };

    const handleExport = async () => {
        try {
            const r = await fetch('/api/admin/programs/export');
            if (r.ok) {
                const blob = await r.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `programs-export-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toastRef.current?.show({ severity: 'success', summary: 'Exported', detail: 'Programs exported to CSV' });
            } else {
                toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to export programs' });
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to export programs' }); }
    };

    const filteredPrograms = programs.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const difficultyBody = (row: ProgramResponse) => (
        <Tag value={row.difficulty || 'All Levels'} severity="info" className="capitalize" />
    );

    const statusBody = (row: ProgramResponse) => {
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

    const actionsBody = (row: ProgramResponse) => (
        <div className="flex gap-2">
            <Button className="p-button-text p-button-rounded" icon="pi pi-pencil" onClick={() => openEdit(row)} tooltip="Edit program" />
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
                        <Link href="/admin/leads"><Button className="w-full justify-start p-button-text" label="Leads" icon="pi pi-comments" /></Link>
                        <Link href="/admin/programs"><Button className="w-full justify-start bg-primary border-primary text-white" label="Programs" icon="pi pi-star" /></Link>
                        <Link href="/admin/trainers"><Button className="w-full justify-start p-button-text" label="Trainers" icon="pi pi-user-edit" /></Link>
                        <Link href="/admin/roles"><Button className="w-full justify-start p-button-text" label="Roles" icon="pi pi-shield" /></Link>
                        <Link href="/admin/gallery"><Button className="w-full justify-start p-button-text" label="Gallery" icon="pi pi-images" /></Link>
                        <Link href="/admin/attendance"><Button className="w-full justify-start p-button-text" label="Attendance" icon="pi pi-calendar" /></Link>
                        <Link href="/admin/activity-logs"><Button className="w-full justify-start p-button-text" label="Activity Logs" icon="pi pi-chart-bar" /></Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Program <span className="text-primary">Management</span></h1>
                                <p className="text-muted-foreground">Create and manage fitness programs</p>
                            </div>
                            <div className="flex gap-3">
                                <Button className="p-button-outlined" label="Export CSV" icon="pi pi-download" onClick={handleExport} />
                                <Button className="bg-primary text-white border-primary" label="Add Program" icon="pi pi-plus" onClick={openCreate} />
                            </div>
                        </div>

                        <Card className="!border-border/50">
                            <div className="p-4">
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <InputText
                                        placeholder="Search programs by title, description, or difficulty..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10"
                                    />
                                </div>
                                <DataTable value={filteredPrograms} paginator rows={10} className="p-datatable-sm" emptyMessage="No programs found. Click 'Add Program' to create one.">
                                    <Column field="title" header="Title" />
                                    <Column field="duration" header="Duration" body={(row: ProgramResponse) => row.duration || 'Flexible'} />
                                    <Column header="Difficulty" body={difficultyBody} />
                                    <Column field="features" header="Features" body={(row: ProgramResponse) => <span className="max-w-xs truncate block">{row.features.join(', ')}</span>} />
                                    <Column header="Status" body={statusBody} />
                                    <Column header="Actions" body={actionsBody} className="w-24" />
                                </DataTable>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>

            <Dialog header={editingId ? 'Edit Program' : 'Add Program'} visible={dialogOpen} onHide={() => setDialogOpen(false)} footer={dialogFooter} className="sm:max-w-lg">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Title *</label>
                        <InputText id="title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Weight Training" className="w-full" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="desc" className="text-sm font-medium">Description *</label>
                        <InputTextarea id="desc" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Program description..." rows={3} className="w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Duration</label>
                            <InputText value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 12 weeks" className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Difficulty</label>
                            <Dropdown value={form.difficulty} options={difficultyOptions} onChange={e => setForm({...form, difficulty: e.value})} className="w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <InputText value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." className="w-full" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Features (comma-separated)</label>
                        <InputTextarea value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder="Free weights, Machine training, Form coaching" rows={2} className="w-full" />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
