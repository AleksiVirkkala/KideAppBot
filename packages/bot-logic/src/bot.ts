/**
 * Bot that works together with the backend
 */

import { LogMessage, LogType } from '@common/types';
import jwtDecode, { InvalidTokenError } from 'jwt-decode';
import { accurateInterval, secondsToPrettierPrint, timeout } from '@common/utils';
import { BotError, FatalBotError, NotImplementedError } from '@/utils/errorUtils';
import {
	Variant,
	ReservationsPostResponse,
	PageResponse,
	ReservationBody
} from '@/types/KideAppTypes';
import {
	getUniqueReservations,
	getTotalQuantityFromReservations,
	getTotalPriceFromReservations,
	tryGetNewReservationQuantity
} from '@/utils';
import { KIDE_APP_API_URL_BASE, KIDE_APP_URL_BASE, TIMEOUTS } from '@common/constants';
import axios, { AxiosError } from 'axios';

export class KideAppBot {
	protected _botIsActive = false;
	protected silentLog = false;
	protected startTime: number | null = null;
	protected stopRequested = false;

	constructor(protected token: string) {}

	public async runBot(eventUrl: string) {
		this.botIsActive = true;
		this.startTime = Date.now();

		try {
			this.verifyToken(this.token);
			const variants = await this.getTicketVariants(eventUrl);
			this.logTicketVariants(variants);
			const reservationResponses = await this.reserveTicketVariants(variants);
			this.logReservations(reservationResponses);
		} catch (err) {
			if (!err) {
				this.fullLog({
					icon: '🤷',
					title: 'Undefined error'
				});
			} else if (err instanceof BotError) {
				this.fullLog(err.log);
			} else if (err instanceof Error) {
				this.fullLog({
					icon: '🤷',
					title: err.message,
					force: true
				});
			} else {
				throw err;
			}
		}

		this.stopBot('Process finished succesfully');
		this.logElapsedTime();
	}

	protected async tryReserve(inventoryId: string, quantity: number, token: string) {
		const API_RESERVATION_ENDPOINT = 'https://api.kide.app/api/reservations';
		const body: ReservationBody = {
			expectCart: true,
			toCreate: [
				{
					inventoryId: inventoryId,
					quantity: quantity
				}
			],
			toCancel: null
		};
		const headers = {
			'Content-Type': 'application/json;charset=UTF-8',
			accept: 'application/json, text/plain, */*',
			authorization: 'Bearer ' + token
		};

		return await axios.post<ReservationsPostResponse>(API_RESERVATION_ENDPOINT, body, { headers });
	}
	protected async fetchProductData(pageId: string) {
		const { data, status } = await axios.get<PageResponse>(KIDE_APP_API_URL_BASE + pageId);
		if (status !== 200) {
			throw new BotError('Request Failed');
		}
		return data;
	}

	protected async getTicketVariants(eventUrl: string) {
		// TODO: There is currently no retry for fetching product data
		const productData = await this.getProductData(eventUrl);
		const { timeUntilSalesStart } = productData.model.product;

		this.log('Checking response', 'title');

		// --- Wait until sales start ----------------------------

		if (timeUntilSalesStart > 0) {
			// TODO make better
			await this.timeoutLog(timeUntilSalesStart - 1);
			this.startTime = Date.now();
		}

		this.fullLog({
			icon: '🎟️',
			title: 'Sales have started, finding ticket variants...'
		});

		const { variants } = productData.model;

		// --- If variants exist, already, return them -----------

		if (variants.length > 0) {
			this.silentLog = false;
			return variants;
		}

		// --- Fetch product data until variants exist -----------

		const productDataWithVariants = await this.getProductDataWithVariants(eventUrl);

		this.silentLog = false;
		return productDataWithVariants.model.variants;
	}

	protected async reserveTicketVariants(variants: Variant[]) {
		const reservationRequests = variants.map(async variant => {
			try {
				return await this.tryReserveTicketVariant(variant);
			} catch (e) {
				if (e instanceof FatalBotError) {
					throw e;
				}
				if (e instanceof BotError) {
					this.fullLog(e.log);
				}
			}
		});
		const resolvedResponses = await Promise.all(reservationRequests);
		const succesfullResponses = resolvedResponses.filter(
			(v): v is ReservationsPostResponse => v !== undefined
		);
		return succesfullResponses;
	}

