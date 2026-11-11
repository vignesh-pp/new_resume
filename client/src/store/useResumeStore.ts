import { create } from 'zustand';
import { ResumeSchema, TemplateId, ThemeSettings, AtsScoreBreakdown, ExperienceItem, EducationItem, ProjectItem, CertificationItem } from '../types/resume';
import { developerResume, executiveResume, designerResume } from '../utils/sampleResumes';

interface ResumeStoreState {
  resumeData: ResumeSchema;
  activeTemplate: TemplateId;
  theme: ThemeSettings;
  atsAnalysis: AtsScoreBreakdown | null;
  isAnalyzing: boolean;
  activeTab: 'editor' | 'templates' | 'analyzer' | 'preview';
  zoom: number;
  showTailorModal: boolean;
  showBulletModal: boolean;
  activeBulletContext: { expId: string; bulletIndex: number; text: string } | null;

  // Actions
  setResumeData: (data: ResumeSchema) => void;
  updatePersonalInfo: (info: Partial<ResumeSchema['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, updated: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, updated: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: Partial<ResumeSchema['skills']>) => void;
  addProject: () => void;
  updateProject: (id: string, updated: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, updated: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;
  toggleSectionVisibility: (section: string) => void;
  reorderSections: (newOrder: string[]) => void;
  setTemplate: (templateId: TemplateId) => void;
  setTheme: (theme: Partial<ThemeSettings>) => void;
  setAtsAnalysis: (analysis: AtsScoreBreakdown | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setActiveTab: (tab: 'editor' | 'templates' | 'analyzer' | 'preview') => void;
  setZoom: (zoom: number) => void;
  setShowTailorModal: (show: boolean) => void;
  setShowBulletModal: (show: boolean) => void;
  setActiveBulletContext: (ctx: { expId: string; bulletIndex: number; text: string } | null) => void;
  loadPreset: (type: 'developer' | 'executive' | 'designer') => void;
}

export const useResumeStore = create<ResumeStoreState>((set) => ({
  resumeData: developerResume,
  activeTemplate: 'classic-ats',
  theme: {
    primaryColor: '#1e3a8a', // Corporate Blue
    fontFamily: 'Inter',
    fontSize: 'normal',
    spacing: 'normal',
  },
  atsAnalysis: null,
  isAnalyzing: false,
  activeTab: 'editor',
  zoom: 1.0,
  showTailorModal: false,
  showBulletModal: false,
  activeBulletContext: null,

  setResumeData: (data) => set({ resumeData: data }),

  updatePersonalInfo: (info) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...info },
      },
    })),

  updateSummary: (summary) =>
    set((state) => ({
      resumeData: { ...state.resumeData, summary },
    })),

  addExperience: () =>
    set((state) => {
      const newExp: ExperienceItem = {
        id: 'exp-' + Date.now(),
        company: 'New Company',
        role: 'Software Engineer',
        location: 'Remote',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        bullets: ['Accomplished key milestones that boosted team efficiency by 25%.'],
      };
      return {
        resumeData: {
          ...state.resumeData,
          experience: [newExp, ...state.resumeData.experience],
        },
      };
    }),

  updateExperience: (id, updated) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.map((exp) =>
          exp.id === id ? { ...exp, ...updated } : exp
        ),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.filter((exp) => exp.id !== id),
      },
    })),

  addEducation: () =>
    set((state) => {
      const newEdu: EducationItem = {
        id: 'edu-' + Date.now(),
        institution: 'University Name',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        location: 'City, State',
        startDate: '2019',
        endDate: '2023',
        gpa: '3.8 / 4.0',
        highlights: [],
      };
      return {
        resumeData: {
          ...state.resumeData,
          education: [...state.resumeData.education, newEdu],
        },
      };
    }),

  updateEducation: (id, updated) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.map((edu) =>
          edu.id === id ? { ...edu, ...updated } : edu
        ),
      },
    })),

  removeEducation: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter((edu) => edu.id !== id),
      },
    })),

  updateSkills: (skills) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: { ...state.resumeData.skills, ...skills },
      },
    })),

  addProject: () =>
    set((state) => {
      const newProj: ProjectItem = {
        id: 'proj-' + Date.now(),
        name: 'New Innovation Project',
        description: 'Scalable cloud-native web platform.',
        role: 'Lead Developer',
        technologies: ['React', 'TypeScript', 'Node.js'],
        bullets: ['Implemented core business logic reducing load times by 30%.'],
      };
      return {
        resumeData: {
          ...state.resumeData,
          projects: [...state.resumeData.projects, newProj],
        },
      };
    }),

  updateProject: (id, updated) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.map((proj) =>
          proj.id === id ? { ...proj, ...updated } : proj
        ),
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((proj) => proj.id !== id),
      },
    })),

  addCertification: () =>
    set((state) => {
      const newCert: CertificationItem = {
        id: 'cert-' + Date.now(),
        name: 'New Professional Certificate',
        issuer: 'Issuing Organization',
        date: '2024',
      };
      return {
        resumeData: {
          ...state.resumeData,
          certifications: [...state.resumeData.certifications, newCert],
        },
      };
    }),

  updateCertification: (id, updated) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: state.resumeData.certifications.map((c) =>
          c.id === id ? { ...c, ...updated } : c
        ),
      },
    })),

  removeCertification: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: state.resumeData.certifications.filter((c) => c.id !== id),
      },
    })),

  toggleSectionVisibility: (section) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        visibleSections: {
          ...state.resumeData.visibleSections,
          [section]: !state.resumeData.visibleSections[section],
        },
      },
    })),

  reorderSections: (newOrder) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        sectionOrder: newOrder,
      },
    })),

  setTemplate: (templateId) => set({ activeTemplate: templateId }),

  setTheme: (theme) =>
    set((state) => ({
      theme: { ...state.theme, ...theme },
    })),

  setAtsAnalysis: (analysis) => set({ atsAnalysis: analysis }),

  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setZoom: (zoom) => set({ zoom }),

  setShowTailorModal: (show) => set({ showTailorModal: show }),

  setShowBulletModal: (show) => set({ showBulletModal: show }),

  setActiveBulletContext: (ctx) => set({ activeBulletContext: ctx }),

  loadPreset: (type) =>
    set(() => {
      if (type === 'executive') {
        return {
          resumeData: executiveResume,
          activeTemplate: 'executive',
          theme: { primaryColor: '#0f172a', fontFamily: 'Merriweather', fontSize: 'normal', spacing: 'normal' },
        };
      }
      if (type === 'designer') {
        return {
          resumeData: designerResume,
          activeTemplate: 'creative',
          theme: { primaryColor: '#7c3aed', fontFamily: 'Poppins', fontSize: 'normal', spacing: 'normal' },
        };
      }
      return {
        resumeData: developerResume,
        activeTemplate: 'classic-ats',
        theme: { primaryColor: '#1e3a8a', fontFamily: 'Inter', fontSize: 'normal', spacing: 'normal' },
      };
    }),
}));

