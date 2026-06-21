'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dumbbell, User, LogOut, Target, TrendingUp, CalendarCheck, Flame,
    CheckCircle2, Clock, Activity, Droplets, Plus, Minus, ChevronRight,
    LineChart, Calculator, UserCheck, Award
} from 'lucide-react';
import { toast } from 'sonner';
import type { UserResponse, WorkoutResponse, TrainerAssignmentResponse, TrainerResponse } from '@/lib/types';

interface CheckInData {
    todayCheckIn: boolean;
    streak: number;
    totalCheckIns: number;
    recentCheckIns: Array<{ date: string; checkInTime: string }>;
}

interface WaterData {
    todayGlasses: number;
    monthlyAverage: number;
    streak: number;
}

export default function UserDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [checkIn, setCheckIn] = useState<CheckInData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    // Workout state
    const [recentWorkout, setRecentWorkout] = useState<WorkoutResponse | null>(null);

    // Water state
    const [water, setWater] = useState<WaterData | null>(null);
    const [waterInput, setWaterInput] = useState(0);

    // Trainer state
    const [trainerAssignment, setTrainerAssignment] = useState<any>(null);

    // Fetch all data
    const fetchAll = useCallback(async () => {
        await Promise.all([fetchCheckIn(), fetchRecentWorkout(), fetchWater(), fetchTrainerAssignment()]);
    }, []);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                await fetchAll();
            } else {
                router.push('/login');
            }
        } catch { router.push('/login'); }
        finally { setIsLoading(false); }
    };

    const fetchCheckIn = async () => {
        try {
            const r = await fetch('/api/user/checkin');
            if (r.ok) {
                const data = await r.json();
                setCheckIn(data);
            }
        } catch { /* silently fail */ }
    };

    const fetchRecentWorkout = async () => {
        try {
            const r = await fetch('/api/user/workout?limit=1');
            if (r.ok) {
                const data = await r.json();
                if (data.workouts?.length > 0) setRecentWorkout(data.workouts[0]);
            }
        } catch { /* silently fail */ }
    };

    const fetchWater = async () => {
        try {
            const r = await fetch('/api/user/water');
            if (r.ok) {
                const data = await r.json();
                setWater(data);
                setWaterInput(data.todayGlasses);
            }
        } catch { /* silently fail */ }
    };

    const fetchTrainerAssignment = async () => {
        try {
            const r = await fetch('/api/user/trainer-assignments');
            if (r.ok) {
                const data = await r.json();
                if (data.assignment) setTrainerAssignment(data.assignment);
            }
        } catch { /* silently fail */ }
    };

    const handleCheckIn = useCallback(async () => {
        setIsCheckingIn(true);
        try {
            const r = await fetch('/api/user/checkin', { method: 'POST' });
            const data = await r.json();
            if (r.ok) { toast.success('Checked in successfully! 💪'); fetchCheckIn(); }
            else if (r.status === 409) { toast.error('Already checked in today!'); fetchCheckIn(); }
            else { toast.error(data.error || 'Check-in failed'); }
        } catch { toast.error('Something went wrong'); }
        finally { setIsCheckingIn(false); }
    }, []);

    const updateWater = async (glasses: number) => {
        if (glasses < 0 || glasses > 50) return;
        setWaterInput(glasses);
        try {
            await fetch('/api/user/water', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ glasses }),
            });
            fetchWater();
        } catch { toast.error('Failed to update water intake'); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Logged out successfully');
        router.push('/');
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
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">FitnessGym</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/user/profile"><Button variant="ghost"><User className="h-4 w-4 mr-2" />Profile</Button></Link>
                        <Button variant="ghost" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Welcome */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome back, <span className="text-primary">{user?.customer?.name || user?.email}</span>!
                        </h1>
                        <p className="text-muted-foreground">Track your progress and manage your fitness journey</p>
                    </div>

                    {/* Stats Grid — 4 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{user?.customer?.weight ? `${user.customer.weight} kg` : 'Not set'}</div>
                                <p className="text-xs text-muted-foreground">Update in profile</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Fitness Goal</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold capitalize">{user?.customer?.fitnessGoal ? user.customer.fitnessGoal.replace('-', ' ') : 'Not set'}</div>
                                <p className="text-xs text-muted-foreground">Set your goal</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Check-in Streak</CardTitle>
                                <Flame className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-500">{checkIn ? `${checkIn.streak} days` : '-'}</div>
                                <p className="text-xs text-muted-foreground">{checkIn ? `${checkIn.totalCheckIns} total` : 'Loading...'}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Row: Check-In + Water Intake */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Check-In Card */}
                        <Card className="border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${checkIn?.todayCheckIn ? 'bg-green-500/20' : 'bg-primary/10'}`}>
                                            {checkIn?.todayCheckIn ? <CheckCircle2 className="h-7 w-7 text-green-500" /> : <CalendarCheck className="h-7 w-7 text-primary" />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{checkIn?.todayCheckIn ? "You're checked in! 🎯" : 'Check in for today'}</h3>
                                            <p className="text-xs text-muted-foreground">{checkIn?.todayCheckIn ? 'See you tomorrow!' : 'Mark your attendance'}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleCheckIn}
                                        disabled={isCheckingIn || checkIn?.todayCheckIn}
                                        className={`${checkIn?.todayCheckIn ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} min-w-[120px]`}
                                        size="sm"
                                    >
                                        {isCheckingIn ? '...' : checkIn?.todayCheckIn ? 'Checked In ✓' : 'Check In'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Water Intake Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                            <Droplets className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Water Intake</h3>
                                            <p className="text-xs text-muted-foreground">Aim for 8-12 glasses/day</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled><LineChart className="h-4 w-4" /></Button>
                                </div>
                                <div className="flex items-center justify-center gap-4 mt-4">
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateWater(Math.max(0, waterInput - 1))}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-blue-500">{water?.todayGlasses ?? 0}</span>
                                        <span className="text-sm text-muted-foreground ml-1">glasses</span>
                                    </div>
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateWater(waterInput + 1)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span>🔥 {water?.streak || 0} day streak</span>
                                    <span>📊 Avg: {water?.monthlyAverage || 0}/day</span>
                                </div>
                                {/* Water glass visual */}
                                <div className="flex gap-1 mt-3 justify-center">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-6 w-4 rounded-sm transition-colors ${
                                                i < (water?.todayGlasses ?? 0)
                                                    ? 'bg-blue-500'
                                                    : 'bg-muted'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Trainer Card */}
                    {trainerAssignment && trainerAssignment.trainerId && (
                        <Card className="border-primary/30">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-primary" />
                                    My Trainer
                                </CardTitle>
                                <Link href="/user/trainer">
                                    <Button variant="outline" size="sm">
                                        Manage <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Award className="h-7 w-7 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{trainerAssignment.trainerId.name}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{trainerAssignment.trainerId.bio}</p>
                                        <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                                            <span>{trainerAssignment.feeType} plan</span>
                                            <span>₹{trainerAssignment.amount}</span>
                                        </div>
                                    </div>
                                    <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/30">Active</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Workout Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Latest Workout
                            </CardTitle>
                            <Link href="/user/workout">
                                <Button variant="outline" size="sm">
                                    Log Workout <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentWorkout ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {new Date(recentWorkout.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </span>
                                        {recentWorkout.duration ? (
                                            <Badge variant="secondary">{recentWorkout.duration} min</Badge>
                                        ) : null}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {recentWorkout.exercises.slice(0, 6).map((ex, i) => (
                                            <div key={i} className="p-2 bg-muted/50 rounded-lg text-xs">
                                                <p className="font-medium truncate">{ex.name}</p>
                                                <p className="text-muted-foreground">{ex.sets}×{ex.reps} @ {ex.weight}kg</p>
                                            </div>
                                        ))}
                                        {recentWorkout.exercises.length > 6 && (
                                            <div className="p-2 bg-muted/50 rounded-lg text-xs flex items-center justify-center text-muted-foreground">
                                                +{recentWorkout.exercises.length - 6} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No workouts logged yet</p>
                                    <Link href="/user/workout">
                                        <Button variant="link" className="text-primary mt-1">Log your first workout</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Check-ins */}
                    {checkIn?.recentCheckIns && checkIn.recentCheckIns.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4" /> Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-1.5">
                                    {checkIn.recentCheckIns.slice(0, 14).map((c) => {
                                        const d = new Date(c.date);
                                        return (
                                            <Badge key={c.date} variant="secondary" className="text-xs py-0.5 px-2">
                                                {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Complete Your Profile */}
                    {(!user?.customer?.weight || !user?.customer?.height || !user?.customer?.fitnessGoal) && (
                        <Card className="border-primary/50 bg-primary/5">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                                <p className="text-sm text-muted-foreground mb-4">Add your fitness details to get personalized recommendations and track your progress effectively.</p>
                                <Link href="/user/profile"><Button className="bg-primary hover:bg-primary/90">Complete Profile</Button></Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <Link href="/user/workout"><Button className="w-full" variant="outline"><Activity className="h-4 w-4 mr-2" />Log Workout</Button></Link>
                            <Link href="/user/measurements"><Button className="w-full" variant="outline"><TrendingUp className="h-4 w-4 mr-2" />Body Measurements</Button></Link>
                            <Link href="/bmi-calculator"><Button className="w-full" variant="outline"><Calculator className="h-4 w-4 mr-2" />BMI Calculator</Button></Link>
                            <Link href="/user/trainer"><Button className="w-full" variant="outline"><UserCheck className="h-4 w-4 mr-2" />My Trainer</Button></Link>
                            <Link href="/user/profile"><Button className="w-full" variant="outline"><User className="h-4 w-4 mr-2" />Update Profile</Button></Link>
                            <Link href="/programs"><Button className="w-full" variant="outline"><Dumbbell className="h-4 w-4 mr-2" />Programs</Button></Link>
                            <Link href="/contact"><Button className="w-full" variant="outline"><Target className="h-4 w-4 mr-2" />Support</Button></Link>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
