import { z } from "zod";

/** Get the first validation error message from a Zod safeParse result */
export function getFirstZodError<T>(
  result:
    | { success: true; data: T }
    | { success: false; error: z.ZodError }
): string {
  if (result.success) return "";
  return result.error.issues[0]?.message || "Validation failed";
}

// ---------- Auth ----------
export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ---------- User Profile ----------
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  phone: z.string().max(20).optional().or(z.literal("")),
  age: z.number().min(10).max(100).optional().nullable(),
  address: z.string().max(500).optional().or(z.literal("")),
  weight: z.number().min(20).max(500).optional().nullable(),
  height: z.number().min(50).max(300).optional().nullable(),
  fitnessGoal: z
    .enum(["fat-loss", "muscle-gain", "general-fitness", "strength", "endurance", "flexibility", ""])
    .optional(),
  profileImage: z.string().max(500).optional().or(z.literal("")),
});

// ---------- Lead ----------
export const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z.string().min(1, "Message is required").max(2000),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(["new", "contacted", "converted", "closed"]),
});

// ---------- Password Reset ----------
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ---------- Workout ----------
export const workoutExerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.number().min(1, "Sets must be at least 1"),
  reps: z.number().min(1, "Reps must be at least 1"),
  weight: z.number().min(0, "Weight cannot be negative"),
  notes: z.string().optional().or(z.literal("")),
});

export const createWorkoutSchema = z.object({
  date: z.string().min(1, "Date is required"),
  exercises: z.array(workoutExerciseSchema).min(1, "At least one exercise is required"),
  duration: z.number().min(0).optional(),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

// ---------- Body Measurements ----------
export const createMeasurementSchema = z.object({
  date: z.string().min(1, "Date is required"),
  weight: z.number().min(20).max(500).optional().nullable(),
  chest: z.number().min(10).max(300).optional().nullable(),
  waist: z.number().min(10).max(300).optional().nullable(),
  arms: z.number().min(5).max(100).optional().nullable(),
  thighs: z.number().min(5).max(100).optional().nullable(),
  hips: z.number().min(10).max(300).optional().nullable(),
  bodyFat: z.number().min(1).max(70).optional().nullable(),
  notes: z.string().max(500).optional().or(z.literal("")),
});

// ---------- Water Intake ----------
export const updateWaterSchema = z.object({
  glasses: z.number().min(0, "Glasses cannot be negative").max(50, "Max 50 glasses"),
});

// ---------- Trainer ----------
export const trainerPricingSchema = z.object({
  monthly: z.number().min(0, "Monthly price must be at least 0"),
  quarterly: z.number().min(0, "Quarterly price must be at least 0"),
  sixMonths: z.number().min(0, "6-month price must be at least 0"),
  annual: z.number().min(0, "Annual price must be at least 0"),
});

export const createTrainerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").max(200),
  bio: z.string().min(1, "Bio is required").max(2000),
  certifications: z.array(z.string()).optional(),
  experience: z.string().max(100).optional().or(z.literal("")),
  specializations: z.array(z.string()).optional(),
  image: z.string().max(500).optional().or(z.literal("")),
  pricing: trainerPricingSchema,
});

export const assignTrainerSchema = z.object({
  trainerId: z.string().min(1, "Trainer is required"),
  feeType: z.enum(["monthly", "quarterly", "sixMonths", "annual"]),
  amount: z.number().min(0, "Amount must be positive"),
});

// ---------- Coupon ----------
export const createCouponSchema = z.object({
  code: z.string().min(1, "Code is required").max(50).toUpperCase(),
  description: z.string().max(500).optional().or(z.literal("")),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(1, "Discount must be at least 1"),
  minPurchase: z.number().min(0).optional(),
  maxUsage: z.number().min(0).optional(),
  expiresAt: z.string().min(1, "Expiry date is required"),
  isActive: z.boolean().optional(),
});

export const updateAssignmentSchema = z.object({
  status: z.enum(["active", "expired", "cancelled"]).optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, "Code is required").toUpperCase(),
  planPrice: z.number().min(0, "Invalid price"),
});

// ---------- Cloudinary Upload ----------
export const uploadSignatureSchema = z.object({
  folder: z.string().max(100).optional(),
});
