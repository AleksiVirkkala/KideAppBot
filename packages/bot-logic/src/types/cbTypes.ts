import type { AxiosResponse } from 'axios';
import type { PageResponse, ReservationsPostResponse } from './KideAppTypes';

export type TryReserveFn = (
  inventoryId: string,
  quantity: number,
  token: string
) => Promise<AxiosResponse<ReservationsPostResponse, any>>;

export type FetchProductDataFn = (pageId: string) => Promise<PageResponse>;
