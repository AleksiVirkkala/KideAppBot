export interface Variant {
  productVariantMaximumReservableQuantity: number
  pricePerItem: number
  availability: number
  name: string
  inventoryId: string
}

export interface Reservation {
  inventoryId: string
  pricePerItem: number
  availability: number
  reservedQuantity: number
  isProductVariantMarkedAsOutOfStock: boolean
  isProductVariantTransferable: boolean // Could be used for multiaccount botting
  isProductVariantHakaAuthenticationRequired: boolean // Interesting
  productVariantMaximumItemQuantityPerUser: boolean // Could say "Woohoo got max!"
  productVariantMaximumReservableQuantity: boolean // ^
  productVariantMinimumReservableQuantity: boolean
  variantName: string
  variantId: string
  productId: string // Pageid?
  productName: string // Grouping? Multievent botting?
}

export interface PageResponse {
  model: {
    product: {
      name: string
      timeUntilSalesStart: number
      salesEnded: boolean
    }
    variants: Variant[]
    company: unknown
    categories: unknown[]
  }
  links: null | unknown
}

export interface ReservationsGetResponse {
  model: {
    reservations: Reservation[]
    reservationsCount: number
    finalPrice: string
  }
}

export type ErrorType = 2 | 3 | 12 | 13 | 14 | 18 | 46

export interface ResponseError {
  error: {
    type: ErrorType
  }
}

export interface ReservationsPostResponse extends ResponseError {
  model: {
    reservations: Reservation[]
  }
  reservationsCount: number
  reservationsTimeLeft: number // Could be shown
}

export interface Reservation {
  inventoryId: string
  variantName: string
  reservedQuantity: number
}

export interface ReservationBody {
  toCreate: [
    {
      inventoryId: string
      quantity: number
    }
  ]
  toCancel: unknown | null
}
