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
import { Dumbbell, Users, MessageSquare, Image as ImageIcon, LogOut, LayoutDashboard, UserCog, Plus, Pencil, Trash2, CalendarCheck, Activity } from 'lucide-react';
import { toast } from 'sonner';
import type { UserResponse, TrainerResponse } from '@/lib/types';

interface TrainerForm {
  name: string;
  bio: string;
  certifications: string;
  experience: string;
  specializations: string;
  image: string;
  email: string;
  password: string;
  pricingMonthly: string;
  pricingQuarterly: string;
  pricingSixMonths: string;
  pricingAnnual: string;
}

const emptyForm: TrainerForm = {
    name: '', bio: '', certifications: '', experience: '', specializations: '', image: '',
    email: '', password: '',
    pricingMonthly: '', pricingQuarterly: '', pricingSixMonths: '', pricingAnnual: '',
};

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
                if (data.user.userType !== 'admin') { router.push('/user/dashboard'); return; }
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
            email: (trainer as any).userEmail || '',
            password: '',
            pricingMonthly: trainer.pricing?.monthly?.toString() || '',
            pricingQuarterly: trainer.pricing?.quarterly?.toString() || '',
            pricingSixMonths: trainer.pricing?.sixMonths?.toString() || '',
            pricingAnnual: trainer.pricing?.annual?.toString() || '',
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.bio) {
            toast.error('Name and bio are required');
            return;
        }

        setIsSaving(true);
        // Destructure form to separate special fields
        const { pricingMonthly, pricingQuarterly, pricingSixMonths, pricingAnnual, email, password, ...restForm } = form;
        const payload: any = {
            ...restForm,
            email,
            ...(editingId ? {} : { password }),
            certifications: form.certifications.split(',').map(c => c.trim()).filter(Boolean),
            specializations: form.specializations.split(',').map(s => s.trim()).filter(Boolean),
            pricing: {
                monthly: parseFloat(pricingMonthly) || 0,
                quarterly: parseFloat(pricingQuarterly) || 0,
                sixMonths: parseFloat(pricingSixMonths) || 0,
                annual: parseFloat(pricingAnnual) || 0,
            },
        };

        // For create, validate email/password
        if (!editingId && (!form.email || !form.password)) {
            toast.error('Email and password are required for new trainers');
            setIsSaving(false);
            return;
        }

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
                        <span className="text-sm text-muted-foreground">Admin: {user?.customer?.name || user?.email}</span>
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
                        <Link href="/admin/activity-logs"><Button variant="ghost" className="w-full justify-start"><Activity className="h-4 w-4 mr-2" />Activity Logs</Button></Link>
                        <Link href="/admin/attendance"><Button variant="ghost" className="w-full justify-start"><CalendarCheck className="h-4 w-4 mr-2" />Attendance</Button></Link>
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
                                        {/* Login Credentials (only shown for create) */}
                                        {!editingId && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email * (Login)</Label>
                                                    <Input id="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="trainer@gym.com" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="password">Password * (Login)</Label>
                                                    <Input id="password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" />
                                                </div>
                                            </>
                                        )}
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

                                        {/* Pricing Section */}
                                        <div className="border-t pt-4">
                                            <Label className="text-base font-semibold mb-3 block">Pricing (₹)</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="pricingMonthly" className="text-xs">Monthly</Label>
                                                    <Input id="pricingMonthly" type="number" min="0" value={form.pricingMonthly} onChange={e => setForm({...form, pricingMonthly: e.target.value})} placeholder="0" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="pricingQuarterly" className="text-xs">Quarterly</Label>
                                                    <Input id="pricingQuarterly" type="number" min="0" value={form.pricingQuarterly} onChange={e => setForm({...form, pricingQuarterly: e.target.value})} placeholder="0" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="pricingSixMonths" className="text-xs">6 Months</Label>
                                                    <Input id="pricingSixMonths" type="number" min="0" value={form.pricingSixMonths} onChange={e => setForm({...form, pricingSixMonths: e.target.value})} placeholder="0" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="pricingAnnual" className="text-xs">Annual</Label>
                                                    <Input id="pricingAnnual" type="number" min="0" value={form.pricingAnnual} onChange={e => setForm({...form, pricingAnnual: e.target.value})} placeholder="0" />
                                                </div>
                                            </div>
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
                                            <TableHead>Email</TableHead>
                                            <TableHead>Experience</TableHead>
                                            <TableHead>Pricing</TableHead>
                                            <TableHead>Certifications</TableHead>
                                            <TableHead>Specializations</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-24">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {trainers.length === 0 ? (
                                            <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No trainers found. Click "Add Trainer" to create one.</TableCell></TableRow>
                                        ) : (
                                            trainers.map((trainer) => (
                                                <TableRow key={trainer._id}>
                                                    <TableCell className="font-medium">{trainer.name}</TableCell>
                                                    <TableCell className="text-xs">{(trainer as any).userEmail || 'N/A'}</TableCell>
                                                    <TableCell>{trainer.experience || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <div className="text-xs space-y-0.5">
                                                            {trainer.pricing?.monthly > 0 && <div>M: ₹{trainer.pricing.monthly}</div>}
                                                            {trainer.pricing?.quarterly > 0 && <div>Q: ₹{trainer.pricing.quarterly}</div>}
                                                            {trainer.pricing?.sixMonths > 0 && <div>6M: ₹{trainer.pricing.sixMonths}</div>}
                                                            {trainer.pricing?.annual > 0 && <div>Y: ₹{trainer.pricing.annual}</div>}
                                                            {(!trainer.pricing || Object.values(trainer.pricing).every(v => !v)) && <span className="text-muted-foreground">Not set</span>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="max-w-[150px] truncate">{trainer.certifications.join(', ')}</TableCell>
                                                    <TableCell className="max-w-[150px] truncate">{trainer.specializations.join(', ')}</TableCell>
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
