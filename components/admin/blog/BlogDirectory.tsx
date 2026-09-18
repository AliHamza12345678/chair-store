"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Search, LayoutGrid, List, Plus, BookOpen, Edit3, Trash2, X, Eye, ExternalLink, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { deletePost } from "@/features/blog/actions"
import { ArticleCard } from "./ArticleCard"
import { BlogEditorModal } from "./BlogEditorModal"
import { BlogLivePreviewModal } from "./BlogLivePreviewModal"

interface BlogDirectoryProps {
  posts: any[]
}

type FilterType = "ALL" | "PUBLISHED" | "DRAFT" | "DESIGN" | "ERGONOMICS"
type ViewMode = "grid" | "table"

export function BlogDirectory({ posts }: BlogDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false)
  const [editingPost, setEditingPost] = useState<any | null>(null)
  const [previewPost, setPreviewPost] = useState<any | null>(null)

  // Compute filter counts
  const filterCounts = useMemo(() => {
    let published = 0
    let draft = 0
    let design = 0
    let ergonomics = 0

    posts.forEach(p => {
      if (p.status === "PUBLISHED") published++
      if (p.status === "DRAFT") draft++
      if (p.category === "Interior Design") design++
      if (p.category === "Ergonomics") ergonomics++
    })

    return {
      ALL: posts.length,
      PUBLISHED: published,
      DRAFT: draft,
      DESIGN: design,
      ERGONOMICS: ergonomics,
    }
  }, [posts])

  // Filtered posts list
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (selectedFilter === "PUBLISHED" && p.status !== "PUBLISHED") return false
      if (selectedFilter === "DRAFT" && p.status !== "DRAFT") return false
      if (selectedFilter === "DESIGN" && p.category !== "Interior Design") return false
      if (selectedFilter === "ERGONOMICS" && p.category !== "Ergonomics") return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (p.title || "").toLowerCase().includes(q)
        const matchExcerpt = (p.excerpt || "").toLowerCase().includes(q)
        const matchAuthor = (p.authorName || "").toLowerCase().includes(q)
        const matchCategory = (p.category || "").toLowerCase().includes(q)

        if (!matchTitle && !matchExcerpt && !matchAuthor && !matchCategory) return false
      }

      return true
    })
  }, [posts, selectedFilter, searchQuery])

  const handleOpenNew = () => {
    setEditingPost(null)
    setIsEditorOpen(true)
  }

  const handleOpenEdit = (post: any) => {
    setEditingPost(post)
    setIsEditorOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return
    const t = toast.loading("Deleting article...")
    try {
      const res = await deletePost(id)
      if (res.success) {
        toast.success("Article deleted successfully", { id: t })
      } else {
        toast.error(res.error || "Failed to delete article", { id: t })
      }
    } catch {
      toast.error("Error deleting article", { id: t })
    }
  }

  return (
    <div className="space-y-5">
      {/* Search, Filter Pills & Add Button Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3.5 rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lm-text-muted)]" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, author, or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-8 rounded-2xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-primary)] text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lm-accent-primary)]/40 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar p-1">
          {[
            { id: "ALL", label: "All Articles" },
            { id: "PUBLISHED", label: "Published" },
            { id: "DRAFT", label: "Drafts" },
            { id: "DESIGN", label: "Interior Design" },
            { id: "ERGONOMICS", label: "Ergonomics" },
          ].map(f => {
            const isActive = selectedFilter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id as FilterType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all duration-300 ${isActive ? 'bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] shadow-md' : 'text-[var(--lm-text-muted)] hover:bg-[var(--lm-surface-hover)]'}`}
              >
                <span>{f.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${isActive ? 'bg-black/20 text-white' : 'bg-[var(--lm-surface-secondary)] text-[var(--lm-text-muted)]'}`}>
                  {filterCounts[f.id as FilterType]}
                </span>
              </button>
            )
          })}
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center gap-2 border-l border-[var(--lm-border-subtle)] pl-3 shrink-0">
          <div className="flex items-center p-1 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-xl text-xs transition-colors ${viewMode === "grid" ? "bg-[var(--lm-surface-elevated)] text-[var(--lm-accent-text)] shadow-sm" : "text-[var(--lm-text-muted)]"}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-xl text-xs transition-colors ${viewMode === "table" ? "bg-[var(--lm-surface-elevated)] text-[var(--lm-accent-text)] shadow-sm" : "text-[var(--lm-text-muted)]"}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleOpenNew}
            className="bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-xs rounded-2xl h-9 px-4 gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Notion Article
          </Button>
        </div>
      </div>

      {/* Directory Contents */}
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card">
          <div className="p-4 rounded-3xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] mb-3 animate-float">
            <BookOpen className="w-8 h-8 text-[var(--lm-accent-text)]" />
          </div>
          <h4 className="text-sm font-bold text-[var(--lm-text-primary)]">No articles found</h4>
          <p className="text-xs text-[var(--lm-text-muted)] mt-1 max-w-xs">
            {searchQuery || selectedFilter !== "ALL"
              ? "Try adjusting your search query or selecting a different category filter."
              : "Create your first luxury article using our Notion-style block editor."}
          </p>
          <Button onClick={handleOpenNew} className="mt-4 bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-xs rounded-xl h-9 px-4">
            <Plus className="w-4 h-4 mr-1.5" />
            Open Notion Editor
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW: Article Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map(post => (
            <ArticleCard
              key={post.id}
              post={post}
              onEdit={handleOpenEdit}
              onPreview={setPreviewPost}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* TABLE VIEW: Modern Table */
        <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">
                  <th className="px-4 py-3.5">Article Title</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Author</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">SEO Score</th>
                  <th className="px-4 py-3.5">Updated</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lm-border-subtle)]">
                {filteredPosts.map(p => (
                  <tr key={p.id} className="group transition-colors hover:bg-[var(--lm-surface-hover)]">
                    <td className="px-4 py-3.5 font-bold text-[var(--lm-text-primary)]">
                      {p.title}
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-[var(--lm-text-muted)]">
                      {p.category || "General"}
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-[var(--lm-text-secondary)] font-medium">
                      {p.authorName || "LUMINA Editorial"}
                    </td>

                    <td className="px-4 py-3.5">
                      {p.status === "PUBLISHED" ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                          Published
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">
                          Draft
                        </Badge>
                      )}
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-amber-500">
                      {p.seoScore || 90}/100
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-[var(--lm-text-muted)] font-mono">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewPost(p)}
                          className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]"
                          title="Live Preview"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] text-blue-500"
                          title="Edit in Notion Editor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/15 text-rose-500"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notion Block Editor Modal */}
      <BlogEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        editingPost={editingPost}
      />

      {/* Live Storefront Article Preview Modal */}
      <BlogLivePreviewModal
        isOpen={!!previewPost}
        onClose={() => setPreviewPost(null)}
        post={previewPost}
      />
    </div>
  )
}
