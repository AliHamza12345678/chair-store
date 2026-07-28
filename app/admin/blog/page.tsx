import { getAllPosts } from "@/features/blog/queries"
import { BlogClient } from "./BlogClient"

export default async function AdminBlogPage() {
  const posts = await getAllPosts()
  return <BlogClient posts={posts} />
}
