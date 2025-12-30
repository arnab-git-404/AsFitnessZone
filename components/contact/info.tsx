// // import React from "react";

// // import { MapPin, Phone, Mail, Clock } from "lucide-react";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { memo } from "react";

// // // Static contact information
// // const CONTACT_INFO = {
// //   address: ["123 Fitness Street", "Gym City, GC 12345", "United States"],
// //   phones: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
// //   emails: ["info@fitnessgym.com", "support@fitnessgym.com"],
// //   hours: [
// //     "Monday - Friday: 5:00 AM - 11:00 PM",
// //     "Saturday - Sunday: 6:00 AM - 10:00 PM",
// //     "24/7 Access for Premium Members",
// //   ],
// // };
// // // Memoized contact info items to prevent re-renders
// // const ContactInfoItem = memo(
// //   ({
// //     icon: Icon,
// //     title,
// //     children,
// //   }: {
// //     icon: React.ElementType;
// //     title: string;
// //     children: React.ReactNode;
// //   }) => (
// //     <Card>
// //       <CardContent className="p-6 flex items-start space-x-4">
// //         <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
// //           <Icon className="h-6 w-6 text-primary" />
// //         </div>
// //         <div>
// //           <h3 className="font-semibold mb-1">{title}</h3>
// //           <div className="text-muted-foreground">{children}</div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   )
// // );
// // ContactInfoItem.displayName = "ContactInfoItem";

// // export default function ContactInfo() {
// //   return (
// //     <div className="space-y-8">
// //       <div>
// //         <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
// //         <div className="space-y-6">
// //           <ContactInfoItem icon={MapPin} title="Address">
// //             {CONTACT_INFO.address.map((line, i) => (
// //               <React.Fragment key={i}>
// //                 {line}
// //                 {i < CONTACT_INFO.address.length - 1 && <br />}
// //               </React.Fragment>
// //             ))}
// //           </ContactInfoItem>

// //           <ContactInfoItem icon={Phone} title="Phone">
// //             {CONTACT_INFO.phones.map((phone, i) => (
// //               <React.Fragment key={i}>
// //                 {phone}
// //                 {i < CONTACT_INFO.phones.length - 1 && <br />}
// //               </React.Fragment>
// //             ))}
// //           </ContactInfoItem>

// //           <ContactInfoItem icon={Mail} title="Email">
// //             {CONTACT_INFO.emails.map((email, i) => (
// //               <React.Fragment key={i}>
// //                 {email}
// //                 {i < CONTACT_INFO.emails.length - 1 && <br />}
// //               </React.Fragment>
// //             ))}
// //           </ContactInfoItem>

// //           <ContactInfoItem icon={Clock} title="Hours">
// //             {CONTACT_INFO.hours.map((hour, i) => (
// //               <React.Fragment key={i}>
// //                 {hour}
// //                 {i < CONTACT_INFO.hours.length - 1 && <br />}
// //               </React.Fragment>
// //             ))}
// //           </ContactInfoItem>
// //         </div>
// //       </div>

// //       {/* Map Placeholder */}
// //       <Card>
// //         <CardContent className="p-0 overflow-hidden">
// //           <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
// //             <div className="text-center space-y-2">
// //               <MapPin className="h-12 w-12 text-primary mx-auto" />
// //               <p className="text-sm text-muted-foreground">
// //                 Google Maps integration
// //                 <br />
// //                 (Add your Google Maps embed here)
// //               </p>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }

// // "use client";

// // import React from 'react';
// // import { MapPin, Phone, Mail, Clock } from 'lucide-react';
// // import { Card, CardContent } from '@/components/ui/card';
// // import { memo } from 'react';
// // import { motion } from 'framer-motion';

// // // Static contact information
// // const CONTACT_INFO = {
// //   address: ["123 Fitness Street", "Gym City, GC 12345", "United States"],
// //   phones: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
// //   emails: ["info@fitnessgym.com", "support@fitnessgym.com"],
// //   hours: [
// //     "Monday - Friday: 5:00 AM - 11:00 PM",
// //     "Saturday - Sunday: 6:00 AM - 10:00 PM",
// //     "24/7 Access for Premium Members"
// //   ]
// // };

