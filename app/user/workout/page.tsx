'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dumbbell, Plus, Trash2, LogOut } from 'lucide-react';
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
    const toastRef = useRef<Toast>(null);
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
            toastRef.current?.show({ severity: 'error', summary: 'Add at least one exercise' });
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
                toastRef.current?.show({ severity: 'success', summary: 'Workout logged! 💪' });
                setExercises([{ name: '', sets: 3, reps: 10, weight: 0 }]);
                setNotes('');
                fetchWorkouts();
            } else {
                const data = await r.json();
                toastRef.current?.show({ severity: 'error', summary: data.error || 'Failed to log workout' });
            }
        } catch { toastRef.current?.show({ severity: 'error', summary: 'Something went wrong' }); }
        finally { setIsSaving(false); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-background">
            <Toast ref={toastRef} />
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/user/dashboard"><Button className="p-button-text" icon="pi pi-chevron-left" /></Link>
                        <span className="text-xl font-bold">Workout Log</span>
                    </div>
                    <Button className="p-button-text" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Log Form */}
                    <div className="space-y-6">
                        <Card className="!border-border/50">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Log Today&apos;s Workout</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="date">Date</label>
                                        <InputText id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full" />
                                    </div>

                                    {/* Exercises */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Exercises</span>
                                            <Button type="button" className="p-button-text" onClick={addExercise}>
                                                <Plus className="h-4 w-4 mr-1" /> Add
                                            </Button>
                                        </div>
                                        {exercises.map((ex, i) => (
                                            <div key={i} className="p-3 border border-border rounded-lg space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <InputText
                                                        placeholder="Exercise name"
                                                        value={ex.name}
                                                        onChange={e => updateExercise(i, 'name', e.target.value)}
                                                        className="flex-1 h-9 text-sm"
                                                    />
                                                    <Button type="button" className="p-button-text p-button-rounded p-button-danger" icon="pi pi-trash" onClick={() => removeExercise(i)} />
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div>
                                                        <label className="text-xs text-muted-foreground">Sets</label>
                                                        <InputText
                                                            type="number"
                                                            value={String(ex.sets)}
                                                            onChange={e => updateExercise(i, 'sets', Number(e.target.value))}
                                                            min={1}
                                                            className="h-9 text-sm w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-muted-foreground">Reps</label>
                                                        <InputText
                                                            type="number"
                                                            value={String(ex.reps)}
                                                            onChange={e => updateExercise(i, 'reps', Number(e.target.value))}
                                                            min={1}
                                                            className="h-9 text-sm w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-muted-foreground">Weight (kg)</label>
                                                        <InputText
                                                            type="number"
                                                            value={String(ex.weight)}
                                                            onChange={e => updateExercise(i, 'weight', Number(e.target.value))}
                                                            min={0}
                                                            className="h-9 text-sm w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="duration">Duration (minutes)</label>
                                        <InputText id="duration" type="number" value={String(duration)} onChange={e => setDuration(e.target.value ? Number(e.target.value) : '')} min={0} className="w-full" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="notes">Notes</label>
                                        <InputTextarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="How did it feel? Any observations..." className="w-full" />
                                    </div>

                                    <Button type="submit" className="w-full bg-primary border-primary text-white" label={isSaving ? 'Saving...' : 'Save Workout'} disabled={isSaving} />
                                </form>
                            </div>
                        </Card>
                    </div>

                    {/* History */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Recent Workouts</h2>
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading...</div>
                        ) : workouts.length === 0 ? (
                            <Card className="!border-border/50">
                                <div className="py-8 text-center text-muted-foreground">
                                    <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No workouts logged yet</p>
                                </div>
                            </Card>
                        ) : (
                            workouts.map((w) => (
                                <Card key={w._id} className="!border-border/50">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-sm">
                                                {new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                            {w.duration ? <Tag value={`${w.duration} min`} severity="secondary" /> : null}
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
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
