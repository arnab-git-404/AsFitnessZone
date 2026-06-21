"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";

// Background images for carousel
const HERO_IMAGES = ["/As Fitness.jpeg"];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen pt-10">
      {/* Background Images Carousel */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt='As FitnessZone Gym'
              fill
              priority={index === 0}
              quality={90}
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 z-10"></div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 min-h-screen flex items-center py-20">
        <div className="max-w-4xl ">
          {/* Badge */}

          <div className="inline-block animate-fade-in ">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-bg-gradient-to-r from-red-500 to-orange-500">
              <Star className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
              <p className="text-orange-500"> #1 Rated Gym in the City</p>
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white animate-fade-in-up leading-tight">
            Transform Your Body,{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent block sm:inline mt-2 sm:mt-0">
              Transform Your Life
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl animate-fade-in-up animation-delay-200 leading-relaxed">
            Join FitnessGym and experience world-class training,
            state-of-the-art equipment, and a community that pushes you to
            achieve your fitness goals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animation-delay-400 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/membership" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full hover:cursor-pointer sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                View Plans
              </Button>
            </Link>
          </div>

          {/* Carousel Indicators */}
          {HERO_IMAGES.length > 1 && (
            <div className="flex gap-2 pt-6 animate-fade-in-up animation-delay-600">
              {HERO_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "w-6 sm:w-8 bg-primary"
                      : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
