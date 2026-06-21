'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import Link from 'next/link';
import { Dumbbell, Heart, Zap, Target, Users, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import DecorativeOrbs from '@/components/ui/DecorativeOrbs';
import GridPattern from '@/components/ui/GridPattern';
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
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-primary">Find Your Fit</span>
                                </motion.div>
                                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                    Our{' '}
                                    <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                        Programs
                                    </span>
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    Discover the perfect program to match your fitness goals and experience level
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Programs Grid */}
                <section className="relative py-24 overflow-hidden">
                    <GridPattern opacity={0.03} />
                    <div className="container mx-auto px-4 relative z-10">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <Card key={i} className="!border-border/50">
                                        <div className="p-6 space-y-4">
                                            <div className="w-14 h-14 rounded-xl bg-muted animate-pulse" />
                                            <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                                            <div className="h-4 bg-muted animate-pulse rounded w-full" />
                                            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
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
                                <p className="text-lg text-muted-foreground">Unable to load programs. Please try again later.</p>
                            </motion.div>
                        ) : programs.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                <p className="text-lg text-muted-foreground">No programs available yet. Check back soon!</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {programs.map((program, index) => {
                                    const Icon = getIcon(program.title);
                                    const gradients = ['from-red-500 to-orange-500', 'from-orange-500 to-yellow-500', 'from-red-600 to-red-400'];
                                    const gIndex = index % gradients.length;
                                    return (
                                        <Reveal key={program._id} delay={index * 0.08} direction="up">
                                            <motion.div
                                                whileHover={{ y: -5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <Card className="group hover:!border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full !border-border/50">
                                                    <div className="p-6 space-y-4">
                                                        <motion.div
                                                            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradients[gIndex]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                                            whileHover={{ rotate: 10 }}
                                                        >
                                                            <Icon className="h-7 w-7 text-white" />
                                                        </motion.div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{program.title}</h3>
                                                            <p className="text-muted-foreground text-sm leading-relaxed">{program.description}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Tag value={program.difficulty || 'All Levels'} severity="info" />
                                                            <Tag value={program.duration || 'Flexible'} severity="secondary" />
                                                        </div>
                                                        {program.features.length > 0 && (
                                                            <ul className="space-y-2">
                                                                {program.features.map((feature, idx) => (
                                                                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 mr-2" />
                                                                        {feature}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                        <Link href="/signup">
                                                            <Button
                                                                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-500 shadow-lg shadow-red-500/20"
                                                                label="Get Started"
                                                            />
                                                        </Link>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        </Reveal>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative py-24 bg-card overflow-hidden">
                    <DecorativeOrbs count={2} />
                    <div className="container mx-auto px-4 relative z-10">
                        <Reveal>
                            <div className="max-w-3xl mx-auto text-center space-y-8">
                                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                    Not Sure Which Program is{' '}
                                    <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                        Right for You?
                                    </span>
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                                    Book a free consultation with our expert trainers to find the perfect program for your goals
                                </p>
                                <Link href="/contact">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            size="large"
                                            className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-500 shadow-lg shadow-red-500/25 px-10 py-3 text-lg"
                                            label="Book Free Consultation"
                                        />
                                    </motion.div>
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </section>
            </main>
        </div>
    );
}
