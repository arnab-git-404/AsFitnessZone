'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isReset, setIsReset] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsReset(true);
                toast.success('Password reset successfully!');
            } else {
                toast.error(data.error || 'Failed to reset password');
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isReset) {
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
                            <CardTitle className="text-2xl">Password Reset!</CardTitle>
                            <CardDescription>
                                Your password has been changed successfully.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-green-500/20 p-4">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            You can now log in with your new password.
                        </p>
                        <Link href="/login">
                            <Button className="w-full bg-primary hover:bg-primary/90">
                                Go to Login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                        <CardTitle className="text-2xl">Set New Password</CardTitle>
                        <CardDescription>
                            Enter your new password below
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="At least 6 characters"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Re-enter your password"
                                disabled={isLoading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                'Resetting...'
                            ) : (
                                <>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Reset Password
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            <ArrowLeft className="h-4 w-4 inline mr-1" />
                            Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
