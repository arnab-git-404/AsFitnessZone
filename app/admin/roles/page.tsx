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
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dumbbell, Shield, LogOut, LayoutDashboard, Plus, Pencil, Trash2, CalendarCheck, Users, UserCog } from 'lucide-react';
import type { UserResponse, RoleResponse } from '@/lib/types';

interface RoleForm { name: string; description: string; }
const emptyForm: RoleForm = { name: '', description: '' };

export default function AdminRoles() {
    const router = useRouter(); const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<RoleForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchUser(); fetchRoles(); }, []);

    const fetchUser = async () => {
        try { const r = await fetch('/api/auth/me'); if (r.ok) { const d = await r.json(); if (d.user.userType !== 'admin') { router.push('/user/dashboard'); return; } setUser(d.user); } else router.push('/login'); } catch { router.push('/login'); } finally { setIsLoading(false); }
    };
    const fetchRoles = async (searchTerm = '') => {
        try { const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''; const r = await fetch(`/api/admin/roles${params}`); if (r.ok) setRoles((await r.json()).roles); } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch roles' }); }
    };
    const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' }); router.push('/'); };
    const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
    const openEdit = (role: RoleResponse) => { setEditingId(role._id); setForm({ name: role.name, description: role.description }); setDialogOpen(true); };
    const handleSave = async () => {
        if (!form.name.trim()) { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Role name is required' }); return; }
        setIsSaving(true);
        try { const r = await fetch(editingId ? `/api/admin/roles/${editingId}` : '/api/admin/roles', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Saved', detail: editingId ? 'Role updated' : 'Role created' }); setDialogOpen(false); fetchRoles(); } else { const d = await r.json(); toastRef.current?.show({ severity: 'error', summary: 'Error', detail: d.error || 'Failed to save' }); } } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); } finally { setIsSaving(false); }
    };
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try { const r = await fetch(`/api/admin/roles/${id}`, { method: 'DELETE' }); if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Role deleted' }); fetchRoles(); } else { const d = await r.json(); toastRef.current?.show({ severity: 'error', summary: 'Error', detail: d.error || 'Failed to delete' }); } } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
    };

    const actionsBody = (row: RoleResponse) => (<div className="flex gap-1"><Button className="p-button-text p-button-rounded" icon="pi pi-pencil" onClick={() => openEdit(row)} /><Button className="p-button-text p-button-rounded p-button-danger" icon="pi pi-trash" onClick={() => handleDelete(row._id)} /></div>);
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
                    <Link href="/admin/trainers"><Button className="w-full justify-start p-button-text" label="Trainers" icon="pi pi-user-edit" /></Link>
                    <Link href="/admin/roles"><Button className="w-full justify-start bg-primary border-primary text-white" label="Roles" icon="pi pi-shield" /></Link>
                    <Link href="/admin/gallery"><Button className="w-full justify-start p-button-text" label="Gallery" icon="pi pi-images" /></Link>
                    <Link href="/admin/attendance"><Button className="w-full justify-start p-button-text" label="Attendance" icon="pi pi-calendar" /></Link>
                    <Link href="/admin/activity-logs"><Button className="w-full justify-start p-button-text" label="Activity Logs" icon="pi pi-chart-bar" /></Link>
                </nav></aside>
                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div><h1 className="text-3xl font-bold mb-2">Role <span className="text-primary">Management</span></h1><p className="text-muted-foreground">Create and manage master role entries for user access control</p></div>
                            <Button className="bg-primary text-white border-primary" label="Add Role" icon="pi pi-plus" onClick={openCreate} />
                        </div>

                        <div className="flex gap-2 max-w-sm">
                            <InputText placeholder="Search roles..." value={search} onChange={e => setSearch(e.target.value)} className="w-full" />
                            <Button className="p-button-outlined" label="Search" onClick={(e) => { e.preventDefault(); fetchRoles(search); }} />
                            {search && <Button className="p-button-text" label="Clear" onClick={() => { setSearch(''); fetchRoles(''); }} />}
                        </div>

                        <Card className="!border-border/50"><div className="p-4">
                            <DataTable value={roles} paginator rows={10} className="p-datatable-sm" emptyMessage="No roles found. Click 'Add Role' to create the first one.">
                                <Column header="Name" body={(row: RoleResponse) => (<div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /><span className="font-medium">{row.name}</span></div>)} />
                                <Column header="Description" body={(row: RoleResponse) => row.description || <span className="italic text-muted-foreground/50">No description</span>} />
                                <Column header="Created" body={(row: RoleResponse) => new Date(row.createdAt).toLocaleDateString()} />
                                <Column header="Actions" body={actionsBody} className="w-24" />
                            </DataTable>
                        </div></Card>
                    </div>
                </main>
            </div>
            <Dialog header={editingId ? 'Edit Role' : 'Add Role'} visible={dialogOpen} onHide={() => setDialogOpen(false)} footer={dialogFooter} className="sm:max-w-md">
                <div className="space-y-4">
                    <div className="space-y-2"><label className="text-sm font-medium">Role Name *</label><InputText value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. manager, frontdesk" className="w-full" /><p className="text-xs text-muted-foreground">Examples: admin, trainer, gymmember</p></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Description</label><InputTextarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe what this role can do..." rows={3} className="w-full" /></div>
                </div>
            </Dialog>
        </div>
    );
}
