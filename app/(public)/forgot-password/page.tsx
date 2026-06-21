'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSent(true);
            } else {
                toast.error(data.error || 'Something went wrong');
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <div className="rounded-lg bg-primary p-3">
                            <Dumbbell className="h-8 w-8 text-primary-foreground" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Forgot Password</CardTitle>
                        <CardDescription>
                            {isSent
                                ? 'Check your email for the reset link'
                                : 'Enter your email and we\'ll send you a reset link'}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {isSent ? (
                        <div className="space-y-6 text-center">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-green-500/20 p-4">
                                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                If an account exists with that email, you'll receive a password reset link shortly. 
                                Please check your inbox (and spam folder).
                            </p>
                            <Link href="/login">
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your.email@example.com"
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Reset Link
                                    </>
                                )}
                            </Button>
                        </form>
                    )}

                    {!isSent && (
                        <div className="mt-6 text-center text-sm">
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                <ArrowLeft className="h-4 w-4 inline mr-1" />
                                Back to Login
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
