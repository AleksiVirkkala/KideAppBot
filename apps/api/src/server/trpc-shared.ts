import { initTRPC, inferAsyncReturnType } from '@trpc/server';

export const createContext = async () => {
	return {};
};
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;
export const router = t.router;
export const procedure = t.procedure;
