"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "Is membership money refundable?",
    answer:
      "Yes, we offer a full refund within the first 7 days of membership activation if you're not satisfied.",
  },
  {
    question: "Can I cancel my membership anytime?",
    answer:
      "Yes! All our plans are flexible. Monthly plans can be cancelled anytime with no penalty.",
  },
  {
    question: "Is there a joining fee?",
    answer:
      "No joining fees! We believe in transparent pricing with no hidden costs.",
  },
  {
    question: "Can I freeze my membership?",
    answer:
      "Yes, you can freeze your membership for up to 2 months per year for medical or travel reasons.",
  },
  {
    question: "Do you offer student or senior discounts?",
    answer:
      "Yes! We offer 15% discount for students and seniors. Contact us for more details.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`border rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-card ${
                  openIndex === index ? "border-orange-500 " : ""
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold pr-4">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-muted-foreground mt-3">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
