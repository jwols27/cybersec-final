import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { PetService } from '../services/petService';

const router = Router();
const prisma = new PrismaClient();

router.get('/me', authenticateJWT, async (req: AuthRequest, res) => {
	const user = await prisma.user.findUnique({ where: { email: req.user?.email } });
	if (!user) return res.status(404).json({ error: 'User not found' });
	res.json({ user });
});

router.get('/data', authenticateJWT, (_, res) => {
	const service = new PetService();
	res.json({ data: service.getPets() });
});

export default router;
