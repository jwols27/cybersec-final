import jwt, { JwtPayload } from 'jsonwebtoken';

type AuthPayload = JwtPayload & { email: string };

export class AuthService {
	static JWT_SECRET = process.env.JWT_SECRET!;

	static signJWT(email: string) {
		return jwt.sign({ email: email }, this.JWT_SECRET, { expiresIn: '1h' });
	}

	static verifyJWT(token: string): AuthPayload {
		return jwt.verify(token, this.JWT_SECRET) as AuthPayload;
	}
}
