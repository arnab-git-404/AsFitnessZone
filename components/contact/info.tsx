"use client";

import React, { memo, useCallback } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
  }: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    delay?: number;
    onClick?: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className=" hover:scale-105 bg-card border border-border rounded-lg p-4 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20"
        >
          <Icon className="h-5 w-5 text-primary" />
        </motion.div>
        <h3 className="font-semibold group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
      <div className="text-sm text-muted-foreground ml-13">{children}</div>
    </motion.div>
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
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* <motion.h2
          className="text-2xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Contact <span className="text-primary">Information</span>
        </motion.h2> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {/* Address */}
          <ContactInfoItem
            icon={MapPin}
            title="Address"
            delay={0.1}
            onClick={openMap}
          >
            {CONTACT_INFO.address.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </ContactInfoItem>

          {/* Phone */}
          <ContactInfoItem icon={Phone} title="Phone" delay={0.2}>
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
          <ContactInfoItem icon={Mail} title="Email" delay={0.3}>
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
          <ContactInfoItem icon={Clock} title="Hours" delay={0.4}>
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
