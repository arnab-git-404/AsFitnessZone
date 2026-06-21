'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dumbbell, Heart, Zap, Target, Users, TrendingUp } from 'lucide-react';
import type { ProgramResponse } from '@/lib/types';

const iconMap: Record<string, React.ElementType> = {
    'weight': Dumbbell,
    'cardio': Heart,
    'personal': Users,
    'fat': TrendingUp,
    'muscle': Target,
    'cross': Zap,
};

function getIcon(title: string): React.ElementType {
    const key = Object.keys(iconMap).find(k => title.toLowerCase().includes(k));
    return key ? iconMap[key] : Dumbbell;
}

export default function ProgramsPage() {
    const [programs, setPrograms] = useState<ProgramResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let mounted = true;
        fetch('/api/programs')
            .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
            .then(data => { if (mounted) setPrograms(data.programs || []); })
            .catch(() => { if (mounted) setIsError(true); })
            .finally(() => { if (mounted) setIsLoading(false); });
        return () => { mounted = false; };
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <section className="py-20 bg-gradient-to-br from-background via-background to-primary/10">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold">
                                Our <span className="text-primary">Programs</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Discover the perfect program to match your fitness goals and experience level
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container mx-auto px-4">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <Card key={i}>
                                        <CardContent className="p-6 space-y-4">
                                            <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
                                            <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                                            <div className="h-4 bg-muted animate-pulse rounded w-full" />
                                            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : isError ? (
                            <div className="text-center py-20 text-muted-foreground">
                                <p className="text-lg">Unable to load programs. Please try again later.</p>
                            </div>
                        ) : programs.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                <p className="text-lg">No programs available yet. Check back soon!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {programs.map((program) => {
                                    const Icon = getIcon(program.title);
                                    return (
                                        <Card key={program._id} className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                                            <CardContent className="p-6 space-y-4">
                                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Icon className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-semibold">{program.title}</h3>
                                                    <p className="text-muted-foreground text-sm">{program.description}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant="secondary">{program.difficulty || 'All Levels'}</Badge>
                                                    <Badge variant="outline">{program.duration || 'Flexible'}</Badge>
                                                </div>
                                                {program.features.length > 0 && (
                                                    <ul className="space-y-2">
                                                        {program.features.map((feature, idx) => (
                                                            <li key={idx} className="flex items-center text-sm text-muted-foreground">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <Link href="/signup">
                                                    <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Not Sure Which Program is Right for You?
                            </h2>
                            <p className="text-muted-foreground">
                                Book a free consultation with our expert trainers to find the perfect program for your goals
                            </p>
                            <Link href="/contact">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">Book Free Consultation</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
