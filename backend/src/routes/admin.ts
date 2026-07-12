import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getUsers, updateUserRole, deleteUser, getAnalytics,
  manageCareer, addMarketInsight, addLearningResource, getLearningResources,
} from '../controllers/adminController';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/users', getUsers);
router.put('/users/:userId/role', authorize('SUPER_ADMIN'), updateUserRole);
router.delete('/users/:userId', authorize('SUPER_ADMIN'), deleteUser);
router.get('/analytics', getAnalytics);

router.post('/careers', manageCareer);
router.post('/market-insights', addMarketInsight);
router.post('/learning-resources', addLearningResource);
router.get('/learning-resources', getLearningResources);

export default router;
