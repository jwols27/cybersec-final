import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { generate2FASecret, verify2FAToken } from '../utils/totps';
import { AuthService } from '../services/authService';

const prisma = new PrismaClient();
const SECURE = !process.env.DEV;
const PENDING_SECRET = process.env.PENDING_SECRET!;

const generatePendingToken = async (email: string, expiresIn: '1m' | '5m') => {
	return jwt.sign({ email }, PENDING_SECRET, { expiresIn });
};

export const register: RequestHandler = async (req, res) => {
	const { email, password } = req.body;
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return res.status(400).json({ error: 'Email already registered' });

	const hashed = await bcrypt.hash(password, 10);
	const { secret, qrCodeDataURL } = await generate2FASecret(email);

	await prisma.user.create({ data: { email, password: hashed, secret } });

	const pendingToken = await generatePendingToken(email, '5m');

	res.json({ message: 'Registered, please verify 2FA within 5 minutes', qrCodeDataURL, pendingToken });
};

export const login: RequestHandler = async (req, res) => {
	const { email, password } = req.body;
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user || !user.password) return res.status(404).json({ error: 'User not found' });

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

	const { qrCodeDataURL } = user.verified2FA ? {} : await generate2FASecret(email);
	const pendingToken = await generatePendingToken(email, '1m');

	res.json({ message: 'Logged in, please verify 2FA within 1 minute', qrCodeDataURL, pendingToken });
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
		if (!user || !user.secret) return res.status(404).json({ error: 'User not found' });

		const valid = verify2FAToken(user.secret, token);
		if (!valid) return res.status(401).json({ error: 'Invalid 2FA code' });

		res.clearCookie('pending');

		const authToken = AuthService.signJWT(user.email);

		await prisma.user.update({ where: { id: user.id }, data: { verified2FA: true } });

		res.json({ message: '2FA verified', authToken });
	} catch (err) {
		res.clearCookie('pending');
		return res.status(403).json({ error: 'Pending token expired or invalid' });
	}
};

export const me: RequestHandler = async (req, res) => {
	const token = req.cookies?.auth;

	if (!token) {
		return res.status(401).json({ error: 'Not authenticated' });
	}

	try {
		const decoded = AuthService.verifyJWT(token);
		console.log(decoded);

		const user = await prisma.user.findUnique({
			where: { email: decoded.email }
		});

		if (!user) return res.status(404).json({ error: 'User not found' });

		res.json({ user });
	} catch (err) {
		res.clearCookie('auth');
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
};

export const logout: RequestHandler = async (_, res) => {
	res.clearCookie('auth', { httpOnly: true, sameSite: 'lax', secure: SECURE });
	res.json({ message: 'Logged out' });
};
