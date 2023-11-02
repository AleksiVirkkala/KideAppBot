import { Reservation, ResponseError } from '@/types/KideAppTypes';
import { AxiosError } from 'axios';
import { WithRequired } from '@common/types';
import { BotError } from './errorUtils';

// TODO: Definition
export const getTotalQuantityFromReservations = (reservations: Reservation[]) => {
	return reservations.map(r => r.reservedQuantity).reduce((prev, curr) => prev + curr, 0);
};

// TODO: Definition
export const getTotalPriceFromReservations = (reservations: Reservation[]) => {
	return reservations
		.map(r => r.reservedQuantity * r.pricePerItem)
		.reduce((prev, curr) => prev + curr, 0);
};

// TODO: Definition
export const getUniqueReservations = (reservations: Reservation[]) => {
	return reservations.filter(
		(value, index, self) => index === self.findIndex(t => t.variantId === value.variantId)
	);
};

export function isKnownReservationError(
	error: AxiosError<any, any>
): error is WithRequired<AxiosError<ResponseError, unknown>, 'response'> {
	const handlableStatusCode = error.response?.status === 400;
	const responseData = error.response?.data;
	const bodyWithErrorExists = responseData && 'error' in responseData;

	return handlableStatusCode && bodyWithErrorExists;
}

export function tryGetNewReservationQuantity(e: AxiosError, currentQnt: number) {
	if (!isKnownReservationError(e)) {
		// The token is probably stale / invalid
		if (e.response?.status === 401) {
			throw new BotError('Unauthorized. Get a new token from kide.app and try again.');
		}
		throw new BotError('Unhandled network error while reserving tickets');
	}
	if (currentQnt <= 1) {
		throw new BotError('Variant sold out');
	}
	// Handle known errors
	const { type } = e.response.data.error;

	// TODO: 401 errors

	switch (type) {
		// Post body missing
		case 2:
			throw new BotError('Post body missing');
		// Invalid InventoryId
		case 3:
			throw new BotError('Invalid InventoryId');
		// Trying to reserve 0 / -3 / >400 -> Invalid number?
		case 12:
			throw new BotError(`Trying to reserve invalid quantity: ${currentQnt}`);
		// Variant not available
		case 13:
			throw new BotError('Variant not available');
		// Qnt exceeds availability - ACTUAL QNT DEFINITELY DOESN'T MATCH BODY quantity variable
		case 14:
			return currentQnt - 1;
		// Qnt too high, might come even if sold out but over the maximum limit ? Comes when exceeding max limit
		case 18:
			return currentQnt - 1;
		// NOT VERIFIED - Only one variant selectable
		case 46:
			throw new BotError('Only one variant type can be reserved');
		default:
			throw new BotError(`Unknown error type: ${type}`);
	}
}

export function calculateXRequestedId(inventoryId: string): string {
	// Remove dashes from the inventory ID
	const strippedId = inventoryId.replace(/-/g, '');
	// An extra ID that will be XOR'd with the inventory ID
	const EXTRA_ID = 'c352aecab2c7432d95c1cb08241ed583';

	// Initialize an empty string to store the final result
	let encodedString = '';

	// Loop through each character of the stripped inventory ID
	for (let i = 0; i < strippedId.length; i++) {
		// XOR the ASCII codes of the characters from strippedId and EXTRA_ID
		const xorResult = strippedId.charCodeAt(i) ^ EXTRA_ID.charCodeAt(i);

		// Append the character corresponding to the XOR result to the encoded string
		encodedString += String.fromCharCode(xorResult);
	}

	// Convert the encoded string to Base64 and return the first 10 characters
	return btoa(encodedString).substring(0, 8);
}
