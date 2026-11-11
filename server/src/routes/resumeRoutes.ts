import { Router } from 'express';
import { resumeController } from '../controllers/resumeController.js';

const router = Router();

router.get('/', resumeController.getAllResumes);
router.get('/:id', resumeController.getResumeById);
router.post('/', resumeController.saveResume);
router.put('/:id', resumeController.saveResume);
router.delete('/:id', resumeController.deleteResume);

export default router;

