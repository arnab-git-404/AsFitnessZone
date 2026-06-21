'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Dumbbell, Users, MessageSquare, Image as ImageIcon, LogOut, LayoutDashboard, UserCog, Plus, Pencil, Trash2, Video, CalendarCheck, Activity } from 'lucide-react';
import { toast } from 'sonner';
import type { UserResponse, MediaResponse } from '@/lib/types';

interface MediaForm {
  type: string;
  url: string;
  publicId: string;
  category: string;
}

const emptyForm: MediaForm = { type: 'image', url: '', publicId: '', category: 'general' };

export default function AdminGallery() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [mediaItems, setMediaItems] = useState<MediaResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<MediaForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchUser();
        fetchMedia();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                if (data.user.userType !== 'admin') { router.push('/user/dashboard'); return; }
                setUser(data.user);
            } else { router.push('/login'); }
        } catch { router.push('/login'); }
        finally { setIsLoading(false); }
    };

    const fetchMedia = async () => {
        try {
            const response = await fetch('/api/admin/gallery');
            if (response.ok) {
                const data = await response.json();
                setMediaItems(data.mediaItems);
            }
        } catch { toast.error('Failed to fetch media'); }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Logged out successfully');
        router.push('/');
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const openEdit = (media: MediaResponse) => {
        setEditingId(media._id);
        setForm({ type: media.type, url: media.url, publicId: media.publicId, category: media.category });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.url || !form.publicId) {
            toast.error('URL and public ID are required');
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(
                editingId ? `/api/admin/gallery/${editingId}` : '/api/admin/gallery',
                {
                    method: editingId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                }
            );

            if (response.ok) {
                toast.success(editingId ? 'Media updated' : 'Media added');
                setDialogOpen(false);
                fetchMedia();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to save');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this media? This will also remove it from Cloudinary.')) return;

        try {
            const response = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Media deleted');
                fetchMedia();
            } else { toast.error('Failed to delete'); }
        } catch { toast.error('Something went wrong'); }
    };

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
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="rounded-lg bg-primary p-2"><Dumbbell className="h-6 w-6 text-primary-foreground" /></div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">FitnessGym Admin</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">Admin: {user?.customer?.name || user?.email}</span>
                        <Button variant="ghost" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)]">
                    <nav className="p-4 space-y-2">
                        <Link href="/admin/dashboard"><Button variant="ghost" className="w-full justify-start"><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</Button></Link>
                        <Link href="/admin/users"><Button variant="ghost" className="w-full justify-start"><Users className="h-4 w-4 mr-2" />Users</Button></Link>
                        <Link href="/admin/leads"><Button variant="ghost" className="w-full justify-start"><MessageSquare className="h-4 w-4 mr-2" />Leads</Button></Link>
                        <Link href="/admin/programs"><Button variant="ghost" className="w-full justify-start"><Dumbbell className="h-4 w-4 mr-2" />Programs</Button></Link>
                        <Link href="/admin/trainers"><Button variant="ghost" className="w-full justify-start"><UserCog className="h-4 w-4 mr-2" />Trainers</Button></Link>
                        <Link href="/admin/gallery"><Button variant="default" className="w-full justify-start bg-primary"><ImageIcon className="h-4 w-4 mr-2" />Gallery</Button></Link>
                        <Link href="/admin/activity-logs"><Button variant="ghost" className="w-full justify-start"><Activity className="h-4 w-4 mr-2" />Activity Logs</Button></Link>
                        <Link href="/admin/attendance"><Button variant="ghost" className="w-full justify-start"><CalendarCheck className="h-4 w-4 mr-2" />Attendance</Button></Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Gallery <span className="text-primary">Management</span></h1>
                                <p className="text-muted-foreground">Manage images and videos for the public gallery</p>
                            </div>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
                                        <Plus className="h-4 w-4 mr-2" />Add Media
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>{editingId ? 'Edit Media' : 'Add Media'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Type</Label>
                                            <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="image">Image</SelectItem>
                                                    <SelectItem value="video">Video</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="url">Media URL *</Label>
                                            <Input id="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://res.cloudinary.com/..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="publicId">Cloudinary Public ID *</Label>
                                            <Input id="publicId" value={form.publicId} onChange={e => setForm({...form, publicId: e.target.value})} placeholder="fitnessgym/profiles/abc123" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="equipment">Equipment</SelectItem>
                                                    <SelectItem value="training">Training</SelectItem>
                                                    <SelectItem value="facility">Facility</SelectItem>
                                                    <SelectItem value="general">General</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={isSaving}>
                                                {isSaving ? 'Saving...' : editingId ? 'Update' : 'Add'}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Card>
                            <CardHeader><div className="text-sm text-muted-foreground">Total Media: {mediaItems.length}</div></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Preview</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>URL</TableHead>
                                            <TableHead>Uploaded By</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="w-24">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mediaItems.length === 0 ? (
                                            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No media found. Click "Add Media" to upload one.</TableCell></TableRow>
                                        ) : (
                                            mediaItems.map((media) => (
                                                <TableRow key={media._id}>
                                                    <TableCell>
                                                        {media.type === 'image' ? (
                                                            <ImageIcon className="h-8 w-8 text-primary/50" />
                                                        ) : (
                                                            <Video className="h-8 w-8 text-primary/50" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell><Badge variant="outline" className="capitalize">{media.type}</Badge></TableCell>
                                                    <TableCell className="capitalize">{media.category}</TableCell>
                                                    <TableCell className="max-w-[200px] truncate text-xs">{media.url}</TableCell>
                                                    <TableCell className="text-sm">Admin</TableCell>
                                                    <TableCell>{new Date(media.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => openEdit(media)}><Pencil className="h-4 w-4" /></Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(media._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                        </div>
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
