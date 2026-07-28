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
  const { title, slug: customSlug, excerpt, content, coverImage, status, authorName, category, readingTime, seoScore, tags, ogImage } = parsed.data

  const baseSlug = customSlug ? slugify(customSlug) : slugify(title)
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
        category: category || "General",
        readingTime: readingTime || "3 min read",
        seoScore: seoScore ?? 90,
        tags: tags || [],
        ogImage: ogImage || coverImage || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    })
    revalidatePath("/admin/blog")
    revalidatePath("/blog")
    return { success: true as const }
  } catch (error: any) {
    return { success: false as const, error: error.message || "Failed to create post." }
  }
}

export async function updatePost(id: string, data: BlogPostFormValues) {
  await requireAdmin()

  const parsed = blogPostSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid fields" }
  }
  const { title, slug: customSlug, excerpt, content, coverImage, status, authorName, category, readingTime, seoScore, tags, ogImage } = parsed.data

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) return { success: false as const, error: "Post not found." }

    const slug = customSlug ? slugify(customSlug) : existing.slug

    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        status,
        authorName,
        category: category || existing.category || "General",
        readingTime: readingTime || existing.readingTime || "3 min read",
        seoScore: seoScore ?? existing.seoScore ?? 90,
        tags: tags || existing.tags || [],
        ogImage: ogImage || coverImage || existing.ogImage || null,
        publishedAt: status === "PUBLISHED" ? existing.publishedAt ?? new Date() : existing.publishedAt,
      },
    })
    revalidatePath("/admin/blog")
    revalidatePath("/blog")
    revalidatePath(`/blog/${existing.slug}`)
    return { success: true as const }
  } catch (error: any) {
    return { success: false as const, error: error.message || "Failed to update post." }
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
