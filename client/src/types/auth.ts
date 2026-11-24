import { ResumeSchema, TemplateId } from './resume';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface SavedResumeRecord {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  title: string;
  templateId: TemplateId;
  theme: any;
  content: ResumeSchema;
  atsScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomTemplateRecord {
  id: string;
  name: string;
  description: string;
  bestSuitedFor: string;
  category: 'ATS' | 'Modern' | 'Minimal' | 'Executive' | 'Creative' | 'Technical' | 'Academic' | 'Custom';
  layoutType: '1-Column' | '2-Column' | 'Sidebar' | 'Split';
  baseLayout: 'classic-ats' | 'modern-pro' | 'minimalist' | 'executive' | 'creative' | 'technical' | 'academic';
  atsScoreEstimate: number;
  isAtsOptimized: boolean;
  theme: {
    primaryColor: string;
    secondaryColor?: string;
    fontFamily: string;
    fontSize: string;
  };
  createdBy: string;
  createdAt: string;
}
