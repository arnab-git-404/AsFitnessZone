"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Check, Star, Percent, X, Tag, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface CouponResult {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
}

interface AppliedCoupon {
    code: string;
    discountAmount: number;
    finalPrice: number;
}

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
    const [couponInput, setCouponInput] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [appliedCoupons, setAppliedCoupons] = useState<Record<number, AppliedCoupon | null>>({});
    const [couponErrors, setCouponErrors] = useState<Record<number, string>>({});

    const getDiscountedPrice = (planIndex: number, originalPrice: number): number => {
        const applied = appliedCoupons[planIndex];
        return applied ? applied.finalPrice : originalPrice;
    };

    const handleApplyCoupon = async (planIndex: number, price: number) => {
        if (!couponInput.trim()) return;

        setIsValidating(true);
        setCouponErrors((prev) => ({ ...prev, [planIndex]: "" }));

        try {
            const response = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponInput.trim(), planPrice: price }),
            });

            const data = await response.json();

            if (response.ok && data.valid) {
                setAppliedCoupons((prev) => ({
                    ...prev,
                    [planIndex]: {
                        code: data.coupon.code,
                        discountAmount: data.savings,
                        finalPrice: data.finalPrice,
                    },
                }));
                setCouponInput("");
            } else {
                setCouponErrors((prev) => ({
                    ...prev,
                    [planIndex]: data.error || "Invalid coupon",
                }));
            }
        } catch {
            setCouponErrors((prev) => ({
                ...prev,
                [planIndex]: "Failed to validate coupon",
            }));
        } finally {
            setIsValidating(false);
        }
    };

    const handleRemoveCoupon = (planIndex: number) => {
        setAppliedCoupons((prev) => ({ ...prev, [planIndex]: null }));
        setCouponErrors((prev) => ({ ...prev, [planIndex]: "" }));
    };

    return (
        <section className="py-10 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => {
                        const discountedPrice = getDiscountedPrice(index, plan.price);
                        const appliedCoupon = appliedCoupons[index];
                        const error = couponErrors[index];

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <Card
                                    className={`relative h-full flex flex-col ${
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
                                            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-1">
                                                <Star className="h-3 w-3 mr-1 fill-current" />
                                                Most Popular
                                            </Badge>
                                        </motion.div>
                                    )}

                                    <CardContent className="p-8 space-y-6 flex flex-col flex-1">
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
                                                {appliedCoupon ? (
                                                    <>
                                                        <span className="text-3xl font-bold text-muted-foreground line-through">
                                                            ₹{plan.price}
                                                        </span>
                                                        <span className="text-5xl font-bold text-primary ml-3">
                                                            ₹{discountedPrice}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-5xl font-bold">₹{plan.price}</span>
                                                )}
                                                <span className="text-muted-foreground ml-2">
                                                    /{plan.duration.toLowerCase()}
                                                </span>
                                            </div>
                                            {appliedCoupon && (
                                                <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-600 border-green-500">
                                                    Save ₹{appliedCoupon.discountAmount} with {appliedCoupon.code}
                                                </Badge>
                                            )}
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

                                        {/* Coupon Section */}
                                        <div className="space-y-2 pt-2 border-t border-border">
                                            {appliedCoupon ? (
                                                <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">{appliedCoupon.code}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => handleRemoveCoupon(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Percent className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Coupon code"
                                                            value={couponInput}
                                                            onChange={(e) => setCouponInput(e.target.value)}
                                                            className="pl-8 h-9 text-sm"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    handleApplyCoupon(index, plan.price);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-9"
                                                        onClick={() => handleApplyCoupon(index, plan.price)}
                                                        disabled={isValidating || !couponInput.trim()}
                                                    >
                                                        {isValidating ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            "Apply"
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                            {error && (
                                                <p className="text-xs text-destructive">{error}</p>
                                            )}
                                        </div>

                                        <Link href="/signup" className="block mt-auto">
                                            <Button
                                                variant="custom"
                                                className="w-full hover:cursor-pointer"
                                                size="lg"
                                            >
                                                {appliedCoupon
                                                    ? `Get Started @ ₹${discountedPrice}`
                                                    : "Get Started"}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
