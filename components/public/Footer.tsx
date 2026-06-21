'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    Dumbbell,
    Facebook,
    Instagram,
    Twitter,
    Mail,
    Phone,
    MapPin,
    Clock,
    ArrowRight,
    CheckCircle2,
    Youtube,
} from 'lucide-react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="relative border-t border-border/40 bg-gradient-to-b from-card to-background">
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            <div className="container mx-auto px-4 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
                    {/* Brand */}
                    <div className="space-y-5">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="rounded-lg bg-gradient-to-br from-red-500 to-orange-500 p-2 transition-transform group-hover:scale-110">
                                <Dumbbell className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                As FitnessZone
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Bolpur&apos;s premium unisex gym — transforming lives through fitness since 2020.
                            Join the community that pushes you to be your best.
                        </p>
                        <div className="flex space-x-3">
                            {[
                                { icon: Facebook, href: '#', label: 'Facebook' },
                                { icon: Instagram, href: '#', label: 'Instagram' },
                                { icon: Twitter, href: '#', label: 'Twitter' },
                                { icon: Youtube, href: '#', label: 'YouTube' },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer"
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-5 text-foreground relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { href: '/about', label: 'About Us' },
                                { href: '/programs', label: 'Programs' },
                                { href: '/trainers', label: 'Our Trainers' },
                                { href: '/membership', label: 'Membership Plans' },
                                { href: '/gallery', label: 'Gallery' },
                                { href: '/bmi-calculator', label: 'BMI Calculator' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h3 className="font-semibold mb-5 text-foreground relative inline-block">
                            Opening Hours
                            <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { day: 'Monday - Friday', hours: '5:00 AM - 11:00 PM' },
                                { day: 'Saturday', hours: '6:00 AM - 10:00 PM' },
                                { day: 'Sunday', hours: '7:00 AM - 8:00 PM' },
                                { day: 'Public Holidays', hours: '7:00 AM - 6:00 PM' },
                            ].map((schedule) => (
                                <li key={schedule.day} className="flex items-start gap-2 text-sm">
                                    <Clock className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                    <div>
                                        <span className="text-muted-foreground">{schedule.day}</span>
                                        <br />
                                        <span className="text-foreground font-medium">{schedule.hours}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-5 text-foreground relative inline-block">
                                Contact Us
                                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                    <span>Bolpur, West Bengal, India</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                    <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                                        +91 98765 43210
                                    </a>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                    <a href="mailto:info@asfitnesszone.com" className="hover:text-primary transition-colors">
                                        info@asfitnesszone.com
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="font-semibold mb-3 text-foreground">Stay Updated</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Get fitness tips and exclusive offers.
                            </p>
                            {subscribed ? (
                                <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 rounded-lg px-3 py-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Thanks for subscribing!
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="flex gap-2">
                                    <InputText
                                        type="email"
                                        placeholder="Your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-9 text-sm bg-muted/50"
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        className="h-9 bg-gradient-to-r from-red-500 to-orange-500 border-red-500 text-white"
                                        icon="pi pi-arrow-right"
                                    />
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border/40 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} As FitnessZone. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <Link href="/privacy" className="hover:text-primary transition-colors cursor-pointer">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-primary transition-colors cursor-pointer">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
