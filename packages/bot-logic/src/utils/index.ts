import { Reservation, ResponseError } from '@/types/KideAppTypes'
import { AxiosError } from 'axios'
import { WithRequired } from '@common/types'
import { BotError } from './errorUtils'

// TODO: Definition
export const getTotalQuantityFromReservations = (reservations: Reservation[]) => {
  return reservations.map(r => r.reservedQuantity).reduce((prev, curr) => prev + curr, 0)
}

// TODO: Definition
export const getTotalPriceFromReservations = (reservations: Reservation[]) => {
  return reservations
    .map(r => r.reservedQuantity * r.pricePerItem)
    .reduce((prev, curr) => prev + curr, 0)
}

// TODO: Definition
export const getUniqueReservations = (reservations: Reservation[]) => {
  return reservations.filter(
    (value, index, self) => index === self.findIndex(t => t.variantId === value.variantId)
  )
}

export function isKnownReservationError(
  error: AxiosError<any, any>
): error is WithRequired<AxiosError<ResponseError, unknown>, 'response'> {
  const handlableStatusCode = error.response?.status === 400
  const responseData = error.response?.data
  const bodyWithErrorExists = responseData && 'error' in responseData

  return handlableStatusCode && bodyWithErrorExists
}

export function tryGetNewReservationQuantity(e: AxiosError, currentQnt: number) {
  if (!isKnownReservationError(e)) {
    throw new BotError('Unhandled network error while reserving tickets')
  }
  if (currentQnt <= 1) {
    throw new BotError('Variant sold out')
  }
  // Handle known errors
  const { type } = e.response.data.error

  // TODO: 401 errors

  switch (type) {
    // Post body missing
    case 2:
      throw new BotError('Post body missing')
    // Invalid InventoryId
    case 3:
      throw new BotError('Invalid InventoryId')
    // Trying to reserve 0 / -3 / >400 -> Invalid number?
    case 12:
      throw new BotError(`Trying to reserve invalid quantity: ${currentQnt}`)
    // Variant not available
    case 13:
      throw new BotError('Variant not available')
    // Qnt exceeds availability - ACTUAL QNT DEFINITELY DOESN'T MATCH BODY quantity variable
    case 14:
      return currentQnt - 1
    // Qnt too high, might come even if sold out but over the maximum limit ? Comes when exceeding max limit
    case 18:
      return currentQnt - 1
    // NOT VERIFIED - Only one variant selectable
    case 46:
      throw new BotError('Only one variant type can be reserved')
    default:
      throw new BotError(`Unknown error type: ${type}`)
  }
}
