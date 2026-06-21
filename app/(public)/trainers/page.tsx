'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, IndianRupee, Check } from 'lucide-react';
import Link from 'next/link';
import type { TrainerResponse } from '@/lib/types';

export default function TrainersPage() {
    const [trainers, setTrainers] = useState<TrainerResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let mounted = true;
        fetch('/api/trainers')
            .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
            .then(data => { if (mounted) setTrainers(data.trainers || []); })
            .catch(() => { if (mounted) setIsError(true); })
            .finally(() => { if (mounted) setIsLoading(false); });
        return () => { mounted = false; };
    }, []);

    // Set page title for SEO since this is a client component
    useEffect(() => {
        document.title = 'Certified Gym Trainers in Bolpur | As FitnessZone';
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <section className="py-20 bg-gradient-to-br from-background via-background to-primary/10">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold">
                                Meet Our <span className="text-primary">Expert Trainers</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Certified professionals dedicated to helping you achieve your fitness goals
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container mx-auto px-4">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => (
                                    <Card key={i}>
                                        <div className="aspect-square bg-muted animate-pulse" />
                                        <CardContent className="p-6 space-y-4">
                                            <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                                            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                                            <div className="h-12 bg-muted animate-pulse rounded w-full" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>                            ) : isError ? (
                                <div className="text-center py-20 text-muted-foreground">
                                    <p className="text-lg">Unable to load trainers. Please try again later.</p>
                                </div>
                            ) : trainers.length === 0 ? (
                                <div className="text-center py-20 text-muted-foreground">
                                    <p className="text-lg">No trainers available yet. Check back soon!</p>
                                </div>
                        ) : (            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trainers.map((trainer) => (
                    <Card key={trainer._id} className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Award className="h-16 w-16 text-primary" />
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold">{trainer.name}</h3>
                                <p className="text-sm text-primary">Trainer</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{trainer.bio}</p>

                            {/* Pricing Section */}
                            {trainer.pricing && Object.values(trainer.pricing).some(v => v > 0) && (
                                <div className="bg-primary/5 rounded-lg p-3 space-y-2">
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                                        <IndianRupee className="h-4 w-4" />
                                        Training Fees
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {trainer.pricing.monthly > 0 && (
                                            <div className="flex items-center justify-between text-xs bg-background rounded px-2 py-1.5">
                                                <span className="text-muted-foreground">Monthly</span>
                                                <span className="font-semibold">₹{trainer.pricing.monthly}</span>
                                            </div>
                                        )}
                                        {trainer.pricing.quarterly > 0 && (
                                            <div className="flex items-center justify-between text-xs bg-background rounded px-2 py-1.5">
                                                <span className="text-muted-foreground">Quarterly</span>
                                                <span className="font-semibold">₹{trainer.pricing.quarterly}</span>
                                            </div>
                                        )}
                                        {trainer.pricing.sixMonths > 0 && (
                                            <div className="flex items-center justify-between text-xs bg-background rounded px-2 py-1.5">
                                                <span className="text-muted-foreground">6 Months</span>
                                                <span className="font-semibold">₹{trainer.pricing.sixMonths}</span>
                                            </div>
                                        )}
                                        {trainer.pricing.annual > 0 && (
                                            <div className="flex items-center justify-between text-xs bg-background rounded px-2 py-1.5">
                                                <span className="text-muted-foreground">Annual</span>
                                                <span className="font-semibold">₹{trainer.pricing.annual}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                {trainer.experience && (
                                    <div className="text-sm font-medium">Experience: {trainer.experience}</div>
                                )}
                                {trainer.certifications.length > 0 && (
                                    <div>
                                        <div className="text-sm font-medium mb-2">Certifications:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {trainer.certifications.map((cert, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-xs">{cert}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {trainer.specializations.length > 0 && (
                                    <div>
                                        <div className="text-sm font-medium mb-2">Specializations:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {trainer.specializations.map((spec, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">{spec}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href="/signup" className="block">
                                <Button className="w-full" size="sm">Choose Trainer</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
