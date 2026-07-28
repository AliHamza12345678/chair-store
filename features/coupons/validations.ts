import * as z from "zod"

export const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters.").max(20).toUpperCase(),
  description: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive("Value must be greater than 0."),
  minOrderValue: z.number().nonnegative().optional().nullable(),
  maxDiscount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  isActive: z.boolean(),
  startsAt: z.string().optional().nullable(), // ISO date string from <input type="date">
  expiresAt: z.string().optional().nullable(),
}).refine(
  (data) => data.type !== "PERCENTAGE" || data.value <= 100,
  { message: "Percentage discount cannot exceed 100.", path: ["value"] }
)

export type CouponFormValues = z.input<typeof couponSchema>

export const applyCouponSchema = z.object({
  code: z.string().min(1, "Enter a coupon code."),
  subtotal: z.number().nonnegative(),
})

export type ApplyCouponValues = z.infer<typeof applyCouponSchema>
