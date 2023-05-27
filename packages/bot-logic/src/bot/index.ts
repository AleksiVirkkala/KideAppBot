import { BotBase } from './BotBase';
import { fetchProductDataFn, tryReserveFn } from '@/private';
export class KideAppBot extends BotBase {
	fetchProductData = fetchProductDataFn;
	tryReserve = tryReserveFn;
}
