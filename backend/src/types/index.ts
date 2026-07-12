import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export interface JwtPayload {
  userId: string;
  role: string;
  device?: string;
}

export interface ParsedResume {
  skills: string[];
  education: string;
  certifications: string[];
  projects: { title: string; description: string; technologies: string[] }[];
  internships: { company: string; position: string; description: string }[];
  experience: string;
  achievements: string[];
  technologies: string[];
  name?: string;
  email?: string;
  mobile?: string;
}

export interface RecommendationResult {
  careerTitle: string;
  matchPercentage: number;
  confidenceScore: number;
  salaryInsights: any;
  industryDemand: string;
  growthPotential: string;
  requiredSkills: string[];
  reasons: string[];
  influencingSkills: string[];
  influencingGoals: string[];
  isVerified: boolean;
  verificationSource: string;
}

export interface ChatContext {
  previousMessages: { role: string; content: string }[];
  userProfile: any;
  userSkills: string[];
  userGoals: string[];
  currentRoadmap?: any;
  recommendations?: any[];
}
