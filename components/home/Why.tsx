import React from "react";
import {
  Dumbbell,
  Target,
  Users,
  Trophy,
  Clock,
  Heart,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function Why() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">FitnessGym</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide everything you need to reach your fitness goals and
            beyond
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Dumbbell,
              title: "Modern Equipment",
              description:
                "State-of-the-art machines and free weights for all fitness levels",
            },
            {
              icon: Users,
              title: "Expert Trainers",
              description: "Certified professionals dedicated to your success",
            },
            {
              icon: Target,
              title: "Personalized Programs",
              description:
                "Custom workout plans tailored to your specific goals",
            },
            {
              icon: Clock,
              title: "24/7 Access",
              description:
                "Work out on your schedule with round-the-clock availability",
            },
            {
              icon: Heart,
              title: "Supportive Community",
              description:
                "Join a motivating environment of like-minded individuals",
            },
            {
              icon: Trophy,
              title: "Proven Results",
              description:
                "Track your progress and celebrate your achievements",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
