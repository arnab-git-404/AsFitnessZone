"use client";

import React, { useState, useCallback, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

export default function ContactForm() {
  const toastRef = useRef<Toast>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const currentData = formDataRef.current;

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentData),
        });

        const data = await response.json();

        if (response.ok) {
          toastRef.current?.show({ severity: "success", summary: "Success", detail: "Message sent successfully! We'll get back to you soon." });
          setFormData({ name: "", email: "", phone: "", message: "" });
        } else {
          toastRef.current?.show({ severity: "error", summary: "Error", detail: data.error || "Failed to send message" });
        }
      } catch (error) {
        toastRef.current?.show({ severity: "error", summary: "Error", detail: "Something went wrong. Please try again." });
        console.error("Contact form error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  return (
    <section className="pb-10">
      <Toast ref={toastRef} />
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="!border-border/50">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name *</label>
                  <InputText
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email *</label>
                  <InputText
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <InputText
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message *</label>
                  <InputTextarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-500"
                  disabled={isSubmitting}
                  label={isSubmitting ? "Sending..." : "Send Message"}
                />
              </form>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
