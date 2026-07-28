import * as z from "zod"

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1, "Please select a rating.").max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, "Review must be at least 10 characters.").max(2000),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
