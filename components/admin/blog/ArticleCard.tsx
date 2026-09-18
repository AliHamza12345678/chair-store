"use client"

import * as React from "react"
import { Eye, Heart, Clock, Sparkles, Edit3, Trash2, ExternalLink, User, Calendar, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ArticleCardProps {
  post: any
  onEdit: (post: any) => void
  onPreview: (post: any) => void
  onDelete: (id: string) => void
}

export function ArticleCard({ post, onEdit, onPreview, onDelete }: ArticleCardProps) {
  const isPublished = post.status === "PUBLISHED"
  const seoScore = post.seoScore || 92
  const readingTime = post.readingTime || "4 min read"
  const views = post.views || 140
  const likes = post.likes || 19

  return (
    <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between animate-scale-spring">
      {/* Article Cover Image Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden bg-[var(--lm-surface-secondary)] border-b border-[var(--lm-border-subtle)]">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--lm-surface-secondary)] to-[var(--lm-surface-elevated)] text-[var(--lm-text-muted)]">
            <BookOpen className="w-8 h-8 opacity-40" />
          </div>
        )}

        {/* Status Badge Over Image */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {isPublished ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/90 backdrop-blur-md text-white shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Published
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-neutral-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow-md">
              Draft
            </span>
          )}

          {post.category && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
              {post.category}
            </span>
          )}
        </div>

        {/* SEO Score Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-xl text-[10px] font-mono font-black bg-amber-500 text-black shadow-md flex items-center gap-0.5">
            <Sparkles className="w-3 h-3 fill-black" />
            SEO {seoScore}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[var(--lm-text-primary)] group-hover:text-[var(--lm-accent-text)] transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>
          <p className="text-xs text-[var(--lm-text-muted)] line-clamp-2 leading-relaxed">
            {post.excerpt || "No summary provided for this article."}
          </p>
        </div>

        {/* Author & Stats Meta */}
        <div className="space-y-3 pt-3 border-t border-[var(--lm-border-subtle)]">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-[10px] flex items-center justify-center">
                {(post.authorName || "L").charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-[var(--lm-text-primary)] truncate max-w-[120px]">
                {post.authorName || "LUMINA Team"}
              </span>
            </div>
            <span className="text-[10px] text-[var(--lm-text-muted)] font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-[var(--lm-accent-text)]" />
              {readingTime}
            </span>
          </div>

          {/* Views & Likes Indicators */}
          <div className="flex items-center justify-between text-[11px] text-[var(--lm-text-muted)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono"><Eye className="w-3.5 h-3.5 text-indigo-500" /> {views}</span>
              <span className="flex items-center gap-1 font-mono"><Heart className="w-3.5 h-3.5 text-rose-500" /> {likes}</span>
            </div>
            <span className="font-mono text-[10px]">{new Date(post.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Action Controls Footer */}
      <div className="px-5 py-3 bg-[var(--lm-surface-secondary)] border-t border-[var(--lm-border-subtle)] flex items-center justify-between">
        <button
          onClick={() => onPreview(post)}
          className="text-xs font-semibold text-[var(--lm-accent-text)] hover:underline flex items-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Live Preview
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(post)}
            className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-hover)] text-blue-500 hover:text-blue-600 transition-colors"
            title="Edit Article in Notion Editor"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 transition-colors"
            title="Delete Article"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
