"use client";

import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import Link from "next/link";
import { Check, Star, Percent, X, Tag as TagIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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
    const toastRef = useRef<Toast>(null);
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
                toastRef.current?.show({ severity: "success", summary: "Coupon Applied", detail: `You saved ₹${data.savings}!` });
            } else {
                setCouponErrors((prev) => ({
                    ...prev,
                    [planIndex]: data.error || "Invalid coupon",
                }));
                toastRef.current?.show({ severity: "error", summary: "Invalid Coupon", detail: data.error || "Invalid coupon" });
            }
        } catch {
            setCouponErrors((prev) => ({
                ...prev,
                [planIndex]: "Failed to validate coupon",
            }));
            toastRef.current?.show({ severity: "error", summary: "Error", detail: "Failed to validate coupon" });
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
            <Toast ref={toastRef} />
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
                                    className={`relative h-full flex flex-col !border-border/50 ${
                                        plan.popular
                                            ? "!border-primary shadow-lg shadow-primary/20 scale-105"
                                            : "hover:!border-primary/50"
                                    } transition-all duration-300`}
                                >
                                    {plan.popular && (
                                        <motion.div
                                            className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5, type: "spring" }}
                                        >
                                            <Tag value="Most Popular" severity="danger" className="px-4 py-1 text-sm" />
                                        </motion.div>
                                    )}

                                    <div className="p-8 space-y-6 flex flex-col flex-1">
                                        <div className="text-center space-y-2">
                                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                                            <p className="text-sm text-muted-foreground">{plan.duration}</p>
                                            {plan.savings && (
                                                <span className="inline-block text-xs bg-secondary text-secondary-foreground rounded-full px-3 py-1">{plan.savings}</span>
                                            )}
                                        </div>

                                        <div className="text-center">
                                            <div className="flex items-baseline justify-center">
                                                {appliedCoupon ? (
                                                    <>
                                                        <span className="text-3xl font-bold text-muted-foreground line-through">₹{plan.price}</span>
                                                        <span className="text-5xl font-bold text-primary ml-3">₹{discountedPrice}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-5xl font-bold">₹{plan.price}</span>
                                                )}
                                                <span className="text-muted-foreground ml-2">/{plan.duration.toLowerCase()}</span>
                                            </div>
                                            {appliedCoupon && (
                                                <span className="inline-block mt-2 text-xs bg-green-500/20 text-green-600 border border-green-500 rounded-full px-3 py-1">
                                                    Save ₹{appliedCoupon.discountAmount} with {appliedCoupon.code}
                                                </span>
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
                                                    <span className="text-sm leading-relaxed">{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>

                                        {/* Coupon Section */}
                                        <div className="space-y-2 pt-2 border-t border-border">
                                            {appliedCoupon ? (
                                                <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <TagIcon className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">{appliedCoupon.code}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveCoupon(index)}
                                                        className="text-muted-foreground hover:text-primary cursor-pointer"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Percent className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <InputText
                                                            placeholder="Coupon code"
                                                            value={couponInput}
                                                            onChange={(e) => setCouponInput(e.target.value)}
                                                            className="w-full pl-8 h-9 text-sm"
                                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    handleApplyCoupon(index, plan.price);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <Button
                                                        className="h-9 p-button-outlined cursor-pointer"
                                                        onClick={() => handleApplyCoupon(index, plan.price)}
                                                        disabled={isValidating || !couponInput.trim()}
                                                        label="Apply"
                                                    />
                                                </div>
                                            )}
                                            {error && (
                                                <p className="text-xs text-red-500">{error}</p>
                                            )}
                                        </div>

                                        <Link href="/signup" className="block mt-auto">
                                            <Button
                                                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-500 shadow-lg shadow-red-500/20"
                                                size="large"
                                                label={appliedCoupon ? `Get Started @ ₹${discountedPrice}` : "Get Started"}
                                            />
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
