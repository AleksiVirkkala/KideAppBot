import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { getAllowedOrigin, getServerPort } from '@/utils';
import cors from 'cors';
import { isDev } from '@common/utils';

import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { AppRouter, appRouter } from './routes';
import { createContext } from '@/server/trpc-shared';

export const startServer = () => {
	const serverPort = getServerPort();

	// http server
	const { server, listen } = createHTTPServer({
		middleware: cors({
			origin: getAllowedOrigin(),
			credentials: true
		}),

		router: appRouter,
		createContext
	});

	// ws server
	const wss = new ws.WebSocketServer({ server });
	const handler = applyWSSHandler<AppRouter>({
		wss,
		router: appRouter,
		createContext
	});

	if (isDev()) {
		wss.on('connection', ws => {
			console.log(`➕➕ Connection (${wss.clients.size})`);
			ws.once('close', () => {
				console.log(`➖➖ Connection (${wss.clients.size})`);
			});
		});
	}

	const { port } = listen(serverPort);
	console.log(`Bot backend started on port ${port}`);

	const stopServer = () => {
		handler.broadcastReconnectNotification();
		wss.close();
		server.close();
	};

	process.on('SIGTERM', stopServer);
	process.on('SIGINT', stopServer);
};