// // // Memoized contact info items with animations
// // const ContactInfoItem = memo(({
// //   icon: Icon,
// //   title,
// //   children,
// //   delay = 0
// // }: {
// //   icon: React.ElementType;
// //   title: string;
// //   children: React.ReactNode;
// //   delay?: number;
// // }) => (
// //   <motion.div
// //     initial={{ opacity: 0, x: -20 }}
// //     whileInView={{ opacity: 1, x: 0 }}
// //     viewport={{ once: true }}
// //     transition={{ duration: 0.5, delay }}
// //   >
// //     <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
// //       <CardContent className="p-6 flex items-start space-x-4">
// //         <motion.div
// //           className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
// //           whileHover={{ scale: 1.1 }}
// //           transition={{ type: "spring", stiffness: 400 }}
// //         >
// //           <Icon className="h-6 w-6 text-primary" />
// //         </motion.div>
// //         <div className="flex-1">
// //           <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
// //           <div className="text-muted-foreground text-sm">{children}</div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   </motion.div>
// // ));

// // ContactInfoItem.displayName = "ContactInfoItem";

// // export default function ContactInfo() {
// //   const handlePhoneClick = (phone: string) => {
// //     window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
// //   };

// //   const handleEmailClick = (email: string) => {
// //     window.location.href = `mailto:${email}`;
// //   };

// //   const handleAddressClick = () => {
// //     const address = CONTACT_INFO.address.join(', ');
// //     window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
// //   };

// //   return (
// //     <div className="space-y-8">
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         whileInView={{ opacity: 1, y: 0 }}
// //         viewport={{ once: true }}
// //         transition={{ duration: 0.5 }}
// //       >
// //         <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
// //         <div className="space-y-4">
// //           <div onClick={handleAddressClick}>
// //             <ContactInfoItem icon={MapPin} title="Address" delay={0.1}>
// //               {CONTACT_INFO.address.map((line, i) => (
// //                 <React.Fragment key={i}>
// //                   {line}
// //                   {i < CONTACT_INFO.address.length - 1 && <br />}
// //                 </React.Fragment>
// //               ))}
// //             </ContactInfoItem>
// //           </div>

// //           <ContactInfoItem icon={Phone} title="Phone" delay={0.2}>
// //             {CONTACT_INFO.phones.map((phone, i) => (
// //               <React.Fragment key={i}>
// //                 <a
// //                   href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
// //                   className="hover:text-primary transition-colors block"
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     handlePhoneClick(phone);
// //                   }}
// //                 >
// //                   {phone}
// //                 </a>
// //                 {i < CONTACT_INFO.phones.length - 1 && <br />}
// //               </React.Fragment>
// //             ))}
// //           </ContactInfoItem>

// //           <ContactInfoItem icon={Mail} title="Email" delay={0.3}>
// //             {CONTACT_INFO.emails.map((email, i) => (
// //               <React.Fragment key={i}>
// //                 <a
// //                   href={`mailto:${email}`}
// //                   className="hover:text-primary transition-colors block"
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     handleEmailClick(email);
// //                   }}
// //                 >
// //                   {email}
// //                 </a>
// //                 {i < CONTACT_INFO.emails.length - 1 && <br />}
// //               </React.Fragment>
// //             ))}
// //           </ContactInfoItem>

// //           <ContactInfoItem icon={Clock} title="Hours" delay={0.4}>
// //             {CONTACT_INFO.hours.map((hour, i) => (
// //               <React.Fragment key={i}>
// //                 {hour}
// //                 {i < CONTACT_INFO.hours.length - 1 && <br />}
// //               </React.Fragment>
// //             ))}
// //           </ContactInfoItem>
// //         </div>
// //       </motion.div>

// //       {/* Map */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         whileInView={{ opacity: 1, y: 0 }}
// //         viewport={{ once: true }}
// //         transition={{ duration: 0.5, delay: 0.5 }}
// //       >
// //         <Card className="overflow-hidden hover:shadow-xl transition-shadow">
// //           <CardContent className="p-0">
// //             <div
// //               className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center cursor-pointer group"
// //               onClick={handleAddressClick}
// //             >
// //               <div className="text-center space-y-2">
// //                 <motion.div
// //                   whileHover={{ scale: 1.2 }}
// //                   transition={{ type: "spring", stiffness: 400 }}
// //                 >
// //                   <MapPin className="h-12 w-12 text-primary mx-auto" />
// //                 </motion.div>
// //                 <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
// //                   Click to view on Google Maps
// //                   <br />
// //                   <span className="text-xs">(Opens in new tab)</span>
// //                 </p>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </motion.div>
// //     </div>
// //   );
// // }

