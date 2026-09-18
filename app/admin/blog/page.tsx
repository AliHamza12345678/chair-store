import { getAllPosts } from "@/features/blog/queries"
import { BlogClient } from "./BlogClient"

export default async function AdminBlogPage() {
  const posts = await getAllPosts()

  const serializedPosts = posts.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    publishedAt: p.publishedAt?.toISOString() || null,
  }))

  return <BlogClient posts={serializedPosts as any} />
}
