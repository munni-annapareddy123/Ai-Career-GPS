import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  startInterview, submitAnswer, getInterviews,
  getInterviewById, completeInterview,
} from '../controllers/interviewController';

const router = Router();

router.use(authenticate);

router.get('/', getInterviews);
router.post('/start', startInterview);
router.get('/:id', getInterviewById);
router.post('/:interviewId/answers', submitAnswer);
router.post('/:interviewId/complete', completeInterview);

export default router;
