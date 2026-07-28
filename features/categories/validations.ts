import * as z from "zod"

const imageField = z.string().transform((val) => val === null ? "" : val).optional().or(z.literal(""))

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  imageUrl: imageField,
  bannerUrl: imageField,
  thumbnailUrl: imageField,
  parentId: z.string().optional().or(z.literal("")),
  type: z.enum(["PARENT", "SUBCATEGORY", "COLLECTION"]).default("PARENT"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().max(60, "SEO title should be under 60 characters").optional().or(z.literal("")),
  seoDescription: z.string().max(160, "SEO description should be under 160 characters").optional().or(z.literal("")),
  seoKeywords: z.string().optional().or(z.literal("")),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
