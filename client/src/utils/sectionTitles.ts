import { ResumeSchema } from '../types/resume';

export const DEFAULT_SECTION_TITLES: Record<string, string> = {
  personal: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  skills: 'Skills & Competencies',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
};

export const SECTION_TITLE_SUGGESTIONS: Record<string, string[]> = {
  summary: [
    'Professional Summary',
    'Executive Summary',
    'About Me',
    'Career Overview',
    'Profile',
  ],
  experience: [
    'Work Experience',
    'Professional Experience',
    'Employment History',
    'Career Experience',
    'Relevant Experience',
  ],
  skills: [
    'Skills & Competencies',
    'Technical Skills',
    'Core Competencies',
    'Skills & Tech Stack',
    'Technical Proficiencies',
  ],
  projects: [
    'Projects',
    'Key Projects',
    'Featured Projects',
    'Technical Projects',
    'Open Source & Systems',
  ],
  education: [
    'Education',
    'Academic Background',
    'Education & Credentials',
    'Education & Degrees',
  ],
  certifications: [
    'Certifications',
    'Licenses & Certifications',
    'Professional Credentials',
    'Certifications & Training',
  ],
};

/**
 * Resolves the dynamic section title customized by the user,
 * falling back to a template-specific or standard default title.
 */
export function getSectionTitle(
  resumeData: ResumeSchema,
  sectionKey: string,
  fallbackTitle?: string
): string {
  if (resumeData.sectionTitles && resumeData.sectionTitles[sectionKey]?.trim()) {
    return resumeData.sectionTitles[sectionKey].trim();
  }
  const customSec = (resumeData.customSections || []).find((s) => s.id === sectionKey);
  if (customSec?.title?.trim()) {
    return customSec.title.trim();
  }
  return fallbackTitle || DEFAULT_SECTION_TITLES[sectionKey] || sectionKey;
}
