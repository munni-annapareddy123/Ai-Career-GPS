import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  register, login, googleLogin,
  refreshToken, forgotPassword, verifyResetOTP, resetPassword,
  changePassword, logout, logoutAllDevices,
  getSessions, getLoginHistory, getSecurityLogs,
} from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

router.use(authenticate);
router.post('/change-password', changePassword);
router.post('/logout', logout);
router.post('/logout-all', logoutAllDevices);
router.get('/sessions', getSessions);
router.get('/login-history', getLoginHistory);
router.get('/security-logs', getSecurityLogs);

export default router;
