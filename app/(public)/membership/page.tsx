'use client';

import { useEffect } from 'react';
import Price from '@/components/membership/Price';
import FAQ from '@/components/membership/FAQ';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import DecorativeOrbs from '@/components/ui/DecorativeOrbs';

export default function MembershipPage() {
    useEffect(() => {
        document.title = 'Gym Membership Plans in Bolpur | As FitnessZone';
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
                                    <span className="text-sm font-medium text-primary">Flexible Plans</span>
                                </motion.div>
                                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                    Choose Your{' '}
                                    <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                        Membership
                                    </span>
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    Flexible plans designed to fit your lifestyle and budget
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Pricing Cards */}
                <Price />

                {/* FAQ Section */}
                <FAQ />
            </main>
        </div>
    );
}
