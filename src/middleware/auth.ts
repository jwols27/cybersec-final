import jwt from 'jsonwebtoken';
import { Request, RequestHandler } from 'express';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
	user?: { email: string };
}

export const authenticateJWT: RequestHandler = (req: AuthRequest, res, next) => {
	const token = req.cookies?.auth;

	if (!token) {
		return res.status(401).json({ error: 'Not authenticated' });
	}

	try {
		req.user = jwt.verify(token, JWT_SECRET) as { email: string };
		next();
	} catch {
		res.clearCookie('auth');
		return res.status(403).json({ error: 'Invalid or expired token' });
	}
};
