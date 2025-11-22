import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/me', authenticateJWT, async (req: AuthRequest, res) => {
	const user = await prisma.user.findUnique({ where: { email: req.user?.email } });
	if (!user) return res.status(404).json({ error: 'User not found' });
	res.json({ user });
});

export default router;
