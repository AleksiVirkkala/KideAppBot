import { startServer } from './server';
import { isDev } from '@common/utils';
import type { AppRouter } from './server/routes';

export type { AppRouter };

console.log('Starting bot backend...');
console.log('isDev:', isDev());

startServer();
