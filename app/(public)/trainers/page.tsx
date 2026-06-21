'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Award, IndianRupee, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import DecorativeOrbs from '@/components/ui/DecorativeOrbs';
import GridPattern from '@/components/ui/GridPattern';
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

    useEffect(() => {
        document.title = 'Certified Gym Trainers in Bolpur | As FitnessZone';
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-28 overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
                    <DecorativeOrbs count={3} />
                    <div className="container mx-auto px-4 relative z-10">
                        <Reveal>
                            <div className="max-w-3xl mx-auto text-center space-y-6">
                                <motion.div
                                    className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-2"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Users className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-primary">Certified Professionals</span>
                                </motion.div>
                                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                    Meet Our{' '}
                                    <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                        Expert Trainers
                                    </span>
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    Certified professionals dedicated to helping you achieve your fitness goals
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Trainers Grid */}
                <section className="relative py-24 overflow-hidden">
                    <GridPattern opacity={0.03} />
                    <div className="container mx-auto px-4 relative z-10">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => (
                                    <Card key={i} className="!border-border/50">
                                        <div className="aspect-square bg-muted animate-pulse" />
                                        <div className="p-6 space-y-4">
                                            <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                                            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                                            <div className="h-12 bg-muted animate-pulse rounded w-full" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : isError ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                <p className="text-lg text-muted-foreground">Unable to load trainers. Please try again later.</p>
                            </motion.div>
                        ) : trainers.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                <p className="text-lg text-muted-foreground">No trainers available yet. Check back soon!</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {trainers.map((trainer, index) => (
                                    <Reveal key={trainer._id} delay={index * 0.1} direction="up">
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Card className="group hover:!border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 overflow-hidden h-full !border-border/50">
                                                <div className="aspect-square bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 relative overflow-hidden">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <motion.div
                                                            className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border-2 border-primary/20"
                                                            whileHover={{ scale: 1.1, rotate: 360 }}
                                                            transition={{ duration: 0.8 }}
                                                        >
                                                            <Award className="h-16 w-16 text-primary/60" />
                                                        </motion.div>
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{trainer.name}</h3>
                                                        <p className="text-sm text-primary font-medium">Certified Trainer</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{trainer.bio}</p>

                                                    {/* Pricing Section */}
                                                    {trainer.pricing && Object.values(trainer.pricing).some(v => v > 0) && (
                                                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 space-y-3 border border-primary/10">
                                                            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                                                                <IndianRupee className="h-4 w-4" />
                                                                Training Fees
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {trainer.pricing.monthly > 0 && (
                                                                    <div className="flex items-center justify-between text-xs bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                                                                        <span className="text-muted-foreground">Monthly</span>
                                                                        <span className="font-bold text-primary">₹{trainer.pricing.monthly}</span>
                                                                    </div>
                                                                )}
                                                                {trainer.pricing.quarterly > 0 && (
                                                                    <div className="flex items-center justify-between text-xs bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                                                                        <span className="text-muted-foreground">Quarterly</span>
                                                                        <span className="font-bold text-primary">₹{trainer.pricing.quarterly}</span>
                                                                    </div>
                                                                )}
                                                                {trainer.pricing.sixMonths > 0 && (
                                                                    <div className="flex items-center justify-between text-xs bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                                                                        <span className="text-muted-foreground">6 Months</span>
                                                                        <span className="font-bold text-primary">₹{trainer.pricing.sixMonths}</span>
                                                                    </div>
                                                                )}
                                                                {trainer.pricing.annual > 0 && (
                                                                    <div className="flex items-center justify-between text-xs bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                                                                        <span className="text-muted-foreground">Annual</span>
                                                                        <span className="font-bold text-primary">₹{trainer.pricing.annual}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="space-y-3">
                                                        {trainer.experience && (
                                                            <div className="text-sm font-medium flex items-center gap-2">
                                                                <span className="text-primary">◆</span>
                                                                Experience: {trainer.experience}
                                                            </div>
                                                        )}
                                                        {trainer.certifications.length > 0 && (
                                                            <div>
                                                                <div className="text-sm font-medium mb-2 text-muted-foreground">Certifications:</div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {trainer.certifications.map((cert, idx) => (
                                                                        <Tag key={idx} value={cert} severity="info" className="text-xs" />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {trainer.specializations.length > 0 && (
                                                            <div>
                                                                <div className="text-sm font-medium mb-2 text-muted-foreground">Specializations:</div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {trainer.specializations.map((spec, idx) => (
                                                                        <Tag key={idx} value={spec} severity="secondary" className="text-xs" />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Link href="/signup" className="block">
                                                        <Button
                                                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-500 shadow-lg shadow-red-500/20"
                                                            size="small"
                                                            label="Choose Trainer"
                                                        />
                                                    </Link>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </Reveal>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
