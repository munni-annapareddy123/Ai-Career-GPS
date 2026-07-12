import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { upload, uploadResume, getResumes, getLatestResume } from '../controllers/resumeController';

const router = Router();

router.use(authenticate);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/latest', getLatestResume);

export default router;
