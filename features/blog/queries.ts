import { prisma } from "@/lib/prisma"

/** Storefront: only published posts, newest first. */
export async function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  })
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
  })
}

/** Admin: every post regardless of status. */
export async function getAllPosts() {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } })
}
