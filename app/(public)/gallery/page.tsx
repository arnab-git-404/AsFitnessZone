'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Image, Video, Camera, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import DecorativeOrbs from '@/components/ui/DecorativeOrbs';

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState('all');

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
                <section className="relative py-28 overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
                    <DecorativeOrbs count={3} />
                    <div className="container mx-auto px-4 relative z-10">
                        <Reveal>
                            <div className="max-w-3xl mx-auto text-center space-y-6">
                                <motion.div
                                    className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-2"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Camera className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-primary">Our Facility</span>
                                </motion.div>
                                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                    Our{' '}
                                    <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                        Gallery
                                    </span>
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    Explore our state-of-the-art facility, equipment, and community in action
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="relative py-24 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <Reveal>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
                                <div className="flex justify-center">
                                    <TabsList className="grid w-full max-w-md grid-cols-4 bg-card border border-border/50 p-1 rounded-xl">
                                        <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all">All</TabsTrigger>
                                        <TabsTrigger value="equipment" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all">Equipment</TabsTrigger>
                                        <TabsTrigger value="training" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all">Training</TabsTrigger>
                                        <TabsTrigger value="facility" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all">Facility</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value={activeTab} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredItems.map((item, index) => (
                                            <Reveal key={index} delay={index * 0.05} direction="up">
                                                <motion.div
                                                    whileHover={{ scale: 1.03 }}
                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                >
                                                    <Card className="group overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10">
                                                        <div className="aspect-square bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 relative overflow-hidden">
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                {item.type === 'image' ? (
                                                                    <motion.div
                                                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                                                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center"
                                                                    >
                                                                        <Image className="h-10 w-10 text-primary/60" />
                                                                    </motion.div>
                                                                ) : (
                                                                    <motion.div
                                                                        whileHover={{ rotate: -10, scale: 1.1 }}
                                                                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center"
                                                                    >
                                                                        <Video className="h-10 w-10 text-primary/60" />
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                                                <span className="text-xs text-white/80 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full capitalize">
                                                                    {item.category} · {item.type}
                                                                </span>
                                                            </div>
                                                            {/* Corner accent */}
                                                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            </Reveal>
                                        ))}
                                    </div>

                                    {filteredItems.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-20"
                                        >
                                            <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                            <p className="text-lg text-muted-foreground">No items found in this category</p>
                                        </motion.div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </Reveal>
                    </div>
                </section>

                {/* Note Section */}
                <section className="relative py-16 bg-card overflow-hidden">
                    <DecorativeOrbs count={1} />
                    <div className="container mx-auto px-4 relative z-10">
                        <Reveal>
                            <div className="max-w-2xl mx-auto text-center">
                                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3">
                                    <Camera className="h-4 w-4 text-primary" />
                                    <span>
                                        Gallery images and videos are managed by administrators through the admin panel.
                                        All media is optimized via Cloudinary for best performance.
                                    </span>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>
            </main>
        </div>
    );
}
