/**
 * Bot that works together with the backend
 */

import { Log, LogType } from '@common/types';
import {
  accurateInterval,
  secondsToPrettierPrint,
  timeout
} from '@common/utils';
import { BotError, FatalBotError } from '@/utils/errorUtils';
import {
  Variant,
  ReservationsPostResponse,
  PageResponse
} from '@/types/KideAppTypes';
import {
  getUniqueReservations,
  getTotalQuantityFromReservations,
  getTotalPriceFromReservations,
  tryGetNewReservationQuantity
} from '@/utils';
import { KIDE_APP_URL_BASE, TIMEOUTS } from '@common/constants';
import { AxiosError } from 'axios';
import { FetchProductDataFn, TryReserveFn } from '@/types/cbTypes';

export abstract class BotBase {
  // These must be implemented by the child class
  abstract tryReserve: TryReserveFn;
  abstract fetchProductData: FetchProductDataFn;

  // State
  protected _botIsActive: boolean = false;
  protected silentLog: boolean = false;
  protected startTime: number | null = null;
  protected stopRequested: boolean = false;

  constructor(protected token: string) {}

  public async runBot(eventUrl: string) {
    this.botIsActive = true;
    this.startTime = Date.now();

    try {
      const variants = await this.getTicketVariants(eventUrl);
      this.logTicketVariants(variants);
      const reservationResponses = await this.reserveTicketVariants(variants);
      this.logReservations(reservationResponses);
    } catch (err) {
      if (!err) this.log('Undefined error', 'e');
      else if (err instanceof BotError) {
        this.fullLog({
          msg: err.message,
          // TODO
          // type: err.type,
          force: true
        });
      } else if (err instanceof Error) {
        this.fullLog({
          msg: err.message,
          type: 'e',
          force: true
        });
      } else {
        throw err;
      }
    }

    this.stopBot('Process finished succesfully');
    this.logElapsedTime();
  }

  protected async getTicketVariants(eventUrl: string) {
    // TODO: There is currently no retry for fetching product data
    const productData = await this.getProductData(eventUrl);
    const { timeUntilSalesStart } = productData.model.product;

    this.log();
    this.log('Checking response', 't');
    this.log();

    // --- Wait until sales start ----------------------------

    if (timeUntilSalesStart > 0) {
      // TODO make better
      await this.timeoutLog(timeUntilSalesStart - 1);
      this.startTime = Date.now();
    }

    this.log('Sales have started, finding ticket variants...', 'l');

    const { variants } = productData.model;

    // --- If variants exist, already, return them -----------

    if (variants.length > 0) {
      this.silentLog = false;
      return variants;
    }

    // --- Fetch product data until variants exist -----------

    const productDataWithVariants = await this.getProductDataWithVariants(
      eventUrl
    );

    this.silentLog = false;
    return productDataWithVariants.model.variants;
  }

