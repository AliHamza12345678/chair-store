import type { CheckoutItem } from "./types"

/** Server-trusted subtotal — never trust a client-supplied total. */
export function calculateSubtotal(items: Pick<CheckoutItem, "price" | "quantity">[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
