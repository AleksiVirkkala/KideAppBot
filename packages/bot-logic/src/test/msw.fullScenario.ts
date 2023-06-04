import { RestResponseResolver } from './testUtils';
import { eventFull } from '@aleksivirkkala/kideappbot-private/pageData';

const variantsMissing: RestResponseResolver = (req, res, ctx) => {
	return res.once(ctx.status(200), ctx.json(eventFull.product.noVariants));
};

const variantsExist: RestResponseResolver = (req, res, ctx) => {
	return res.once(ctx.status(200), ctx.json(eventFull.product.halfVariants));
};

const salesEnded: RestResponseResolver = (req, res, ctx) => {
	return res.once(ctx.status(200), ctx.json(eventFull.product.salesEnded));
};

const salesNotStarted: RestResponseResolver = (req, res, ctx) => {
	return res.once(ctx.status(200), ctx.json(eventFull.product.salesNotStarted));
};

const error500: RestResponseResolver = (req, res, ctx) => {
	return res.once(ctx.status(500));
};

export const completeHandlers = {
	salesEnded,
	salesNotStarted,
	error500,
	variantsExist,
	variantsMissing
};
