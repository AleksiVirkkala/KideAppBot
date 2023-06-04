import { z } from 'zod';
import { observable } from '@trpc/server/observable';
import { procedure, router } from '@/server/trpc-shared';
import KideAppBot from 'kideappbot';

import { EventEmitter } from 'events';
import jwtDecode, { InvalidTokenError } from 'jwt-decode';
import { LogMessage } from '@common/types';
import { TRPCError } from '@trpc/server';
// create a global event emitter (could be replaced by redis, etc)
const ee = new EventEmitter();
const botInstances: Record<string, KideAppBot> = {};

export const botRouter = router({
	createPost: procedure
		.input(
			z.object({
				title: z.string(),
				text: z.string()
			})
		)
		.mutation(({ input }) => {
			// imagine db call here
			return {
				id: `${Math.random()}`,
				...input
			};
		}),
	randomNumber: procedure.subscription(opts => {
		console.log(opts.ctx);
		return observable<{ randomNumber: number }>(emit => {
			const timer = setInterval(() => {
				// emits a number every second
				emit.next({ randomNumber: Math.random() });
			}, 200);

			return () => {
				clearInterval(timer);
			};
		});
	}),
	// restoreSession: authProcedure.
	reserve: procedure
		.input(
			z.object({
				eventUrl: z.string(),
				token: z.string()
			})
		)
		.mutation(async ({ input }) => {
			const { token, eventUrl } = input;

			try {
				jwtDecode(token);
			} catch (e) {
				if (e instanceof InvalidTokenError) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Invalid Bearer Token'
					});
				}
			}

			if (botInstances[token]) {
				botInstances[token].requestStop();
			}
			const bot = new KideAppBot(token);

			bot.setOnLog(log => {
				console.log(`newLog-${token}`, log);
				ee.emit(`newLog-${token}`, log);
			});
			bot.setOnIsActiveChanged(newValue => {
				console.log(`isRunningChanged-${token}`, newValue);
				ee.emit(`isRunningChanged-${token}`, newValue);
			});

			botInstances[token] = bot;
			botInstances[token].runBot(eventUrl);

			return 'OK';
		}),
	newLog: procedure
		.input(
			z.object({
				token: z.string()
			})
		)
		.subscription(({ input }) => {
			const { token } = input;
			return observable<LogMessage>(emit => {
				ee.on(`newLog-${token}`, (log: LogMessage) => {
					emit.next(log);
				});
				return () => {
					// ee.removeAllListeners(`newLog-${token}`);
				};
			});
		}),
	isRunningChanged: procedure
		.input(
			z.object({
				token: z.string()
			})
		)
		.subscription(({ input }) => {
			const { token } = input;
			return observable<boolean>(emit => {
				ee.on(`isRunningChanged-${token}`, (isRunning: boolean) => {
					emit.next(isRunning);
				});
				return () => {
					//ee.removeAllListeners(`isRunningChanged-${token}`);
				};
			});
		}),
	stop: procedure
		.input(
			z.object({
				token: z.string()
			})
		)
		.mutation(({ input }) => {
			const { token } = input;

			const bot = botInstances[token];
			if (bot) {
				console.log('Stopping bot!');
				bot.requestStop();
			}
		})
});
