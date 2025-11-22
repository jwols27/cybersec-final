import { Router } from 'express';
import { requireApiCertificate } from '../middleware/api';
import { PetService } from '../services/petService';

const router = Router();
router.get('/data', requireApiCertificate, (_, res) => {
	const service = new PetService();
	res.json({ data: service.getPets() });
});

export default router;
