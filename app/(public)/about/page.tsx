'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Heart, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import DecorativeOrbs from '@/components/ui/DecorativeOrbs';
import GridPattern from '@/components/ui/GridPattern';

export default function AboutPage() {
    useEffect(() => {
        document.title = 'About As FitnessZone | Unisex Gym in Bolpur';
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
                                    <span className="text-sm font-medium text-primary">Since 2020</span>
                                </motion.div>
                                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                    About{' '}
                                    <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                        FitnessGym
                                    </span>
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    More than just a gym — we&apos;re a community dedicated to transforming lives through fitness
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="relative py-24 overflow-hidden">
                    <GridPattern opacity={0.03} />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            <Reveal direction="left">
                                <Card className="group bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10">
                                    <CardContent className="p-8 space-y-4">
                                        <motion.div
                                            className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Target className="h-7 w-7 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold">Our Mission</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            To empower individuals to achieve their fitness goals through expert guidance,
                                            state-of-the-art facilities, and a supportive community. We believe everyone
                                            deserves access to quality fitness resources and personalized attention.
                                        </p>
                                    </CardContent>
                                </Card>
                            </Reveal>

                            <Reveal direction="right">
                                <Card className="group bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10">
                                    <CardContent className="p-8 space-y-4">
                                        <motion.div
                                            className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Heart className="h-7 w-7 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold">Our Vision</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            To be the leading fitness destination that inspires healthier lifestyles and
                                            builds a stronger community. We envision a world where fitness is accessible,
                                            enjoyable, and transformative for everyone.
                                        </p>
                                    </CardContent>
                                </Card>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* Training Philosophy */}
                <section className="relative py-24 bg-card overflow-hidden">
                    <DecorativeOrbs count={2} />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto space-y-16">
                            <Reveal>
                                <div className="text-center space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-bold">
                                        Our Training{' '}
                                        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                            Philosophy
                                        </span>
                                    </h2>
                                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                        We believe in a holistic approach to fitness that combines science,
                                        dedication, and personalization
                                    </p>
                                </div>
                            </Reveal>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        icon: Zap,
                                        title: 'Progressive Training',
                                        description: 'Gradual intensity increase for sustainable results',
                                        gradient: 'from-red-500 to-orange-500',
                                    },
                                    {
                                        icon: Heart,
                                        title: 'Holistic Wellness',
                                        description: 'Focus on physical, mental, and emotional health',
                                        gradient: 'from-orange-500 to-yellow-500',
                                    },
                                    {
                                        icon: Award,
                                        title: 'Evidence-Based',
                                        description: 'Programs backed by sports science research',
                                        gradient: 'from-red-600 to-red-400',
                                    },
                                ].map((item, index) => (
                                    <Reveal key={index} delay={index * 0.15} direction="up">
                                        <Card className="group hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 h-full">
                                            <CardContent className="p-8 text-center space-y-5">
                                                <motion.div
                                                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto`}
                                                    whileHover={{ scale: 1.15, rotate: 360 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <item.icon className="h-8 w-8 text-white" />
                                                </motion.div>
                                                <h3 className="text-xl font-bold">{item.title}</h3>
                                                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Infrastructure */}
                <section className="relative py-24 overflow-hidden">
                    <GridPattern opacity={0.03} />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto space-y-12">
                            <Reveal>
                                <div className="text-center space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-bold">
                                        World-Class{' '}
                                        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                            Infrastructure
                                        </span>
                                    </h2>
                                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                        Our facility is equipped with everything you need for your fitness journey
                                    </p>
                                </div>
                            </Reveal>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: '10,000 sq ft Training Area',
                                        description: 'Spacious workout zones for cardio, strength, and functional training',
                                        icon: '🏋️',
                                    },
                                    {
                                        title: 'Premium Equipment',
                                        description: 'Latest machines from top brands like Technogym and Life Fitness',
                                        icon: '⚙️',
                                    },
                                    {
                                        title: 'Dedicated Zones',
                                        description: 'Separate areas for CrossFit, yoga, spinning, and group classes',
                                        icon: '🧘',
                                    },
                                    {
                                        title: 'Modern Amenities',
                                        description: 'Clean locker rooms, showers, sauna, and relaxation areas',
                                        icon: '🚿',
                                    },
                                ].map((item, index) => (
                                    <Reveal key={index} delay={index * 0.1} direction={index % 2 === 0 ? 'left' : 'right'}>
                                        <Card className="group hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10">
                                            <CardContent className="p-6 space-y-3">
                                                <motion.span
                                                    className="text-3xl block"
                                                    whileHover={{ scale: 1.2 }}
                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                >
                                                    {item.icon}
                                                </motion.span>
                                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                                                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
