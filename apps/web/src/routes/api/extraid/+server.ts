import { getLatestExtraID } from 'kideappbot';
import type { RequestHandler } from '../$types';

export const GET: RequestHandler = async () => {
	const id = await getLatestExtraID();
	return new Response(String(id));
};
