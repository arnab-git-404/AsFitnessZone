'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Dumbbell, Users, MessageSquare, Image as ImageIcon, LogOut, LayoutDashboard, UserCog, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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

export default function AdminPrograms() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [programs, setPrograms] = useState<ProgramResponse[]>([]);
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
                if (data.user.role !== 'admin') { router.push('/user/dashboard'); return; }
                setUser(data.user);
            } else { router.push('/login'); }
        } catch { router.push('/login'); }
        finally { setIsLoading(false); }
    };

    const fetchPrograms = async () => {
        try {
            const response = await fetch('/api/admin/programs');
            if (response.ok) {
                const data = await response.json();
                setPrograms(data.programs);
            }
        } catch { toast.error('Failed to fetch programs'); }
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

    const openEdit = (program: ProgramResponse) => {
        setEditingId(program._id);
        setForm({
            title: program.title,
            description: program.description,
            image: program.image,
            features: program.features.join(', '),
            duration: program.duration,
            difficulty: program.difficulty,
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.title || !form.description) {
            toast.error('Title and description are required');
            return;
        }

        setIsSaving(true);
        const payload = {
            ...form,
            features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        };

        try {
            const response = await fetch(
                editingId ? `/api/admin/programs/${editingId}` : '/api/admin/programs',
                {
                    method: editingId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                toast.success(editingId ? 'Program updated' : 'Program created');
                setDialogOpen(false);
                fetchPrograms();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to save');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this program?')) return;

        try {
            const response = await fetch(`/api/admin/programs/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Program deleted');
                fetchPrograms();
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
                        <Link href="/admin/programs"><Button variant="default" className="w-full justify-start bg-primary"><Dumbbell className="h-4 w-4 mr-2" />Programs</Button></Link>
                        <Link href="/admin/trainers"><Button variant="ghost" className="w-full justify-start"><UserCog className="h-4 w-4 mr-2" />Trainers</Button></Link>
                        <Link href="/admin/gallery"><Button variant="ghost" className="w-full justify-start"><ImageIcon className="h-4 w-4 mr-2" />Gallery</Button></Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Program <span className="text-primary">Management</span></h1>
                                <p className="text-muted-foreground">Create and manage fitness programs</p>
                            </div>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
                                        <Plus className="h-4 w-4 mr-2" />Add Program
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>{editingId ? 'Edit Program' : 'Add Program'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title *</Label>
                                            <Input id="title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Weight Training" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="desc">Description *</Label>
                                            <Textarea id="desc" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Program description..." rows={3} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="duration">Duration</Label>
                                                <Input id="duration" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 12 weeks" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="difficulty">Difficulty</Label>
                                                <Select value={form.difficulty} onValueChange={v => setForm({...form, difficulty: v})}>
                                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">Any</SelectItem>
                                                        <SelectItem value="beginner">Beginner</SelectItem>
                                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="advanced">Advanced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="image">Image URL</Label>
                                            <Input id="image" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="features">Features (comma-separated)</Label>
                                            <Textarea id="features" value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder="Free weights, Machine training, Form coaching" rows={2} />
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
                            <CardHeader><div className="text-sm text-muted-foreground">Total Programs: {programs.length}</div></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Difficulty</TableHead>
                                            <TableHead>Features</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-24">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {programs.length === 0 ? (
                                            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No programs found. Click "Add Program" to create one.</TableCell></TableRow>
                                        ) : (
                                            programs.map((program) => (
                                                <TableRow key={program._id}>
                                                    <TableCell className="font-medium">{program.title}</TableCell>
                                                    <TableCell>{program.duration || 'Flexible'}</TableCell>
                                                    <TableCell><Badge variant="secondary" className="capitalize">{program.difficulty || 'All Levels'}</Badge></TableCell>
                                                    <TableCell className="max-w-xs truncate">{program.features.join(', ')}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={program.isActive ? 'default' : 'outline'}>
                                                            {program.isActive ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => openEdit(program)}><Pencil className="h-4 w-4" /></Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(program._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
