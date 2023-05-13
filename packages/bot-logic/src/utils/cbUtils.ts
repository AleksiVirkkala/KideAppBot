import { FetchProductDataFn, TryReserveFn } from '@/types/cbTypes';

// TODO: Explanation
export interface MethodImplementations {
  fetchProductDataFn: FetchProductDataFn;
  tryReserveFn: TryReserveFn;
}

// TODO: Explanation
const fallbackHandlers: MethodImplementations = {
  fetchProductDataFn: () => {
    throw new Error('fetchProductData not implemented');
  },
  tryReserveFn: () => {
    throw new Error('tryReserve not implemented');
  }
};
