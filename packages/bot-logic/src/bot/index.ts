import { BotBase } from './BotBase';
import { fetchProductDataFn, tryReserveFn } from '@aleksivirkkala/kideappbot-private/index';
export class KideAppBot extends BotBase {
	fetchProductData = fetchProductDataFn;
	tryReserve = tryReserveFn;
}
