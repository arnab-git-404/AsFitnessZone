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
import { Dumbbell, Image as ImageIcon, Video, LogOut, ArrowUp, ArrowDown, Search } from 'lucide-react';
import type { UserResponse, MediaResponse } from '@/lib/types';

const typeOptions = [{ label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }];
const categoryOptions = [{ label: 'Equipment', value: 'equipment' }, { label: 'Training', value: 'training' }, { label: 'Facility', value: 'facility' }, { label: 'General', value: 'general' }];

interface MediaForm { type: string; url: string; publicId: string; category: string; }
const emptyForm: MediaForm = { type: 'image', url: '', publicId: '', category: 'general' };

export default function AdminGallery() {
    const router = useRouter(); const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [mediaItems, setMediaItems] = useState<MediaResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<MediaForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const [editOrderId, setEditOrderId] = useState<string | null>(null);
    const [editOrderValue, setEditOrderValue] = useState('');

    useEffect(() => { fetchUser(); fetchMedia(); }, []);

    const fetchUser = async () => {
        try { const r = await fetch('/api/auth/me'); if (r.ok) { const d = await r.json(); if (d.user.userType !== 'admin') { router.push('/user/dashboard'); return; } setUser(d.user); } else router.push('/login'); } catch { router.push('/login'); } finally { setIsLoading(false); }
    };
    const fetchMedia = async () => {
        try { const r = await fetch('/api/admin/gallery'); if (r.ok) setMediaItems((await r.json()).mediaItems); } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch media' }); }
    };
    const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' }); router.push('/'); };
    const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
    const openEdit = (m: MediaResponse) => { setEditingId(m._id); setForm({ type: m.type, url: m.url, publicId: m.publicId, category: m.category }); setDialogOpen(true); };
    const handleSave = async () => {
        if (!form.url || !form.publicId) { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'URL and public ID are required' }); return; }
        setIsSaving(true);
        try { const r = await fetch(editingId ? `/api/admin/gallery/${editingId}` : '/api/admin/gallery', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Saved', detail: editingId ? 'Media updated' : 'Media added' }); setDialogOpen(false); fetchMedia(); } else { const d = await r.json(); toastRef.current?.show({ severity: 'error', summary: 'Error', detail: d.error || 'Failed to save' }); } } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); } finally { setIsSaving(false); }
    };
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try { const r = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' }); if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Media deleted' }); fetchMedia(); } else toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete' }); } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
    };

    const updateOrder = async (id: string, newOrder: number) => {
        try {
            const r = await fetch(`/api/admin/gallery/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newOrder }),
            });
            if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Order updated' }); fetchMedia(); }
            else toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update order' });
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
    };

    const moveUp = async (row: MediaResponse, index: number) => {
        if (index === 0) return;
        const prev = filteredMedia[index - 1];
        // Swap orders — await each sequentially to avoid race condition
        const res1 = await fetch(`/api/admin/gallery/${row._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: prev.order }),
        });
        const res2 = await fetch(`/api/admin/gallery/${prev._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: row.order }),
        });
        if (res1.ok && res2.ok) {
            toastRef.current?.show({ severity: 'success', summary: 'Order updated' });
            fetchMedia();
        } else {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to reorder' });
        }
    };

    const moveDown = async (row: MediaResponse, index: number) => {
        if (index === filteredMedia.length - 1) return;
        const next = filteredMedia[index + 1];
        const res1 = await fetch(`/api/admin/gallery/${row._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: next.order }),
        });
        const res2 = await fetch(`/api/admin/gallery/${next._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: row.order }),
        });
        if (res1.ok && res2.ok) {
            toastRef.current?.show({ severity: 'success', summary: 'Order updated' });
            fetchMedia();
        } else {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to reorder' });
        }
    };

    const saveOrderEdit = (id: string) => {
        const val = parseInt(editOrderValue, 10);
        if (!isNaN(val) && val >= 0) {
            updateOrder(id, val);
        }
        setEditOrderId(null);
        setEditOrderValue('');
    };

    const filteredMedia = mediaItems.filter(m =>
        m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const previewBody = (row: MediaResponse) => row.type === 'image' ? <ImageIcon className="h-8 w-8 text-primary/50" /> : <Video className="h-8 w-8 text-primary/50" />;
    const typeBody = (row: MediaResponse) => <Tag value={row.type} severity="info" className="capitalize" />;

    const orderBody = (row: MediaResponse) => {
        const idx = filteredMedia.findIndex(m => m._id === row._id);
        return (
            <div className="flex items-center gap-1">
                {editOrderId === row._id ? (
                    <div className="flex items-center gap-1">
                        <InputText
                            value={editOrderValue}
                            onChange={e => setEditOrderValue(e.target.value)}
                            className="w-16 h-8 text-xs"
                            autoFocus
                            onBlur={() => saveOrderEdit(row._id)}
                            onKeyDown={e => { if (e.key === 'Enter') saveOrderEdit(row._id); if (e.key === 'Escape') setEditOrderId(null); }}
                        />
                    </div>
                ) : (
                    <span
                        className="cursor-pointer hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/10"
                        onClick={() => { setEditOrderId(row._id); setEditOrderValue(String(row.order)); }}
                        title="Click to edit order"
                    >
                        {row.order}
                    </span>
                )}
                <Button className="p-button-text p-button-rounded p-button-sm" icon="pi pi-angle-up" disabled={idx === 0} onClick={() => moveUp(row, idx)} tooltip="Move up" />
                <Button className="p-button-text p-button-rounded p-button-sm" icon="pi pi-angle-down" disabled={idx === filteredMedia.length - 1} onClick={() => moveDown(row, idx)} tooltip="Move down" />
            </div>
        );
    };

    const actionsBody = (row: MediaResponse) => (<div className="flex gap-2">
        <Button className="p-button-text p-button-rounded" icon="pi pi-pencil" onClick={() => openEdit(row)} />
        <Button className="p-button-text p-button-rounded p-button-danger" icon="pi pi-trash" onClick={() => handleDelete(row._id)} />
    </div>);

    const dialogFooter = (<div className="flex justify-end gap-3"><Button className="p-button-outlined" label="Cancel" onClick={() => setDialogOpen(false)} /><Button className="bg-primary text-white border-primary" label={isSaving ? 'Saving...' : editingId ? 'Update' : 'Add'} onClick={handleSave} disabled={isSaving} /></div>);

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
                    <Link href="/admin/gallery"><Button className="w-full justify-start bg-primary border-primary text-white" label="Gallery" icon="pi pi-images" /></Link>
                    <Link href="/admin/attendance"><Button className="w-full justify-start p-button-text" label="Attendance" icon="pi pi-calendar" /></Link>
                    <Link href="/admin/activity-logs"><Button className="w-full justify-start p-button-text" label="Activity Logs" icon="pi pi-chart-bar" /></Link>
                </nav></aside>
                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div><h1 className="text-3xl font-bold mb-2">Gallery <span className="text-primary">Management</span></h1><p className="text-muted-foreground">Manage images and videos — use arrow buttons or click the order number to reorder</p></div>
                            <Button className="bg-primary text-white border-primary" label="Add Media" icon="pi pi-plus" onClick={openCreate} />
                        </div>
                        <Card className="!border-border/50"><div className="p-4">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <InputText
                                    placeholder="Search by category or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10"
                                />
                            </div>
                            <DataTable value={filteredMedia} paginator rows={10} className="p-datatable-sm" emptyMessage="No media found. Click 'Add Media' to upload one.">
                                <Column header="Preview" body={previewBody} />
                                <Column header="Type" body={typeBody} />
                                <Column field="category" header="Category" body={(row: MediaResponse) => <span className="capitalize">{row.category}</span>} />
                                <Column header="Order" body={orderBody} className="w-40" />
                                <Column field="url" header="URL" body={(row: MediaResponse) => <span className="max-w-[200px] truncate block text-xs">{row.url}</span>} />
                                <Column header="Uploaded By" body={() => 'Admin'} />
                                <Column header="Date" body={(row: MediaResponse) => new Date(row.createdAt).toLocaleDateString()} />
                                <Column header="Actions" body={actionsBody} className="w-24" />
                            </DataTable>
                        </div></Card>
                    </div>
                </main>
            </div>
            <Dialog header={editingId ? 'Edit Media' : 'Add Media'} visible={dialogOpen} onHide={() => setDialogOpen(false)} footer={dialogFooter} className="sm:max-w-lg">
                <div className="space-y-4">
                    <div className="space-y-2"><label className="text-sm font-medium">Type</label><Dropdown value={form.type} options={typeOptions} onChange={e => setForm({...form, type: e.value})} className="w-full" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Media URL *</label><InputText value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://res.cloudinary.com/..." className="w-full" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Cloudinary Public ID *</label><InputText value={form.publicId} onChange={e => setForm({...form, publicId: e.target.value})} placeholder="fitnessgym/profiles/abc123" className="w-full" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Category</label><Dropdown value={form.category} options={categoryOptions} onChange={e => setForm({...form, category: e.value})} className="w-full" /></div>
                </div>
            </Dialog>
        </div>
    );
}
