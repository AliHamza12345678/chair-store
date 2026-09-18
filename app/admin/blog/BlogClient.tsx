"use client"

import * as React from "react"
import { BlogMetrics } from "@/components/admin/blog/BlogMetrics"
import { BlogDirectory } from "@/components/admin/blog/BlogDirectory"
import { BookOpen, Sparkles, Layers } from "lucide-react"

interface BlogClientProps {
  posts: any[]
}

export function BlogClient({ posts }: BlogClientProps) {
  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--lm-border-default)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Notion + Medium Editorial Studio
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--lm-text-primary)] mt-2">
            CMS Editorial & Blog Studio
          </h1>
          <p className="text-xs text-[var(--lm-text-muted)] mt-1">
            Write guides, design stories, and updates with our 3-panel block editor featuring slash commands (`/`), SEO analysis, and live storefront previews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-[var(--lm-surface-elevated)] border border-[var(--lm-border-default)] glass-card flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--lm-accent-text)]" />
            <span className="text-xs font-semibold text-[var(--lm-text-secondary)]">{posts.length} Articles Recorded</span>
          </div>
        </div>
      </div>

      {/* 1. Reader & Article Metrics */}
      <BlogMetrics posts={posts} />

      {/* 2. Article Cards Grid & Modern Table Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--lm-text-primary)] tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--lm-accent-text)]" />
            Editorial Publications Directory ({posts.length})
          </h2>
        </div>

        <BlogDirectory posts={posts} />
      </div>
    </div>
  )
}
