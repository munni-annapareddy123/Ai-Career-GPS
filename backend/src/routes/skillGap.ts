import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getSkillGaps, analyzeSkillGaps, updateSkillGap } from '../controllers/skillGapController';

const router = Router();

router.use(authenticate);

router.get('/', getSkillGaps);
router.post('/analyze', analyzeSkillGaps);
router.put('/:id', updateSkillGap);

export default router;
