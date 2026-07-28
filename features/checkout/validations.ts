import * as z from "zod"

export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  address: z.string().min(5, "Address is required."),
  city: z.string().min(1, "City is required."),
  zipCode: z.string().min(1, "Postal code is required."),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["COD", "INSTALLMENT"]).default("COD"),
})

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

export const checkoutItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
})
