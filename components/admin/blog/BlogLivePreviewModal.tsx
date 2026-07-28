"use client"

import * as React from "react"
import { X, Calendar, User, Clock, Heart, Eye, Sparkles, Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"

interface BlogLivePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  post: any
}

export function BlogLivePreviewModal({ isOpen, onClose, post }: BlogLivePreviewModalProps) {
  if (!isOpen || !post) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl bg-[var(--lm-surface-elevated)] text-[var(--lm-text-primary)] rounded-3xl border border-[var(--lm-border-default)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] glass-card animate-scale-spring">
        {/* Top Preview Control Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--lm-surface-secondary)] border-b border-[var(--lm-border-default)]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Live Storefront Preview Mode
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-[var(--lm-surface-hover)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Preview Content Body */}
        <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar space-y-8 flex-1 max-w-3xl mx-auto w-full">
          {/* Category & Title */}
          <div className="space-y-3 text-center sm:text-left">
            {post.category && (
              <Badge className="bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)] border-[var(--lm-accent-border)] font-bold text-xs">
                {post.category}
              </Badge>
            )}
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--lm-text-primary)] leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-sm sm:text-base text-[var(--lm-text-muted)] leading-relaxed font-medium">
                {post.excerpt}
              </p>
            )}

            {/* Author & Date Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--lm-border-subtle)] text-xs text-[var(--lm-text-muted)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-xs flex items-center justify-center">
                  {(post.authorName || "L").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[var(--lm-text-primary)]">{post.authorName || "LUMINA Editorial"}</p>
                  <p className="text-[10px] text-[var(--lm-text-muted)]">Published on {new Date(post.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[var(--lm-accent-text)]" /> {post.readingTime || "4 min read"}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-indigo-500" /> {post.views || 140} views</span>
              </div>
            </div>
          </div>

          {/* Hero Cover Image */}
          {post.coverImage && (
            <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-[var(--lm-border-default)] shadow-lg">
              <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Article Rendered Body */}
          <div className="prose prose-neutral dark:prose-invert max-w-none text-sm sm:text-base text-[var(--lm-text-secondary)] leading-relaxed space-y-4 whitespace-pre-wrap font-serif">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-[var(--lm-border-default)] flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[var(--lm-text-muted)]">Article Tags:</span>
              {post.tags.map((t: string) => (
                <span key={t} className="px-3 py-1 rounded-xl text-xs font-semibold bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] text-[var(--lm-text-secondary)]">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
