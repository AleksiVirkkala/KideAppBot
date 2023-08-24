// TODO: Why does FatalBotError extend BotError and not the other way around?

import type { LogEntry } from '@common/types';

export class BotError extends Error {
	log: LogEntry;

	// TODO: Make LogType easier to understand
	constructor(options: LogEntry | string) {
		let logEntry: LogEntry;
		if (typeof options === 'string') {
			logEntry = { icon: '❌', title: options };
		} else {
			logEntry = options;
		}
		super(logEntry.content);
		this.log = logEntry;
		this.name = 'BotError';
	}
}

export class FatalBotError extends BotError {}

export class NotImplementedError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = 'NotImplementedError';
	}
}
