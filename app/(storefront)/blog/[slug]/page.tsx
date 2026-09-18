import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getPublishedPostBySlug } from "@/features/blog/queries"
import { estimateReadingTime } from "@/features/blog/utils"
import type { Metadata } from "next"

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPublishedPostBySlug(params.slug)
  if (!post) return { title: "Not Found" }
  return {
    title: `${post.title} | LUMINA Journal`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPublishedPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <div className="container mx-auto px-6 md:px-12 py-32 max-w-3xl min-h-screen">
      <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-12">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
      </Link>

      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""} · {estimateReadingTime(post.content)} min read
        {post.authorName && ` · ${post.authorName}`}
      </p>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-10">{post.title}</h1>

      {post.coverImage && (
        <div className="aspect-video bg-secondary rounded-2xl overflow-hidden mb-10">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap">
        {post.content}
      </div>
    </div>
  )
}
