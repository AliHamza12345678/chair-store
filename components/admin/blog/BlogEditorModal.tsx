"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  X, Check, Sparkles, Image, Video, Code, Quote, AlertCircle, Layout, Hash,
  Heading1, Heading2, AlignLeft, Bold, Italic, Link, Trash2, Eye, Calendar,
  Clock, Tag, FileText, Globe, RefreshCw, ChevronRight, Layers, Plus, MoveUp, MoveDown
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/select"
import { toast } from "sonner"
import { createPost, updatePost } from "@/features/blog/actions"

interface BlogEditorModalProps {
  isOpen: boolean
  onClose: () => void
  editingPost: any | null
}

type BlockType = "paragraph" | "h1" | "h2" | "quote" | "callout" | "image" | "code" | "video"

interface EditorBlock {
  id: string
  type: BlockType
  content: string
  extra?: any
}

export function BlogEditorModal({ isOpen, onClose, editingPost }: BlogEditorModalProps) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [category, setCategory] = useState("Interior Design")
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT")
  const [authorName, setAuthorName] = useState("LUMINA Editorial")
  const [tags, setTags] = useState<string[]>(["LUXURY", "INTERIOR"])
  const [newTagInput, setNewTagInput] = useState("")
  const [ogImage, setOgImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState("Saved just now")

  // Blocks array
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: "b1", type: "paragraph", content: "Welcome to Lumina's editorial studio. Select or edit text blocks below..." }
  ])

  // Slash menu state
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || "")
      setSlug(editingPost.slug || "")
      setExcerpt(editingPost.excerpt || "")
      setCoverImage(editingPost.coverImage || "")
      setCategory(editingPost.category || "Interior Design")
      setStatus(editingPost.status || "DRAFT")
      setAuthorName(editingPost.authorName || "LUMINA Editorial")
      setTags(editingPost.tags || ["LUXURY"])
      setOgImage(editingPost.ogImage || editingPost.coverImage || "")

      // Parse content into blocks or single text block
      if (editingPost.content) {
        const lines = editingPost.content.split("\n\n").filter(Boolean)
        const parsedBlocks: EditorBlock[] = lines.map((line: string, idx: number) => {
          if (line.startsWith("# ")) return { id: `b-${idx}`, type: "h1", content: line.replace("# ", "") }
          if (line.startsWith("## ")) return { id: `b-${idx}`, type: "h2", content: line.replace("## ", "") }
          if (line.startsWith("> ")) return { id: `b-${idx}`, type: "quote", content: line.replace("> ", "") }
          if (line.startsWith("```")) return { id: `b-${idx}`, type: "code", content: line.replace(/```/g, "") }
          return { id: `b-${idx}`, type: "paragraph", content: line }
        })
        setBlocks(parsedBlocks.length > 0 ? parsedBlocks : [{ id: "b1", type: "paragraph", content: editingPost.content }])
      }
    } else {
      setTitle("")
      setSlug("")
      setExcerpt("")
      setCoverImage("")
      setCategory("Interior Design")
      setStatus("DRAFT")
      setAuthorName("LUMINA Editorial")
      setTags(["LUXURY", "DESIGN"])
      setOgImage("")
      setBlocks([
        { id: "b1", type: "h1", content: "Architectural Comfort in Modern Seating" },
        { id: "b2", type: "paragraph", content: "Exploring how ergonomic contours and full-grain leather transform executive sanctuaries into spaces of serene productivity." },
        { id: "b3", type: "callout", content: "Key Design Insight: Lumina's 5-point lumbar support reduces lumbar strain by 42% over long workdays.", extra: { style: "info" } },
        { id: "b4", type: "quote", content: "Architecture is not just about space; it is about how furniture commands the experience of living." }
      ])
    }
  }, [editingPost, isOpen])

  if (!isOpen) return null

  // Compute Word Count & Reading Time
  const fullText = blocks.map(b => b.content).join(" ")
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))
  const readingTime = `${readingTimeMinutes} min read`

  // Calculate Real-Time SEO Score (0 - 100)
  let calculatedSeoScore = 40
  if (title.length >= 10) calculatedSeoScore += 20
  if (excerpt.length >= 20) calculatedSeoScore += 15
  if (coverImage) calculatedSeoScore += 15
  if (wordCount >= 100) calculatedSeoScore += 10
  const finalSeoScore = Math.min(100, calculatedSeoScore)

  const handleAddBlock = (type: BlockType) => {
    const newBlock: EditorBlock = {
      id: `b-${Date.now()}`,
      type,
      content: type === "h1" ? "Heading Title" : type === "quote" ? "Inspiring quote..." : type === "callout" ? "Important callout note..." : "",
      extra: type === "callout" ? { style: "info" } : type === "code" ? { lang: "typescript" } : undefined
    }
    setBlocks([...blocks, newBlock])
    setShowSlashMenu(false)
  }

  const handleUpdateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b))
    setAutoSaveStatus("Saving changes...")
    setTimeout(() => setAutoSaveStatus("Saved just now"), 1000)
  }

  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) return
    setBlocks(blocks.filter(b => b.id !== id))
  }

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === blocks.length - 1) return
    const newBlocks = [...blocks]
    const targetIdx = direction === "up" ? index - 1 : index + 1
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIdx]
    newBlocks[targetIdx] = temp
    setBlocks(newBlocks)
  }

  const handleAddTag = () => {
    if (!newTagInput.trim()) return
    const tag = newTagInput.trim().toUpperCase()
    if (!tags.includes(tag)) setTags([...tags, tag])
    setNewTagInput("")
  }

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please provide an article title")
      return
    }

    // Assemble blocks into markdown string
    const assembledContent = blocks.map(b => {
      if (b.type === "h1") return `# ${b.content}`
      if (b.type === "h2") return `## ${b.content}`
      if (b.type === "quote") return `> ${b.content}`
      if (b.type === "callout") return `> **Note**: ${b.content}`
      if (b.type === "code") return `\`\`\`\n${b.content}\n\`\`\``
      return b.content
    }).join("\n\n")

    setIsSubmitting(true)
    const t = toast.loading(editingPost ? "Saving Notion article..." : "Publishing Notion article...")

    const formData = {
      title,
      slug,
      excerpt,
      content: assembledContent,
      coverImage,
      status,
      authorName,
      category,
      readingTime,
      seoScore: finalSeoScore,
      tags,
      ogImage,
    }

    try {
      const res = editingPost ? await updatePost(editingPost.id, formData) : await createPost(formData)
      if (res.success) {
        toast.success(editingPost ? "Article updated successfully" : "Article published successfully", { id: t })
        onClose()
      } else {
        toast.error(res.error || "Failed to save article", { id: t })
      }
    } catch {
      toast.error("Error saving article", { id: t })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-black/80 backdrop-blur-lg">
      {/* Notion Fullscreen Container */}
      <div className="relative z-10 w-full h-[96vh] bg-[var(--lm-surface-elevated)] text-[var(--lm-text-primary)] rounded-3xl border border-[var(--lm-border-default)] shadow-2xl overflow-hidden flex flex-col glass-card animate-scale-spring">
        {/* Top Notion Bar Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-[var(--lm-surface-secondary)] border-b border-[var(--lm-border-default)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[var(--lm-text-primary)] uppercase tracking-wider">Notion Studio</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.2 rounded-full">
                  {autoSaveStatus}
                </span>
              </div>
              <p className="text-[10px] text-[var(--lm-text-muted)] font-mono">{wordCount} words • {readingTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveArticle}
              disabled={isSubmitting}
              className="bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-xs rounded-xl h-8 px-4 gap-1.5 shadow-md"
            >
              {isSubmitting ? "Saving..." : (editingPost ? "Save Changes" : "Publish Article")}
            </Button>
          </div>
        </div>

        {/* 3-Panel Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* PANEL 1: Left Outline & Block Palette (3 Cols) */}
          <div className="hidden lg:block lg:col-span-3 border-r border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] p-4 overflow-y-auto custom-scrollbar space-y-5">
            <div>
              <h4 className="text-[11px] font-bold text-[var(--lm-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[var(--lm-accent-text)]" />
                Document Outline
              </h4>
              <div className="space-y-1 text-xs">
                {blocks.filter(b => b.type === "h1" || b.type === "h2").map((b, i) => (
                  <div
                    key={b.id}
                    className={`p-2 rounded-xl border border-[var(--lm-border-subtle)] bg-[var(--lm-surface-elevated)] font-semibold truncate ${b.type === 'h2' ? 'ml-3 text-[11px] text-[var(--lm-text-muted)]' : 'text-[var(--lm-text-primary)]'}`}
                  >
                    {b.content || "Untitled Heading"}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Block Inserter Palette */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-[var(--lm-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-500" />
                Block Inserter Palette
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { type: "paragraph", label: "Paragraph", icon: AlignLeft },
                  { type: "h1", label: "Heading 1", icon: Heading1 },
                  { type: "h2", label: "Heading 2", icon: Heading2 },
                  { type: "callout", label: "Callout", icon: AlertCircle },
                  { type: "quote", label: "Quote", icon: Quote },
                  { type: "image", label: "Image", icon: Image },
                  { type: "code", label: "Code", icon: Code },
                  { type: "video", label: "Video", icon: Video },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => handleAddBlock(item.type as BlockType)}
                      className="p-2.5 rounded-xl border border-[var(--lm-border-subtle)] bg-[var(--lm-surface-elevated)] hover:bg-[var(--lm-surface-hover)] hover:border-[var(--lm-accent-border)] text-left flex items-center gap-2 text-[11px] font-semibold text-[var(--lm-text-secondary)] transition-all"
                    >
                      <Icon className="w-3.5 h-3.5 text-[var(--lm-accent-text)] shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* PANEL 2: Center Editor Canvas (6 Cols) */}
          <div className="col-span-1 lg:col-span-6 p-6 overflow-y-auto custom-scrollbar space-y-6 bg-[var(--lm-surface-elevated)]">
            {/* Title & Cover Image */}
            <div className="space-y-4 border-b border-[var(--lm-border-default)] pb-6">
              <Input
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="Cover Image URL (e.g. https://images.unsplash.com/...)"
                className="text-xs bg-[var(--lm-surface-secondary)] h-9"
              />

              <textarea
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Article Title..."
                rows={2}
                className="w-full text-3xl font-black tracking-tight text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] bg-transparent border-none focus:outline-none resize-none leading-tight"
              />

              <Input
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="Write a compelling 1-sentence article summary..."
                className="text-xs bg-[var(--lm-surface-secondary)] h-9"
              />
            </div>

            {/* Interactive Notion Blocks Canvas */}
            <div className="space-y-4">
              {blocks.map((block, idx) => (
                <div key={block.id} className="group relative flex items-start gap-2 p-2 rounded-2xl hover:bg-[var(--lm-surface-secondary)]/60 transition-colors">
                  {/* Block Controls */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 pt-2 shrink-0 transition-opacity">
                    <button onClick={() => handleMoveBlock(idx, "up")} className="p-1 rounded text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]">
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleMoveBlock(idx, "down")} className="p-1 rounded text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]">
                      <MoveDown className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDeleteBlock(block.id)} className="p-1 rounded text-rose-500 hover:text-rose-600">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Block Field Rendering */}
                  <div className="flex-1 min-w-0">
                    {block.type === "h1" && (
                      <input
                        value={block.content}
                        onChange={e => handleUpdateBlockContent(block.id, e.target.value)}
                        placeholder="Heading 1..."
                        className="w-full text-2xl font-black text-[var(--lm-text-primary)] bg-transparent border-none focus:outline-none"
                      />
                    )}

                    {block.type === "h2" && (
                      <input
                        value={block.content}
                        onChange={e => handleUpdateBlockContent(block.id, e.target.value)}
                        placeholder="Heading 2..."
                        className="w-full text-xl font-bold text-[var(--lm-text-primary)] bg-transparent border-none focus:outline-none"
                      />
                    )}

                    {block.type === "paragraph" && (
                      <textarea
                        value={block.content}
                        onChange={e => handleUpdateBlockContent(block.id, e.target.value)}
                        placeholder="Type paragraph or '/' for slash commands..."
                        rows={3}
                        className="w-full text-sm text-[var(--lm-text-secondary)] bg-transparent border-none focus:outline-none resize-none leading-relaxed font-serif"
                      />
                    )}

                    {block.type === "quote" && (
                      <div className="p-4 rounded-2xl bg-indigo-500/10 border-l-4 border-indigo-500 italic text-sm text-[var(--lm-text-primary)]">
                        <textarea
                          value={block.content}
                          onChange={e => handleUpdateBlockContent(block.id, e.target.value)}
                          placeholder="Write inspiring quote..."
                          rows={2}
                          className="w-full bg-transparent border-none focus:outline-none resize-none font-serif"
                        />
                      </div>
                    )}

                    {block.type === "callout" && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <textarea
                          value={block.content}
                          onChange={e => handleUpdateBlockContent(block.id, e.target.value)}
                          placeholder="Callout highlight note..."
                          rows={2}
                          className="w-full text-xs font-semibold text-[var(--lm-text-primary)] bg-transparent border-none focus:outline-none resize-none"
                        />
                      </div>
                    )}

                    {block.type === "code" && (
                      <div className="p-4 rounded-2xl bg-neutral-950 text-emerald-400 font-mono text-xs space-y-1 border border-neutral-800">
                        <span className="text-[10px] text-neutral-500 block uppercase">Code Block</span>
                        <textarea
                          value={block.content}
                          onChange={e => handleUpdateBlockContent(block.id, e.target.value)}
                          placeholder="const example = () => {}"
                          rows={4}
                          className="w-full bg-transparent border-none focus:outline-none resize-none font-mono"
                        />
                      </div>
                    )}

                    {block.type === "image" && (
                      <div className="space-y-2 p-3 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)]">
                        <Input
                          value={block.content}
                          onChange={e => handleUpdateBlockContent(block.id, e.target.value)}
                          placeholder="Image URL..."
                          className="text-xs bg-[var(--lm-surface-primary)] h-8"
                        />
                        {block.content && (
                          <div className="h-48 rounded-xl overflow-hidden border border-[var(--lm-border-subtle)]">
                            <img src={block.content} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add Block Trigger */}
            <button
              type="button"
              onClick={() => handleAddBlock("paragraph")}
              className="w-full py-3 rounded-2xl border border-dashed border-[var(--lm-border-default)] hover:border-[var(--lm-accent-border)] text-xs text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4 text-[var(--lm-accent-text)]" />
              Add Paragraph Block
            </button>
          </div>

          {/* PANEL 3: Right SEO & Publishing Inspector (3 Cols) */}
          <div className="hidden lg:block lg:col-span-3 border-l border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] p-4 overflow-y-auto custom-scrollbar space-y-5">
            {/* Status Selector */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-[var(--lm-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                Publishing Status
              </h4>
              <Select value={status} onChange={e => setStatus(e.target.value as any)} className="bg-[var(--lm-surface-elevated)] text-xs h-9 font-bold">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </Select>
            </div>

            {/* Real-time SEO Score Calculator */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[var(--lm-surface-elevated)] to-[var(--lm-surface-elevated)] border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--lm-text-primary)] uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> SEO Optimization
                </span>
                <span className="text-sm font-black text-amber-500 tabular-nums">{finalSeoScore}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--lm-surface-secondary)] overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${finalSeoScore}%` }} />
              </div>
              <p className="text-[10px] text-[var(--lm-text-muted)]">
                {finalSeoScore >= 80 ? "✓ Article is well optimized for search engine ranking." : "Add a cover image and longer excerpt to improve score."}
              </p>
            </div>

            {/* Permastructure / Slug */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--lm-text-muted)] uppercase">URL Slug Permastructure</label>
              <Input
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="article-url-slug"
                className="text-xs font-mono bg-[var(--lm-surface-elevated)] h-8"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--lm-text-muted)] uppercase">Category</label>
              <Select value={category} onChange={e => setCategory(e.target.value)} className="bg-[var(--lm-surface-elevated)] text-xs h-9">
                <option value="Interior Design">Interior Design</option>
                <option value="Ergonomics">Ergonomics</option>
                <option value="Guides & How-To">Guides & How-To</option>
                <option value="Lumina News">Lumina News</option>
              </Select>
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--lm-text-muted)] uppercase">Author Name</label>
              <Input
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="LUMINA Editorial"
                className="text-xs bg-[var(--lm-surface-elevated)] h-8"
              />
            </div>

            {/* Article Tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[var(--lm-text-muted)] uppercase flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-500" /> Article Tags
              </label>
              <div className="flex items-center gap-1.5">
                <Input
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tag..."
                  className="bg-[var(--lm-surface-elevated)] text-xs h-8"
                />
                <Button type="button" size="sm" onClick={handleAddTag} className="h-8 text-xs bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)]">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)] border border-[var(--lm-accent-border)] flex items-center gap-1">
                    <span>{t}</span>
                    <button onClick={() => setTags(tags.filter(x => x !== t))} className="hover:text-rose-500">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
