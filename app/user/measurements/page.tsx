'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, TrendingUp, ChevronLeft, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import type { MeasurementResponse } from '@/lib/types';

export default function MeasurementsPage() {
    const router = useRouter();
    const [measurements, setMeasurements] = useState<MeasurementResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chart');

    // Form state
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [weight, setWeight] = useState<number | ''>('');
    const [chest, setChest] = useState<number | ''>('');
    const [waist, setWaist] = useState<number | ''>('');
    const [arms, setArms] = useState<number | ''>('');
    const [thighs, setThighs] = useState<number | ''>('');
    const [hips, setHips] = useState<number | ''>('');
    const [bodyFat, setBodyFat] = useState<number | ''>('');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchMeasurements = useCallback(async () => {
        try {
            const r = await fetch('/api/user/measurements?limit=30');
            if (r.ok) {
                const data = await r.json();
                setMeasurements(data.measurements);
            }
        } catch { /* silently fail */ }
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchMeasurements(); }, [fetchMeasurements]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const body: Record<string, unknown> = { date };
            if (weight !== '') body.weight = Number(weight);
            if (chest !== '') body.chest = Number(chest);
            if (waist !== '') body.waist = Number(waist);
            if (arms !== '') body.arms = Number(arms);
            if (thighs !== '') body.thighs = Number(thighs);
            if (hips !== '') body.hips = Number(hips);
            if (bodyFat !== '') body.bodyFat = Number(bodyFat);
            if (notes) body.notes = notes;

            const r = await fetch('/api/user/measurements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (r.ok) {
                toast.success('Measurements saved! 📏');
                setWeight('');
                setWaist('');
                setArms('');
                fetchMeasurements();
                setActiveTab('chart');
            } else {
                const data = await r.json();
                toast.error(data.error || 'Failed to save');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setIsSaving(false); }
    };

    // Simple SVG line chart for weight
    const sortedM = [...measurements].reverse();
    const weightData = sortedM.filter(m => m.weight).slice(-20);

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
                        <span className="text-xl font-bold">Body Measurements</span>
                    </div>
                    <Button variant="ghost" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
                    <TabsList className="mb-6">
                        <TabsTrigger value="chart">Progress Chart</TabsTrigger>
                        <TabsTrigger value="log">Log New</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    {/* Progress Chart */}
                    <TabsContent value="chart">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Weight Progress</CardTitle></CardHeader>
                            <CardContent>
                                {weightData.length < 2 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                        <p>Log at least 2 weight measurements to see your progress chart.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <SimpleLineChart data={weightData} />
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            <StatCard label="Starting" value={`${weightData[0].weight} kg`} />
                                            <StatCard label="Current" value={`${weightData[weightData.length - 1].weight} kg`} color="text-primary" />
                                            <StatCard
                                                label="Change"
                                                value={`${(weightData[weightData.length - 1].weight! - weightData[0].weight!).toFixed(1)} kg`}
                                                color={(weightData[weightData.length - 1].weight! - weightData[0].weight!) <= 0 ? 'text-green-500' : 'text-orange-500'}
                                            />
                                            <StatCard label="Entries" value={`${weightData.length}`} />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Log New */}
                    <TabsContent value="log">
                        <Card>
                            <CardHeader><CardTitle>Log Body Measurements</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <Field label="Weight (kg)" value={weight} onChange={setWeight} />
                                        <Field label="Chest (cm)" value={chest} onChange={setChest} />
                                        <Field label="Waist (cm)" value={waist} onChange={setWaist} />
                                        <Field label="Arms (cm)" value={arms} onChange={setArms} />
                                        <Field label="Thighs (cm)" value={thighs} onChange={setThighs} />
                                        <Field label="Hips (cm)" value={hips} onChange={setHips} />
                                        <Field label="Body Fat %" value={bodyFat} onChange={setBodyFat} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
                                    </div>
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save Measurements'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* History */}
                    <TabsContent value="history">
                        <Card>
                            <CardHeader><CardTitle>Measurement History</CardTitle></CardHeader>
                            <CardContent>
                                {sortedM.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">No measurements logged yet.</div>
                                ) : (
                                    <div className="space-y-2">
                                        {sortedM.map((m) => (
                                            <div key={m._id} className="p-3 border border-border rounded-lg text-sm">
                                                <div className="font-medium mb-1">
                                                    {new Date(m.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                                                    {m.weight && <span>Weight: {m.weight} kg</span>}
                                                    {m.chest && <span>Chest: {m.chest} cm</span>}
                                                    {m.waist && <span>Waist: {m.waist} cm</span>}
                                                    {m.arms && <span>Arms: {m.arms} cm</span>}
                                                    {m.thighs && <span>Thighs: {m.thighs} cm</span>}
                                                    {m.hips && <span>Hips: {m.hips} cm</span>}
                                                    {m.bodyFat && <span>Body Fat: {m.bodyFat}%</span>}
                                                </div>
                                                {m.notes && <p className="text-xs italic mt-1 text-muted-foreground">{m.notes}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

// Helper components

function Field({ label, value, onChange }: { label: string; value: number | ''; onChange: (v: number | '') => void }) {
    return (
        <div className="space-y-1">
            <Label className="text-xs">{label}</Label>
            <Input type="number" value={value} onChange={e => onChange(e.target.value ? Number(e.target.value) : '')} className="h-9" />
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div className="p-3 bg-card border border-border rounded-xl text-center">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-lg font-bold ${color || ''}`}>{value}</p>
        </div>
    );
}

function SimpleLineChart({ data }: { data: MeasurementResponse[] }) {
    const values = data.map(m => m.weight!).filter(Boolean);
    const min = Math.min(...values) * 0.98;
    const max = Math.max(...values) * 1.02;
    const range = max - min || 1;
    const width = 600;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const points = values.map((v, i) => {
        const x = padding.left + (i / (values.length - 1)) * chartW;
        const y = padding.top + chartH - ((v - min) / range) * chartH;
        return `${x},${y}`;
    });

    const yLabels = [min, (min + max) / 2, max].map(v => Math.round(v * 10) / 10);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-64">
            {/* Grid lines */}
            {yLabels.map((v, i) => {
                const y = padding.top + chartH - ((v - min) / range) * chartH;
                return (
                    <g key={i}>
                        <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="4 4" />
                        <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-muted-foreground">{v}</text>
                    </g>
                );
            })}

            {/* Line */}
            <polyline
                points={points.join(' ')}
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Dots */}
            {points.map((p, i) => {
                const [x, y] = p.split(',').map(Number);
                return <circle key={i} cx={x} cy={y} r="3" fill="#f97316" />;
            })}

            {/* X-axis labels */}
            {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 5)) === 0).map((m, i) => {
                const idx = data.indexOf(m);
                const x = padding.left + (idx / (data.length - 1)) * chartW;
                const label = new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                    <text key={i} x={x} y={height - 5} textAnchor="middle" className="text-[10px] fill-muted-foreground">
                        {label}
                    </text>
                );
            })}
        </svg>
    );
}
