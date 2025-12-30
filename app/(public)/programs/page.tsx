import Header from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dumbbell, Heart, Zap, Target, Users, TrendingUp } from 'lucide-react';

export default function ProgramsPage() {
    const programs = [
        {
            icon: Dumbbell,
            title: 'Weight Training',
            description: 'Build strength and muscle with our comprehensive weight training programs',
            features: ['Free weights', 'Machine training', 'Progressive overload', 'Form coaching'],
            difficulty: 'All Levels',
            duration: 'Flexible',
        },
        {
            icon: Heart,
            title: 'Cardio Training',
            description: 'Improve cardiovascular health and endurance with varied cardio workouts',
            features: ['Treadmills', 'Ellipticals', 'Rowing machines', 'HIIT sessions'],
            difficulty: 'Beginner to Advanced',
            duration: '30-60 min',
        },
        {
            icon: Users,
            title: 'Personal Training',
            description: 'One-on-one coaching tailored to your specific goals and needs',
            features: ['Custom programs', 'Nutrition guidance', 'Progress tracking', 'Accountability'],
            difficulty: 'Personalized',
            duration: 'Custom',
        },
        {
            icon: TrendingUp,
            title: 'Fat Loss Program',
            description: 'Scientifically designed program to help you lose fat and keep it off',
            features: ['Calorie management', 'Metabolic training', 'Body composition tracking', 'Meal plans'],
            difficulty: 'All Levels',
            duration: '12 weeks',
        },
        {
            icon: Target,
            title: 'Muscle Gain',
            description: 'Structured hypertrophy program for maximum muscle growth',
            features: ['Hypertrophy focus', 'Supplement guidance', 'Recovery protocols', 'Strength tracking'],
            difficulty: 'Intermediate to Advanced',
            duration: '16 weeks',
        },
        {
            icon: Zap,
            title: 'Cross Training',
            description: 'High-intensity functional fitness for overall athletic performance',
            features: ['Functional movements', 'Olympic lifts', 'Gymnastics', 'Metabolic conditioning'],
            difficulty: 'Intermediate to Advanced',
            duration: '45-60 min',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-background via-background to-primary/10">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold">
                                Our <span className="text-primary">Programs</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Discover the perfect program to match your fitness goals and experience level
                            </p>
                        </div>
                    </div>
                </section>

                {/* Programs Grid */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {programs.map((program, index) => (
                                <Card key={index} className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <program.icon className="h-6 w-6 text-primary" />
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xl font-semibold">{program.title}</h3>
                                            <p className="text-muted-foreground text-sm">{program.description}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Badge variant="secondary">{program.difficulty}</Badge>
                                            <Badge variant="outline">{program.duration}</Badge>
                                        </div>

                                        <ul className="space-y-2">
                                            {program.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-sm text-muted-foreground">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <Link href="/signup">
                                            <Button className="w-full bg-primary hover:bg-primary/90">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Not Sure Which Program is Right for You?
                            </h2>
                            <p className="text-muted-foreground">
                                Book a free consultation with our expert trainers to find the perfect program for your goals
                            </p>
                            <Link href="/contact">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    Book Free Consultation
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}