	get botIsActive() {
		return this._botIsActive;
	}
	set botIsActive(value: boolean) {
		this._botIsActive = value;
		this.onIsActiveChanged(value);
	}

	protected onIsActiveChanged: (newValue: boolean) => void = () => {
		throw new NotImplementedError("onIsActiveChanged hasn't been set");
	};
	public setOnIsActiveChanged(handler: (newValue: boolean) => void) {
		this.onIsActiveChanged = handler;
	}

	protected onLog: (log: LogMessage) => void = () => {
		throw new NotImplementedError("onLog hasn't been set");
	};
	public setOnLog(handler: (log: LogMessage) => void) {
		this.onLog = handler;
	}

	// Logging methods
	protected log(msg?: string, type?: LogType, replace?: boolean) {
		this.fullLog({ title: msg, type, replace });
	}

	protected fullLog({
		type,
		icon,
		title,
		content,
		replace,
		force
	}: LogMessage & { force?: boolean }) {
		this.stopIfRequested();
		if (!force && this.silentLog) return;
		this.onLog({ type, icon, title, content, replace });
	}

	// TODO: Diagnose if works properly
	protected stopIfRequested() {
		if (this.stopRequested) {
			this.stopRequested = false;
			this.stopBot();
			throw new FatalBotError({
				title: 'Process terminated by user',
				type: 'title'
			});
		}
	}

	// TODO: Find if used at all?
	public requestStop() {
		if (!this.botIsActive) return;
		this.stopRequested = true;
	}

	public stopBot(msg?: string) {
		if (!this.botIsActive) return;
		this.log(msg, 'title');
		this.botIsActive = false;
		this.silentLog = false;
	}

	protected logTicketVariants(variants: Variant[]) {
		// TODO: Poop
		if (variants.length === 0) {
			throw new BotError('No variants available');
		}

		variants.forEach((variant, i) => {
			this.fullLog({
				title: `${i + 1}`,
				content: variant.name
			});
			this.fullLog({
				title: 'Availability',
				content: variant.availability + ' kpl',
				type: 'bullet'
			});
			this.fullLog({
				title: 'Max-order',
				content: variant.productVariantMaximumReservableQuantity + ' kpl',
				type: 'bullet'
			});
		});
	}

	// Other helper methods
	protected async timeoutLog(seconds: number) {
		this.fullLog({
			icon: '⏳',
			title: 'Time until sales start...',
			content: secondsToPrettierPrint(seconds)
		});
		await this.timeoutLogHelper(seconds);
	}

	protected async timeoutLogHelper(seconds: number) {
		if (seconds === 0) return;

		return new Promise((resolve, reject) => {
			accurateInterval(stop => {
				try {
					this.fullLog({
						icon: ' ⏳',
						title: 'Time until sales start...',
						content: secondsToPrettierPrint(--seconds),
						replace: true
					});
					if (seconds <= 0) {
						stop();
						resolve(undefined);
					}
				} catch (e) {
					stop();
					reject(e);
				}
			}, 1000);
		});
	}

	protected logElapsedTime() {
		const currTime = Date.now();
		const elapsedMs = currTime - (this.startTime || 0);
		this.fullLog({
			title: 'Time elapsed',
			content: elapsedMs + ' ms'
		});
	}

	protected logReservations(reservationResponses: ReservationsPostResponse[]) {
		const allReservations = reservationResponses.map(r => r.model.reservations).flat();
		const reservations = getUniqueReservations(allReservations);
		const totalQuantity = getTotalQuantityFromReservations(reservations);
		const totalPrice = getTotalPriceFromReservations(reservations);

		if (reservations.length === 0) {
			throw new BotError("Couldn't reserve any tickets");
		}

		this.fullLog({
			title: 'Items in shopping cart',
			type: 'title'
		});

		reservations.forEach(res => {
			this.fullLog({
				icon: '✅',
				title: 'Variant',
				content: res.variantName + ' - ' + res.reservedQuantity + ' kpl'
			});
		});
		this.fullLog({
			icon: '🎫',
			title: 'Total quantity',
			content: totalQuantity.toString()
		});
		const totalPriceStr = totalPrice + '';
		const formattedPrice =
			totalPriceStr.slice(0, totalPriceStr.length - 2) +
			'.' +
			totalPriceStr.slice(totalPriceStr.length - 2) +
			'€';
		this.fullLog({
			icon: '💲',
			title: 'Total price',
			content: formattedPrice
		});
	}

