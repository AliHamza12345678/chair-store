import * as z from "zod"

export const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  phone: z.string().min(7, "Enter a valid phone number."),
  addressLine1: z.string().min(3, "Address is required."),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  isDefault: z.boolean(),
})

export type AddressFormValues = z.input<typeof addressSchema>
