import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
	windowMs: 60 * 1000,
	limit: 5,
	message: { error: 'Too many login attempts. Try again later.' },
	standardHeaders: true,
	legacyHeaders: false
});
