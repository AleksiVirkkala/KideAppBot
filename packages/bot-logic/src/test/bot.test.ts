import { BotError, FatalBotError } from '@/utils/errorUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getTotalPriceFromReservations, getTotalQuantityFromReservations } from '@/utils';
import { ReservationBody, Variant } from '@/types/KideAppTypes';
import { LogMessage } from '@common/types';
import {
	reqHandler500,
	reqHandlerSalesEnded,
	reqHandlerSalesNotStarted,
	reqHandlerVariantsExist,
	reqHandlerVariantsMissing,
	server
} from './msw';
import { rest } from 'msw';
import { completeHandlers } from './msw.fullScenario';
import { createSuccesReservationByInventoryId } from '@/test/testUtils';
import { KideAppBot } from '@/bot';

// ! This file is in private folder because it may contain sensitive data !
import {
	eventFull,
	eventNon200,
	eventOnSale,
	eventSalesEnded,
	eventSalesNotStarted,
	eventVariantsFirstMissing,
	fakeReservations
} from '@aleksivirkkala/kideappbot-private/pageData';

server; // Makes the app actually import the server and works correctly this way

const KIDE_TOKEN = 'asdfasdf';

describe('bot tests', () => {
	describe('utility tests', () => {
		let bot: KideAppBot;
		let logCb: (log: LogMessage) => void;

		beforeEach(() => {
			logCb = vi.fn();
			bot = new KideAppBot(KIDE_TOKEN);
			bot.setOnLog(logCb);
		});
		describe('parsePageId', () => {
			it('Should assert that page id is in correct form', () => {
				const eventId = '4cfa05ca-cd95-4829-b656-57d8fadef1a5';
				const pageUrl = `https://kide.app/events/${eventId}`;

				const result = bot['parsePageId'](pageUrl);
				expect(result).toBe(eventId);
			});
			it('Should fail with invalid url base', () => {
				const pageUrl = `https://kide.ap/events/4cfa05ca-cd95-4829-b656-57d8fadef1a5`;
				expect(() => bot['parsePageId'](pageUrl)).toThrow(BotError);
			});
			it('Should fail if event id is missing', () => {
				const pageUrl = `https://kide.app/events/`;
				expect(() => bot['parsePageId'](pageUrl)).toThrow(BotError);
			});
		});
		describe('Logging', () => {
			describe('fullLog', () => {
				it('Should call the callback correctly', () => {
					const testLog: LogMessage = {
						title: 'Test log',
						type: 'bullet',
						content: '4',
						replace: true
					};
					bot['fullLog'](testLog);
					expect(logCb).toHaveBeenCalledOnce();
					expect(logCb).toHaveBeenCalledWith(testLog);
				});
				it('Should work with empty parameter object', () => {
					bot['fullLog']({});
					expect(logCb).toHaveBeenCalledOnce();
				});
			});
			describe('log', () => {
				it('Should call the callback correctly', () => {
					const testLog: LogMessage = {
						title: 'Test log',
						type: 'bullet'
					};
					bot['log'](testLog.title, testLog.type);
					expect(logCb).toHaveBeenCalledOnce();
					expect(logCb).toHaveBeenCalledWith(testLog);
				});
				it('Should work with empty parameter object', () => {
					bot['log']();
					expect(logCb).toHaveBeenCalledOnce();
				});
			});
		});
		describe('getTotalQuantityFromReservationResponses', () => {
			it('Should calculate total quantity correctly', () => {
				const result = getTotalQuantityFromReservations(fakeReservations);
				expect(result).toBe(16);
			});
		});
		describe('getTotalPriceFromReservationResponses', () => {
			it('Should calculate total price correctly', () => {
				const result = getTotalPriceFromReservations(fakeReservations);
				expect(result).toBe(28000);
			});
		});
	});

	describe('Process related tests', () => {
		let bot: KideAppBot;

		beforeEach(() => {
			bot = new KideAppBot(KIDE_TOKEN);
			bot.setOnLog(vi.fn());
			bot.setOnIsActiveChanged(vi.fn());
		});

		describe('getProductData', () => {
			it('Should fail with invalid url', async () => {
				const eventApiUrl = eventOnSale.apiUrl;
				expect(bot.getProductData(eventApiUrl)).rejects.toThrow(BotError);
			});
			it('Should get the correct product data', async () => {
				const eventUrl = eventOnSale.eventUrl;
				const result = await bot.getProductData(eventUrl);
				expect(result).toEqual(eventOnSale.pageData);
			});
			it('Should throw correct error if status is not 200', async () => {
				const eventUrl = eventNon200.eventUrl;
				expect(bot.getProductData(eventUrl)).rejects.toThrow(BotError);
			});
		});
		describe('getProductDataWithVariants', () => {
			it('Should try again until variants array is not empty', async () => {
				server.use(
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandler500),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandler500),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsExist)
				);

				const eventUrl = eventVariantsFirstMissing.eventUrl;
				const pageData = await bot['getProductDataWithVariants'](eventUrl);
				expect(pageData).toEqual(eventVariantsFirstMissing.pageDataVariants);
			});
		});
		describe('getTicketVariants', () => {
			it('Should get array of variants even if no variants are available at first', async () => {
				server.use(
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandler500),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandler500),
					rest.get(eventVariantsFirstMissing.apiUrl, reqHandlerVariantsExist)
				);

				const eventUrl = eventVariantsFirstMissing.eventUrl;
				const expectedVariants = eventVariantsFirstMissing.pageDataVariants.model.variants;
				const variants = await bot['getTicketVariants'](eventUrl);
				expect(variants).toEqual(expectedVariants);
			});
			it('Should wait for sales to start if sales have not started yet', async () => {
				server.use(
					rest.get(eventSalesNotStarted.apiUrl, reqHandlerSalesNotStarted),
					rest.get(eventSalesNotStarted.apiUrl, reqHandler500),
					rest.get(eventSalesNotStarted.apiUrl, reqHandler500),
					rest.get(eventSalesNotStarted.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventSalesNotStarted.apiUrl, reqHandler500),
					rest.get(eventSalesNotStarted.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventSalesNotStarted.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventSalesNotStarted.apiUrl, reqHandlerVariantsExist)
				);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const spy = vi.spyOn(bot, 'timeoutLog');
				const eventUrl = eventSalesNotStarted.eventUrl;
				const expectedVariants = eventSalesNotStarted.pageDataVariants.model.variants;
				const variants = await bot['getTicketVariants'](eventUrl);
				expect(spy).toHaveBeenCalledOnce();
				expect(variants).toEqual(expectedVariants);
			});
			it('Should fail if sales have ended', async () => {
				server.use(
					rest.get(eventSalesEnded.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventSalesEnded.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventSalesEnded.apiUrl, reqHandler500),
					rest.get(eventSalesEnded.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventSalesEnded.apiUrl, reqHandlerVariantsMissing),
					rest.get(eventSalesEnded.apiUrl, reqHandlerSalesEnded)
				);
				const eventUrl = eventSalesEnded.eventUrl;
				try {
					await bot['getTicketVariants'](eventUrl);
					expect.fail('Should not reach this line');
				} catch (e) {
					expect(e).toBeInstanceOf(BotError);
				}
			});
		});
		describe('reserveTicketVariant', () => {
			beforeEach(() => {
				bot.botIsActive = true;
			});
			it('Should successfully reserve variant that is available', async () => {
				server.use(
					rest.post('https://api.kide.app/api/reservations', async (req, res, ctx) => {
						const body: ReservationBody = await req.json();
						const { quantity } = body.toCreate[0];

						if (quantity === 2) {
							return res(ctx.status(200), ctx.json(eventSalesNotStarted.responseReserved));
						}
						if (quantity > 2) {
							return res(
								ctx.status(400),
								ctx.json({
									error: {
										type: 18
									}
								})
							);
						}
					})
				);
				const variant: Variant = eventOnSale.pageData.model.variants[0];
				const result = await bot.tryReserveTicketVariant(variant);
				expect(result).toEqual(eventSalesNotStarted.responseReserved);
			});
			it('Should stop properly if variant gets sold out', async () => {
				// TODO
			});
			it('Should fail if bearer token is invalid', async () => {
				// TODO
			});
		});
		describe('reserveTicketVariants', () => {
			it('Should succesfully reserve an array of variants', async () => {
				server.use(
					rest.post('https://api.kide.app/api/reservations', async (req, res, ctx) => {
						const body: ReservationBody = await req.json();
						const { inventoryId } = body.toCreate[0];
						if (
							inventoryId === 'f3d18dec-fe92-465d-a349-08982ad27525' ||
							inventoryId === 'b3c5de2b-c069-414f-802d-839722b5f788'
						) {
							return res(
								ctx.status(400),
								ctx.json({
									error: {
										type: 46
									}
								})
							);
						}
						if (inventoryId === 'd6bb2ade-50d3-4f87-8e57-db9570db7d57') {
							return res(
								ctx.status(400),
								ctx.json({
									error: {
										type: 13
									}
								})
							);
						}
						if (
							inventoryId === '695d5fd6-cd65-4bbf-9440-93905cc4fb3f' ||
							inventoryId === 'c83bb1f8-e0ff-430b-bbbb-d758d08e0622' ||
							inventoryId === 'a7f04dca-8f3e-4905-a99f-183e7419bbce' ||
							inventoryId === '8c1a2770-b574-47cd-92a3-7ab4cca761fc'
						) {
							return res(ctx.status(200), ctx.json(eventSalesNotStarted.responseReserved));
						}
					})
				);
				const variants: Variant[] = eventVariantsFirstMissing.pageDataVariants.model.variants;
				const results = await bot['reserveTicketVariants'](variants);
				expect(results.length).toBe(4);
			});
		});
		describe('logReservations', () => {
			it('Should throw if there are no reservations made', () => {
				expect(() => bot['logReservations']([])).toThrow(BotError);
			});
		});
	});
	describe('Full run', () => {
		let bot: KideAppBot;

		beforeEach(() => {
			bot = new KideAppBot(KIDE_TOKEN);
			bot.setOnLog(vi.fn());
			bot.setOnIsActiveChanged(vi.fn());
		});
		it('Should survive without errors', async () => {
			const eventUrl = eventFull.eventUrl;

			// Building the scenario
			server.use(
				rest.get(eventFull.apiUrl, completeHandlers.salesNotStarted),
				rest.get(eventFull.apiUrl, completeHandlers.error500),
				rest.get(eventFull.apiUrl, completeHandlers.error500),
				rest.get(eventFull.apiUrl, completeHandlers.variantsMissing),
				rest.get(eventFull.apiUrl, completeHandlers.variantsMissing),
				rest.get(eventFull.apiUrl, completeHandlers.error500),
				rest.get(eventFull.apiUrl, completeHandlers.variantsMissing),
				rest.get(eventFull.apiUrl, completeHandlers.variantsMissing),
				rest.get(eventFull.apiUrl, completeHandlers.variantsMissing),
				rest.get(eventFull.apiUrl, completeHandlers.variantsExist),
				rest.post('https://api.kide.app/api/reservations', async (req, res, ctx) => {
					const body: ReservationBody = await req.json();
					const { inventoryId, quantity } = body.toCreate[0];
					const resData = await createSuccesReservationByInventoryId(inventoryId, quantity);
					return res(ctx.status(200), ctx.json(resData));
				})
			);

			// Execution
			await bot['runBot'](eventUrl);
		});
	});
});
