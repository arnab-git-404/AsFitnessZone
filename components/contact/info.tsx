"use client";

import React, { memo, useCallback } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

/* ----------------------------------
   Static Contact Information
---------------------------------- */
const CONTACT_INFO = {
  address: ["123 Fitness Street", "Gym City, GC 12345", "United States"],
  phones: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
  emails: ["info@fitnessgym.com", "support@fitnessgym.com"],
  hours: [
    "Monday - Friday: 5:00 AM - 11:00 PM",
    "Saturday - Sunday: 6:00 AM - 10:00 PM",
  ],
};

/* ----------------------------------
   Contact Item
---------------------------------- */
const ContactInfoItem = memo(
  ({
    icon: Icon,
    title,
    children,
    delay = 0,
    onClick,
    gradient,
  }: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    delay?: number;
    onClick?: () => void;
    gradient: string;
  }) => (
    <Reveal delay={delay} direction="up">
      <motion.div
        onClick={onClick}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-card border border-border/50 rounded-xl p-5 hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-1 ml-16">
          {children}
        </div>
      </motion.div>
    </Reveal>
  )
);

ContactInfoItem.displayName = "ContactInfoItem";

/* ----------------------------------
   Main Component
---------------------------------- */
export default function ContactInfo() {
    
  const openMap = useCallback(() => {
    const address = CONTACT_INFO.address.join(", ");
    window.open(
      `https://maps.google.com/?q=${encodeURIComponent(address)}`,
      "_blank"
    );
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {/* Address */}
          <ContactInfoItem
            icon={MapPin}
            title="Address"
            delay={0.1}
            onClick={openMap}
            gradient="from-red-500 to-orange-500"
          >
            {CONTACT_INFO.address.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </ContactInfoItem>

          {/* Phone */}
          <ContactInfoItem icon={Phone} title="Phone" delay={0.2} gradient="from-orange-500 to-yellow-500">
            {CONTACT_INFO.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="block hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {phone}
              </a>
            ))}
          </ContactInfoItem>

          {/* Email */}
          <ContactInfoItem icon={Mail} title="Email" delay={0.3} gradient="from-red-600 to-red-400">
            {CONTACT_INFO.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="block hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {email}
              </a>
            ))}
          </ContactInfoItem>

          {/* Hours */}
          <ContactInfoItem icon={Clock} title="Hours" delay={0.4} gradient="from-orange-600 to-red-500">
            {CONTACT_INFO.hours.map((hour, i) => (
              <div key={i} className="mb-1">
                {hour}
              </div>
            ))}
          </ContactInfoItem>
        </div>
      </div>
    </section>
  );
}
