import { procedure, router } from '@/server/trpc-shared';

export const miscRouter = router({
  healthCheck: procedure.query(() => 'OK')
});
