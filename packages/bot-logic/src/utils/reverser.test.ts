import { describe, it } from 'vitest';
import { getLatestExtraProperties } from './reverser';
import { calculateXRequestedId } from '.';

describe('reverser', () => {
	it('Should extract latest extraID from Kide.app', async () => {
		await getLatestExtraProperties();
	});
	it('Should calculate id correctly', () => {
		const result = calculateXRequestedId('241c097a-e5e9-4b3e-a31c-76c658dbee91', '8f9c151f');
		console.log(result);
	});
});
