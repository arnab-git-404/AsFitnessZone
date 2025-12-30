import React from "react";
import { Card, CardContent } from "../ui/card";
import { Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-br from-primary to-red-600 border-none text-white">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Fitness Journey?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join FitnessGym today and get your first month at 50% off. Limited
              time offer for new members!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Join Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-transparent text-white border-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              {["No Joining Fee", "Cancel Anytime", "Free Consultation"].map(
                (benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{benefit}</span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
