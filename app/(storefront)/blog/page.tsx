import Link from "next/link"
import { getPublishedPosts } from "@/features/blog/queries"
import { estimateReadingTime } from "@/features/blog/utils"

export const metadata = {
  title: "Journal | LUMINA",
  description: "Guides, updates, and stories from the LUMINA team.",
}

export default async function BloglistingPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="container mx-auto px-6 md:px-12 py-32 min-h-screen">
      <h1 className="text-5xl font-bold tracking-tighter mb-4">Journal</h1>
      <p className="text-muted-foreground text-lg mb-16 max-w-xl">
        Guides, updates, and stories from the LUMINA team.
      </p>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts published yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="aspect-[4/3] bg-secondary rounded-2xl overflow-hidden mb-4">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Image</div>
                )}
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""} · {estimateReadingTime(post.content)} min read
              </p>
              <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">{post.title}</h2>
              {post.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
