import * as z from "zod"

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().optional(),
  excerpt: z.string().max(400).optional(),
  content: z.string().min(10, "Content must be at least 10 characters."),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  authorName: z.string().optional(),
  category: z.string().optional(),
  readingTime: z.string().optional(),
  seoScore: z.number().optional(),
  tags: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>
