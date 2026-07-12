import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getRecommendations, generateRecommendations,
  acceptRecommendation, getRecommendationById,
} from '../controllers/recommendationController';

const router = Router();

router.use(authenticate);

router.get('/', getRecommendations);
router.post('/generate', generateRecommendations);
router.get('/:id', getRecommendationById);
router.post('/:id/accept', acceptRecommendation);

export default router;
