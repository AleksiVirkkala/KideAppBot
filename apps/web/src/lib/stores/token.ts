import { localStorageStore } from '@skeletonlabs/skeleton';
import { derived, type Writable } from 'svelte/store';
import { decodeJwt, errors } from 'jose';

export interface AuthTokenPayload {
	aud: string;
	exp: number;
	iss: string;
	nbf: number;
	sub: string;
	token_id: string;
	user_id: string;
}

export const token: Writable<string> = localStorageStore('token', '');

export const tokenIsSet = derived(token, $token => !!$token);

export const decodedToken = derived(token, $token => {
	if ($token.startsWith('"') || $token.endsWith('"')) {
		return null;
	}
	try {
		const { exp, sub } = decodeJwt($token);
		if (!exp || !sub) return null;

		return {
			expEpoch: exp,
			expDate: new Date(exp * 1000),
			userEmail: sub
		};
	} catch (error) {
		if (error instanceof errors.JOSEError) {
			return null;
		}
		throw error;
	}
});

export const tokenIsExpired = derived(decodedToken, $decodedToken => {
	const now = new Date();
	return $decodedToken && $decodedToken.expDate < now;
});

tokenIsExpired.subscribe(expired => {
	// User should sign in again if token is expired
	if (expired) token.set('');
});
