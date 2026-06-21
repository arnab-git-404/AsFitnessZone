// Shared API response types

export interface RoleResponse {
  _id: string;
  name: string;
  description: string;
}

export interface UserResponse {
  _id: string;
  email: string;
  userType: "gymMember" | "admin" | "trainer";
  role: RoleResponse | string;
  createdAt: string;
  updatedAt: string;
  customer?: CustomerResponse;
  trainer?: TrainerResponse;
}

export interface CustomerResponse {
  _id: string;
  userId: string;
  name: string;
  phone?: string;
  age?: number;
  address?: string;
  weight?: number;
  height?: number;
  fitnessGoal?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadResponse {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalLeads: number;
  totalPrograms: number;
  totalTrainers: number;
}

export interface ProgramResponse {
  _id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerPricing {
  monthly: number;
  quarterly: number;
  sixMonths: number;
  annual: number;
}

export interface TrainerResponse {
  _id: string;
  userId?: string;
  userEmail?: string;
  name: string;
  bio: string;
  certifications: string[];
  experience: string;
  specializations: string[];
  image: string;
  isActive: boolean;
  pricing: TrainerPricing;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerAssignmentResponse {
  _id: string;
  customerId: string;
  trainerId: string | TrainerResponse;
  feeType: 'monthly' | 'quarterly' | 'sixMonths' | 'annual';
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutResponse {
  _id: string;
  userId: string;
  date: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
    notes?: string;
  }>;
  duration?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeasurementResponse {
  _id: string;
  userId: string;
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  thighs?: number;
  hips?: number;
  bodyFat?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WaterLogResponse {
  _id: string;
  userId: string;
  date: string;
  glasses: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponResponse {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  maxUsage: number;
  currentUsage: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaResponse {
  _id: string;
  type: "image" | "video";
  url: string;
  publicId: string;
  category: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}
