import { Router } from 'express';
import { login, logout, me, register, verify2FA } from '../controllers/authController';
import { loginLimiter } from '../middleware/rateLimit';
import { getConfig, loginWithGoogle } from '../controllers/oauthController';

const router = Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/2fa/verify', verify2FA);
router.get('/me', me);
router.post('/logout', logout);
router.get('/oauth-config', getConfig);
router.post('/google', loginWithGoogle);

export default router;
