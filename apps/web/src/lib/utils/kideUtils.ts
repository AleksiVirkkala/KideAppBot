import { decodeJwt, errors } from 'jose';

interface Credentials {
	email: string;
	password: string;
}

interface SuccessResult {
	success: true;
	token: string;
}
interface ErrorResult {
	success: false;
	error: string;
}

type Result = SuccessResult | ErrorResult;

export const loginUser = async ({ email, password }: Credentials): Promise<Result> => {
	const payload = `client_id=56d9cbe22a58432b97c287eadda040df&grant_type=password&password=${password}&rememberMe=true&username=${email}`;
	const response = await fetch('https://auth.kide.app/oauth2/token', {
		method: 'POST',
		body: payload
	});

	if (response.status !== 200) {
		return {
			success: false,
			error: 'Invalid credentials'
		};
	}
	const data = await response.json();

	return {
		success: true,
		token: data.access_token
	};
};

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
