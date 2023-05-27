// TODO: Add path alias for routes
import { miscRouter } from './miscRouter';
import { botRouter } from './botRouter';
import { router } from '../trpc-shared';

export const routes = {
	bot: botRouter,
	misc: miscRouter
};

export const appRouter = router(routes);

// For use in frontend
export type AppRouter = typeof appRouter;
