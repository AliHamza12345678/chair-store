import * as z from "zod"

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.number().positive("Price must be greater than 0."),
  categoryId: z.string().min(1, "Category is required."),
  imageUrl: z.string().optional(),
  inventory: z.number().min(0),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productSchema>
