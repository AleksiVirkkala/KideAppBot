// TODO: We should export the backend api-type here
// export type { AppRouter } from '@/server';

export type LogType = 'regular' | 'title' | 'bullet' | 'empty';

export interface LogEntry {
	type?: LogType;
	icon?: string;
	title?: string;
	content?: string;
}

export interface LogMessage extends LogEntry {
	replace?: boolean;
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
