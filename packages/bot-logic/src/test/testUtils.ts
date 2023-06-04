import { Variant } from '@/types/KideAppTypes';
import { eventFull } from '@aleksivirkkala/kideappbot-private/pageData';
import {
	AsyncResponseResolverReturnType,
	MockedResponse,
	PathParams,
	ResponseComposition,
	RestContext,
	RestRequest
} from 'msw';

export type RestResponseResolver = (
	req: RestRequest<never, PathParams<string>>,
	res: ResponseComposition<any>,
	ctx: RestContext
) => AsyncResponseResolverReturnType<MockedResponse>;

const variants = eventFull.product.allVariants.model.variants;

export const findVariantByInventoryId = (id: string) => {
	return variants.find(v => v.inventoryId === id) as Variant;
};

export const createSuccesReservationByInventoryId = (id: string, count: number) => {
	const variant = findVariantByInventoryId(id);
	return {
		model: {
			reservations: [
				{
					pricePerItem: variant.pricePerItem,
					reservedQuantity: count,
					variantName: variant.name
				}
			]
		},
		reservationsCount: count
	};
};
