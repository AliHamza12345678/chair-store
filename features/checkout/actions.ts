"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/features/auth/queries"
import { validateCoupon, incrementCouponUsage } from "@/features/coupons/actions"
import { calculateSubtotal } from "./utils"
import { checkoutFormSchema } from "./validations"
import type { CheckoutItem, CheckoutResult } from "./types"

const FLAT_SHIPPING_RATE = 50.0

export async function createCheckoutSession(
  items: CheckoutItem[],
  addressText: string,
  couponCode?: string,
  paymentMethod: "COD" | "INSTALLMENT" = "COD"
): Promise<CheckoutResult> {
  const user = await getCurrentUser()

  if (!user?.id) {
    return { success: false, error: "User is required to create an order." }
  }

  if (!items.length) {
    return { success: false, error: "Your cart is empty." }
  }

  // Server-trusted subtotal — never trust a client-supplied total.
  const subtotal = calculateSubtotal(items)

  // Re-validate the coupon server-side; the client's discount is only a preview.
  let discount = 0
  let couponId: string | undefined
  if (couponCode) {
    const couponResult = await validateCoupon(couponCode, subtotal)
    if (couponResult.success && couponResult.coupon) {
      discount = couponResult.coupon.discountAmount
      couponId = couponResult.coupon.id
    }
    // If the coupon is no longer valid at the moment of checkout (e.g. someone
    // else just used the last redemption), we silently drop it rather than
    // blocking the order — the order summary already showed the applied
    // discount, so failing hard here would be a confusing UX for a rare race.
  }

  const total = Math.max(0, subtotal - discount) + FLAT_SHIPPING_RATE

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: user.id,
          total,
          subtotal,
          discount,
          status: "PENDING",
          isPaid: false,
          paymentMethod,
          couponId,
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      })

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        })
      }

      return created
    })

    return { success: true, orderId: order.id }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create checkout session" }
  }
}

export async function processCheckout(items: CheckoutItem[], formData: FormData): Promise<CheckoutResult> {
  const user = await getCurrentUser()
  if (!user) return { success: false, error: "You must be logged in to checkout" }

  const parsed = checkoutFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    address: formData.get("address"),
    city: formData.get("city"),
    zipCode: formData.get("zipCode"),
    couponCode: formData.get("couponCode") || undefined,
    paymentMethod: formData.get("paymentMethod") || "COD",
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Please check your shipping details." }
  }

  const address = `${parsed.data.address}, ${parsed.data.city}, ${parsed.data.zipCode}`

  return createCheckoutSession(items, address, parsed.data.couponCode, parsed.data.paymentMethod)
}
