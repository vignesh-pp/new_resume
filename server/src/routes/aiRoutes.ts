import { Router } from 'express';
import multer from 'multer';
import { aiController } from '../controllers/aiController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

const router = Router();

router.post('/parse-upload', upload.single('file'), aiController.parseUpload);
router.post('/analyze-ats', aiController.analyzeAts);
router.post('/improve-bullet', aiController.improveBullet);
router.post('/tailor-resume', aiController.tailorResume);
router.post('/export-docx', aiController.exportDocx);

export default router;

