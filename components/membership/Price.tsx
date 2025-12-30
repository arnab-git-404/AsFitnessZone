// import React from 'react'
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import Link from 'next/link';
// import { Check, Star } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';

// export default function Price() {

//         const plans = [
//         {
//             name: 'Monthly',
//             duration: '1 Month',
//             price: 49,
//             popular: false,
//             features: [
//                 'Access to all equipment',
//                 'Locker room access',
//                 'Free WiFi',
//                 'Mobile app access',
//                 'Cancel anytime',
//             ],
//         },
//         {
//             name: 'Quarterly',
//             duration: '3 Months',
//             price: 129,
//             popular: true,
//             savings: 'Save $18',
//             features: [
//                 'Everything in Monthly',
//                 '1 free personal training session',
//                 'Nutrition consultation',
//                 'Priority class booking',
//                 'Guest passes (2/month)',
//             ],
//         },
//         {
//             name: 'Yearly',
//             duration: '12 Months',
//             price: 449,
//             popular: false,
//             savings: 'Save $139',
//             features: [
//                 'Everything in Quarterly',
//                 '4 free personal training sessions',
//                 'Monthly body composition analysis',
//                 'Unlimited guest passes',
//                 'Exclusive member events',
//                 'Free gym merchandise',
//             ],
//         },
//     ];

//   return (
//      <section className="py-20">
//                     <div className="container mx-auto px-4">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//                             {plans.map((plan, index) => (
//                                 <Card
//                                     key={index}
//                                     className={`relative ${plan.popular
//                                             ? 'border-primary shadow-lg shadow-primary/20 scale-105'
//                                             : 'hover:border-primary/50'
//                                         } transition-all`}
//                                 >
//                                     {plan.popular && (
//                                         <div className="absolute -top-4 left-1/2 -translate-x-1/2">
//                                             <Badge className="bg-primary text-white px-4 py-1">
//                                                 <Star className="h-3 w-3 mr-1 fill-current" />
//                                                 Most Popular
//                                             </Badge>
//                                         </div>
//                                     )}

//                                     <CardContent className="p-8 space-y-6">
//                                         <div className="text-center space-y-2">
//                                             <h3 className="text-2xl font-bold">{plan.name}</h3>
//                                             <p className="text-sm text-muted-foreground">{plan.duration}</p>
//                                             {plan.savings && (
//                                                 <Badge variant="secondary" className="text-xs">
//                                                     {plan.savings}
//                                                 </Badge>
//                                             )}
//                                         </div>

//                                         <div className="text-center">
//                                             <div className="flex items-baseline justify-center">
//                                                 <span className="text-5xl font-bold">${plan.price}</span>
//                                                 <span className="text-muted-foreground ml-2">/{plan.duration.toLowerCase()}</span>
//                                             </div>
//                                         </div>

//                                         <ul className="space-y-3">
//                                             {plan.features.map((feature, idx) => (
//                                                 <li key={idx} className="flex items-start">
//                                                     <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
//                                                     <span className="text-sm">{feature}</span>
//                                                 </li>
//                                             ))}
//                                         </ul>

//                                         <Link href="/signup" className="block">
//                                             <Button
//                                                 className={`w-full ${plan.popular
//                                                         ? 'bg-primary hover:bg-primary/90'
//                                                         : 'bg-secondary hover:bg-secondary/90'
//                                                     }`}
//                                                 size="lg"
//                                             >
//                                                 Get Started
//                                             </Button>
//                                         </Link>
//                                     </CardContent>
//                                 </Card>
//                             ))}
//                         </div>
//                     </div>
//                 </section>
//   )
// }

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Monthly",
    duration: "1 Month",
    price: 49,
    popular: false,
    savings: "Save ₹0",
    features: [
      "Access to all equipment",
      "Locker room access",
      "Free WiFi",
      "Mobile app access",
      "Cancel anytime",
    ],
  },
  {
    name: "Quarterly",
    duration: "3 Months",
    price: 129,
    popular: true,
    savings: "Save ₹18",
    features: [
      "Everything in Monthly",
      "1 free personal training session",
      "Nutrition consultation",
      "Priority class booking",
      "Guest passes (2/month)",
    ],
  },
  {
    name: "Yearly",
    duration: "12 Months",
    price: 449,
    popular: false,
    savings: "Save ₹139",
    features: [
      "Everything in Quarterly",
      "4 free personal training sessions",
      "Monthly body composition analysis",
      "Unlimited guest passes",
      "Exclusive member events",
    ],
  },
];

export default function Price() {
  return (
    <section className="py-10 min-h-screen ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                className={`relative h-full ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/20 scale-105"
                    : "hover:border-primary/50"
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute top-4 left-1/2 -translate-x-1/2 border-1 rounded-full"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500  px-4 py-1">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </motion.div>
                )}

                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.duration}
                    </p>
                    {plan.savings && (
                      <Badge variant="secondary" className="text-xs">
                        {plan.savings}
                      </Badge>
                    )}
                  </div>

                  <div className="text-center">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold">₹{plan.price}</span>
                      <span className="text-muted-foreground ml-2">
                        /{plan.duration.toLowerCase()}
                      </span>
                    </div>
                  </div>

  

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start min-h-[32px]"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                      >
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <Link href="/signup" className="block mt-auto">
                    <Button
                      variant="custom"
                      className={`w-full hover:cursor-pointer`}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
