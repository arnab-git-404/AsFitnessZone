// // // import React from "react";
// // // import { Card, CardContent } from "../ui/card";
// // // import { Star } from "lucide-react";
// // // import LogoLoop from "@/components/LogoLoop";

// // // export const dynamic = "force-static";

// // // export default function Testimonials() {
// // //   return (
// // //     <section className="py-20">
// // //       <div className="container mx-auto px-4">
// // //         <div className="text-center mb-16">
// // //           <h2 className="text-3xl md:text-4xl font-bold mb-4">
// // //             Success <span className="text-primary">Stories</span>
// // //           </h2>
// // //           <p className="text-muted-foreground max-w-2xl mx-auto">
// // //             Hear from our members who transformed their lives
// // //           </p>
// // //         </div>

// // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //           {[
// // //             {
// // //               name: "Sarah Johnson",
// // //               role: "Lost 30 lbs",
// // //               content:
// // //                 "FitnessGym changed my life! The trainers are amazing and the community is so supportive. I never thought I could achieve this.",
// // //               rating: 5,
// // //             },
// // //             {
// // //               name: "Mike Chen",
// // //               role: "Gained 15 lbs muscle",
// // //               content:
// // //                 "Best investment I ever made. The personalized training program helped me build muscle and confidence. Highly recommend!",
// // //               rating: 5,
// // //             },
// // //             {
// // //               name: "Emily Davis",
// // //               role: "Marathon Runner",
// // //               content:
// // //                 "The trainers helped me prepare for my first marathon. Their expertise and encouragement made all the difference.",
// // //               rating: 5,
// // //             },
// // //           ].map((testimonial, index) => (
// // //             <Card key={index} className="bg-card border-border">
// // //               <CardContent className="p-6 space-y-4">
// // //                 <div className="flex gap-1">
// // //                   {Array.from({ length: testimonial.rating }).map((_, i) => (
// // //                     <Star
// // //                       key={i}
// // //                       className="h-5 w-5 fill-primary text-primary"
// // //                     />
// // //                   ))}
// // //                 </div>
// // //                 <p className="text-muted-foreground italic">
// // //                   &quot;{testimonial.content}&quot;
// // //                 </p>
// // //                 <div>
// // //                   <div className="font-semibold">{testimonial.name}</div>
// // //                   <div className="text-sm text-primary">{testimonial.role}</div>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // }






// // "use client";

// // import React from "react";
// // import { Card, CardContent } from "../ui/card";
// // import { Star } from "lucide-react";
// // import LogoLoop from "@/components/LogoLoop";
// // import { motion } from "framer-motion";

// // const testimonials = [
// //   {
// //     name: "Sarah Johnson",
// //     role: "Lost 30 lbs",
// //     content:
// //       "FitnessGym changed my life! The trainers are amazing and the community is so supportive. I never thought I could achieve this.",
// //     rating: 5,
// //   },
// //   {
// //     name: "Mike Chen",
// //     role: "Gained 15 lbs muscle",
// //     content:
// //       "Best investment I ever made. The personalized training program helped me build muscle and confidence. Highly recommend!",
// //     rating: 5,
// //   },
// //   {
// //     name: "Emily Davis",
// //     role: "Marathon Runner",
// //     content:
// //       "The trainers helped me prepare for my first marathon. Their expertise and encouragement made all the difference.",
// //     rating: 5,
// //   },
// //   {
// //     name: "John Smith",
// //     role: "Fitness Enthusiast",
// //     content:
// //       "Amazing facility with top-notch equipment. The staff is incredibly helpful and motivating. Best gym in town!",
// //     rating: 5,
// //   },
// //   {
// //     name: "Lisa Brown",
// //     role: "Yoga Practitioner",
// //     content:
// //       "The yoga classes are fantastic! Great instructors and a peaceful environment. I feel stronger and more flexible.",
// //     rating: 5,
// //   },
// // ];

