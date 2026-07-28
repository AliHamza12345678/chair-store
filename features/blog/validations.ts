import * as z from "zod"

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(20, "Content must be at least 20 characters."),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  authorName: z.string().optional(),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>
