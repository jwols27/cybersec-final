import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { generate2FASecret, verify2FAToken } from '../utils/totps';

const prisma = new PrismaClient();
const SECURE = !process.env.DEV;
const JWT_SECRET = process.env.JWT_SECRET!;
const PENDING_SECRET = process.env.PENDING_SECRET!;

export const register: RequestHandler = async (req, res) => {
	const { email, password } = req.body;
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return res.status(400).json({ error: 'Email already registered' });

	const hashed = await bcrypt.hash(password, 10);
	const { secret, qrCodeDataURL } = await generate2FASecret(email);

	await prisma.user.create({
		data: { email, password: hashed, secret }
	});

	res.json({ message: 'Registered', qrCodeDataURL });
};

export const login: RequestHandler = async (req, res) => {
	const { email, password } = req.body;
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return res.status(404).json({ error: 'User not found' });

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

	const pendingToken = jwt.sign({ email }, PENDING_SECRET, { expiresIn: '1m' });

	res.cookie('pending', pendingToken, {
		httpOnly: true,
		sameSite: 'lax',
		secure: SECURE,
		maxAge: 60 * 1000
	});

	res.json({ message: 'Password OK, please verify 2FA within 1 minute' });
};

export const verify2FA: RequestHandler = async (req, res) => {
	const { token } = req.body;
	const pendingToken = req.cookies?.pending;

	if (!pendingToken) {
		return res.status(400).json({ error: 'Missing pending token cookie' });
	}

	try {
		const decoded = jwt.verify(pendingToken, PENDING_SECRET) as { email: string };
		const user = await prisma.user.findUnique({ where: { email: decoded.email } });
		if (!user) return res.status(404).json({ error: 'User not found' });

		const valid = verify2FAToken(user.secret, token);
		if (!valid) return res.status(401).json({ error: 'Invalid 2FA code' });

		res.clearCookie('pending');

		const authToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

		res.json({ message: '2FA verified', token: authToken });
	} catch (err) {
		res.clearCookie('pending');
		return res.status(403).json({ error: 'Pending token expired or invalid' });
	}
};
