// Shared API response types

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  address?: string;
  weight?: number;
  height?: number;
  fitnessGoal?: string;
  profileImage?: string;
  role: "user" | "admin";
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

export interface TrainerResponse {
  _id: string;
  name: string;
  bio: string;
  certifications: string[];
  experience: string;
  specializations: string[];
  image: string;
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
