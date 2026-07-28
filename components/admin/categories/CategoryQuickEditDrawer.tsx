"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import {
  X, Upload, Image as ImageIcon, Trash2, Eye, EyeOff, Star, StarOff,
  GripVertical, ChevronDown, AlertCircle, CheckCircle2, Info, Sparkles,
  Globe, FileText, Tag, ArrowUpRight, Check, Layers, Sliders, Hash
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/clsx"

// ─── Types ────────────────────────────────────────────────────
export interface CategoryDrawerData {
  id?: string
  name: string
  description: string
  imageUrl: string
  bannerUrl: string
  thumbnailUrl: string
  parentId: string
  type: "PARENT" | "SUBCATEGORY" | "COLLECTION"
  sortOrder: number
  isVisible: boolean
  isFeatured: boolean
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

interface ParentOption {
  id: string
  name: string
}

interface CategoryQuickEditDrawerProps {
  isOpen: boolean
  onClose: () => void
  data: CategoryDrawerData
  onChange: (data: CategoryDrawerData) => void
  onSave: () => void
  isSaving: boolean
  parentOptions: ParentOption[]
}

// ─── SEO Score Calculator ─────────────────────────────────────
function calculateSeoScore(data: CategoryDrawerData): { score: number; issues: string[]; passes: string[] } {
  const issues: string[] = []
  const passes: string[] = []
  let score = 0

  // Title checks
  if (data.seoTitle && data.seoTitle.length >= 10 && data.seoTitle.length <= 60) {
    score += 25
    passes.push("SEO title length is optimal (10-60 chars)")
  } else if (data.seoTitle && data.seoTitle.length > 0) {
    score += 10
    issues.push(data.seoTitle.length < 10 ? "SEO title is too short" : "SEO title exceeds 60 characters")
  } else {
    issues.push("Missing SEO title")
  }

  // Description checks
  if (data.seoDescription && data.seoDescription.length >= 50 && data.seoDescription.length <= 160) {
    score += 25
    passes.push("Meta description length is optimal (50-160 chars)")
  } else if (data.seoDescription && data.seoDescription.length > 0) {
    score += 10
    issues.push(data.seoDescription.length < 50 ? "Meta description is too short" : "Meta description exceeds 160 chars")
  } else {
    issues.push("Missing meta description")
  }

  // Keywords
  if (data.seoKeywords && data.seoKeywords.trim().length > 0) {
    const kwCount = data.seoKeywords.split(",").filter(k => k.trim()).length
    if (kwCount >= 3 && kwCount <= 8) {
      score += 25
      passes.push(`${kwCount} keywords defined (${kwCount} tags)`)
    } else {
      score += 15
      issues.push(kwCount < 3 ? "Add more keywords (3+ recommended)" : "Too many keywords (max 8)")
    }
  } else {
    issues.push("No SEO keywords defined")
  }

  // Visual Assets
  if (data.imageUrl || data.bannerUrl || data.thumbnailUrl) {
    score += 15
    passes.push("Category has visual media attached")
  } else {
    issues.push("No cover, banner, or thumbnail image set")
  }

  // Name quality
  if (data.name && data.name.length >= 3) {
    score += 10
    passes.push("Category name is clear and descriptive")
  } else {
    issues.push("Category name is too short")
  }

  return { score: Math.min(score, 100), issues, passes }
}

function getSeoGrade(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500/10" }
  if (score >= 60) return { label: "Good", color: "text-blue-500", bg: "bg-blue-500/10" }
  if (score >= 40) return { label: "Fair", color: "text-amber-500", bg: "bg-amber-500/10" }
  return { label: "Needs Attention", color: "text-red-500", bg: "bg-red-500/10" }
}

// ─── Drag & Drop Image Zone ──────────────────────────────────
function DragDropImageZone({
  label,
  value,
  onChange,
  aspectHint,
  icon: Icon = ImageIcon
}: {
  label: string
  value: string
  onChange: (url: string) => void
  aspectHint: string
  icon?: React.ElementType
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUrlMode, setIsUrlMode] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    // Handle files dropped directly
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
        return
      }
    }

    // Handle drag text/URL
    const text = e.dataTransfer.getData("text/plain")
    if (text && (text.startsWith("http://") || text.startsWith("https://") || text.startsWith("data:image/"))) {
      onChange(text)
      return
    }

    const html = e.dataTransfer.getData("text/html")
    if (html) {
      const match = html.match(/src=["']([^"']+)["']/)
      if (match?.[1]) {
        onChange(match[1])
      }
    }
  }, [onChange])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  if (value) {
    return (
      <div className="group relative rounded-2xl overflow-hidden border border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] shadow-sm transition-all duration-300 hover:shadow-md">
        <img
          src={value}
          alt={label}
          className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-3">
          <div>
            <span className="text-xs font-semibold text-white">{label}</span>
            <p className="text-[10px] text-white/70">Image Set</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs transition-colors"
              title="Replace image"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    )
  }

  if (isUrlMode) {
    return (
      <div className="rounded-2xl border border-[var(--lm-accent-border)] bg-[var(--lm-surface-elevated)] p-3 space-y-2 animate-scale-spring">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--lm-text-primary)]">{label} URL</span>
          <button
            type="button"
            onClick={() => setIsUrlMode(false)}
            className="text-[11px] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors"
          >
            Cancel
          </button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Paste image URL (https://...)"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            className="text-xs h-8 bg-[var(--lm-surface-primary)]"
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            className="h-8 text-xs shrink-0 bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)]"
            onClick={() => {
              if (urlInput) {
                onChange(urlInput)
                setUrlInput("")
                setIsUrlMode(false)
              }
            }}
          >
            Set
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 group",
        "h-28 flex flex-col items-center justify-center gap-1.5 p-3 text-center",
        isDragging
          ? "border-[var(--lm-accent-primary)] bg-[var(--lm-accent-muted)] scale-[1.02] shadow-lg"
          : "border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] hover:border-[var(--lm-accent-border)] hover:bg-[var(--lm-surface-hover)]"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <div className={cn(
        "p-2 rounded-xl transition-all duration-300",
        isDragging ? "bg-[var(--lm-accent-primary)]/20 scale-110" : "bg-[var(--lm-surface-elevated)] group-hover:bg-[var(--lm-accent-muted)] group-hover:scale-105"
      )}>
        <Icon className={cn(
          "w-4 h-4 transition-colors duration-300",
          isDragging ? "text-[var(--lm-accent-primary)]" : "text-[var(--lm-text-muted)] group-hover:text-[var(--lm-accent-text)]"
        )} />
      </div>
      <div>
        <p className="text-xs font-medium text-[var(--lm-text-primary)] group-hover:text-[var(--lm-accent-text)] transition-colors">
          {label}
        </p>
        <p className="text-[10px] text-[var(--lm-text-muted)]">
          {aspectHint} • <button type="button" onClick={(e) => { e.stopPropagation(); setIsUrlMode(true) }} className="underline hover:text-[var(--lm-accent-text)]">or enter URL</button>
        </p>
      </div>
    </div>
  )
}

