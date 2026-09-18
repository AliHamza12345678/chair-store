export interface CheckoutItem {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export interface CheckoutResult {
  success: boolean
  error?: string
  orderId?: string
}
