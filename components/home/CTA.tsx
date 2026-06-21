'use client';

import React from 'react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';

export default function CTA() {
    return (
        <section className="relative py-28 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary/5 to-gray-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />

            {/* Floating orbs */}
            <motion.div
                className="absolute top-20 right-20 w-72 h-72 rounded-full bg-red-500/5 blur-3xl"
                animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl"
                animate={{ y: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <Reveal>
                    <motion.div
                        className="max-w-4xl mx-auto text-center space-y-8"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Sparkles className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium text-orange-500">Limited Time Offer</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                            Ready to{' '}
                            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                Transform
                            </span>{' '}
                            Your Life?
                        </h2>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Join As FitnessZone today and get your first month at <span className="text-white font-semibold">50% off</span>.
                            Limited time offer for new members!
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link href="/signup">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        size="lg"
                                        className="text-lg px-10 py-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 group"
                                    >
                                        Join Now
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/contact">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="text-lg px-10 py-6 border-gray-600 text-gray-300 hover:bg-white/5 hover:border-gray-500"
                                    >
                                        Free Consultation
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>

                        {/* Benefits */}
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-6">
                            {['No Joining Fee', 'Cancel Anytime', 'Free Trial Session', 'All Equipment Access'].map(
                                (benefit, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <span className="text-gray-300">{benefit}</span>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </motion.div>
                </Reveal>
            </div>
        </section>
    );
}