// // export default function Testimonials() {
// //   const testimonialNodes = testimonials.map((testimonial, index) => ({
// //     node: (
// //       <Card className="bg-card border-border w-[350px] ">
// //         <CardContent className="p-6 space-y-4">
// //           <div className="flex gap-1">
// //             {Array.from({ length: 5 }).map((_, i) => (
// //               <Star
// //                 key={i}
// //                 className={`h-5 w-5 ${
// //                   i < testimonial.rating
// //                     ? "fill-primary text-primary"
// //                     : "fill-muted text-muted"
// //                 }`}
// //               />
// //             ))}
// //           </div>
// //           <p className="text-muted-foreground italic min-h-[100px]">
// //             &quot;{testimonial.content}&quot;
// //           </p>
// //           <div>
// //             <div className="font-semibold">{testimonial.name}</div>
// //             <div className="text-sm text-primary">{testimonial.role}</div>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     ),
// //     key: index,
// //   }));

// //   return (
// //     <section className="py-20 overflow-hidden">
// //       <div className="container mx-auto px-4">
// //         <motion.div
// //           className="text-center mb-16"
// //           initial={{ opacity: 0, y: 20 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.5 }}
// //         >
// //           <h2 className="text-3xl md:text-4xl font-bold mb-4">
// //             Success <span className="text-primary">Stories</span>
// //           </h2>
// //           <p className="text-muted-foreground max-w-2xl mx-auto">
// //             Hear from our members who transformed their lives
// //           </p>
// //         </motion.div>

// //         <motion.div
// //           initial={{ opacity: 0 }}
// //           whileInView={{ opacity: 1 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.5, delay: 0.2 }}
// //         >
// //           <LogoLoop
// //             logos={testimonialNodes}
// //             speed={30}
// //             direction="left"
// //             gap={24}
// //             pauseOnHover
// //             logoHeight={280}
// //             scaleOnHover
// //             fadeOut
// //             className="py-4"
// //           />
// //         </motion.div>
// //       </div>
// //     </section>
// //   );
// // }



// "use client";

// import React from "react";
// import { Star } from "lucide-react";
// import LogoLoop from "@/components/LogoLoop";
// import { motion } from "framer-motion";
// import { Card, CardContent } from "../ui/card";


// const testimonials = [
//   {
//     name: "Sarah Johnson",
//     role: "Lost 30 lbs",
//     content:
//       "FitnessGym changed my life! The trainers are amazing and the community is so supportive. I never thought I could achieve this.",
//     rating: 5,
//   },
//   {
//     name: "Mike Chen",
//     role: "Gained 15 lbs muscle",
//     content:
//       "Best investment I ever made. The personalized training program helped me build muscle and confidence. Highly recommend!",
//     rating: 5,
//   },
//   {
//     name: "Emily Davis",
//     role: "Marathon Runner",
//     content:
//       "The trainers helped me prepare for my first marathon. Their expertise and encouragement made all the difference.",
//     rating: 5,
//   },
//   {
//     name: "John Smith",
//     role: "Fitness Enthusiast",
//     content:
//       "Amazing facility with top-notch equipment. The staff is incredibly helpful and motivating. Best gym in town!",
//     rating: 5,
//   },
//   {
//     name: "Lisa Brown",
//     role: "Yoga Practitioner",
//     content:
//       "The yoga classes are fantastic! Great instructors and a peaceful environment. I feel stronger and more flexible.",
//     rating: 5,
//     date: "March 15, 2024",
//   },
// ];

// const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
//   return (
//     <Card className="w-[350px] hover:shadow-xl transition-shadow duration-300">
//       <CardContent className="pt-6">
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-1">
//             {Array.from({ length: Math.floor(testimonial.rating) }).map((_, i) => (
//               <Star
//                 key={i}
//                 className="h-4 w-4 fill-yellow-400 text-yellow-400"
//               />
//             ))}
//           </div>
//           <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
//             {testimonial.content}
//           </span>
//         </div>
//         <p className="text-sm mb-4 text-muted-foreground min-h-[60px]">
//           {testimonial.text}
//         </p>
//         <div className="flex items-center justify-between text-sm">
//           <span className="font-medium">{testimonial.name}</span>
//           <span className="text-muted-foreground text-xs">{testimonial.date}</span>
//         </div>
//       </CardContent>
//     </Card>

