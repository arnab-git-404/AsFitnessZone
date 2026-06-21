'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dumbbell, Users, MessageSquare, Image as ImageIcon, LogOut, LayoutDashboard, UserCog, Plus, Trash2, CalendarCheck, UserPlus, X, Activity } from 'lucide-react';
import { toast } from 'sonner';
import type { UserResponse, TrainerAssignmentResponse, TrainerResponse } from '@/lib/types';

const feeTypeLabels: Record<string, string> = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    sixMonths: '6 Months',
    annual: 'Annual',
};

const statusColors: Record<string, string> = {
    active: 'default',
    expired: 'outline',
    cancelled: 'destructive',
};

export default function AdminTrainerAssignments() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [trainers, setTrainers] = useState<TrainerResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({
        customerId: '',
        trainerId: '',
        feeType: 'monthly' as string,
        amount: 0,
        notes: '',
    });

    useEffect(() => {
        fetchUser();
        fetchAssignments();
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

    const fetchAssignments = async () => {
        try {
            const response = await fetch('/api/admin/trainer-assignments');
            if (response.ok) {
                const data = await response.json();
                setAssignments(data.assignments);
            }
        } catch { toast.error('Failed to fetch assignments'); }
    };

    const fetchTrainers = async () => {
        try {
            const response = await fetch('/api/admin/trainers');
            if (response.ok) {
                const data = await response.json();
                setTrainers(data.trainers);
            }
        } catch { }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Logged out successfully');
        router.push('/');
    };

    const openCreate = () => {
        setForm({ customerId: '', trainerId: '', feeType: 'monthly', amount: 0, notes: '' });
        setDialogOpen(true);
    };

    const handleFeeTypeChange = (feeType: string, trainerId?: string) => {
        const t = trainerId || form.trainerId;
        const trainer = trainers.find(tr => tr._id === t);
        let amount = 0;
        if (trainer && trainer.pricing) {
            amount = trainer.pricing[feeType as keyof typeof trainer.pricing] || 0;
        }
        setForm(prev => ({ ...prev, feeType, amount }));
    };

    const handleTrainerChange = (trainerId: string) => {
        const trainer = trainers.find(t => t._id === trainerId);
        let amount = 0;
        if (trainer && trainer.pricing) {
            amount = trainer.pricing[form.feeType as keyof typeof trainer.pricing] || 0;
        }
        setForm(prev => ({ ...prev, trainerId, amount }));
    };

    const handleSave = async () => {
        if (!form.customerId || !form.trainerId) {
            toast.error('Customer ID and Trainer are required');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/trainer-assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                toast.success('Assignment created');
                setDialogOpen(false);
                fetchAssignments();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to create');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this assignment?')) return;
        try {
            const response = await fetch(`/api/admin/trainer-assignments/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Assignment deleted');
                fetchAssignments();
            } else { toast.error('Failed to delete'); }
        } catch { toast.error('Something went wrong'); }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Cancel this assignment?')) return;
        try {
            const response = await fetch(`/api/admin/trainer-assignments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
            });
            if (response.ok) {
                toast.success('Assignment cancelled');
                fetchAssignments();
            } else { toast.error('Failed to cancel'); }
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
                        <Link href="/admin/trainers"><Button variant="ghost" className="w-full justify-start"><UserCog className="h-4 w-4 mr-2" />Trainers</Button></Link>
                        <Link href="/admin/trainer-assignments"><Button variant="default" className="w-full justify-start bg-primary"><UserPlus className="h-4 w-4 mr-2" />Trainer Assign</Button></Link>
                        <Link href="/admin/gallery"><Button variant="ghost" className="w-full justify-start"><ImageIcon className="h-4 w-4 mr-2" />Gallery</Button></Link>
                        <Link href="/admin/activity-logs"><Button variant="ghost" className="w-full justify-start"><Activity className="h-4 w-4 mr-2" />Activity Logs</Button></Link>
                        <Link href="/admin/attendance"><Button variant="ghost" className="w-full justify-start"><CalendarCheck className="h-4 w-4 mr-2" />Attendance</Button></Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Trainer <span className="text-primary">Assignments</span></h1>
                                <p className="text-muted-foreground">Assign customers to trainers with fee plans</p>
                            </div>
                            <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
                                <Plus className="h-4 w-4 mr-2" />New Assignment
                            </Button>
                        </div>

                        <Card>
                            <CardHeader><div className="text-sm text-muted-foreground">Total Assignments: {assignments.length}</div></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Trainer</TableHead>
                                            <TableHead>Fee Type</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-24">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assignments.length === 0 ? (
                                            <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No assignments found.</TableCell></TableRow>
                                        ) : (
                                            assignments.map((a: any) => (
                                                <TableRow key={a._id}>
                                                    <TableCell className="font-medium">{a.customerName}</TableCell>
                                                    <TableCell>{a.trainerId?.name || 'Unknown'}</TableCell>
                                                    <TableCell><Badge variant="outline">{feeTypeLabels[a.feeType] || a.feeType}</Badge></TableCell>
                                                    <TableCell>₹{a.amount}</TableCell>
                                                    <TableCell className="text-xs">{new Date(a.startDate).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-xs">{new Date(a.endDate).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={(statusColors[a.status] as any) || 'outline'}>
                                                            {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            {a.status === 'active' && (
                                                                <Button variant="ghost" size="icon" onClick={() => handleCancel(a._id)} title="Cancel">
                                                                    <X className="h-4 w-4 text-orange-500" />
                                                                </Button>
                                                            )}
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(a._id)}>
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
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

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>New Trainer Assignment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerId">Customer User ID *</Label>
                            <Input id="customerId" value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} placeholder="MongoDB User ID of the customer" />
                            <p className="text-xs text-muted-foreground">Enter the User ID from the Users page</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="trainer">Trainer *</Label>
                            <Select value={form.trainerId} onValueChange={handleTrainerChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a trainer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {trainers.map(t => (
                                        <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feeType">Fee Type *</Label>
                            <Select value={form.feeType} onValueChange={(v) => handleFeeTypeChange(v, form.trainerId)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select fee type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="sixMonths">6 Months</SelectItem>
                                    <SelectItem value="annual">Annual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (₹)</Label>
                            <Input id="amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} disabled />
                            <p className="text-xs text-muted-foreground">Auto-calculated from trainer pricing. Edit trainer to change.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input id="notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Create Assignment'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
