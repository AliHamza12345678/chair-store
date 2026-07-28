"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/permissions"
import { slugify } from "@/lib/slugify"
import { blogPostSchema, BlogPostFormValues } from "./validations"

export async function createPost(data: BlogPostFormValues) {
  await requireAdmin()

  const parsed = blogPostSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid fields" }
  }
  const { title, excerpt, content, coverImage, status, authorName } = parsed.data

  const baseSlug = slugify(title)
  let slug = baseSlug
  let suffix = 1
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`
  }

  try {
    await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        status,
        authorName,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    })
    revalidatePath("/admin/blog")
    revalidatePath("/blog")
    return { success: true as const }
  } catch {
    return { success: false as const, error: "Failed to create post." }
  }
}

export async function updatePost(id: string, data: BlogPostFormValues) {
  await requireAdmin()

  const parsed = blogPostSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid fields" }
  }
  const { title, excerpt, content, coverImage, status, authorName } = parsed.data

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) return { success: false as const, error: "Post not found." }

    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        coverImage: coverImage || null,
        status,
        authorName,
        // Set publishedAt the first time a post moves to PUBLISHED; keep it
        // stable after that so re-saving a published post doesn't bump its date.
        publishedAt: status === "PUBLISHED" ? existing.publishedAt ?? new Date() : existing.publishedAt,
      },
    })
    revalidatePath("/admin/blog")
    revalidatePath("/blog")
    revalidatePath(`/blog/${existing.slug}`)
    return { success: true as const }
  } catch {
    return { success: false as const, error: "Failed to update post." }
  }
}

export async function deletePost(id: string) {
  await requireAdmin()
  try {
    await prisma.blogPost.delete({ where: { id } })
    revalidatePath("/admin/blog")
    revalidatePath("/blog")
    return { success: true as const }
  } catch {
    return { success: false as const, error: "Failed to delete post." }
  }
}
