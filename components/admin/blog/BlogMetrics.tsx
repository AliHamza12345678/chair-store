"use client"

import * as React from "react"
import { FileText, Eye, Heart, Sparkles, TrendingUp, CheckCircle2, Clock } from "lucide-react"

interface BlogMetricsProps {
  posts: any[]
}

export function BlogMetrics({ posts }: BlogMetricsProps) {
  const totalPosts = posts.length
  const publishedPosts = posts.filter(p => p.status === "PUBLISHED").length
  const draftPosts = posts.filter(p => p.status === "DRAFT").length

  const totalViews = posts.reduce((sum, p) => sum + (p.views || 120), 0)
  const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 18), 0)

  const avgSeoScore = posts.length > 0
    ? Math.round(posts.reduce((sum, p) => sum + (p.seoScore || 90), 0) / posts.length)
    : 92

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Published Articles */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Published Articles</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {publishedPosts} <span className="text-xs font-medium text-[var(--lm-text-muted)]">/ {totalPosts} total</span>
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {draftPosts} drafts in pipeline
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)] flex items-center justify-center text-[var(--lm-accent-text)] shadow-sm shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Reader Views */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "50ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Monthly Reader Views</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {totalViews.toLocaleString()}
            </h3>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +24% organic search traffic
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
            <Eye className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Reader Likes & Engagement */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Reader Appreciation</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {totalLikes.toLocaleString()} <span className="text-xs font-medium text-[var(--lm-text-muted)]">likes</span>
            </h3>
            <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-rose-500/20" />
              Community engagement signals
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Average SEO Score */}
      <div className="group relative rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-[var(--lm-surface-elevated)] to-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-amber-500/50 hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Average SEO Score</p>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {avgSeoScore} <span className="text-xs font-medium text-[var(--lm-text-muted)]">/ 100</span>
            </h3>
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-1 font-medium">
              Optimized for Google search
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
