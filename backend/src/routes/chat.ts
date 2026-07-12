import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getChats, getChatById, createChat, sendMessage, sendMessageStream,
  archiveChat, deleteChat, searchChats, renameChat,
} from '../controllers/chatController';

const router = Router();

router.use(authenticate);

router.get('/', getChats);
router.get('/search', searchChats);
router.post('/', createChat);
router.get('/:id', getChatById);
router.post('/:chatId/messages', sendMessage);
router.post('/:chatId/stream', sendMessageStream);
router.put('/:id', renameChat);
router.put('/:id/archive', archiveChat);
router.delete('/:id', deleteChat);

export default router;
