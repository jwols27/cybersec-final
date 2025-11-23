import { RequestHandler } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/authService';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const prisma = new PrismaClient();

export const getConfig: RequestHandler = async (_, res) => {
	res.json({ GOOGLE_CLIENT_ID });
};

export const loginWithGoogle: RequestHandler = async (req, res) => {
	try {
		const { credential } = req.body;

		if (!credential) {
			return res.status(400).json({ error: 'No credential provided' });
		}

		const payload = await verifyGoogleIdToken(credential);

		const { sub, email } = payload;

		if (!sub || !email || typeof email !== 'string') {
			return res.status(400).json({ error: 'Malformed credentials' });
		}

		const existing = await prisma.user.findFirst({
			where: { OR: [{ email }, { googleId: sub }] }
		});

		if (existing) {
			await prisma.user.update({
				where: { id: existing.id },
				data: { email, googleId: sub }
			});
		} else {
			await prisma.user.create({
				data: { email, googleId: sub }
			});
		}

		const authToken = AuthService.signJWT(email);

		res.json({
			authToken,
			success: true
		});
	} catch (error) {
		console.error('Google auth error:', error);
		res.status(401).json({ error: 'Authentication failed' });
	}
};

const verifyGoogleIdToken = async (idToken: string) => {
	const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

	try {
		const { payload } = await jwtVerify(idToken, JWKS, {
			issuer: ['https://accounts.google.com', 'accounts.google.com'],
			audience: GOOGLE_CLIENT_ID
		});
		return payload;
	} catch (error) {
		throw new Error('Invalid Google ID token');
	}
};
