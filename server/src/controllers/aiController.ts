import { Request, Response } from 'express';
import { aiGateway } from '../services/aiGateway.js';

export const aiController = {
  async parseUpload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No resume file uploaded' });
      }

      const { buffer, originalname, mimetype } = req.file;
      const parsedResume = await aiGateway.parseResumeFile(buffer, originalname, mimetype);
      return res.json({ success: true, data: parsedResume });
    } catch (err: any) {
      console.error('Parse upload error:', err.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to process document with AI service: ' + (err.response?.data?.detail || err.message),
      });
    }
  },

  async analyzeAts(req: Request, res: Response) {
    try {
      const resume = req.body;
      const analysis = await aiGateway.analyzeAts(resume);
      return res.json({ success: true, data: analysis });
    } catch (err: any) {
      console.error('ATS analysis error:', err.message);
      return res.status(500).json({
        success: false,
        error: 'ATS analysis failed: ' + (err.response?.data?.detail || err.message),
      });
    }
  },

  async improveBullet(req: Request, res: Response) {
    try {
      const { bullet, role } = req.body;
      if (!bullet) {
        return res.status(400).json({ success: false, error: 'Bullet text is required' });
      }
      const result = await aiGateway.improveBullet(bullet, role);
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: 'Optimization failed: ' + (err.response?.data?.detail || err.message),
      });
    }
  },

  async tailorResume(req: Request, res: Response) {
    try {
      const { resume, jobDescription } = req.body;
      if (!jobDescription) {
        return res.status(400).json({ success: false, error: 'Job description is required' });
      }
      const result = await aiGateway.tailorResume(resume, jobDescription);
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: 'Tailoring failed: ' + (err.response?.data?.detail || err.message),
      });
    }
  },

  async exportDocx(req: Request, res: Response) {
    try {
      const resume = req.body;
      const template = (req.query.template as string) || 'classic-ats';
      const docxBuffer = await aiGateway.generateDocx(resume, template);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename=resume_${template}.docx`);
      return res.send(docxBuffer.data);
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: 'DOCX generation failed: ' + (err.response?.data?.detail || err.message),
      });
    }
  },
};
