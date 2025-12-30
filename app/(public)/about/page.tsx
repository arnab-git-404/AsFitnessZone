
import { Card, CardContent } from '@/components/ui/card';
import { Target, Heart, Zap, Award } from 'lucide-react';

export const dynamic = "force-static";

export const metadata = {
  title: "About As FitnessZone",
  description:
    "Learn about As FitnessZone, a trusted unisex gym in Bolpur focused on fitness, safety and results.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-background via-background to-primary/10">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold">
                                About <span className="text-primary">FitnessGym</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                More than just a gym - we're a community dedicated to transforming lives through fitness
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                                <CardContent className="p-8 space-y-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Target className="h-6 w-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Our Mission</h2>
                                    <p className="text-muted-foreground">
                                        To empower individuals to achieve their fitness goals through expert guidance,
                                        state-of-the-art facilities, and a supportive community. We believe everyone
                                        deserves access to quality fitness resources and personalized attention.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                                <CardContent className="p-8 space-y-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Heart className="h-6 w-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Our Vision</h2>
                                    <p className="text-muted-foreground">
                                        To be the leading fitness destination that inspires healthier lifestyles and
                                        builds a stronger community. We envision a world where fitness is accessible,
                                        enjoyable, and transformative for everyone.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Training Philosophy */}
                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold">
                                    Our Training <span className="text-primary">Philosophy</span>
                                </h2>
                                <p className="text-muted-foreground">
                                    We believe in a holistic approach to fitness that combines science,
                                    dedication, and personalization
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        icon: Zap,
                                        title: 'Progressive Training',
                                        description: 'Gradual intensity increase for sustainable results',
                                    },
                                    {
                                        icon: Heart,
                                        title: 'Holistic Wellness',
                                        description: 'Focus on physical, mental, and emotional health',
                                    },
                                    {
                                        icon: Award,
                                        title: 'Evidence-Based',
                                        description: 'Programs backed by sports science research',
                                    },
                                ].map((item, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-6 text-center space-y-4">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                                                <item.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <h3 className="text-xl font-semibold">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Infrastructure */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold">
                                    World-Class <span className="text-primary">Infrastructure</span>
                                </h2>
                                <p className="text-muted-foreground">
                                    Our facility is equipped with everything you need for your fitness journey
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: '10,000 sq ft Training Area',
                                        description: 'Spacious workout zones for cardio, strength, and functional training',
                                    },
                                    {
                                        title: 'Premium Equipment',
                                        description: 'Latest machines from top brands like Technogym and Life Fitness',
                                    },
                                    {
                                        title: 'Dedicated Zones',
                                        description: 'Separate areas for CrossFit, yoga, spinning, and group classes',
                                    },
                                    {
                                        title: 'Modern Amenities',
                                        description: 'Clean locker rooms, showers, sauna, and relaxation areas',
                                    },
                                ].map((item, index) => (
                                    <Card key={index} className="hover:border-primary/50 transition-colors">
                                        <CardContent className="p-6 space-y-2">
                                            <h3 className="text-lg font-semibold">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}
