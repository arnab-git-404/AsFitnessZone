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

// ---------- Cloudinary Upload ----------
export const uploadSignatureSchema = z.object({
  folder: z.string().max(100).optional(),
});
