'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dumbbell, User, LogOut, Users, TrendingUp, CalendarCheck, Award,
    IndianRupee, AlertCircle, ChevronRight, LayoutDashboard, Target
} from 'lucide-react';
import { toast } from 'sonner';
import type { TrainerPricing } from '@/lib/types';

interface CustomerAssignment {
    _id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAge: number | null;
    customerFitnessGoal: string;
    feeType: string;
    amount: number;
    startDate: string;
    endDate: string;
    status: string;
}

interface TrainerProfile {
    _id: string;
    name: string;
    bio: string;
    image: string;
    specializations: string[];
    pricing: TrainerPricing;
}

interface DashboardStats {
    totalCustomers: number;
    activeCustomers: number;
    expiringSoon: number;
    totalRevenue: number;
}

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

export default function TrainerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [trainer, setTrainer] = useState<TrainerProfile | null>(null);
    const [assignments, setAssignments] = useState<CustomerAssignment[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalCustomers: 0, activeCustomers: 0, expiringSoon: 0, totalRevenue: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch user session
            const meRes = await fetch('/api/auth/me');
            if (!meRes.ok) { router.push('/login'); return; }
            const meData = await meRes.json();
            setUser(meData.user);

            // Fetch trainer assignments
            const assignRes = await fetch('/api/trainer/assignments');
            if (!assignRes.ok) {
                if (assignRes.status === 404) {
                    toast.error('Trainer profile not found. Contact admin.');
                }
                setIsLoading(false);
                return;
            }
            const data = await assignRes.json();
            setTrainer(data.trainer);
            setAssignments(data.assignments);
            setStats(data.stats);
        } catch {
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Logged out successfully');
        router.push('/');
    };

    const getDaysLeft = (endDate: string) => {
        const diff = new Date(endDate).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
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

    if (!trainer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Trainer Profile Not Found</h2>
                        <p className="text-muted-foreground mb-4">Your account doesn't have a trainer profile. Please contact the admin.</p>
                        <Button onClick={handleLogout}>Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Header */}
            <header className="border-b border-border bg-card/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="rounded-lg bg-primary p-2">
                            <Dumbbell className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
                            Trainer Portal
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">{trainer.name}</span>
                        <Button variant="ghost" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                            <Award className="h-10 w-10 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-1">
                                Welcome, <span className="text-primary">{trainer.name}</span>
                            </h1>
                            <p className="text-muted-foreground">{trainer.bio}</p>
                            {trainer.specializations?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {trainer.specializations.map((s, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                                <Users className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-500">{stats.activeCustomers}</div>
                                <p className="text-xs text-muted-foreground">Out of {stats.totalCustomers} total</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-orange-500">{stats.expiringSoon}</div>
                                <p className="text-xs text-muted-foreground">Within 7 days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.totalCustomers}</div>
                                <p className="text-xs text-muted-foreground">All time assignments</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Revenue</CardTitle>
                                <IndianRupee className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">₹{stats.totalRevenue}</div>
                                <p className="text-xs text-muted-foreground">From active customers</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Customers Table */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                My Customers
                            </CardTitle>
                            <span className="text-sm text-muted-foreground">{assignments.length} total</span>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Fee Plan</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                                No customers assigned yet
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        assignments.map((a) => {
                                            const daysLeft = getDaysLeft(a.endDate);
                                            const isExpiring = a.status === 'active' && daysLeft > 0 && daysLeft <= 7;
                                            return (
                                                <TableRow key={a._id}>
                                                    <TableCell>
                                                        <div className="font-medium">{a.customerName}</div>
                                                        {a.customerFitnessGoal && (
                                                            <div className="text-xs text-muted-foreground capitalize">
                                                                Goal: {a.customerFitnessGoal.replace('-', ' ')}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        <div>{a.customerEmail}</div>
                                                        {a.customerPhone && <div className="text-xs text-muted-foreground">{a.customerPhone}</div>}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs">
                                                            {feeTypeLabels[a.feeType] || a.feeType}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">₹{a.amount}</TableCell>
                                                    <TableCell className="text-sm">
                                                        {new Date(a.startDate).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        <div>{new Date(a.endDate).toLocaleDateString()}</div>
                                                        {isExpiring && (
                                                            <div className="text-xs text-orange-500 font-medium">
                                                                {daysLeft}d remaining
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                isExpiring
                                                                    ? 'secondary'
                                                                    : (statusColors[a.status] as any) || 'outline'
                                                            }
                                                            className={
                                                                isExpiring
                                                                    ? 'bg-orange-500/10 text-orange-600 border-orange-500/30'
                                                                    : ''
                                                            }
                                                        >
                                                            {a.status === 'active'
                                                                ? isExpiring
                                                                    ? 'Expiring'
                                                                    : 'Active'
                                                                : a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <IndianRupee className="h-4 w-4 text-primary" />
                                    Your Pricing
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {trainer.pricing && Object.values(trainer.pricing).some(v => v > 0) ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {trainer.pricing.monthly > 0 && (
                                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                                                <div className="text-xs text-muted-foreground">Monthly</div>
                                                <div className="text-lg font-bold">₹{trainer.pricing.monthly}</div>
                                            </div>
                                        )}
                                        {trainer.pricing.quarterly > 0 && (
                                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                                                <div className="text-xs text-muted-foreground">Quarterly</div>
                                                <div className="text-lg font-bold">₹{trainer.pricing.quarterly}</div>
                                            </div>
                                        )}
                                        {trainer.pricing.sixMonths > 0 && (
                                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                                                <div className="text-xs text-muted-foreground">6 Months</div>
                                                <div className="text-lg font-bold">₹{trainer.pricing.sixMonths}</div>
                                            </div>
                                        )}
                                        {trainer.pricing.annual > 0 && (
                                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                                                <div className="text-xs text-muted-foreground">Annual</div>
                                                <div className="text-lg font-bold">₹{trainer.pricing.annual}</div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No pricing set</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <CalendarCheck className="h-4 w-4 text-primary" />
                                    Quick Links
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-3">
                                <Link href="/"><Button variant="outline" className="w-full"><LayoutDashboard className="h-4 w-4 mr-2" />Home</Button></Link>
                                <Link href="/user/profile"><Button variant="outline" className="w-full"><User className="h-4 w-4 mr-2" />Profile</Button></Link>
                                <Link href="/programs"><Button variant="outline" className="w-full"><Target className="h-4 w-4 mr-2" />Programs</Button></Link>
                                <Link href="/contact"><Button variant="outline" className="w-full"><ChevronRight className="h-4 w-4 mr-2" />Support</Button></Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
