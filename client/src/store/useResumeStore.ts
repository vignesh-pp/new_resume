import { create } from 'zustand';
import { 
  ResumeSchema, TemplateId, ThemeSettings, AtsScoreBreakdown, 
  ExperienceItem, EducationItem, ProjectItem, CertificationItem,
  CustomSection, CustomSectionItem 
} from '../types/resume';
import { developerResume, executiveResume, designerResume } from '../utils/sampleResumes';
import { sanitizeResumeData, createEmptyResume } from '../utils/sanitizeResume';

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

  // Track currently active saved resume ID
  currentResumeId: string | null;
  currentResumeTitle: string | null;
  setCurrentResumeId: (id: string | null, title?: string | null) => void;
  resetResume: () => void;

  // Live Section Focus
  focusedSection: string | null;
  focusTimestamp: number;
  focusSection: (sectionKey: string) => void;

  // Template Preview Modal
  previewModalTemplate: TemplateId | null;
  isPreviewModalOpen: boolean;
  openPreviewModal: (templateId?: TemplateId) => void;
  closePreviewModal: () => void;

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
  addCustomSection: (title?: string) => void;
  updateCustomSection: (id: string, updated: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, index: number, updated: Partial<CustomSectionItem>) => void;
  removeCustomSectionItem: (sectionId: string, index: number) => void;
  updateSectionTitle: (sectionKey: string, title: string) => void;
  toggleSectionVisibility: (section: string) => void;
  reorderSections: (newOrder: string[]) => void;
  moveSectionOrder: (sectionKey: string, direction: 'up' | 'down') => void;
  moveSectionToPosition: (sourceKey: string, targetKey: string, position?: 'before' | 'after') => void;
  setSectionColumn: (sectionKey: string, column: 'left' | 'right') => void;
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
    layoutMode: 'single-column',
    skillsColumns: 2,
    sideBySideEducationCert: false,
    fitToSinglePage: true,
    leftSections: ['skills', 'education', 'certifications'],
    rightSections: ['summary', 'experience', 'projects'],
  },
  atsAnalysis: null,
  isAnalyzing: false,
  activeTab: 'editor',
  zoom: 1.0,
  showTailorModal: false,
  showBulletModal: false,
  activeBulletContext: null,

  currentResumeId: null,
  currentResumeTitle: null,
  setCurrentResumeId: (id, title = null) => set({ currentResumeId: id, currentResumeTitle: title }),
  resetResume: () => set({
    resumeData: createEmptyResume(),
    currentResumeId: null,
    currentResumeTitle: null,
  }),

  focusedSection: null,
  focusTimestamp: 0,
  focusSection: (sectionKey) =>
    set({
      focusedSection: sectionKey,
      focusTimestamp: Date.now(),
      activeTab: 'editor',
    }),

  previewModalTemplate: null,
  isPreviewModalOpen: false,
  openPreviewModal: (templateId) =>
    set((state) => ({
      previewModalTemplate: templateId || state.activeTemplate,
      isPreviewModalOpen: true,
    })),
  closePreviewModal: () =>
    set({
      isPreviewModalOpen: false,
      previewModalTemplate: null,
    }),

  setResumeData: (data) => set({ resumeData: sanitizeResumeData(data) }),

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

  addCustomSection: (title = 'Awards & Honors') =>
    set((state) => {
      const newSecId = 'custom-' + Date.now();
      const newSec: CustomSection = {
        id: newSecId,
        title,
        items: [
          {
            title: 'Outstanding Technical Achievement Award',
            subtitle: 'Company Annual Summit',
            date: '2023',
            description: 'Recognized for pioneering high-concurrency payment engine.',
          },
        ],
      };
      const existing = state.resumeData.customSections || [];
      const order = state.resumeData.sectionOrder || [];
      return {
        resumeData: {
          ...state.resumeData,
          customSections: [...existing, newSec],
          sectionOrder: [...order, newSecId],
          sectionTitles: {
            ...(state.resumeData.sectionTitles || {}),
            [newSecId]: title,
          },
          visibleSections: {
            ...state.resumeData.visibleSections,
            [newSecId]: true,
          },
        },
      };
    }),

  updateCustomSection: (id, updated) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: (state.resumeData.customSections || []).map((sec) =>
          sec.id === id ? { ...sec, ...updated } : sec
        ),
        sectionTitles: updated.title
          ? {
              ...(state.resumeData.sectionTitles || {}),
              [id]: updated.title,
            }
          : state.resumeData.sectionTitles,
      },
    })),

  removeCustomSection: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: (state.resumeData.customSections || []).filter((s) => s.id !== id),
        sectionOrder: (state.resumeData.sectionOrder || []).filter((s) => s !== id),
      },
    })),

  addCustomSectionItem: (sectionId) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: (state.resumeData.customSections || []).map((sec) => {
          if (sec.id !== sectionId) return sec;
          const newItem: CustomSectionItem = {
            title: 'New Achievement / Award',
            subtitle: 'Issuing Organization',
            date: '2024',
            description: 'Details and scope of the recognition.',
          };
          return { ...sec, items: [...sec.items, newItem] };
        }),
      },
    })),

  updateCustomSectionItem: (sectionId, index, updated) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: (state.resumeData.customSections || []).map((sec) => {
          if (sec.id !== sectionId) return sec;
          const newItems = [...sec.items];
          newItems[index] = { ...newItems[index], ...updated };
          return { ...sec, items: newItems };
        }),
      },
    })),

  removeCustomSectionItem: (sectionId, index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: (state.resumeData.customSections || []).map((sec) => {
          if (sec.id !== sectionId) return sec;
          return { ...sec, items: sec.items.filter((_, i) => i !== index) };
        }),
      },
    })),

  updateSectionTitle: (sectionKey, title) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        sectionTitles: {
          ...(state.resumeData.sectionTitles || {}),
          [sectionKey]: title,
        },
        customSections: (state.resumeData.customSections || []).map((sec) =>
          sec.id === sectionKey ? { ...sec, title } : sec
        ),
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

  moveSectionOrder: (sectionKey, direction) =>
    set((state) => {
      const order = [...(state.resumeData.sectionOrder || ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'])];
      const idx = order.indexOf(sectionKey);
      if (idx === -1) return state;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= order.length) return state;
      const temp = order[idx];
      order[idx] = order[targetIdx];
      order[targetIdx] = temp;
      return {
        resumeData: {
          ...state.resumeData,
          sectionOrder: order,
        },
      };
    }),

  moveSectionToPosition: (sourceKey, targetKey, position = 'before') =>
    set((state) => {
      const defaultOrder = ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'];
      const baseOrder = (state.resumeData.sectionOrder && state.resumeData.sectionOrder.length > 0)
        ? state.resumeData.sectionOrder
        : defaultOrder;
      const customIds = (state.resumeData.customSections || []).map((s) => s.id);
      const fullOrder = [
        ...baseOrder,
        ...customIds.filter((id) => !baseOrder.includes(id)),
      ];

      const fromIndex = fullOrder.indexOf(sourceKey);
      if (fromIndex === -1) return state;

      const orderWithoutSource = fullOrder.filter((k) => k !== sourceKey);
      const toIndex = orderWithoutSource.indexOf(targetKey);
      if (toIndex === -1) return state;

      const insertIndex = position === 'after' ? toIndex + 1 : toIndex;
      orderWithoutSource.splice(insertIndex, 0, sourceKey);

      return {
        resumeData: {
          ...state.resumeData,
          sectionOrder: orderWithoutSource,
        },
      };
    }),

  setSectionColumn: (sectionKey, column) =>
    set((state) => {
      const left = [...(state.theme.leftSections || ['skills', 'education', 'certifications'])].filter((s) => s !== sectionKey);
      const right = [...(state.theme.rightSections || ['summary', 'experience', 'projects'])].filter((s) => s !== sectionKey);
      if (column === 'left') {
        left.push(sectionKey);
      } else {
        right.push(sectionKey);
      }
      return {
        theme: {
          ...state.theme,
          leftSections: left,
          rightSections: right,
        },
      };
    }),

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

