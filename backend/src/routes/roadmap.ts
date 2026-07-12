import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getRoadmaps, getCurrentRoadmap, generateNewRoadmap,
  updateTaskStatus, regenerateRoadmap,
} from '../controllers/roadmapController';

const router = Router();

router.use(authenticate);

router.get('/', getRoadmaps);
router.get('/current', getCurrentRoadmap);
router.post('/generate', generateNewRoadmap);
router.put('/tasks/:taskId', updateTaskStatus);
router.put('/:roadmapId/regenerate', regenerateRoadmap);

export default router;