// ─── Live Preview Card ────────────────────────────────────────
function LivePreviewCard({ data }: { data: CategoryDrawerData }) {
  const displayImage = data.bannerUrl || data.imageUrl
  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] shadow-lg transition-all duration-500 hover:shadow-xl group">
      {/* Banner / Cover */}
      <div className="relative h-40 bg-gradient-to-br from-[var(--lm-surface-secondary)] to-[var(--lm-surface-inset)] overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={data.name || "Preview"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--lm-surface-primary)] border border-[var(--lm-border-default)] flex items-center justify-center shadow-inner">
              <ImageIcon className="w-6 h-6 text-[var(--lm-text-muted)]" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Featured & Visibility Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {data.isFeatured && (
            <div className="px-2.5 py-1 rounded-full bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </div>
          )}
          {!data.isVisible && (
            <div className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
              <EyeOff className="w-2.5 h-2.5" />
              Hidden
            </div>
          )}
        </div>

        {/* Thumbnail Overlay & Title */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end gap-3">
          {data.thumbnailUrl ? (
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/40 shadow-lg shrink-0 bg-black/20 backdrop-blur-sm">
              <img src={data.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 text-white/70 font-bold text-sm">
              {data.name ? data.name.charAt(0).toUpperCase() : "C"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-base leading-tight drop-shadow-md truncate">
              {data.name || "Untitled Category"}
            </h3>
            <p className="text-white/75 text-[11px] truncate mt-0.5">
              {data.type === "PARENT" ? "Top-Level Category" : data.type === "SUBCATEGORY" ? "Subcategory" : "Featured Collection"}
            </p>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 space-y-3">
        <p className="text-xs text-[var(--lm-text-secondary)] line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {data.description || "Add a description to present this category elegantly to storefront visitors..."}
        </p>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[var(--lm-border-subtle)] text-[var(--lm-text-muted)]">
          <div className="flex items-center gap-1.5 text-[var(--lm-accent-text)] font-medium">
            <Globe className="w-3 h-3" />
            <span>/category/{data.name ? data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") : "new-category"}</span>
          </div>
          <span className="tabular-nums font-mono text-[10px] bg-[var(--lm-surface-secondary)] px-2 py-0.5 rounded-full">
            Order #{data.sortOrder}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── SEO Health Panel ─────────────────────────────────────────
function SeoHealthPanel({ data }: { data: CategoryDrawerData }) {
  const { score, issues, passes } = calculateSeoScore(data)
  const grade = getSeoGrade(score)
  const circumference = 2 * Math.PI * 32
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="p-4 rounded-2xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] space-y-4">
      {/* Donut Score & Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
          <svg className="w-18 h-18 -rotate-90 transform" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="32" fill="none" stroke="var(--lm-border-default)" strokeWidth="5" />
            <circle
              cx="36" cy="36" r="32" fill="none"
              stroke={score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444"}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-base font-bold tabular-nums", grade.color)}>{score}</span>
            <span className="text-[9px] text-[var(--lm-text-muted)] uppercase tracking-wider font-semibold">SEO</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", grade.bg, grade.color)}>
              {grade.label}
            </span>
            <span className="text-xs text-[var(--lm-text-muted)]">Optimization Score</span>
          </div>
          <p className="text-[11px] text-[var(--lm-text-muted)] mt-1.5 leading-normal">
            {issues.length === 0
              ? "Your metadata meets all enterprise SEO standard rules."
              : `${issues.length} recommendation${issues.length > 1 ? "s" : ""} to boost search ranking.`}
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar pt-1">
        {issues.map((issue, i) => (
          <div key={`iss-${i}`} className="flex items-start gap-2 text-[11px] text-amber-500 bg-amber-500/5 p-2 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{issue}</span>
          </div>
        ))}
        {passes.map((pass, i) => (
          <div key={`pas-${i}`} className="flex items-start gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 p-2 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{pass}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section Accordion Component ─────────────────────────────
function DrawerSection({ title, icon: Icon, defaultOpen = true, children }: {
  title: string
  icon: React.ElementType
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-[var(--lm-border-default)] rounded-2xl bg-[var(--lm-surface-elevated)] overflow-hidden transition-all duration-300 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2.5 px-4 py-3.5 text-left hover:bg-[var(--lm-surface-hover)] transition-colors"
      >
        <div className="p-1.5 rounded-lg bg-[var(--lm-accent-muted)]">
          <Icon className="w-4 h-4 text-[var(--lm-accent-text)]" />
        </div>
        <span className="text-xs font-semibold text-[var(--lm-text-primary)] flex-1">{title}</span>
        <ChevronDown className={cn(
          "w-4 h-4 text-[var(--lm-text-muted)] transition-transform duration-300",
          isOpen ? "rotate-180" : ""
        )} />
      </button>
      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-[var(--lm-border-subtle)]">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN DRAWER COMPONENT ───────────────────────────────────
export function CategoryQuickEditDrawer({
  isOpen,
  onClose,
  data,
  onChange,
  onSave,
  isSaving,
  parentOptions,
}: CategoryQuickEditDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape & handle lock scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const updateField = <K extends keyof CategoryDrawerData>(key: K, value: CategoryDrawerData[K]) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-500",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-xl bg-[var(--lm-surface-primary)] border-l border-[var(--lm-border-default)] shadow-2xl",
          "flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)]">
              <Tag className="w-4 h-4 text-[var(--lm-accent-text)]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--lm-text-primary)]">
                {data.id ? "Quick Edit Category" : "Create New Category"}
              </h2>
              <p className="text-[11px] text-[var(--lm-text-muted)] mt-0.5">
                {data.id ? `Editing category ID: ${data.id.slice(0, 10)}...` : "Define taxonomy, imagery, and SEO metadata"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--lm-surface-hover)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar">

          {/* ── Real-time Storefront Preview ── */}
          <DrawerSection title="Live Storefront Preview" icon={Eye} defaultOpen={true}>
            <LivePreviewCard data={data} />
          </DrawerSection>

          {/* ── Basic Information ── */}
          <DrawerSection title="Taxonomy & Information" icon={FileText} defaultOpen={true}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Category Name *</label>
              <Input
                value={data.name}
                onChange={e => updateField("name", e.target.value)}
                placeholder="e.g. Ergonomic Office Chairs"
                className="bg-[var(--lm-surface-secondary)] text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Description</label>
              <textarea
                value={data.description}
                onChange={e => updateField("description", e.target.value)}
                placeholder="Write a brief category description for collection pages..."
                rows={3}
                className="flex w-full rounded-xl border border-input bg-[var(--lm-surface-secondary)] px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lm-accent-primary)]/40 resize-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Category Type</label>
                <Select
                  value={data.type}
                  onChange={e => updateField("type", e.target.value as CategoryDrawerData["type"])}
                  className="bg-[var(--lm-surface-secondary)] text-xs h-9"
                >
                  <option value="PARENT">Parent Category</option>
                  <option value="SUBCATEGORY">Subcategory</option>
                  <option value="COLLECTION">Special Collection</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Parent Category</label>
                <Select
                  value={data.parentId}
                  onChange={e => updateField("parentId", e.target.value)}
                  className="bg-[var(--lm-surface-secondary)] text-xs h-9"
                  disabled={data.type === "PARENT"}
                >
                  <option value="">None (Top Level)</option>
                  {parentOptions.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Controls & Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--lm-text-secondary)] flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-[var(--lm-text-muted)]" />
                  Sort Order
                </label>
                <Input
                  type="number"
                  value={data.sortOrder}
                  onChange={e => updateField("sortOrder", parseInt(e.target.value) || 0)}
                  min={0}
                  className="bg-[var(--lm-surface-secondary)] text-xs h-9"
                />
              </div>

              <div className="space-y-3 pt-4">
                {/* Visibility Toggle Switch */}
                <div
                  onClick={() => updateField("isVisible", !data.isVisible)}
                  className="flex items-center justify-between p-2 rounded-xl bg-[var(--lm-surface-secondary)] cursor-pointer hover:bg-[var(--lm-surface-hover)] transition-colors"
                >
                  <span className="text-xs font-medium text-[var(--lm-text-primary)]">Visible on Store</span>
                  <div className={cn(
                    "relative w-9 h-5 rounded-full transition-colors duration-300",
                    data.isVisible ? "bg-emerald-500" : "bg-neutral-400 dark:bg-neutral-700"
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                      data.isVisible ? "translate-x-4" : "translate-x-0.5"
                    )} />
                  </div>
                </div>

                {/* Featured Toggle Switch */}
                <div
                  onClick={() => updateField("isFeatured", !data.isFeatured)}
                  className="flex items-center justify-between p-2 rounded-xl bg-[var(--lm-surface-secondary)] cursor-pointer hover:bg-[var(--lm-surface-hover)] transition-colors"
                >
                  <span className="text-xs font-medium text-[var(--lm-text-primary)]">Featured Category</span>
                  <div className={cn(
                    "relative w-9 h-5 rounded-full transition-colors duration-300",
                    data.isFeatured ? "bg-[var(--lm-accent-primary)]" : "bg-neutral-400 dark:bg-neutral-700"
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                      data.isFeatured ? "translate-x-4" : "translate-x-0.5"
                    )} />
                  </div>
                </div>
              </div>
            </div>
          </DrawerSection>

          {/* ── Image & Media Assets ── */}
          <DrawerSection title="Visual Media Assets" icon={ImageIcon} defaultOpen={true}>
            <div className="space-y-3">
              <DragDropImageZone
                label="Cover Image"
                value={data.imageUrl}
                onChange={url => updateField("imageUrl", url)}
                aspectHint="Recommended: 800×600 • Drag & drop file or URL"
                icon={ImageIcon}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DragDropImageZone
                  label="Hero Banner"
                  value={data.bannerUrl}
                  onChange={url => updateField("bannerUrl", url)}
                  aspectHint="Recommended: 1920×600"
                  icon={Upload}
                />
                <DragDropImageZone
                  label="Square Thumbnail"
                  value={data.thumbnailUrl}
                  onChange={url => updateField("thumbnailUrl", url)}
                  aspectHint="Recommended: 400×400"
                  icon={ImageIcon}
                />
              </div>
            </div>
          </DrawerSection>

          {/* ── SEO Optimization ── */}
          <DrawerSection title="SEO Optimization & Metadata" icon={Globe} defaultOpen={false}>
            <SeoHealthPanel data={data} />

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">SEO Title Tag</label>
                <span className={cn(
                  "text-[10px] tabular-nums font-mono",
                  (data.seoTitle?.length || 0) > 60 ? "text-red-500 font-bold" : "text-[var(--lm-text-muted)]"
                )}>
                  {data.seoTitle?.length || 0} / 60
                </span>
              </div>
              <Input
                value={data.seoTitle}
                onChange={e => updateField("seoTitle", e.target.value)}
                placeholder="e.g. Premium Ergonomic Chairs | Lumina Executive Furniture"
                className="bg-[var(--lm-surface-secondary)] text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Meta Description</label>
                <span className={cn(
                  "text-[10px] tabular-nums font-mono",
                  (data.seoDescription?.length || 0) > 160 ? "text-red-500 font-bold" : "text-[var(--lm-text-muted)]"
                )}>
                  {data.seoDescription?.length || 0} / 160
                </span>
              </div>
              <textarea
                value={data.seoDescription}
                onChange={e => updateField("seoDescription", e.target.value)}
                placeholder="Provide a compelling snippet for Google search engine results..."
                rows={3}
                className="flex w-full rounded-xl border border-input bg-[var(--lm-surface-secondary)] px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lm-accent-primary)]/40 resize-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">SEO Keywords</label>
              <Input
                value={data.seoKeywords}
                onChange={e => updateField("seoKeywords", e.target.value)}
                placeholder="luxury chair, executive desk, office furniture, ergonomic seating"
                className="bg-[var(--lm-surface-secondary)] text-xs h-9"
              />
              <p className="text-[10px] text-[var(--lm-text-muted)]">Separate keywords with commas (3 to 8 recommended)</p>
            </div>
          </DrawerSection>

        </div>

        {/* Drawer Action Footer */}
        <div className="px-6 py-4 border-t border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl text-xs h-10 border-[var(--lm-border-default)]"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSave}
              className="flex-1 rounded-xl text-xs h-10 bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-semibold hover:opacity-90 shadow-lg shadow-[var(--lm-accent-primary)]/20 transition-all duration-300"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving Category...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  {data.id ? "Save Changes" : "Create Category"}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