// "use client";

// import React, { memo, useCallback } from "react";
// import { MapPin, Phone, Mail, Clock } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { motion } from "framer-motion";

// /* ----------------------------------
//    Static Contact Information
// ---------------------------------- */
// const CONTACT_INFO = {
//   address: ["123 Fitness Street", "Gym City, GC 12345", "United States"],
//   phones: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
//   emails: ["info@fitnessgym.com", "support@fitnessgym.com"],
//   hours: [
//     "Monday - Friday: 5:00 AM - 11:00 PM",
//     "Saturday - Sunday: 6:00 AM - 10:00 PM",
//     "24/7 Access for Premium Members",
//   ],
// };

// /* ----------------------------------
//    Contact Item
// ---------------------------------- */
// const ContactInfoItem = memo(
//   ({
//     icon: Icon,
//     title,
//     children,
//     delay = 0,
//   }: {
//     icon: React.ElementType;
//     title: string;
//     children: React.ReactNode;
//     delay?: number;
//   }) => (
//     <motion.div
//       initial={{ opacity: 0, x: -16 }}
//       whileInView={{ opacity: 1, x: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.4, delay }}
//     >
//       <Card className="group hover:shadow-lg transition-shadow">
//         <CardContent className="p-6 flex gap-4">
//           <motion.div
//             whileHover={{ scale: 1.1 }}
//             transition={{ type: "spring", stiffness: 300 }}
//             className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20"
//           >
//             <Icon className="h-6 w-6 text-primary" />
//           </motion.div>

//           <div>
//             <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
//               {title}
//             </h3>
//             <div className="text-sm text-muted-foreground">{children}</div>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// );

// ContactInfoItem.displayName = "ContactInfoItem";

// /* ----------------------------------
//    Main Component
// ---------------------------------- */
// export default function ContactInfo() {
//   const openMap = useCallback(() => {
//     const address = CONTACT_INFO.address.join(", ");
//     window.open(
//       `https://maps.google.com/?q=${encodeURIComponent(address)}`,
//       "_blank"
//     );
//   }, []);

//   return (
//     <div className="space-y-10 max-w-5xl mx-auto">
//       {/* ================= CONTACT INFO ================= */}
//       <motion.section
//         initial={{ opacity: 0, y: 16 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.4 }}
//       >
//         <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

//         <div className="space-y-4">
//           {/* Address */}
//           <div onClick={openMap} className="cursor-pointer">
//             <ContactInfoItem icon={MapPin} title="Address" delay={0.1}>
//               {CONTACT_INFO.address.map((line, i) => (
//                 <div key={i}>{line}</div>
//               ))}
//             </ContactInfoItem>
//           </div>

//           {/* Phone */}
//           <ContactInfoItem icon={Phone} title="Phone" delay={0.2}>
//             {CONTACT_INFO.phones.map((phone) => (
//               <a
//                 key={phone}
//                 href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
//                 className="block hover:text-primary transition-colors"
//               >
//                 {phone}
//               </a>
//             ))}
//           </ContactInfoItem>

//           {/* Email */}
//           <ContactInfoItem icon={Mail} title="Email" delay={0.3}>
//             {CONTACT_INFO.emails.map((email) => (
//               <a
//                 key={email}
//                 href={`mailto:${email}`}
//                 className="block hover:text-primary transition-colors"
//               >
//                 {email}
//               </a>
//             ))}
//           </ContactInfoItem>

//           {/* Hours */}
//           <ContactInfoItem icon={Clock} title="Hours" delay={0.4}>
//             {CONTACT_INFO.hours.map((hour, i) => (
//               <div key={i}>{hour}</div>
//             ))}
//           </ContactInfoItem>
//         </div>
//       </motion.section>

//       {/* ================= MAP ================= */}
//       <motion.section
//         initial={{ opacity: 0, y: 16 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.4, delay: 0.2 }}
//       >
//         <Card
//           onClick={openMap}
//           className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
//         >
//           <CardContent className="p-0">
//             <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group">
//               <div className="text-center space-y-2">
//                 <motion.div whileHover={{ scale: 1.15 }}>
//                   <MapPin className="h-12 w-12 text-primary mx-auto" />
//                 </motion.div>
//                 <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
//                   Click to view on Google Maps
//                   <br />
//                   <span className="text-xs">(Opens in new tab)</span>
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.section>
//     </div>
//   );
// }

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
