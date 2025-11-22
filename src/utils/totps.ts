import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generate2FASecret = async (email: string) => {
	const secret = speakeasy.generateSecret({
		name: `Cybersec Final (${email})`
	});

	const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url!);

	return { secret: secret.base32, qrCodeDataURL };
};

export const verify2FAToken = (secret: string, token: string) => {
	return speakeasy.totp.verify({
		secret,
		encoding: 'base32',
		token,
		window: 1
	});
};
