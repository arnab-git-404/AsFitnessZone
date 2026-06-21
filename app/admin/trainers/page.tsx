'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Dumbbell, Users, MessageSquare, Image as ImageIcon, LogOut, LayoutDashboard, UserCog, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { UserResponse, TrainerResponse } from '@/lib/types';

interface TrainerForm {
  name: string;
  bio: string;
  certifications: string;
  experience: string;
  specializations: string;
  image: string;
}

const emptyForm: TrainerForm = { name: '', bio: '', certifications: '', experience: '', specializations: '', image: '' };

export default function AdminTrainers() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [trainers, setTrainers] = useState<TrainerResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<TrainerForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchUser();
        fetchTrainers();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                if (data.user.role !== 'admin') { router.push('/user/dashboard'); return; }
                setUser(data.user);
            } else { router.push('/login'); }
        } catch { router.push('/login'); }
        finally { setIsLoading(false); }
    };

    const fetchTrainers = async () => {
        try {
            const response = await fetch('/api/admin/trainers');
            if (response.ok) {
                const data = await response.json();
                setTrainers(data.trainers);
            }
        } catch { toast.error('Failed to fetch trainers'); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Logged out successfully');
        router.push('/');
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const openEdit = (trainer: TrainerResponse) => {
        setEditingId(trainer._id);
        setForm({
            name: trainer.name,
            bio: trainer.bio,
            certifications: trainer.certifications.join(', '),
            experience: trainer.experience,
            specializations: trainer.specializations.join(', '),
            image: trainer.image,
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.bio) {
            toast.error('Name and bio are required');
            return;
        }

        setIsSaving(true);
        const payload = {
            ...form,
            certifications: form.certifications.split(',').map(c => c.trim()).filter(Boolean),
            specializations: form.specializations.split(',').map(s => s.trim()).filter(Boolean),
        };

        try {
            const response = await fetch(
                editingId ? `/api/admin/trainers/${editingId}` : '/api/admin/trainers',
                {
                    method: editingId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                toast.success(editingId ? 'Trainer updated' : 'Trainer created');
                setDialogOpen(false);
                fetchTrainers();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to save');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this trainer?')) return;

        try {
            const response = await fetch(`/api/admin/trainers/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Trainer deleted');
                fetchTrainers();
            } else { toast.error('Failed to delete'); }
        } catch { toast.error('Something went wrong'); }
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
                        <span className="text-sm text-muted-foreground">Admin: {user?.name}</span>
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
                        <Link href="/admin/trainers"><Button variant="default" className="w-full justify-start bg-primary"><UserCog className="h-4 w-4 mr-2" />Trainers</Button></Link>
                        <Link href="/admin/gallery"><Button variant="ghost" className="w-full justify-start"><ImageIcon className="h-4 w-4 mr-2" />Gallery</Button></Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Trainer <span className="text-primary">Management</span></h1>
                                <p className="text-muted-foreground">Manage fitness trainers and their credentials</p>
                            </div>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
                                        <Plus className="h-4 w-4 mr-2" />Add Trainer
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>{editingId ? 'Edit Trainer' : 'Add Trainer'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name *</Label>
                                            <Input id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. John Martinez" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio *</Label>
                                            <Textarea id="bio" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Trainer biography..." rows={3} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="exp">Experience</Label>
                                            <Input id="exp" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="e.g. 10 years" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                                            <Input id="certifications" value={form.certifications} onChange={e => setForm({...form, certifications: e.target.value})} placeholder="NASM-CPT, CSCS, ..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                                            <Input id="specializations" value={form.specializations} onChange={e => setForm({...form, specializations: e.target.value})} placeholder="Strength Training, Yoga, ..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="image">Image URL</Label>
                                            <Input id="image" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={isSaving}>
                                                {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Card>
                            <CardHeader><div className="text-sm text-muted-foreground">Total Trainers: {trainers.length}</div></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Experience</TableHead>
                                            <TableHead>Certifications</TableHead>
                                            <TableHead>Specializations</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-24">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {trainers.length === 0 ? (
                                            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No trainers found. Click "Add Trainer" to create one.</TableCell></TableRow>
                                        ) : (
                                            trainers.map((trainer) => (
                                                <TableRow key={trainer._id}>
                                                    <TableCell className="font-medium">{trainer.name}</TableCell>
                                                    <TableCell>{trainer.experience || 'N/A'}</TableCell>
                                                    <TableCell className="max-w-[200px] truncate">{trainer.certifications.join(', ')}</TableCell>
                                                    <TableCell className="max-w-[200px] truncate">{trainer.specializations.join(', ')}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={trainer.isActive ? 'default' : 'outline'}>
                                                            {trainer.isActive ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => openEdit(trainer)}><Pencil className="h-4 w-4" /></Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(trainer._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
