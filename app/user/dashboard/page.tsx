'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import {
    Dumbbell, User, LogOut, Target, TrendingUp, CalendarCheck, Flame,
    CheckCircle2, Clock, Activity, Droplets, Plus, Minus, ChevronRight,
    Calculator, UserCheck, Award
} from 'lucide-react';
import type { UserResponse, WorkoutResponse } from '@/lib/types';

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
    const toastRef = useRef<Toast>(null);
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
            if (r.ok) { toastRef.current?.show({ severity: 'success', summary: 'Checked in successfully! 💪' }); fetchCheckIn(); }
            else if (r.status === 409) { toastRef.current?.show({ severity: 'error', summary: 'Already checked in today!' }); fetchCheckIn(); }
            else { toastRef.current?.show({ severity: 'error', summary: data.error || 'Check-in failed' }); }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Something went wrong' }); }
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
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Failed to update water intake' }); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toastRef.current?.show({ severity: 'success', summary: 'Logged out successfully' });
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
            <Toast ref={toastRef} />
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="rounded-lg bg-primary p-2"><Dumbbell className="h-6 w-6 text-white" /></div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">FitnessGym</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/user/profile"><Button className="p-button-text"><User className="h-4 w-4 mr-2" />Profile</Button></Link>
                        <Button className="p-button-text" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
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
                        <Card className="!border-border/50">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">Current Weight</span>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="text-2xl font-bold">{user?.customer?.weight ? `${user.customer.weight} kg` : 'Not set'}</div>
                                <p className="text-xs text-muted-foreground mt-1">Update in profile</p>
                            </div>
                        </Card>
                        <Card className="!border-border/50">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">Fitness Goal</span>
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="text-2xl font-bold capitalize">{user?.customer?.fitnessGoal ? user.customer.fitnessGoal.replace('-', ' ') : 'Not set'}</div>
                                <p className="text-xs text-muted-foreground mt-1">Set your goal</p>
                            </div>
                        </Card>
                        <Card className="!border-border/50">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">Check-in Streak</span>
                                    <Flame className="h-4 w-4 text-orange-500" />
                                </div>
                                <div className="text-2xl font-bold text-orange-500">{checkIn ? `${checkIn.streak} days` : '-'}</div>
                                <p className="text-xs text-muted-foreground mt-1">{checkIn ? `${checkIn.totalCheckIns} total` : 'Loading...'}</p>
                            </div>
                        </Card>
                        <Card className="!border-border/50">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">Member Since</span>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="text-2xl font-bold">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Row: Check-In + Water Intake */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Check-In Card */}
                        <Card className="!border-primary/20">
                            <div className="p-6">
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
                                        className={`${checkIn?.todayCheckIn ? 'bg-green-600 hover:bg-green-700 border-green-600' : 'bg-primary border-primary text-white'} min-w-[120px]`}
                                    >
                                        {isCheckingIn ? '...' : checkIn?.todayCheckIn ? 'Checked In ✓' : 'Check In'}
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Water Intake Card */}
                        <Card className="!border-border/50">
                            <div className="p-6">
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
                                    <Button className="p-button-text p-button-rounded" icon="pi pi-chart-line" disabled />
                                </div>
                                <div className="flex items-center justify-center gap-4 mt-4">
                                    <Button className="p-button-outlined p-button-rounded" icon="pi pi-minus" onClick={() => updateWater(Math.max(0, waterInput - 1))} />
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-blue-500">{water?.todayGlasses ?? 0}</span>
                                        <span className="text-sm text-muted-foreground ml-1">glasses</span>
                                    </div>
                                    <Button className="p-button-outlined p-button-rounded" icon="pi pi-plus" onClick={() => updateWater(waterInput + 1)} />
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
                            </div>
                        </Card>
                    </div>

                    {/* Trainer Card */}
                    {trainerAssignment && trainerAssignment.trainerId && (
                        <Card className="!border-primary/30">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <UserCheck className="h-5 w-5 text-primary" />
                                        My Trainer
                                    </h2>
                                    <Link href="/user/trainer">
                                        <Button className="p-button-outlined">Manage <ChevronRight className="h-4 w-4 ml-1" /></Button>
                                    </Link>
                                </div>
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
                                    <Tag value="Active" severity="success" />
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Workout Card */}
                    <Card className="!border-border/50">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    Latest Workout
                                </h2>
                                <Link href="/user/workout">
                                    <Button className="p-button-outlined">Log Workout <ChevronRight className="h-4 w-4 ml-1" /></Button>
                                </Link>
                            </div>
                            {recentWorkout ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {new Date(recentWorkout.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </span>
                                        {recentWorkout.duration ? (
                                            <Tag value={`${recentWorkout.duration} min`} severity="secondary" />
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
                                        <Button className="p-button-link text-primary mt-1">Log your first workout</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Recent Check-ins */}
                    {checkIn?.recentCheckIns && checkIn.recentCheckIns.length > 0 && (
                        <Card className="!border-border/50">
                            <div className="p-6">
                                <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
                                    <Clock className="h-4 w-4" /> Recent Activity
                                </h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {checkIn.recentCheckIns.slice(0, 14).map((c) => {
                                        const d = new Date(c.date);
                                        return (
                                            <Tag key={c.date} value={d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} severity="secondary" className="text-xs py-0.5 px-2" />
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Complete Your Profile */}
                    {(!user?.customer?.weight || !user?.customer?.height || !user?.customer?.fitnessGoal) && (
                        <Card className="!border-primary/50 !bg-primary/5">
                            <div className="p-6">
                                <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                                <p className="text-sm text-muted-foreground mb-4">Add your fitness details to get personalized recommendations and track your progress effectively.</p>
                                <Link href="/user/profile"><Button className="bg-primary border-primary text-white">Complete Profile</Button></Link>
                            </div>
                        </Card>
                    )}

                    {/* Quick Actions */}
                    <Card className="!border-border/50">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <Link href="/user/workout"><Button className="w-full p-button-outlined"><Activity className="h-4 w-4 mr-2" />Log Workout</Button></Link>
                                <Link href="/user/measurements"><Button className="w-full p-button-outlined"><TrendingUp className="h-4 w-4 mr-2" />Body Measurements</Button></Link>
                                <Link href="/bmi-calculator"><Button className="w-full p-button-outlined"><Calculator className="h-4 w-4 mr-2" />BMI Calculator</Button></Link>
                                <Link href="/user/trainer"><Button className="w-full p-button-outlined"><UserCheck className="h-4 w-4 mr-2" />My Trainer</Button></Link>
                                <Link href="/user/profile"><Button className="w-full p-button-outlined"><User className="h-4 w-4 mr-2" />Update Profile</Button></Link>
                                <Link href="/programs"><Button className="w-full p-button-outlined"><Dumbbell className="h-4 w-4 mr-2" />Programs</Button></Link>
                                <Link href="/contact"><Button className="w-full p-button-outlined"><Target className="h-4 w-4 mr-2" />Support</Button></Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
