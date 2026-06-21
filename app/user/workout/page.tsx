'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Plus, Trash2, ChevronLeft, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import type { WorkoutResponse } from '@/lib/types';

interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight: number;
    notes?: string;
}

export default function WorkoutPage() {
    const router = useRouter();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [exercises, setExercises] = useState<Exercise[]>([
        { name: '', sets: 3, reps: 10, weight: 0 },
    ]);
    const [duration, setDuration] = useState<number | ''>(30);
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [workouts, setWorkouts] = useState<WorkoutResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWorkouts = useCallback(async () => {
        try {
            const r = await fetch('/api/user/workout?limit=10');
            if (r.ok) {
                const data = await r.json();
                setWorkouts(data.workouts);
            }
        } catch { /* silently fail */ }
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchWorkouts(); }, [fetchWorkouts]);

    const addExercise = () => {
        setExercises([...exercises, { name: '', sets: 3, reps: 10, weight: 0 }]);
    };

    const removeExercise = (index: number) => {
        if (exercises.length <= 1) return;
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
        const updated = [...exercises];
        (updated[index] as any)[field] = value;
        setExercises(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validExercises = exercises.filter(ex => ex.name.trim());
        if (validExercises.length === 0) {
            toast.error('Add at least one exercise');
            return;
        }

        setIsSaving(true);
        try {
            const r = await fetch('/api/user/workout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date,
                    exercises: validExercises,
                    duration: duration || 0,
                    notes,
                }),
            });

            if (r.ok) {
                toast.success('Workout logged! 💪');
                setExercises([{ name: '', sets: 3, reps: 10, weight: 0 }]);
                setNotes('');
                fetchWorkouts();
            } else {
                const data = await r.json();
                toast.error(data.error || 'Failed to log workout');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setIsSaving(false); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/user/dashboard"><Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button></Link>
                        <span className="text-xl font-bold">Workout Log</span>
                    </div>
                    <Button variant="ghost" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Log Form */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Log Today&apos;s Workout</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                                    </div>

                                    {/* Exercises */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label>Exercises</Label>
                                            <Button type="button" variant="ghost" size="sm" onClick={addExercise}>
                                                <Plus className="h-4 w-4 mr-1" /> Add
                                            </Button>
                                        </div>
                                        {exercises.map((ex, i) => (
                                            <div key={i} className="p-3 border border-border rounded-lg space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        placeholder="Exercise name"
                                                        value={ex.name}
                                                        onChange={e => updateExercise(i, 'name', e.target.value)}
                                                        className="flex-1 h-9 text-sm"
                                                    />
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeExercise(i)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div>
                                                        <Label className="text-xs">Sets</Label>
                                                        <Input
                                                            type="number"
                                                            value={ex.sets}
                                                            onChange={e => updateExercise(i, 'sets', Number(e.target.value))}
                                                            min={1}
                                                            className="h-9 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Reps</Label>
                                                        <Input
                                                            type="number"
                                                            value={ex.reps}
                                                            onChange={e => updateExercise(i, 'reps', Number(e.target.value))}
                                                            min={1}
                                                            className="h-9 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Weight (kg)</Label>
                                                        <Input
                                                            type="number"
                                                            value={ex.weight}
                                                            onChange={e => updateExercise(i, 'weight', Number(e.target.value))}
                                                            min={0}
                                                            className="h-9 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration (minutes)</Label>
                                        <Input id="duration" type="number" value={duration} onChange={e => setDuration(e.target.value ? Number(e.target.value) : '')} min={0} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="How did it feel? Any observations..." />
                                    </div>

                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save Workout'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* History */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Recent Workouts</h2>
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading...</div>
                        ) : workouts.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No workouts logged yet</p>
                                </CardContent>
                            </Card>
                        ) : (
                            workouts.map((w) => (
                                <Card key={w._id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-sm">
                                                {new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                            {w.duration ? <Badge variant="secondary">{w.duration} min</Badge> : null}
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {w.exercises.map((ex, i) => (
                                                <div key={i} className="text-xs p-1.5 bg-muted/50 rounded">
                                                    <span className="font-medium">{ex.name}</span>
                                                    <span className="text-muted-foreground ml-1">
                                                        {ex.sets}×{ex.reps} @ {ex.weight}kg
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        {w.notes && (
                                            <p className="text-xs text-muted-foreground mt-2 italic">{w.notes}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
