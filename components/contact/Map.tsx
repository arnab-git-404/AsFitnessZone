import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Map() {
  return (
    <div className=" px-4 py-10">
      <div className="relative h-72 max-w-5xl mx-auto bg-muted rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3639.909214153586!2d87.7890582!3d24.1749165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fa1fe039f130fb%3A0x99ffb19a0da24778!2sThe%20Atmosphere!5e0!3m2!1sen!2sin!4v1766264845638!5m2!1sen!2sin"
          width="100%"
          height="100%"
          //   style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="AsFitness Bolpur Location"
        />
      </div>
    </div>
  );
}
