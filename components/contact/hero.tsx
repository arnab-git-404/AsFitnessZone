'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import DecorativeOrbs from '@/components/ui/DecorativeOrbs';
import Reveal from '@/components/ui/Reveal';

export default function Hero() {
    return (
        <section className="relative py-28 overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
            <DecorativeOrbs count={3} />
            <div className="container mx-auto px-4 relative z-10">
                <Reveal>
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <motion.div
                            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            <MessageCircle className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">We&apos;re Here to Help</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                            Get in{' '}
                            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                Touch
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Have questions? We&apos;re here to help you start your fitness journey
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
