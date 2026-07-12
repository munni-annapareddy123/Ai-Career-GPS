import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getNotifications, markAsRead, markAllAsRead, getUnreadCount,
} from '../controllers/notificationController';

const router = Router();

router.use(authenticate);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

export default router;
