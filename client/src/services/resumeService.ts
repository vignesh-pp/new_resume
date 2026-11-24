import axios from 'axios';
import { ResumeSchema, TemplateId } from '../types/resume';
import { SavedResumeRecord, User } from '../types/auth';
import { isLiveApiEnabled } from '../config/env';
import { sanitizeResumeData } from '../utils/sanitizeResume';

const STORAGE_KEY = 'ai_resume_saved_resumes';

// Seed sample resumes if none exist
function getLocalResumes(): SavedResumeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read resumes from localStorage', e);
  }
  return [];
}

function saveLocalResumes(resumes: SavedResumeRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  } catch (e) {
    console.error('Could not save resumes to localStorage', e);
  }
}

export const resumeService = {
  /**
   * Retrieves resumes. If admin, returns all resumes. Otherwise returns user's resumes.
   */
  async getResumes(user?: User | null): Promise<SavedResumeRecord[]> {
    if (isLiveApiEnabled()) {
      try {
        const resp = await axios.get('/api/resumes');
        if (resp.data?.success && Array.isArray(resp.data.data)) {
          const all: SavedResumeRecord[] = resp.data.data.map((item: any) => ({
            id: item._id || item.id,
            userId: item.userId || 'usr-alex-1',
            userEmail: item.userEmail || '',
            userName: item.userName || '',
            title: item.title || 'Untitled Resume',
            templateId: item.templateId || 'classic-ats',
            theme: item.theme || {},
            content: sanitizeResumeData(item.content),
            atsScore: item.atsScore || 85,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
          }));

          if (user?.role === 'admin') {
            return all;
          }
          return all.filter((r) => !user || r.userId === user.id);
        }
      } catch (err) {
        console.warn('Live API resumes fetch failed, falling back to local storage:', err);
      }
    }

    // LocalStorage fallback
    const all = getLocalResumes();
    if (!user) return all;
    if (user.role === 'admin') return all;
    return all.filter((r) => r.userId === user.id);
  },

  /**
   * Saves or updates a resume.
   */
  async saveResume(
    content: ResumeSchema,
    templateId: TemplateId,
    theme: any,
    atsScore: number,
    user: User,
    existingId?: string | null,
    customTitle?: string
  ): Promise<SavedResumeRecord> {
    const sanitizedContent = sanitizeResumeData(content);
    const title = customTitle || `${sanitizedContent.personalInfo.fullName || 'My'} Resume`;
    const now = new Date().toISOString();

    if (isLiveApiEnabled()) {
      try {
        const payload = {
          id: existingId || undefined,
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          title,
          templateId,
          theme,
          content: sanitizedContent,
          atsScore,
        };

        const resp = await axios.post('/api/resumes', payload);
        if (resp.data?.success && resp.data.data) {
          const item = resp.data.data;
          return {
            id: item._id || item.id,
            userId: user.id,
            userEmail: user.email,
            userName: user.name,
            title,
            templateId,
            theme,
            content: sanitizedContent,
            atsScore,
            createdAt: item.createdAt || now,
            updatedAt: item.updatedAt || now,
          };
        }
      } catch (err) {
        console.warn('Live API save failed, falling back to local storage:', err);
      }
    }

    // Local storage persistence
    const resumes = getLocalResumes();
    let record: SavedResumeRecord;

    if (existingId) {
      const idx = resumes.findIndex((r) => r.id === existingId);
      if (idx !== -1) {
        record = {
          ...resumes[idx],
          title,
          templateId,
          theme,
          content: sanitizedContent,
          atsScore,
          updatedAt: now,
        };
        resumes[idx] = record;
        saveLocalResumes(resumes);
        return record;
      }
    }

    // Create new
    record = {
      id: 'res-' + Date.now(),
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      title,
      templateId,
      theme,
      content: sanitizedContent,
      atsScore,
      createdAt: now,
      updatedAt: now,
    };
    resumes.unshift(record);
    saveLocalResumes(resumes);
    return record;
  },

  /**
   * Deletes a resume by ID.
   */
  async deleteResume(id: string): Promise<boolean> {
    if (isLiveApiEnabled()) {
      try {
        await axios.delete(`/api/resumes/${id}`);
      } catch (err) {
        console.warn('Live API delete failed:', err);
      }
    }

    const resumes = getLocalResumes().filter((r) => r.id !== id);
    saveLocalResumes(resumes);
    return true;
  },

  /**
   * Duplicates an existing resume.
   */
  async duplicateResume(id: string, user: User): Promise<SavedResumeRecord | null> {
    const resumes = getLocalResumes();
    const target = resumes.find((r) => r.id === id);
    if (!target) return null;

    const copy: SavedResumeRecord = {
      ...target,
      id: 'res-' + Date.now(),
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    resumes.unshift(copy);
    saveLocalResumes(resumes);
    return copy;
  },
};
