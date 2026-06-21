'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Users, LogOut, LayoutDashboard, Search, UserPlus, CalendarCheck, MessageSquare, Image as ImageIcon, UserCog, Activity } from 'lucide-react';
import { toast } from 'sonner';
import type { UserResponse } from '@/lib/types';

export default function AdminUsers() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUser();
        fetchUsers();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                if (data.user.userType !== 'admin') {
                    router.push('/user/dashboard');
                    return;
                }
                setUser(data.user);
            } else {
                router.push('/login');
            }
        } catch (error) {
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            toast.success('Logged out successfully');
            router.push('/');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const filteredUsers = users.filter(u =>
        (u.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Dumbbell className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="rounded-lg bg-primary p-2">
                            <Dumbbell className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
                            FitnessGym Admin
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">Admin: {user?.customer?.name || user?.email}</span>
                        <Button variant="ghost" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)]">
                    <nav className="p-4 space-y-2">
                        <Link href="/admin/dashboard">
                            <Button variant="ghost" className="w-full justify-start">
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/admin/users">
                            <Button variant="default" className="w-full justify-start bg-primary">
                                <Users className="h-4 w-4 mr-2" />
                                Users
                            </Button>
                        </Link>
                        <Link href="/admin/leads">
                            <Button variant="ghost" className="w-full justify-start">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Leads
                            </Button>
                        </Link>
                        <Link href="/admin/programs">
                            <Button variant="ghost" className="w-full justify-start">
                                <Dumbbell className="h-4 w-4 mr-2" />
                                Programs
                            </Button>
                        </Link>
                        <Link href="/admin/trainers">
                            <Button variant="ghost" className="w-full justify-start">
                                <UserCog className="h-4 w-4 mr-2" />
                                Trainers
                            </Button>
                        </Link>
                        <Link href="/admin/trainer-assignments">
                            <Button variant="ghost" className="w-full justify-start">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Trainer Assign
                            </Button>
                        </Link>
                        <Link href="/admin/gallery">
                            <Button variant="ghost" className="w-full justify-start">
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Gallery
                            </Button>
                        </Link>
                        <Link href="/admin/activity-logs">
                            <Button variant="ghost" className="w-full justify-start">
                                <Activity className="h-4 w-4 mr-2" />
                                Activity Logs
                            </Button>
                        </Link>
                        <Link href="/admin/attendance">
                            <Button variant="ghost" className="w-full justify-start">
                                <CalendarCheck className="h-4 w-4 mr-2" />
                                Attendance
                            </Button>
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    User <span className="text-primary">Management</span>
                                </h1>
                                <p className="text-muted-foreground">
                                    View and manage all gym members
                                </p>
                            </div>
                            <Button className="bg-primary hover:bg-primary/90">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add User
                            </Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search users by name or email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Fitness Goal</TableHead>
                                            <TableHead>User Type</TableHead>
                                            <TableHead>Joined</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                    No users found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((u) => (
                                                <TableRow key={u._id}>
                                                    <TableCell className="font-medium">{u.customer?.name || 'N/A'}</TableCell>
                                                    <TableCell>{u.email}</TableCell>
                                                    <TableCell>{u.customer?.phone || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        {u.customer?.fitnessGoal ? (
                                                            <Badge variant="secondary" className="capitalize">
                                                                {u.customer.fitnessGoal.replace('-', ' ')}
                                                            </Badge>
                                                        ) : (
                                                            'Not set'
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={u.userType === 'admin' ? 'default' : u.userType === 'trainer' ? 'secondary' : 'outline'}>
                                                            {u.userType === 'gymMember' ? 'Member' : u.userType === 'trainer' ? 'Trainer' : 'Admin'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
