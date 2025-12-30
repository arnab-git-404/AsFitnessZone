'use client';

import Header from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Image, Video } from 'lucide-react';

export const metadata = {
  title: "Gym Photos & Videos",
  description:
    "View photos and videos of As FitnessZone, a modern unisex gym in Bolpur.",
};

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState('all');

    // Placeholder gallery items - in production, these would come from the database
    const galleryItems = [
        { type: 'image', category: 'equipment', url: '/gallery/equipment1.jpg' },
        { type: 'image', category: 'equipment', url: '/gallery/equipment2.jpg' },
        { type: 'image', category: 'training', url: '/gallery/training1.jpg' },
        { type: 'image', category: 'training', url: '/gallery/training2.jpg' },
        { type: 'image', category: 'facility', url: '/gallery/facility1.jpg' },
        { type: 'image', category: 'facility', url: '/gallery/facility2.jpg' },
        { type: 'video', category: 'training', url: '/gallery/workout1.mp4' },
        { type: 'video', category: 'training', url: '/gallery/workout2.mp4' },
    ];

    const filteredItems = activeTab === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeTab);

    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-background via-background to-primary/10">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold">
                                Our <span className="text-primary">Gallery</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Explore our state-of-the-art facility, equipment, and community in action
                            </p>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                                <TabsTrigger value="training">Training</TabsTrigger>
                                <TabsTrigger value="facility">Facility</TabsTrigger>
                            </TabsList>

                            <TabsContent value={activeTab} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredItems.map((item, index) => (
                                        <Card key={index} className="group overflow-hidden cursor-pointer hover:border-primary/50 transition-all">
                                            <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    {item.type === 'image' ? (
                                                        <Image className="h-16 w-16 text-primary/50" />
                                                    ) : (
                                                        <Video className="h-16 w-16 text-primary/50" />
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {filteredItems.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No items found in this category
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>

                {/* Note Section */}
                <section className="py-12 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto text-center text-sm text-muted-foreground">
                            <p>
                                Note: Gallery images and videos will be managed by administrators through the admin panel.
                                All media is optimized and delivered via Cloudinary for the best performance.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}
