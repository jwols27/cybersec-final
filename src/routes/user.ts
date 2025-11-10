import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticateJWT, (req: AuthRequest, res) => {
	res.json({ message: 'Welcome!', email: req.user?.email });
});

export default router;
