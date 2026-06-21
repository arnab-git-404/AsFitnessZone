'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dumbbell, LogOut, Search } from 'lucide-react';
import type { UserResponse } from '@/lib/types';

const fitnessGoalOptions = [
    { label: 'Fat Loss', value: 'fat-loss' },
    { label: 'Muscle Gain', value: 'muscle-gain' },
    { label: 'General Fitness', value: 'general-fitness' },
    { label: 'Strength', value: 'strength' },
    { label: 'Endurance', value: 'endurance' },
    { label: 'Flexibility', value: 'flexibility' },
];

interface UserForm {
    name: string;
    email: string;
    password: string;
    phone: string;
    weight: string;
    height: string;
    fitnessGoal: string;
}

const emptyForm: UserForm = {
    name: '',
    email: '',
    password: '',
    phone: '',
    weight: '',
    height: '',
    fitnessGoal: '',
};

export default function AdminUsers() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Create dialog
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createForm, setCreateForm] = useState<UserForm>(emptyForm);
    const [isCreating, setIsCreating] = useState(false);

    // Edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<UserForm>(emptyForm);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUser();
        fetchUsers();
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

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch users' }); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toastRef.current?.show({ severity: 'success', summary: 'Logged out', detail: 'Logged out successfully' });
        router.push('/');
    };

    // ---- Create ----
    const openCreateDialog = () => {
        setCreateForm(emptyForm);
        setCreateDialogOpen(true);
    };

    const handleCreateUser = async () => {
        if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password || createForm.password.length < 6) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Name, email, and password (min 6 chars) are required' });
            return;
        }
        setIsCreating(true);
        try {
            const r = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createForm),
            });
            if (r.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Created', detail: 'Customer created successfully' });
                setCreateDialogOpen(false);
                setCreateForm(emptyForm);
                fetchUsers();
            } else {
                const data = await r.json();
                toastRef.current?.show({ severity: 'error', summary: 'Error', detail: data.error || 'Failed to create user' });
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
        finally { setIsCreating(false); }
    };

    // ---- Edit ----
    const openEditDialog = (row: UserResponse) => {
        setEditingId(row._id);
        setEditForm({
            name: row.customer?.name || '',
            email: row.email,
            password: '',
            phone: row.customer?.phone || '',
            weight: row.customer?.weight?.toString() || '',
            height: row.customer?.height?.toString() || '',
            fitnessGoal: row.customer?.fitnessGoal || '',
        });
        setEditDialogOpen(true);
    };

    const handleEditUser = async () => {
        if (!editForm.name.trim()) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Name is required' });
            return;
        }
        if (!editForm.email.trim()) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Email is required' });
            return;
        }
        setIsEditing(true);
        try {
            const r = await fetch(`/api/admin/users/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            if (r.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Updated', detail: 'User updated successfully' });
                setEditDialogOpen(false);
                setEditingId(null);
                fetchUsers();
            } else {
                const data = await r.json();
                toastRef.current?.show({ severity: 'error', summary: 'Error', detail: data.error || 'Failed to update user' });
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
        finally { setIsEditing(false); }
    };

    // ---- Toggle Status ----
    const handleToggleStatus = async (row: UserResponse) => {
        const newStatus = row.isActive === false; // if inactive → activate, otherwise → deactivate
        try {
            const r = await fetch(`/api/admin/users/${row._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: newStatus }),
            });
            if (r.ok) {
                toastRef.current?.show({ severity: 'success', summary: newStatus ? 'Activated' : 'Deactivated', detail: `${row.customer?.name || row.email} ${newStatus ? 'activated' : 'deactivated'}` });
                fetchUsers();
            } else {
                const data = await r.json();
                toastRef.current?.show({ severity: 'error', summary: 'Error', detail: data.error || 'Failed to toggle status' });
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' }); }
    };

    // ---- Export CSV ----
    const handleExport = async () => {
        try {
            const r = await fetch('/api/admin/users/export');
            if (r.ok) {
                const blob = await r.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toastRef.current?.show({ severity: 'success', summary: 'Exported', detail: 'Users exported to CSV' });
            } else {
                toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to export users' });
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to export users' }); }
    };

    // ---- Filters & Templates ----
    const filteredUsers = users.filter(u =>
        (u.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const userTypeTemplate = (row: UserResponse) => {
        const severity = row.userType === 'admin' ? 'danger' : row.userType === 'trainer' ? 'info' : 'secondary';
        return <Tag value={row.userType === 'gymMember' ? 'Member' : row.userType === 'trainer' ? 'Trainer' : 'Admin'} severity={severity} />;
    };

    const statusTemplate = (row: UserResponse) => {
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

    const actionsTemplate = (row: UserResponse) => (
        <div className="flex gap-2">
            <Button className="p-button-text p-button-rounded" icon="pi pi-pencil" onClick={() => openEditDialog(row)} tooltip="Edit user" />
            <Button
                className={`p-button-text p-button-rounded ${row.isActive !== false ? 'p-button-danger' : 'p-button-success'}`}
                icon={row.isActive !== false ? 'pi pi-ban' : 'pi pi-check-circle'}
                onClick={() => handleToggleStatus(row)}
                tooltip={row.isActive !== false ? 'Deactivate' : 'Activate'}
            />
        </div>
    );

    const createDialogFooter = (
        <div className="flex justify-end gap-3">
            <Button className="p-button-outlined" label="Cancel" onClick={() => setCreateDialogOpen(false)} />
            <Button className="bg-primary text-white border-primary" label={isCreating ? 'Creating...' : 'Create User'} onClick={handleCreateUser} disabled={isCreating} />
        </div>
    );

    const editDialogFooter = (
        <div className="flex justify-end gap-3">
            <Button className="p-button-outlined" label="Cancel" onClick={() => setEditDialogOpen(false)} />
            <Button className="bg-primary text-white border-primary" label={isEditing ? 'Saving...' : 'Save Changes'} onClick={handleEditUser} disabled={isEditing} />
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
                        <Link href="/admin/users"><Button className="w-full justify-start bg-primary border-primary text-white" label="Users" icon="pi pi-users" /></Link>
                        <Link href="/admin/leads"><Button className="w-full justify-start p-button-text" label="Leads" icon="pi pi-comments" /></Link>
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
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">User <span className="text-primary">Management</span></h1>
                                <p className="text-muted-foreground">View and manage all gym members</p>
                            </div>
                            <div className="flex gap-3">
                                <Button className="p-button-outlined" label="Export CSV" icon="pi pi-download" onClick={handleExport} />
                                <Button className="bg-primary text-white border-primary" label="Add User" icon="pi pi-user-plus" onClick={openCreateDialog} />
                            </div>
                        </div>

                        <Card className="!border-border/50">
                            <div className="p-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <InputText
                                        placeholder="Search users by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10"
                                    />
                                </div>
                            </div>
                            <div className="px-4 pb-4">
                                <DataTable value={filteredUsers} paginator rows={10} className="p-datatable-sm" emptyMessage="No users found">
                                    <Column field="customer.name" header="Name" body={(row: UserResponse) => row.customer?.name || 'N/A'} />
                                    <Column field="email" header="Email" />
                                    <Column field="customer.phone" header="Phone" body={(row: UserResponse) => row.customer?.phone || 'N/A'} />
                                    <Column header="Fitness Goal" body={(row: UserResponse) => {
                                        if (row.customer?.fitnessGoal) {
                                            return <Tag value={row.customer.fitnessGoal.replace('-', ' ')} severity="info" className="capitalize" />;
                                        }
                                        return <span className="text-muted-foreground">Not set</span>;
                                    }} />
                                    <Column header="User Type" body={userTypeTemplate} />
                                    <Column header="Status" body={statusTemplate} />
                                    <Column field="createdAt" header="Joined" body={(row: UserResponse) => new Date(row.createdAt).toLocaleDateString()} />
                                    <Column header="Actions" body={actionsTemplate} className="w-24" />
                                </DataTable>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Create Dialog */}
            <Dialog header="Add New Customer" visible={createDialogOpen} onHide={() => setCreateDialogOpen(false)} footer={createDialogFooter} className="sm:max-w-lg">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="create-name">Full Name *</label>
                            <InputText id="create-name" value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} placeholder="John Doe" className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="create-email">Email *</label>
                            <InputText id="create-email" type="email" value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} placeholder="john@example.com" className="w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="create-password">Password *</label>
                        <InputText id="create-password" type="password" value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} placeholder="Min 6 characters" className="w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="create-phone">Phone</label>
                            <InputText id="create-phone" type="tel" value={createForm.phone} onChange={e => setCreateForm({...createForm, phone: e.target.value})} placeholder="+1 (555) 123-4567" className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="create-fitnessGoal">Fitness Goal</label>
                            <Dropdown id="create-fitnessGoal" value={createForm.fitnessGoal} options={fitnessGoalOptions} onChange={e => setCreateForm({...createForm, fitnessGoal: e.value})} placeholder="Select goal" className="w-full" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="create-weight">Weight (kg)</label>
                            <InputText id="create-weight" type="number" value={createForm.weight} onChange={e => setCreateForm({...createForm, weight: e.target.value})} placeholder="70" className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="create-height">Height (cm)</label>
                            <InputText id="create-height" type="number" value={createForm.height} onChange={e => setCreateForm({...createForm, height: e.target.value})} placeholder="175" className="w-full" />
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog header="Edit User" visible={editDialogOpen} onHide={() => setEditDialogOpen(false)} footer={editDialogFooter} className="sm:max-w-lg">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="edit-name">Full Name *</label>
                            <InputText id="edit-name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="John Doe" className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="edit-email">Email</label>
                            <InputText id="edit-email" type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="john@example.com" className="w-full" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="edit-phone">Phone</label>
                            <InputText id="edit-phone" type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} placeholder="+1 (555) 123-4567" className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="edit-fitnessGoal">Fitness Goal</label>
                            <Dropdown id="edit-fitnessGoal" value={editForm.fitnessGoal} options={fitnessGoalOptions} onChange={e => setEditForm({...editForm, fitnessGoal: e.value})} placeholder="Select goal" className="w-full" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="edit-weight">Weight (kg)</label>
                            <InputText id="edit-weight" type="number" value={editForm.weight} onChange={e => setEditForm({...editForm, weight: e.target.value})} placeholder="70" className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="edit-height">Height (cm)</label>
                            <InputText id="edit-height" type="number" value={editForm.height} onChange={e => setEditForm({...editForm, height: e.target.value})} placeholder="175" className="w-full" />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
