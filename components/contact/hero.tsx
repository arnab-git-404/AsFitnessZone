import React from "react";

export default function Hero() {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Have questions? We're here to help you start your fitness journey
          </p>
        </div>
      </div>
    </section>
  );
}