  protected async reserveTicketVariants(variants: Variant[]) {
    let reservationRequests = variants.map(async variant => {
      try {
        return await this.tryReserveTicketVariant(variant);
      } catch (e) {
        if (e instanceof BotError) {
          this.log(e.message, e.type);
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

  protected onIsActiveChanged: (newValue: boolean) => void = () => {};
  public setOnIsActiveChanged(handler: (newValue: boolean) => void) {
    this.onIsActiveChanged = handler;
  }

  protected onLog: (log: Log) => void = () => {};
  public setOnLog(handler: (log: Log) => void) {
    this.onLog = handler;
  }

  // Logging methods
  protected log(msg?: string, type?: LogType, replace?: boolean) {
    this.fullLog({ msg, type, replace });
  }

  protected fullLog({
    msg,
    value,
    type,
    replace,
    force
  }: {
    msg?: string;
    value?: string;
    type?: LogType;
    replace?: boolean;
    force?: boolean;
  }) {
    this.stopIfRequested();
    if (!force && this.silentLog) return;
    this.onLog({ msg, value, type, replace });
  }

  // TODO: Diagnose if works properly
  protected stopIfRequested() {
    if (this.stopRequested) {
      this.stopRequested = false;
      this.stopBot();
      throw new FatalBotError('Process terminated by user', 't');
    }
  }

  // TODO: Find if used at all?
  public requestStop() {
    if (!this.botIsActive) return;
    this.stopRequested = true;
  }

  public stopBot(msg?: string) {
    if (!this.botIsActive) return;
    this.log();
    this.log(msg, 't');
    this.botIsActive = false;
    this.silentLog = false;
  }

  protected logTicketVariants(variants: Variant[]) {
    // TODO: Poop
    if (variants.length === 0) {
      throw new BotError('No variants available');
    }

    this.log();

    variants.forEach((variant, i) => {
      this.fullLog({
        msg: i + 1 + '.',
        value: variant.name
      });
      this.fullLog({
        msg: 'Availability: ',
        value: variant.availability + ' kpl',
        type: 'b'
      });
      this.fullLog({
        msg: 'Max-order: ',
        value: variant.productVariantMaximumReservableQuantity + ' kpl',
        type: 'b'
      });
    });

    this.log();
  }

  // Other helper methods
  protected async timeoutLog(seconds: number) {
    this.fullLog({
      msg: 'Time until sales start... ',
      value: secondsToPrettierPrint(seconds),
      type: 'l'
    });
    await this.timeoutLogHelper(seconds);
  }

  protected async timeoutLogHelper(seconds: number) {
    if (seconds === 0) return;

    return new Promise((resolve, reject) => {
      accurateInterval(stop => {
        try {
          this.fullLog({
            msg: 'Time until sales start... ',
            value: secondsToPrettierPrint(--seconds),
            type: 'l',
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
      msg: 'Time elapsed:',
      value: elapsedMs + ' ms'
    });
  }

  protected logReservations(reservationResponses: ReservationsPostResponse[]) {
    const allReservations = reservationResponses
      .map(r => r.model.reservations)
      .flat();
    const reservations = getUniqueReservations(allReservations);
    const totalQuantity = getTotalQuantityFromReservations(reservations);
    const totalPrice = getTotalPriceFromReservations(reservations);

    if (reservations.length === 0) {
      throw new BotError("Couldn't reserve any tickets");
    }

    this.log();
    this.log('Items in shopping cart', 't');
    this.log();

    reservations.forEach(res => {
      this.fullLog({
        msg: 'Variant:',
        value: res.variantName + ' - ' + res.reservedQuantity + ' kpl',
        type: 's'
      });
    });
    this.log();
    this.fullLog({
      msg: '🎫 Total quantity:',
      value: totalQuantity.toString()
    });
    const totalPriceStr = totalPrice + '';
    const formattedPrice =
      totalPriceStr.slice(0, totalPriceStr.length - 2) +
      '.' +
      totalPriceStr.slice(totalPriceStr.length - 2) +
      '€';
    this.fullLog({
      msg: '💲 Total price:',
      value: formattedPrice
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

  // TODO
  protected async getProductDataWithVariants(
    eventUrl: string
  ): Promise<PageResponse> {
    while (true) {
      try {
        // TODO: Log replace
        const productData: PageResponse = await this.getProductData(eventUrl);
        const variantsExist: boolean = productData.model.variants.length > 0;

        if (variantsExist) {
          return productData;
        }
      } catch (e) {
        if (e instanceof BotError) {
          // TODO: Should this handle only certain error messages?
          this.fullLog({
            msg: e.message,
            value: new Date().toISOString(), // TODO check if this is correct
            type: 'e',
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
    this.log('Parsing input', 't');

    const productPageId = this.parsePageId(eventUrl);

    this.log();
    this.fullLog({
      msg: 'Parsed pageId: ',
      value: productPageId,
      type: 's'
    });
    this.log('Fetching page info...', 'f');

    try {
      const data = await this.fetchProductData(productPageId);

      this.fullLog({
        msg: 'Received response',
        value: data.model.product.name,
        type: 's'
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
    const {
      productVariantMaximumReservableQuantity,
      availability,
      inventoryId
    } = variant;

    let quantity = Math.min(
      productVariantMaximumReservableQuantity,
      availability
    );

    // ---- Setting timeout ------------------------------

    let timeLimitExceeded = false;

    setTimeout(() => {
      timeLimitExceeded = true;
    }, 20000);

    // ---- Logging --------------------------------------

    this.log('Reserving ticket', 't');
    this.log();

    this.fullLog({
      msg: 'Variant',
      value: variant.name
    });
    this.fullLog({
      msg: 'inventoryId:',
      value: inventoryId.toString(),
      type: 'b'
    });
    this.fullLog({
      msg: 'Amount:',
      value: quantity.toString(),
      type: 'b'
    });
    this.log();
    this.log('Sending reservation...', 'l');
    this.log();

    // ---- Reservation loop -----------------------------

    while (!timeLimitExceeded) {
      try {
        const { data } = await this.tryReserve(
          variant.inventoryId,
          quantity,
          this.token
        );
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
