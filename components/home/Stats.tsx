'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Users, Dumbbell, Award, CalendarCheck } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

interface CounterProps {
    end: number;
    suffix?: string;
    duration?: number;
}

function AnimatedCounter({ end, suffix = '', duration = 2000 }: CounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const startTime = Date.now();
                    const animate = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out quad
                        const eased = progress * (2 - progress);
                        setCount(Math.floor(eased * end));
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return (
        <div ref={ref} className="text-4xl md:text-5xl font-bold text-white">
            {count}{suffix}
        </div>
    );
}

const stats = [
    {
        icon: Users,
        value: 1000,
        suffix: '+',
        label: 'Active Members',
        description: 'And growing every day',
        gradient: 'from-red-500 to-orange-500',
    },
    {
        icon: CalendarCheck,
        value: 50,
        suffix: '+',
        label: 'Weekly Classes',
        description: 'For all fitness levels',
        gradient: 'from-orange-500 to-yellow-500',
    },
    {
        icon: Award,
        value: 15,
        suffix: '+',
        label: 'Expert Trainers',
        description: 'Certified professionals',
        gradient: 'from-red-600 to-red-400',
    },
    {
        icon: Dumbbell,
        value: 5,
        suffix: '+',
        label: 'Years of Excellence',
        description: 'Serving the community',
        gradient: 'from-orange-600 to-red-500',
    },
];

export default function Stats() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <Reveal>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            By the{' '}
                            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                Numbers
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Our results speak for themselves. Join a community that&apos;s growing stronger every day.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Reveal key={index} delay={index * 0.15}>
                                <div className="group relative">
                                    {/* Glow effect */}
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

                                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-all duration-300">
                                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-6`}>
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>

                                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />

                                        <div className="mt-2 text-xl font-semibold text-white">
                                            {stat.label}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-400">
                                            {stat.description}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
