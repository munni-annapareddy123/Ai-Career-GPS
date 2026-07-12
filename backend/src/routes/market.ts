import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getMarketInsights, getTrendingSkills, getFutureSkills,
  getSalaryTrends, getTopCompanies,
} from '../controllers/marketController';

const router = Router();

router.use(authenticate);

router.get('/', getMarketInsights);
router.get('/trending-skills', getTrendingSkills);
router.get('/future-skills', getFutureSkills);
router.get('/salary-trends', getSalaryTrends);
router.get('/top-companies', getTopCompanies);

export default router;
