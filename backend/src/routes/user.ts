import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getProfile, updateProfile, getUser, updateUser,
  addSkill, updateSkill, deleteSkill,
  addCertification, addProject, addInternship,
  getDashboard,
} from '../controllers/userController';

const router = Router();

router.use(authenticate);

router.get('/me', getUser);
router.put('/me', updateUser);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);

router.post('/skills', addSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

router.post('/certifications', addCertification);
router.post('/projects', addProject);
router.post('/internships', addInternship);

export default router;
