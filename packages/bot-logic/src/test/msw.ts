import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { RestResponseResolver } from './testUtils';

// Data
import {
	eventNon200,
	eventOnSale,
	eventSalesNotStarted,
	eventVariantsFirstMissing
} from '../private/pageData';

export const reqHandlerVariantsMissing: RestResponseResolver = (req, res, ctx) => {
	return res.once(ctx.status(200), ctx.json(eventVariantsFirstMissing.pageDataNoVariants));
};

export const reqHandlerVariantsExist: RestResponseResolver = (req, res, ctx) => {
	return res.once(ctx.status(200), ctx.json(eventVariantsFirstMissing.pageDataVariants));
};

export const reqHandlerSalesEnded: RestResponseResolver = (req, res, ctx) => {
	return res.once(ctx.status(200), ctx.json(eventVariantsFirstMissing.pageDataSalesEnded));
};

export const reqHandlerSalesNotStarted: RestResponseResolver = (req, res, ctx) => {
	return res.once(ctx.status(200), ctx.json(eventSalesNotStarted.pageDataNotStarted));
};

export const reqHandler500: RestResponseResolver = (req, res, ctx) => {
	return res.once(ctx.status(500), ctx.json(eventVariantsFirstMissing.pageDataNoVariants));
};

export const restHandlers = [
	// Succesfull product page
	rest.get(eventOnSale.apiUrl, (req, res, ctx) => {
		return res(ctx.status(200), ctx.json(eventOnSale.pageData));
	}),
	// Failing product page
	rest.get(eventNon200.apiUrl, (req, res) => {
		return res.networkError('Something went wrong');
	}),

	rest.get('https://testi.com', (req, res, ctx) => {
		return res(ctx.status(200));
	})
];

export const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => {
	server.resetHandlers();
	server.restoreHandlers();
});
