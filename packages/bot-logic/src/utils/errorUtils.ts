// TODO: Why does FatalBotError extend BotError and not the other way around?

import type { LogType } from '@common/types';

export class FatalBotError extends Error {
	type: LogType;

	// TODO: Make LogType easier to understand
	constructor(msg: string, type: LogType = 'e') {
		super(msg);
		this.type = type;
		this.name = 'BotError';
	}
}

export class BotError extends FatalBotError {}

export class NotImplementedError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = 'NotImplementedError';
	}
}
