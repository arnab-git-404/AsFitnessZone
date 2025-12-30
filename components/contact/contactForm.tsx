// 'use client';

// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { MapPin, Phone, Mail, Clock } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";

// export default function Contact() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await fetch("/api/leads", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         toast.success("Message sent successfully! We'll get back to you soon.");
//         setFormData({ name: "", email: "", phone: "", message: "" });
//       } else {
//         const data = await response.json();
//         toast.error(data.error || "Failed to send message");
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <section className="py-20">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
//           {/* Contact Form */}
//           <Card>
//             <CardContent className="p-8">
//               <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Name *</Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     placeholder="Your full name"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email *</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="your.email@example.com"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone</Label>
//                   <Input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="+1 (555) 123-4567"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="message">Message *</Label>
//                   <Textarea
//                     id="message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     placeholder="Tell us how we can help you..."
//                     rows={5}
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full bg-primary hover:bg-primary/90"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Sending..." : "Send Message"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Contact Info */}
//           <div className="space-y-8">
//             <div>
//               <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
//               <div className="space-y-6">
//                 <Card>
//                   <CardContent className="p-6 flex items-start space-x-4">
//                     <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
//                       <MapPin className="h-6 w-6 text-primary" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold mb-1">Address</h3>
//                       <p className="text-muted-foreground">
//                         123 Fitness Street
//                         <br />
//                         Gym City, GC 12345
//                         <br />
//                         United States
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardContent className="p-6 flex items-start space-x-4">
//                     <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
//                       <Phone className="h-6 w-6 text-primary" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold mb-1">Phone</h3>
//                       <p className="text-muted-foreground">
//                         +1 (555) 123-4567
//                         <br />
//                         +1 (555) 123-4568
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardContent className="p-6 flex items-start space-x-4">
//                     <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
//                       <Mail className="h-6 w-6 text-primary" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold mb-1">Email</h3>
//                       <p className="text-muted-foreground">
//                         info@fitnessgym.com
//                         <br />
//                         support@fitnessgym.com
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardContent className="p-6 flex items-start space-x-4">
//                     <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
//                       <Clock className="h-6 w-6 text-primary" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold mb-1">Hours</h3>
//                       <p className="text-muted-foreground">
//                         Monday - Friday: 5:00 AM - 11:00 PM
//                         <br />
//                         Saturday - Sunday: 6:00 AM - 10:00 PM
//                         <br />
//                         24/7 Access for Premium Members
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             {/* Map Placeholder */}
//             <Card>
//               <CardContent className="p-0 overflow-hidden">
//                 <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
//                   <div className="text-center space-y-2">
//                     <MapPin className="h-12 w-12 text-primary mx-auto" />
//                     <p className="text-sm text-muted-foreground">
//                       Google Maps integration
//                       <br />
//                       (Add your Google Maps embed here)
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(
            "Message sent successfully! We'll get back to you soon."
          );
          setFormData({ name: "", email: "", phone: "", message: "" });
        } else {
          toast.error(data.error || "Failed to send message");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Contact form error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
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
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Contact Form */}
          <Card>
            <CardContent className="">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  variant="custom"
                  className="hover:cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
