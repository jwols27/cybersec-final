import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
	user?: { email: string };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

	const token = authHeader.split(' ')[1];
	if (!token) return res.status(401).json({ error: 'Invalid Authorization header format' });

	try {
		req.user = jwt.verify(token, JWT_SECRET) as { email: string };
		next();
	} catch {
		return res.status(403).json({ error: 'Invalid or expired token' });
	}
};