//   );
// };

// export default function Testimonials() {

//   const testimonialNodes = testimonials.map((testimonial) => ({
//     node: <TestimonialCard  testimonial={testimonial} />,
//   }));

//   return (
//     <section className="py-20 overflow-hidden">
//       <div className="container mx-auto px-4">
//         <motion.div
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//         >
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             Success <span className="text-primary">Stories</span>
//           </h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             Hear from our members who transformed their lives
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <LogoLoop
//             logos={testimonialNodes}
//             speed={30}
//             direction="left"
//             gap={24}
//             pauseOnHover
//             logoHeight={280}
//             scaleOnHover
//             fadeOut
//             className="py-4"
//           />
//         </motion.div>
//       </div>
//     </section>
//   );
// }



"use client";

import React from "react";
import { Star } from "lucide-react";
import LogoLoop from "@/components/LogoLoop";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Lost 30 lbs",
    content:
      "FitnessGym changed my life! The trainers are amazing and the community is so supportive. I never thought I could achieve this.",
    rating: 5,
    date: "January 10, 2024",
  },
  {
    name: "Mike Chen",
    role: "Gained 15 lbs muscle",
    content:
      "Best investment I ever made. The personalized training program helped me build muscle and confidence. Highly recommend!",
    rating: 5,
    date: "February 5, 2024",
  },
  {
    name: "Emily Davis",
    role: "Marathon Runner",
    content:
      "The trainers helped me prepare for my first marathon. Their expertise and encouragement made all the difference.",
    rating: 5,
    date: "February 20, 2024",
  },
  {
    name: "John Smith",
    role: "Fitness Enthusiast",
    content:
      "Amazing facility with top-notch equipment. The staff is incredibly helpful and motivating. Best gym in town!",
    rating: 5,
    date: "March 8, 2024",
  },
  {
    name: "Lisa Brown",
    role: "Yoga Practitioner",
    content:
      "The yoga classes are fantastic! Great instructors and a peaceful environment. I feel stronger and more flexible.",
    rating: 5,
    date: "March 15, 2024",
  },
];

const TestimonialCard = React.memo(({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <Card className="w-[350px] h-[220px] hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardContent className="flex flex-col h-full">

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star
                key={i}
                // className="h-4 w-4 fill-primary text-primary"
                 className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {testimonial.role}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground italic flex-1 mb-4 line-clamp-3">
          &quot;{testimonial.content}&quot;
        </p>

        {/* <span className="text-muted-foreground text-xs ">{testimonial.date}</span> */}
          <p className="text-xl text-muted-foreground">{testimonial.name}</p>

          <p className="text-sm text-muted-foreground">{testimonial.date}</p>

        {/* <span className="text-foreground">{testimonial.name}</span> */}
        {/* <div className="flex items-center justify-between border-t pt-4 mt-auto">
        </div> */}
      </CardContent>
    </Card>
  );
});

TestimonialCard.displayName = "TestimonialCard";

export default function Testimonials() {
  const testimonialNodes = testimonials.map((testimonial, index) => ({
    node: <TestimonialCard key={index} testimonial={testimonial} />,
  }));

  return (
    <section className="py-20 overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 md:px-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-6xl font-bold mb-4">
            Success <span className="text-primary">Stories</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our members who transformed their lives
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LogoLoop
            logos={testimonialNodes}
            speed={50}
            direction="left"
            gap={24}
            pauseOnHover
            logoHeight={60}
            scaleOnHover
            fadeOut
          fadeOutColor="bg-muted/30"
          
          />
          <LogoLoop
            logos={testimonialNodes}
            speed={50}
            direction="right"
            gap={24}
            pauseOnHover
            logoHeight={60}
            scaleOnHover
            fadeOut
          fadeOutColor="bg-muted/30"
          />
        </motion.div>
      </div>
    </section>
  );
}