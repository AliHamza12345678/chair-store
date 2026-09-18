"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/permissions"
import { couponSchema, CouponFormValues, applyCouponSchema } from "./validations"
import { calculateDiscount, isCouponCurrentlyValid } from "./utils"
import type { ApplyCouponResult } from "./types"

// ── Admin CRUD ──────────────────────────────────────────────

export async function createCoupon(data: CouponFormValues) {
  await requireAdmin()

  const parsed = couponSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid fields" }
  }
  const { code, description, type, value, minOrderValue, maxDiscount, usageLimit, isActive, startsAt, expiresAt } = parsed.data

  try {
    await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        type,
        value,
        minOrderValue: minOrderValue ?? null,
        maxDiscount: maxDiscount ?? null,
        usageLimit: usageLimit ?? null,
        isActive,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })
    revalidatePath("/admin/coupons")
    return { success: true as const }
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { success: false as const, error: "A coupon with this code already exists." }
    }
    return { success: false as const, error: "Failed to create coupon." }
  }
}

export async function updateCoupon(id: string, data: CouponFormValues) {
  await requireAdmin()

  const parsed = couponSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid fields" }
  }
  const { code, description, type, value, minOrderValue, maxDiscount, usageLimit, isActive, startsAt, expiresAt } = parsed.data

  try {
    await prisma.coupon.update({
      where: { id },
      data: {
        code: code.toUpperCase(),
        description,
        type,
        value,
        minOrderValue: minOrderValue ?? null,
        maxDiscount: maxDiscount ?? null,
        usageLimit: usageLimit ?? null,
        isActive,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })
    revalidatePath("/admin/coupons")
    return { success: true as const }
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { success: false as const, error: "A coupon with this code already exists." }
    }
    return { success: false as const, error: "Failed to update coupon." }
  }
}

export async function deleteCoupon(id: string) {
  await requireAdmin()
  try {
    await prisma.coupon.delete({ where: { id } })
    revalidatePath("/admin/coupons")
    return { success: true as const }
  } catch {
    return { success: false as const, error: "Failed to delete coupon." }
  }
}

// ── Storefront: apply coupon at checkout ────────────────────

/**
 * Validates a coupon code against the current cart subtotal and returns
 * the discount amount. Does NOT increment usedCount — that only happens
 * once the order is actually placed (see features/checkout/actions.ts),
 * so an abandoned cart doesn't burn a redemption.
 */
export async function validateCoupon(code: string, subtotal: number): Promise<ApplyCouponResult> {
  const parsed = applyCouponSchema.safeParse({ code, subtotal })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid coupon." }
  }

  const coupon = await prisma.coupon.findFirst({
    where: { code: { equals: parsed.data.code.trim(), mode: "insensitive" } },
  })

  if (!coupon) {
    return { success: false, error: "Coupon not found." }
  }

  const { valid, reason } = isCouponCurrentlyValid(coupon, subtotal)
  if (!valid) {
    return { success: false, error: reason }
  }

  const discountAmount = calculateDiscount(coupon, subtotal)

  return {
    success: true,
    coupon: { id: coupon.id, code: coupon.code, discountAmount },
  }
}

/**
 * Called from inside the order-creation transaction (features/checkout/actions.ts)
 * once an order is confirmed, to atomically increment usage.
 */
export async function incrementCouponUsage(couponId: string) {
  await prisma.coupon.update({
    where: { id: couponId },
    data: { usedCount: { increment: 1 } },
  })
}
