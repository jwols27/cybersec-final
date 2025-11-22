import { Request, RequestHandler } from 'express';

interface ClientRequest extends Request {
	client?: { authorized: boolean };
}

const requireApiCertificate: RequestHandler = (req: ClientRequest, res, next) => {
	if (!req.client?.authorized) {
		return res.status(403).json({ error: 'Client certificate required or invalid' });
	}
	next();
};

export { requireApiCertificate };