	// TODO
	protected parsePageId(eventUrl: string) {
		const startsCorrectly = eventUrl.startsWith(KIDE_APP_URL_BASE);
		const containsMoreThanBase = eventUrl.length > KIDE_APP_URL_BASE.length;

		if (!(startsCorrectly && containsMoreThanBase)) {
			throw new BotError("Couldn't parse productPageId from given URL");
		}

		return eventUrl.substring(KIDE_APP_URL_BASE.length);
	}

	protected verifyToken(token: string) {
		try {
			jwtDecode(token);
		} catch (e) {
			if (e instanceof InvalidTokenError) {
				throw new FatalBotError('Invalid bearer token');
			}
		}
	}

	// TODO
	protected async getProductDataWithVariants(eventUrl: string): Promise<PageResponse> {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			try {
				// TODO: Log replace
				const productData: PageResponse = await this.getProductData(eventUrl);
				const variantsExist: boolean = productData.model.variants.length > 0;

				if (variantsExist) {
					return productData;
				}
			} catch (e) {
				if (e instanceof FatalBotError) {
					throw e;
				}
				if (e instanceof BotError) {
					// TODO: Should this handle only certain error messages?
					this.fullLog({
						icon: '🚫',
						title: e.message,
						content: new Date().toISOString(), // TODO check if this is correct
						force: true
					});
					await timeout(TIMEOUTS.PAGE_FETCH_FAILED);
					this.silentLog = true;
					continue;
				}
				throw e;
			}
		}
	}

	async getProductData(eventUrl: string) {
		this.fullLog({
			title: 'Parsing input',
			type: 'title'
		});

		const productPageId = this.parsePageId(eventUrl);

		this.fullLog({
			icon: '✅',
			title: 'Parsed pageId',
			content: productPageId
		});
		this.fullLog({
			icon: '🛰️',
			title: 'Fetching page info...'
		});

		try {
			const data = await this.fetchProductData(productPageId);

			this.fullLog({
				icon: '✅',
				title: 'Received response',
				content: data.model.product.name
			});

			// --- If not on sale, no need to go forward -------------

			const { salesEnded } = data.model.product;

			if (salesEnded) {
				throw new FatalBotError('Sales have ended'); // TODO: Check if works this way
			}

			return data;
		} catch (e) {
			if (e instanceof AxiosError) {
				throw new BotError(e.message);
			}
			throw e;
		}
	}

	async tryReserveTicketVariant(variant: Variant) {
		const { productVariantMaximumReservableQuantity, availability, inventoryId } = variant;

		let quantity = Math.min(productVariantMaximumReservableQuantity, availability);

		// ---- Setting timeout ------------------------------

		let timeLimitExceeded = false;

		setTimeout(() => {
			timeLimitExceeded = true;
		}, 20000);

		// ---- Logging --------------------------------------

		this.fullLog({
			title: 'Reserving ticket',
			type: 'title'
		});

		this.fullLog({
			title: 'Variant',
			content: variant.name
		});
		this.fullLog({
			title: 'inventoryId',
			content: inventoryId.toString(),
			type: 'bullet'
		});
		this.fullLog({
			title: 'Amount',
			content: quantity.toString(),
			type: 'bullet'
		});
		this.fullLog({
			icon: '📨',
			title: 'Sending reservation...'
		});

		// ---- Reservation loop -----------------------------

		while (!timeLimitExceeded) {
			try {
				const { data } = await this.tryReserve(variant.inventoryId, quantity, this.token);
				return data;
			} catch (e) {
				if (!(e instanceof AxiosError)) {
					console.log(e);
					throw new BotError('Unhandled error while reserving tickets');
				}
				quantity = tryGetNewReservationQuantity(e, quantity);

				// TODO: Currently not climbing up
				// TODO: Add variant name to error messages?
			}
		}
	}
}
