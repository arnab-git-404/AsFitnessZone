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
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Dumbbell, Users, MessageSquare, Image as ImageIcon, LogOut, LayoutDashboard,
    UserCog, Plus, Pencil, Trash2, CalendarCheck, Percent, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import type { UserResponse, CouponResponse } from '@/lib/types';

interface CouponForm {
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    minPurchase: number;
    maxUsage: number;
    expiresAt: string;
    isActive: boolean;
}

const emptyForm: CouponForm = {
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 0,
    maxUsage: 0,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
};

export default function AdminCoupons() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [coupons, setCoupons] = useState<CouponResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<CouponForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchUser();
        fetchCoupons();
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

    const fetchCoupons = async () => {
        try {
            const response = await fetch('/api/admin/coupons');
            if (response.ok) {
                const data = await response.json();
                setCoupons(data.coupons);
            }
        } catch { toast.error('Failed to fetch coupons'); }
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

    const openEdit = (coupon: CouponResponse) => {
        setEditingId(coupon._id);
        setForm({
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minPurchase: coupon.minPurchase,
            maxUsage: coupon.maxUsage,
            expiresAt: new Date(coupon.expiresAt).toISOString().split('T')[0],
            isActive: coupon.isActive,
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.code || !form.discountValue || !form.expiresAt) {
            toast.error('Code, discount value, and expiry are required');
            return;
        }

        if (form.discountType === 'percentage' && form.discountValue > 100) {
            toast.error('Percentage discount cannot exceed 100%');
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(
                editingId ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons',
                {
                    method: editingId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                }
            );

            if (response.ok) {
                toast.success(editingId ? 'Coupon updated' : 'Coupon created');
                setDialogOpen(false);
                fetchCoupons();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to save');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const response = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Coupon deleted');
                fetchCoupons();
            } else { toast.error('Failed to delete'); }
        } catch { toast.error('Something went wrong'); }
    };

    const isExpired = (date: string) => new Date(date) < new Date();
    const isFullyUsed = (coupon: CouponResponse) => coupon.maxUsage > 0 && coupon.currentUsage >= coupon.maxUsage;

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
                        <Link href="/admin/gallery"><Button variant="ghost" className="w-full justify-start"><ImageIcon className="h-4 w-4 mr-2" />Gallery</Button></Link>
                        <Link href="/admin/activity-logs"><Button variant="ghost" className="w-full justify-start"><Activity className="h-4 w-4 mr-2" />Activity Logs</Button></Link>
                        <Link href="/admin/attendance"><Button variant="ghost" className="w-full justify-start"><CalendarCheck className="h-4 w-4 mr-2" />Attendance</Button></Link>
                        <Link href="/admin/coupons"><Button variant="default" className="w-full justify-start bg-primary"><Percent className="h-4 w-4 mr-2" />Coupons</Button></Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Coupon <span className="text-primary">Management</span></h1>
                                <p className="text-muted-foreground">Create and manage discount coupons</p>
                            </div>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
                                        <Plus className="h-4 w-4 mr-2" />Add Coupon
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>{editingId ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="code">Coupon Code *</Label>
                                            <Input
                                                id="code"
                                                value={form.code}
                                                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                                placeholder="e.g. SUMMER50"
                                                maxLength={50}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="desc">Description</Label>
                                            <Textarea
                                                id="desc"
                                                value={form.description}
                                                onChange={e => setForm({ ...form, description: e.target.value })}
                                                placeholder="Coupon description..."
                                                rows={2}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="discountType">Discount Type</Label>
                                                <Select value={form.discountType} onValueChange={v => setForm({ ...form, discountType: v })}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                        <SelectItem value="fixed">Fixed (₹)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="discountValue">
                                                    {form.discountType === 'percentage' ? 'Discount %' : 'Discount Amount (₹)'}
                                                </Label>
                                                <Input
                                                    id="discountValue"
                                                    type="number"
                                                    value={form.discountValue}
                                                    onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })}
                                                    min={1}
                                                    max={form.discountType === 'percentage' ? 100 : 99999}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="minPurchase">Min Purchase (₹)</Label>
                                                <Input
                                                    id="minPurchase"
                                                    type="number"
                                                    value={form.minPurchase}
                                                    onChange={e => setForm({ ...form, minPurchase: Number(e.target.value) })}
                                                    min={0}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="maxUsage">Max Usage (0 = unlimited)</Label>
                                                <Input
                                                    id="maxUsage"
                                                    type="number"
                                                    value={form.maxUsage}
                                                    onChange={e => setForm({ ...form, maxUsage: Number(e.target.value) })}
                                                    min={0}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="expiresAt">Expiry Date *</Label>
                                            <Input
                                                id="expiresAt"
                                                type="date"
                                                value={form.expiresAt}
                                                onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="isActive">Active</Label>
                                            <Switch
                                                id="isActive"
                                                checked={form.isActive}
                                                onCheckedChange={(v: boolean) => setForm({ ...form, isActive: v })}
                                            />
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
                            <CardHeader><div className="text-sm text-muted-foreground">Total Coupons: {coupons.length}</div></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Discount</TableHead>
                                            <TableHead>Usage</TableHead>
                                            <TableHead>Min Purchase</TableHead>
                                            <TableHead>Expires</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-24">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {coupons.length === 0 ? (
                                            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No coupons found. Click "Add Coupon" to create one.</TableCell></TableRow>
                                        ) : (
                                            coupons.map((coupon) => (
                                                <TableRow key={coupon._id}>
                                                    <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                                                    <TableCell>
                                                        {coupon.discountType === 'percentage'
                                                            ? `${coupon.discountValue}%`
                                                            : `₹${coupon.discountValue}`
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {coupon.maxUsage > 0
                                                            ? `${coupon.currentUsage} / ${coupon.maxUsage}`
                                                            : `${coupon.currentUsage} / ∞`
                                                        }
                                                    </TableCell>
                                                    <TableCell>{coupon.minPurchase > 0 ? `₹${coupon.minPurchase}` : 'None'}</TableCell>
                                                    <TableCell className={isExpired(coupon.expiresAt) ? 'text-destructive' : ''}>
                                                        {new Date(coupon.expiresAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {isExpired(coupon.expiresAt) ? (
                                                            <Badge variant="outline" className="text-destructive border-destructive">Expired</Badge>
                                                        ) : isFullyUsed(coupon) ? (
                                                            <Badge variant="outline">Exhausted</Badge>
                                                        ) : coupon.isActive ? (
                                                            <Badge variant="default">Active</Badge>
                                                        ) : (
                                                            <Badge variant="outline">Inactive</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => openEdit(coupon)}><Pencil className="h-4 w-4" /></Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
