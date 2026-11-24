import { create } from 'zustand';
import { TemplateMeta, TemplateId } from '../types/resume';
import { CustomTemplateRecord } from '../types/auth';
import { TEMPLATES_CONFIG } from '../utils/templateDefinitions';

const CUSTOM_TEMPLATES_KEY = 'ai_resume_custom_templates';

interface TemplateState {
  customTemplates: CustomTemplateRecord[];
  allTemplates: TemplateMeta[];
  isAdminModalOpen: boolean;
  
  // Actions
  loadCustomTemplates: () => void;
  createCustomTemplate: (template: Omit<CustomTemplateRecord, 'id' | 'createdAt'>) => CustomTemplateRecord;
  deleteCustomTemplate: (id: string) => void;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  getTemplateMeta: (templateId: TemplateId) => TemplateMeta | undefined;
  getBaseLayout: (templateId: TemplateId) => 'classic-ats' | 'modern-pro' | 'minimalist' | 'executive' | 'creative' | 'technical' | 'academic';
}

function getStoredCustomTemplates(): CustomTemplateRecord[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read custom templates from localStorage', e);
  }
  return [];
}

function saveStoredCustomTemplates(templates: CustomTemplateRecord[]): void {
  try {
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
  } catch (e) {
    console.error('Could not save custom templates to localStorage', e);
  }
}

function mergeAllTemplates(custom: CustomTemplateRecord[]): TemplateMeta[] {
  const customAsMeta: TemplateMeta[] = custom.map((c) => ({
    id: c.id,
    name: c.name,
    bestSuitedFor: c.bestSuitedFor,
    category: c.category as any,
    isAtsOptimized: c.isAtsOptimized,
    atsScoreEstimate: c.atsScoreEstimate,
    layoutType: c.layoutType as any,
    description: c.description,
  }));
  return [...TEMPLATES_CONFIG, ...customAsMeta];
}

export const useTemplateStore = create<TemplateState>((set, get) => {
  const initialCustom = getStoredCustomTemplates();

  return {
    customTemplates: initialCustom,
    allTemplates: mergeAllTemplates(initialCustom),
    isAdminModalOpen: false,

    loadCustomTemplates: () => {
      const custom = getStoredCustomTemplates();
      set({
        customTemplates: custom,
        allTemplates: mergeAllTemplates(custom),
      });
    },

    createCustomTemplate: (templateData) => {
      const newRecord: CustomTemplateRecord = {
        ...templateData,
        id: `tpl-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const updated = [...get().customTemplates, newRecord];
      saveStoredCustomTemplates(updated);
      set({
        customTemplates: updated,
        allTemplates: mergeAllTemplates(updated),
      });
      return newRecord;
    },

    deleteCustomTemplate: (id: string) => {
      const updated = get().customTemplates.filter((t) => t.id !== id);
      saveStoredCustomTemplates(updated);
      set({
        customTemplates: updated,
        allTemplates: mergeAllTemplates(updated),
      });
    },

    openAdminModal: () => set({ isAdminModalOpen: true }),
    closeAdminModal: () => set({ isAdminModalOpen: false }),

    getTemplateMeta: (templateId: TemplateId) => {
      return get().allTemplates.find((t) => t.id === templateId);
    },

    getBaseLayout: (templateId: TemplateId) => {
      // Check if it's one of the built-ins
      const builtins = ['classic-ats', 'modern-pro', 'minimalist', 'executive', 'creative', 'technical', 'academic'];
      if (builtins.includes(templateId)) {
        return templateId as any;
      }
      // Check if it's a custom template
      const custom = get().customTemplates.find((t) => t.id === templateId);
      if (custom) {
        return custom.baseLayout;
      }
      return 'classic-ats';
    },
  };
});
