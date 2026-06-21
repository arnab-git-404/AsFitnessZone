'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dumbbell, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import DecorativeOrbs from '@/components/ui/DecorativeOrbs';

export default function LoginPage() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: 'Login successful!' });
                
                if (data.user.userType === 'admin') {
                    router.push('/admin/dashboard');
                } else if (data.user.userType === 'trainer') {
                    router.push('/trainer/dashboard');
                } else {
                    router.push('/user/dashboard');
                }
            } else {
                toastRef.current?.show({ severity: 'error', summary: 'Error', detail: data.error || 'Login failed' });
            }
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 p-4 overflow-hidden">
            <Toast ref={toastRef} />
            <DecorativeOrbs count={4} />
            
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="!border-border/50 backdrop-blur-sm shadow-xl shadow-red-500/5">
                    <div className="p-8 space-y-6">
                        <div className="space-y-4 text-center">
                            <motion.div
                                className="flex justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            >
                                <div className="rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-3 shadow-lg shadow-red-500/25">
                                    <Dumbbell className="h-8 w-8 text-white" />
                                </div>
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-bold">Welcome Back</h2>
                                <p className="text-sm text-muted-foreground">Sign in to your FitnessGym account</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                    <InputText
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your.email@example.com"
                                        className="w-full pl-10"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                                    <Link href="/forgot-password" className="text-xs text-primary hover:underline cursor-pointer">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                    <InputText
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-10"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-500 shadow-lg shadow-red-500/25"
                                    disabled={isLoading}
                                    label={isLoading ? 'Signing in...' : 'Sign In'}
                                />
                            </motion.div>
                        </form>

                        <motion.div
                            className="text-center text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span className="text-muted-foreground">Don&apos;t have an account? </span>
                            <Link href="/signup" className="text-primary hover:underline font-medium cursor-pointer">
                                Sign up
                            </Link>
                        </motion.div>

                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                ← Back to Home
                            </Link>
                        </motion.div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
