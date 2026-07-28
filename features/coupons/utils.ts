import type { Coupon } from "@prisma/client"

/**
 * Pure discount calculation, shared by the checkout preview (client)
 * and the server-side order-creation action (so both agree on amounts).
 */
export function calculateDiscount(coupon: Pick<Coupon, "type" | "value" | "maxDiscount">, subtotal: number): number {
  let discount = 0

  if (coupon.type === "PERCENTAGE") {
    discount = (subtotal * coupon.value) / 100
    if (coupon.maxDiscount != null) {
      discount = Math.min(discount, coupon.maxDiscount)
    }
  } else {
    discount = coupon.value
  }

  // Never discount more than the order is worth
  return Math.min(discount, subtotal)
}

/** Client + server share this check so the checkout UI and the final
 * order action never disagree about whether a coupon is currently usable. */
export function isCouponCurrentlyValid(coupon: Coupon, subtotal: number): { valid: boolean; reason?: string } {
  if (!coupon.isActive) return { valid: false, reason: "This coupon is no longer active." }

  const now = new Date()
  if (coupon.startsAt && now < coupon.startsAt) {
    return { valid: false, reason: "This coupon is not active yet." }
  }
  if (coupon.expiresAt && now > coupon.expiresAt) {
    return { valid: false, reason: "This coupon has expired." }
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, reason: "This coupon has reached its usage limit." }
  }
  if (coupon.minOrderValue != null && subtotal < coupon.minOrderValue) {
    return { valid: false, reason: `This coupon requires a minimum order of Rs ${coupon.minOrderValue.toLocaleString()}.` }
  }

  return { valid: true }
}
