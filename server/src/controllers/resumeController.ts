import { Request, Response } from 'express';
import { storeService } from '../services/storeService.js';

export const resumeController = {
  async getAllResumes(req: Request, res: Response) {
    try {
      const resumes = await storeService.getAll();
      return res.json({ success: true, count: resumes.length, data: resumes });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async getResumeById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const resume = await storeService.getById(id);
      if (!resume) {
        return res.status(404).json({ success: false, error: 'Resume not found' });
      }
      return res.json({ success: true, data: resume });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async saveResume(req: Request, res: Response) {
    try {
      const { id } = req.body;
      let resume;
      if (id) {
        resume = await storeService.update(String(id), req.body);
      }
      if (!resume) {
        resume = await storeService.create(req.body);
      }
      return res.json({ success: true, data: resume });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async deleteResume(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const deleted = await storeService.delete(id);
      return res.json({ success: deleted });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};

