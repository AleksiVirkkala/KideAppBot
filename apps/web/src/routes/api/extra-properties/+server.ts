import { getLatestExtraProperties } from 'kideappbot';
import type { RequestHandler } from '../$types';

export const GET: RequestHandler = async () => {
	const extraProperties = await getLatestExtraProperties();

	const headers = new Headers();
	headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');

	return new Response(JSON.stringify(extraProperties), { headers });
};
