import { decodeJwt, errors } from 'jose';

export const isValidJwt = (token: string) => {
	try {
		decodeJwt(token);
		return true;
	} catch (error) {
		if (error instanceof errors.JOSEError) {
			return false;
		}
		throw error;
	}
};
