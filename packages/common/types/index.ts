// TODO: We should export the backend api-type here
// export type { AppRouter } from '@/server';

// TODO: These are pretty much as unclear as they can be :D
export type LogType = 'b' | 'l' | 'e' | 's' | 'w' | 'f' | 't'

export interface Log {
  msg?: string
  value?: string
  type?: LogType
  replace?: boolean
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
