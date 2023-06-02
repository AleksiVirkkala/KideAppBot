import { localStorageStore } from '@skeletonlabs/skeleton';
import { derived, type Writable } from 'svelte/store';

export const token: Writable<string> = localStorageStore('token', '');

export const tokenIsSet = derived(token, $token => !!$token);
