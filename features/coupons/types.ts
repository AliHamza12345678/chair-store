import type { Coupon, CouponType } from "@prisma/client"

export type { Coupon, CouponType }

export interface ApplyCouponResult {
  success: boolean
  error?: string
  coupon?: {
    id: string
    code: string
    discountAmount: number
  }
}
