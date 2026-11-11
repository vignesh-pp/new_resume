export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photoUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface SkillsCategorized {
  technical: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
  softSkills: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  role?: string;
  technologies: string[];
  url?: string;
  github?: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CustomSectionItem {
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeSchema {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsCategorized;
  projects: ProjectItem[];
  certifications: CertificationItem[];
  customSections: CustomSection[];
  sectionOrder: string[];
  visibleSections: Record<string, boolean>;
}

export type TemplateId = 
  | 'classic-ats'
  | 'modern-pro'
  | 'minimalist'
  | 'executive'
  | 'creative'
  | 'technical'
  | 'academic';

export type FontOption = 
  | 'Inter' 
  | 'Plus Jakarta Sans' 
  | 'Roboto' 
  | 'Montserrat' 
  | 'Poppins' 
  | 'Merriweather' 
  | 'Playfair Display' 
  | 'Lora' 
  | 'JetBrains Mono' 
  | 'Fira Code';

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor?: string;
  fontFamily: FontOption;
  fontSize: 'compact' | 'normal' | 'relaxed' | 'large';
  spacing: 'compact' | 'normal' | 'spacious';
  bulletStyle?: 'circle' | 'dash' | 'diamond' | 'caret' | 'check';
  accentGradient?: boolean;
  showPhoto?: boolean;
  showPageBreakGuide?: boolean;
  paperShadow?: 'none' | 'subtle' | 'elevated' | 'floating';
}

export interface AtsScoreBreakdown {
  overallScore: number;
  completenessScore: number;
  impactMetricsScore: number;
  keywordsScore: number;
  formattingScore: number;
  strengths: string[];
  improvements: string[];
  detectedKeywords: string[];
  missingKeywords: string[];
}

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  bestSuitedFor: string;
  category: 'ATS' | 'Modern' | 'Minimal' | 'Executive' | 'Creative' | 'Technical' | 'Academic';
  isAtsOptimized: boolean;
  atsScoreEstimate: number;
  layoutType: '1-Column' | '2-Column' | 'Sidebar' | 'Split';
  description: string;
}

