import { isDev } from '@common/utils';

export function getAllowedOrigin(): string {
	return isDev() ? '*' : process.env.ALLOWED_ORIGIN ?? '';
}

export const getServerPort = (): number => {
	return parseInt(process.env.PORT ?? '3000', 10);
};
