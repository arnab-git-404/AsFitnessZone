import Header from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

export const metadata = {
  title: "Certified Gym Trainers in Bolpur",
  description:
    "Meet certified fitness trainers at As FitnessZone, a leading unisex gym in Bolpur.",
}

export default function TrainersPage() {
    const trainers = [
        {
            name: 'John Martinez',
            title: 'Head Trainer & Strength Coach',
            image: '/trainers/trainer1.jpg',
            certifications: ['NASM-CPT', 'CSCS', 'Nutrition Specialist'],
            experience: '12 years',
            specializations: ['Strength Training', 'Powerlifting', 'Sports Performance'],
            bio: 'John has transformed hundreds of clients with his evidence-based approach to strength training and nutrition.',
        },
        {
            name: 'Sarah Williams',
            title: 'Yoga & Wellness Coach',
            image: '/trainers/trainer2.jpg',
            certifications: ['RYT-500', 'Wellness Coach', 'Meditation Instructor'],
            experience: '8 years',
            specializations: ['Yoga', 'Flexibility', 'Mindfulness', 'Recovery'],
            bio: 'Sarah brings a holistic approach to fitness, focusing on mind-body connection and sustainable wellness.',
        },
        {
            name: 'Mike Thompson',
            title: 'CrossFit & HIIT Specialist',
            image: '/trainers/trainer3.jpg',
            certifications: ['CrossFit L2', 'HIIT Certified', 'Olympic Lifting'],
            experience: '10 years',
            specializations: ['CrossFit', 'HIIT', 'Functional Fitness', 'Olympic Lifts'],
            bio: 'Mike\'s high-energy training style pushes athletes to reach their peak performance and beyond.',
        },
        {
            name: 'Emily Chen',
            title: 'Weight Loss & Nutrition Expert',
            image: '/trainers/trainer4.jpg',
            certifications: ['ACE-CPT', 'Precision Nutrition L2', 'Behavioral Change Specialist'],
            experience: '9 years',
            specializations: ['Fat Loss', 'Nutrition Coaching', 'Lifestyle Change'],
            bio: 'Emily specializes in sustainable weight loss through personalized nutrition and training programs.',
        },
        {
            name: 'David Rodriguez',
            title: 'Bodybuilding & Hypertrophy Coach',
            image: '/trainers/trainer5.jpg',
            certifications: ['IFBB Pro Coach', 'Sports Nutrition', 'Biomechanics'],
            experience: '15 years',
            specializations: ['Bodybuilding', 'Muscle Gain', 'Contest Prep'],
            bio: 'David has coached numerous competitive bodybuilders and helps clients achieve their muscle-building goals.',
        },
        {
            name: 'Lisa Anderson',
            title: 'Senior Fitness & Rehabilitation',
            image: '/trainers/trainer6.jpg',
            certifications: ['ACSM-CPT', 'Corrective Exercise', 'Senior Fitness'],
            experience: '11 years',
            specializations: ['Senior Fitness', 'Injury Prevention', 'Corrective Exercise'],
            bio: 'Lisa specializes in safe, effective training for older adults and post-rehabilitation clients.',
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
                                Meet Our <span className="text-primary">Expert Trainers</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Certified professionals dedicated to helping you achieve your fitness goals
                            </p>
                        </div>
                    </div>
                </section>

                {/* Trainers Grid */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {trainers.map((trainer, index) => (
                                <Card key={index} className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden">
                                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Award className="h-16 w-16 text-primary" />
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-semibold">{trainer.name}</h3>
                                            <p className="text-sm text-primary">{trainer.title}</p>
                                        </div>

                                        <p className="text-sm text-muted-foreground">{trainer.bio}</p>

                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">Experience: {trainer.experience}</div>

                                            <div>
                                                <div className="text-sm font-medium mb-2">Certifications:</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {trainer.certifications.map((cert, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                            {cert}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium mb-2">Specializations:</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {trainer.specializations.map((spec, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-xs">
                                                            {spec}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}
