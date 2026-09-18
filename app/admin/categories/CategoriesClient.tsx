"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import {
  Plus, Search, LayoutGrid, List, TreePine, Eye, EyeOff,
  Star, StarOff, Trash2, Edit, MoreHorizontal, Filter,
  ChevronDown, ChevronRight, Package, TrendingUp, Users,
  BarChart3, Globe, Sparkles, Check, X, ArrowUpDown,
  FolderTree, Layers, Hash, GripVertical, Download,
  AlertCircle, CheckCircle2, Shield, AlertTriangle, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/clsx"
import { toast } from "sonner"
import { CategoryQuickEditDrawer, type CategoryDrawerData } from "@/components/admin/categories/CategoryQuickEditDrawer"
import {
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
  toggleCategoryFeatured,
  toggleCategoryVisibility,
} from "@/features/categories/actions"

// ─── Types ────────────────────────────────────────────────────
interface CategoryWithCounts {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  bannerUrl: string | null
  thumbnailUrl: string | null
  parentId: string | null
  type: string
  sortOrder: number
  isVisible: boolean
  isFeatured: boolean
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  monthlyVisitors: number
  monthlySales: number
  conversionRate: number
  createdAt: Date
  updatedAt: Date
  _count: { products: number }
  parent?: { id: string; name: string } | null
  children?: CategoryWithCounts[]
}

interface CategoryAnalytics {
  totalCategories: number
  totalProducts: number
  totalVisitors: number
  avgConversion: number
  totalSales: number
  visibleCount: number
  featuredCount: number
}

interface CategoriesClientProps {
  categories: CategoryWithCounts[]
  analytics: CategoryAnalytics
}

type ViewMode = "grid" | "tree" | "table"
type FilterType = "all" | "PARENT" | "SUBCATEGORY" | "COLLECTION"
type FilterVisibility = "all" | "visible" | "hidden"
type FilterSeo = "all" | "good" | "poor"

// ─── SEO Score Helper ─────────────────────────────────────────
function getCategorySeoScore(cat: CategoryWithCounts): number {
  let score = 0
  if (cat.seoTitle && cat.seoTitle.length >= 10 && cat.seoTitle.length <= 60) score += 30
  else if (cat.seoTitle) score += 10
  if (cat.seoDescription && cat.seoDescription.length >= 50 && cat.seoDescription.length <= 160) score += 30
  else if (cat.seoDescription) score += 10
  if (cat.seoKeywords) score += 20
  if (cat.imageUrl || cat.bannerUrl) score += 10
  if (cat.name && cat.name.length >= 3) score += 10
  return Math.min(score, 100)
}

function getSeoStatusBadge(score: number) {
  if (score >= 80) return { label: "Excellent", variant: "success" as const, icon: CheckCircle2 }
  if (score >= 50) return { label: "Good", variant: "warning" as const, icon: AlertCircle }
  return { label: "Poor", variant: "destructive" as const, icon: AlertCircle }
}

// ─── Metric Card with Ring & Count Effect ────────────────────
function MetricCard({
  label, value, subtitle, icon: Icon, accentColor = "var(--lm-accent-primary)", percentage = 100, delay = 0
}: {
  label: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  accentColor?: string
  percentage?: number
  delay?: number
}) {
  const circumference = 2 * Math.PI * 14
  const strokeOffset = circumference - (Math.min(Math.max(percentage, 0), 100) / 100) * circumference

  return (
    <div
      className="group relative rounded-2xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] p-4 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background radial glow */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--lm-text-muted)]">{label}</p>
          <p className="text-2xl font-extrabold text-[var(--lm-text-primary)] mt-1 tracking-tight tabular-nums">{value}</p>
          {subtitle && (
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>

        {/* Ring & Icon badge */}
        <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
          <svg className="w-11 h-11 -rotate-90 transform" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="var(--lm-border-default)" strokeWidth="2.5" />
            <circle
              cx="18" cy="18" r="14" fill="none"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div
            className="absolute inset-1.5 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)` }}
          >
            <Icon className="w-4 h-4" style={{ color: accentColor }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tree Node Component ──────────────────────────────────────
function TreeNode({
  category,
  depth = 0,
  selectedIds,
  onToggleSelect,
  onEdit,
  onToggleFeatured,
  onToggleVisibility,
  onDelete,
}: {
  category: CategoryWithCounts
  depth?: number
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onEdit: (cat: CategoryWithCounts) => void
  onToggleFeatured: (id: string, val: boolean) => void
  onToggleVisibility: (id: string, val: boolean) => void
  onDelete: (id: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = category.children && category.children.length > 0
  const seoScore = getCategorySeoScore(category)
  const seoStatus = getSeoStatusBadge(seoScore)

  return (
    <div className="animate-scale-spring">
      <div
        className={cn(
          "group flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all duration-200 hover:bg-[var(--lm-surface-hover)] border border-transparent",
          selectedIds.has(category.id) && "bg-[var(--lm-accent-muted)] border-[var(--lm-accent-border)] hover:bg-[var(--lm-accent-muted)]"
        )}
        style={{ paddingLeft: `${depth * 28 + 12}px` }}
      >
        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-6 h-6 flex items-center justify-center rounded-lg transition-colors shrink-0",
            hasChildren ? "hover:bg-[var(--lm-surface-active)] cursor-pointer text-[var(--lm-text-muted)]" : "cursor-default opacity-0"
          )}
        >
          {hasChildren && (
            <ChevronRight className={cn(
              "w-4 h-4 text-[var(--lm-text-muted)] transition-transform duration-300",
              isExpanded && "rotate-90 text-[var(--lm-accent-text)]"
            )} />
          )}
        </button>

        {/* Checkbox */}
        <label className="flex items-center shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedIds.has(category.id)}
            onChange={() => onToggleSelect(category.id)}
            className="w-4 h-4 rounded border-[var(--lm-border-strong)] text-[var(--lm-accent-primary)] focus:ring-[var(--lm-accent-primary)] cursor-pointer"
          />
        </label>

        {/* Image Preview */}
        <div className="w-9 h-9 rounded-xl overflow-hidden bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] shrink-0 shadow-sm">
          {category.imageUrl || category.thumbnailUrl ? (
            <img src={category.imageUrl || category.thumbnailUrl || ""} alt={category.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-4 h-4 text-[var(--lm-text-muted)]" />
            </div>
          )}
        </div>

        {/* Name & Badges */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--lm-text-primary)] truncate">{category.name}</span>
          <Badge variant="secondary" className="text-[9px] px-2 py-0.5 rounded-full shrink-0 font-medium">
            {category.type === "PARENT" ? "Parent Category" : category.type === "SUBCATEGORY" ? "Subcategory" : "Collection"}
          </Badge>
          {category.isFeatured && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shrink-0">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
          {!category.isVisible && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-semibold flex items-center gap-1 shrink-0">
              <EyeOff className="w-2.5 h-2.5" />
              Hidden
            </span>
          )}
        </div>

        {/* Product Count Pill */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--lm-surface-secondary)] text-[10px] font-medium text-[var(--lm-text-secondary)] shrink-0 border border-[var(--lm-border-subtle)]">
          <Package className="w-3 h-3 text-[var(--lm-text-muted)]" />
          <span className="tabular-nums font-semibold">{category._count.products}</span> products
        </div>

        {/* SEO badge */}
        <Badge
          variant={seoStatus.variant}
          className="text-[9px] px-2 py-0.5 rounded-full shrink-0 font-mono"
        >
          SEO {seoScore}%
        </Badge>

        {/* Hover Quick Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors"
            title="Quick Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onToggleFeatured(category.id, !category.isFeatured)}
            className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] transition-colors"
            title={category.isFeatured ? "Unfeature" : "Feature"}
          >
            {category.isFeatured
              ? <Star className="w-3.5 h-3.5 text-[var(--lm-accent-primary)] fill-current" />
              : <StarOff className="w-3.5 h-3.5 text-[var(--lm-text-muted)]" />
            }
          </button>
          <button
            type="button"
            onClick={() => onToggleVisibility(category.id, !category.isVisible)}
            className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] transition-colors"
            title={category.isVisible ? "Hide Category" : "Make Visible"}
          >
            {category.isVisible
              ? <Eye className="w-3.5 h-3.5 text-emerald-500" />
              : <EyeOff className="w-3.5 h-3.5 text-amber-500" />
            }
          </button>
          <button
            type="button"
            onClick={() => onDelete(category.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/15 text-red-500 transition-colors"
            title="Delete Category"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Children Tree Connectors */}
      {hasChildren && isExpanded && (
        <div className="relative ml-4 pl-3 border-l border-[var(--lm-border-default)] space-y-1 my-1">
          {category.children!.map(child => (
            <TreeNode
              key={child.id}
              category={child}
              depth={depth + 1}
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
              onEdit={onEdit}
              onToggleFeatured={onToggleFeatured}
              onToggleVisibility={onToggleVisibility}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Luxury Grid Card Component ───────────────────────────────
function CategoryGridCard({
  category,
  isSelected,
  onToggleSelect,
  onEdit,
  onToggleFeatured,
  onToggleVisibility,
  delay = 0,
}: {
  category: CategoryWithCounts
  isSelected: boolean
  onToggleSelect: () => void
  onEdit: () => void
  onToggleFeatured: () => void
  onToggleVisibility: () => void
  delay?: number
}) {
  const seoScore = getCategorySeoScore(category)
  const seoStatus = getSeoStatusBadge(seoScore)

  return (
    <div
      className={cn(
        "group relative rounded-3xl border overflow-hidden transition-all duration-500 flex flex-col justify-between",
        "hover:shadow-2xl hover:-translate-y-1.5 hover:border-[var(--lm-accent-border)] animate-scale-spring",
        "bg-[var(--lm-surface-elevated)] glass-card",
        isSelected ? "border-[var(--lm-accent-primary)] ring-2 ring-[var(--lm-accent-primary)]/40 shadow-lg" : "border-[var(--lm-border-default)]"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Selection Checkbox Pill */}
      <div className="absolute top-3 left-3 z-20">
        <label className="cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4 rounded border-white/40 bg-black/40 text-[var(--lm-accent-primary)] focus:ring-[var(--lm-accent-primary)] cursor-pointer"
          />
        </label>
      </div>

      {/* Banner / Cover Image Area */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--lm-surface-secondary)] to-[var(--lm-surface-inset)]">
        {(category.bannerUrl || category.imageUrl) ? (
          <img
            src={category.bannerUrl || category.imageUrl || ""}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-5 rounded-2xl bg-[var(--lm-surface-primary)]/60 backdrop-blur-md border border-[var(--lm-border-default)] shadow-sm">
              <Package className="w-9 h-9 text-[var(--lm-text-muted)]" />
            </div>
          </div>
        )}

        {/* Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Top-Right Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {category.isFeatured && (
            <div className="px-2.5 py-1 rounded-full bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md animate-shimmer-sweep overflow-hidden">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </div>
          )}
          {!category.isVisible && (
            <div className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
              <EyeOff className="w-2.5 h-2.5" />
              Hidden
            </div>
          )}
        </div>

        {/* Banner Details Overlay & Quick Actions */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 flex items-end justify-between z-10">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            {category.thumbnailUrl ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/40 shadow-lg shrink-0">
                <img src={category.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md">
                {category.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-white font-bold text-sm leading-snug truncate drop-shadow-md">{category.name}</h3>
              <p className="text-white/80 text-[10px] font-medium truncate">
                {category.type === "PARENT" ? "Parent Category" : category.type === "SUBCATEGORY" ? "Subcategory" : "Collection"}
                {category.parent ? ` • ${category.parent.name}` : ""}
              </p>
            </div>
          </div>

          {/* Hover Action Overlay Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shrink-0">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit() }}
              className="p-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-colors"
              title="Edit Category"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleFeatured() }}
              className="p-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
              title={category.isFeatured ? "Unfeature" : "Feature"}
            >
              {category.isFeatured
                ? <Star className="w-3.5 h-3.5 text-yellow-300 fill-current" />
                : <StarOff className="w-3.5 h-3.5 text-white" />
              }
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleVisibility() }}
              className="p-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
              title={category.isVisible ? "Hide Category" : "Make Visible"}
            >
              {category.isVisible
                ? <Eye className="w-3.5 h-3.5 text-emerald-300" />
                : <EyeOff className="w-3.5 h-3.5 text-amber-300" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <p className="text-xs text-[var(--lm-text-secondary)] line-clamp-2 leading-relaxed min-h-[2rem]">
          {category.description || "No category description assigned yet."}
        </p>

        {/* Analytics mini row */}
        <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] text-[11px]">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--lm-text-muted)]">Products</span>
            <span className="font-bold text-[var(--lm-text-primary)] tabular-nums">{category._count.products}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--lm-text-muted)]">Visitors</span>
            <span className="font-bold text-[var(--lm-text-primary)] tabular-nums">{(category.monthlyVisitors / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--lm-text-muted)]">Conv. Rate</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{category.conversionRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* Bottom Bar: SEO Score Badge & Order */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--lm-border-subtle)]">
          <Badge variant={seoStatus.variant} className="text-[9px] px-2 py-0.5 font-mono rounded-full">
            <seoStatus.icon className="w-2.5 h-2.5 mr-1" />
            SEO {seoScore}%
          </Badge>
          <span className="text-[10px] text-[var(--lm-text-muted)] font-mono font-medium">
            Sort: #{category.sortOrder}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Data Table Row Component ─────────────────────────────────
function CategoryTableRow({
  category,
  isSelected,
  onToggleSelect,
  onEdit,
  onToggleFeatured,
  onToggleVisibility,
  onDelete,
}: {
  category: CategoryWithCounts
  isSelected: boolean
  onToggleSelect: () => void
  onEdit: () => void
  onToggleFeatured: () => void
  onToggleVisibility: () => void
  onDelete: () => void
}) {
  const seoScore = getCategorySeoScore(category)
  const seoStatus = getSeoStatusBadge(seoScore)

  return (
    <tr className={cn(
      "group border-b border-[var(--lm-border-subtle)] transition-colors hover:bg-[var(--lm-surface-hover)]",
      isSelected && "bg-[var(--lm-accent-muted)]"
    )}>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 rounded border-[var(--lm-border-strong)] text-[var(--lm-accent-primary)] focus:ring-[var(--lm-accent-primary)] cursor-pointer"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] shrink-0 shadow-sm">
            {category.imageUrl || category.thumbnailUrl ? (
              <img src={category.imageUrl || category.thumbnailUrl || ""} alt={category.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-4 h-4 text-[var(--lm-text-muted)]" />
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--lm-text-primary)]">{category.name}</p>
            <p className="text-[10px] text-[var(--lm-text-muted)] font-mono">/{category.slug}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="secondary" className="text-[9px] rounded-full">
          {category.type === "PARENT" ? "Parent" : category.type === "SUBCATEGORY" ? "Sub" : "Collection"}
        </Badge>
      </td>
      <td className="px-4 py-3 text-xs font-semibold text-[var(--lm-text-primary)] tabular-nums">
        {category._count.products}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {category.isVisible ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
              <Eye className="w-3 h-3" /> Visible
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-medium">
              <EyeOff className="w-3 h-3" /> Hidden
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        {category.isFeatured ? (
          <Star className="w-4 h-4 text-[var(--lm-accent-primary)] fill-current" />
        ) : (
          <span className="text-xs text-[var(--lm-text-muted)]">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <Badge variant={seoStatus.variant} className="text-[9px] font-mono rounded-full">
          {seoScore}%
        </Badge>
      </td>
      <td className="px-4 py-3 text-xs text-[var(--lm-text-muted)] tabular-nums">
        {(category.monthlyVisitors / 1000).toFixed(1)}k
      </td>
      <td className="px-4 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
        {category.conversionRate.toFixed(1)}%
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={onEdit} className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors" title="Edit">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={onToggleFeatured} className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] transition-colors">
            {category.isFeatured ? <Star className="w-3.5 h-3.5 text-[var(--lm-accent-primary)] fill-current" /> : <StarOff className="w-3.5 h-3.5 text-[var(--lm-text-muted)]" />}
          </button>
          <button type="button" onClick={onToggleVisibility} className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] transition-colors">
            {category.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-amber-500" />}
          </button>
          <button type="button" onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/15 text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export function CategoriesClient({ categories, analytics }: CategoriesClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [filterVisibility, setFilterVisibility] = useState<FilterVisibility>("all")
  const [filterSeo, setFilterSeo] = useState<FilterSeo>("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const emptyDrawerData: CategoryDrawerData = {
    name: "",
    description: "",
    imageUrl: "",
    bannerUrl: "",
    thumbnailUrl: "",
    parentId: "",
    type: "PARENT",
    sortOrder: 0,
    isVisible: true,
    isFeatured: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  }

  const [drawerData, setDrawerData] = useState<CategoryDrawerData>(emptyDrawerData)

  // ─── Derived Data ─────────────────────────────────────────
  const parentOptions = useMemo(() =>
    categories
      .filter(c => c.type === "PARENT")
      .map(c => ({ id: c.id, name: c.name })),
    [categories]
  )

  // Build tree structure
  const categoryTree = useMemo(() => {
    const map = new Map<string, CategoryWithCounts>()
    const roots: CategoryWithCounts[] = []

    categories.forEach(cat => {
      map.set(cat.id, { ...cat, children: [] })
    })

    categories.forEach(cat => {
      const node = map.get(cat.id)!
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children!.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots.sort((a, b) => a.sortOrder - b.sortOrder)
  }, [categories])

  // Filtered flat list
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!cat.name.toLowerCase().includes(q) && !cat.slug.toLowerCase().includes(q) && !(cat.description || "").toLowerCase().includes(q)) {
          return false
        }
      }
      if (filterType !== "all" && cat.type !== filterType) return false
      if (filterVisibility === "visible" && !cat.isVisible) return false
      if (filterVisibility === "hidden" && cat.isVisible) return false
      if (filterSeo !== "all") {
        const score = getCategorySeoScore(cat)
        if (filterSeo === "good" && score < 60) return false
        if (filterSeo === "poor" && score >= 60) return false
      }
      return true
    })
  }, [categories, searchQuery, filterType, filterVisibility, filterSeo])

  // Filtered tree
  const filteredTree = useMemo(() => {
    if (!searchQuery && filterType === "all" && filterVisibility === "all" && filterSeo === "all") {
      return categoryTree
    }

    const filteredIds = new Set(filteredCategories.map(c => c.id))

    function filterNode(node: CategoryWithCounts): CategoryWithCounts | null {
      const filteredChildren = (node.children || []).map(filterNode).filter(Boolean) as CategoryWithCounts[]
      if (filteredIds.has(node.id) || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren }
      }
      return null
    }

    return categoryTree.map(filterNode).filter(Boolean) as CategoryWithCounts[]
  }, [categoryTree, filteredCategories, searchQuery, filterType, filterVisibility, filterSeo])

  // ─── Handlers ─────────────────────────────────────────────
  const toggleSelectId = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    if (selectedIds.size === filteredCategories.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredCategories.map(c => c.id)))
    }
  }, [filteredCategories, selectedIds.size])

  const openNewDrawer = useCallback(() => {
    setDrawerData(emptyDrawerData)
    setIsDrawerOpen(true)
  }, [])

  const openEditDrawer = useCallback((cat: CategoryWithCounts) => {
    setDrawerData({
      id: cat.id,
      name: cat.name,
      description: cat.description || "",
      imageUrl: cat.imageUrl || "",
      bannerUrl: cat.bannerUrl || "",
      thumbnailUrl: cat.thumbnailUrl || "",
      parentId: cat.parentId || "",
      type: cat.type as "PARENT" | "SUBCATEGORY" | "COLLECTION",
      sortOrder: cat.sortOrder,
      isVisible: cat.isVisible,
      isFeatured: cat.isFeatured,
      seoTitle: cat.seoTitle || "",
      seoDescription: cat.seoDescription || "",
      seoKeywords: cat.seoKeywords || "",
    })
    setIsDrawerOpen(true)
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    const loadingToast = toast.loading(drawerData.id ? "Updating category..." : "Creating category...")
    try {
      const payload = {
        name: drawerData.name,
        description: drawerData.description,
        imageUrl: drawerData.imageUrl,
        bannerUrl: drawerData.bannerUrl,
        thumbnailUrl: drawerData.thumbnailUrl,
        parentId: drawerData.parentId || undefined,
        type: drawerData.type,
        sortOrder: drawerData.sortOrder,
        isVisible: drawerData.isVisible,
        isFeatured: drawerData.isFeatured,
        seoTitle: drawerData.seoTitle,
        seoDescription: drawerData.seoDescription,
        seoKeywords: drawerData.seoKeywords,
      }

      const res = drawerData.id
        ? await updateCategory(drawerData.id, payload)
        : await createCategory(payload)

      if (res.success) {
        toast.success(drawerData.id ? "Category updated" : "Category created", { id: loadingToast })
        setIsDrawerOpen(false)
      } else {
        toast.error(res.error, { id: loadingToast })
      }
    } catch {
      toast.error("Something went wrong", { id: loadingToast })
    } finally {
      setIsSaving(false)
    }
  }, [drawerData])

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirmId) return
    const t = toast.loading("Deleting category...")
    const res = await deleteCategory(deleteConfirmId)
    if (res.success) {
      toast.success("Category deleted", { id: t })
      setDeleteConfirmId(null)
    } else {
      toast.error(res.error, { id: t })
    }
  }, [deleteConfirmId])

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return
    const t = toast.loading(`Deleting ${selectedIds.size} categories...`)
    const res = await bulkDeleteCategories(Array.from(selectedIds))
    if (res.success) {
      toast.success(`${selectedIds.size} categories deleted`, { id: t })
      setSelectedIds(new Set())
    } else {
      toast.error(res.error, { id: t })
    }
  }, [selectedIds])

  const handleToggleFeatured = useCallback(async (id: string, val: boolean) => {
    const res = await toggleCategoryFeatured(id, val)
    if (res.success) toast.success(val ? "Marked as featured" : "Removed from featured")
    else toast.error(res.error)
  }, [])

  const handleToggleVisibility = useCallback(async (id: string, val: boolean) => {
    const res = await toggleCategoryVisibility(id, val)
    if (res.success) toast.success(val ? "Category is now visible" : "Category hidden")
    else toast.error(res.error)
  }, [])

  // Average SEO Score
  const avgSeo = useMemo(() => {
    if (categories.length === 0) return 0
    return Math.round(categories.reduce((sum, c) => sum + getCategorySeoScore(c), 0) / categories.length)
  }, [categories])

  const activeFilterCount = (filterType !== "all" ? 1 : 0) + (filterVisibility !== "all" ? 1 : 0) + (filterSeo !== "all" ? 1 : 0)

  // ═════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)] shadow-inner">
            <FolderTree className="w-6 h-6 text-[var(--lm-accent-text)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)]">Category Management</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)] text-[10px] font-bold uppercase tracking-widest border border-[var(--lm-accent-border)]">
                Enterprise
              </span>
            </div>
            <p className="text-xs text-[var(--lm-text-muted)] mt-0.5">
              Organize product taxonomy, visual banners, parent-child hierarchies, and SEO performance
            </p>
          </div>
        </div>
        <Button
          onClick={openNewDrawer}
          className="bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-semibold rounded-2xl hover:opacity-95 shadow-xl shadow-[var(--lm-accent-primary)]/25 transition-all duration-300 hover:-translate-y-0.5 h-11 px-5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* ── Category Analytics Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MetricCard label="Categories" value={analytics.totalCategories} icon={FolderTree} accentColor="var(--lm-accent-primary)" percentage={100} delay={0} />
        <MetricCard label="Products" value={analytics.totalProducts} icon={Package} accentColor="#8b5cf6" percentage={85} delay={50} />
        <MetricCard label="Visitors" value={`${(analytics.totalVisitors / 1000).toFixed(1)}k`} subtitle="Monthly" icon={Users} accentColor="#06b6d4" percentage={92} delay={100} />
        <MetricCard label="Conversion" value={`${analytics.avgConversion.toFixed(1)}%`} icon={TrendingUp} accentColor="#10b981" percentage={analytics.avgConversion * 10} delay={150} />
        <MetricCard label="Sales" value={`₨${(analytics.totalSales / 1000).toFixed(0)}k`} subtitle="Monthly" icon={BarChart3} accentColor="#f59e0b" percentage={78} delay={200} />
        <MetricCard label="Visible" value={`${analytics.visibleCount}/${analytics.totalCategories}`} icon={Eye} accentColor="#22c55e" percentage={(analytics.visibleCount / (analytics.totalCategories || 1)) * 100} delay={250} />
        <MetricCard label="SEO Health" value={`${avgSeo}%`} icon={Globe} accentColor={avgSeo >= 70 ? "#10b981" : avgSeo >= 50 ? "#f59e0b" : "#ef4444"} percentage={avgSeo} delay={300} />
      </div>

      {/* ── Dashboard Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lm-text-muted)]" />
          <input
            type="text"
            placeholder="Search categories by name, slug, description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-2xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-primary)] text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lm-accent-primary)]/40 focus:border-[var(--lm-accent-border)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "gap-2 rounded-2xl h-10 text-xs font-semibold border-[var(--lm-border-default)] transition-colors",
            (showFilters || activeFilterCount > 0) && "bg-[var(--lm-accent-muted)] border-[var(--lm-accent-border)] text-[var(--lm-accent-text)]"
          )}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* View Mode Toggle Pill */}
        <div className="flex items-center border border-[var(--lm-border-default)] rounded-2xl p-1 bg-[var(--lm-surface-primary)]">
          {(["grid", "tree", "table"] as ViewMode[]).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-300",
                viewMode === mode
                  ? "bg-[var(--lm-surface-elevated)] text-[var(--lm-accent-text)] shadow-sm border border-[var(--lm-border-subtle)]"
                  : "text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]"
              )}
            >
              {mode === "grid" && <LayoutGrid className="w-3.5 h-3.5" />}
              {mode === "tree" && <TreePine className="w-3.5 h-3.5" />}
              {mode === "table" && <List className="w-3.5 h-3.5" />}
              <span className="capitalize">{mode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Expanded Filter Options ── */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card animate-scale-spring">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Category Type</label>
            <Select value={filterType} onChange={e => setFilterType(e.target.value as FilterType)} className="bg-[var(--lm-surface-primary)] text-xs h-9 rounded-xl">
              <option value="all">All Types</option>
              <option value="PARENT">Parent Categories</option>
              <option value="SUBCATEGORY">Subcategories</option>
              <option value="COLLECTION">Collections</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Visibility Status</label>
            <Select value={filterVisibility} onChange={e => setFilterVisibility(e.target.value as FilterVisibility)} className="bg-[var(--lm-surface-primary)] text-xs h-9 rounded-xl">
              <option value="all">All Visibility</option>
              <option value="visible">Visible Only</option>
              <option value="hidden">Hidden Only</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">SEO Health Status</label>
            <Select value={filterSeo} onChange={e => setFilterSeo(e.target.value as FilterSeo)} className="bg-[var(--lm-surface-primary)] text-xs h-9 rounded-xl">
              <option value="all">All SEO Scores</option>
              <option value="good">Optimal SEO (&ge; 60%)</option>
              <option value="poor">Needs Improvement (&lt; 60%)</option>
            </Select>
          </div>
        </div>
      )}

      {/* ── Bulk Action Floating Bar ── */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3.5 rounded-3xl border border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] backdrop-blur-xl shadow-xl animate-scale-spring">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] flex items-center justify-center text-xs font-bold shadow-md">
              {selectedIds.size}
            </div>
            <span className="text-xs font-bold text-[var(--lm-text-primary)]">categories selected</span>
          </div>

          <div className="flex-1" />

          <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs font-medium">
            {selectedIds.size === filteredCategories.length ? "Deselect All" : "Select All Filtered"}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="gap-1.5 text-xs rounded-xl font-semibold shadow-md"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Selected ({selectedIds.size})
          </Button>

          <button
            onClick={() => setSelectedIds(new Set())}
            className="p-1.5 rounded-xl hover:bg-black/10 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Main View Content Area ── */}
      <div className="min-h-[420px]">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card">
            <div className="p-5 rounded-3xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] mb-4 animate-float">
              <FolderTree className="w-10 h-10 text-[var(--lm-accent-text)]" />
            </div>
            <h3 className="text-base font-bold text-[var(--lm-text-primary)] mb-1">
              {searchQuery || activeFilterCount > 0 ? "No categories match filters" : "No categories created yet"}
            </h3>
            <p className="text-xs text-[var(--lm-text-muted)] mb-5 max-w-sm">
              {searchQuery || activeFilterCount > 0
                ? "Try clearing your search query or adjusting your filters to see more results."
                : "Create parent categories and subcategories to organize product inventory."
              }
            </p>
            {searchQuery || activeFilterCount > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearchQuery(""); setFilterType("all"); setFilterVisibility("all"); setFilterSeo("all") }}
                className="rounded-xl text-xs"
              >
                Clear All Filters
              </Button>
            ) : (
              <Button onClick={openNewDrawer} className="bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] text-xs rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Create Category
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* ── LUXURY GRID VIEW ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((cat, i) => (
                <CategoryGridCard
                  key={cat.id}
                  category={cat}
                  isSelected={selectedIds.has(cat.id)}
                  onToggleSelect={() => toggleSelectId(cat.id)}
                  onEdit={() => openEditDrawer(cat)}
                  onToggleFeatured={() => handleToggleFeatured(cat.id, !cat.isFeatured)}
                  onToggleVisibility={() => handleToggleVisibility(cat.id, !cat.isVisible)}
                  delay={i * 30}
                />
              ))}
          </div>
        ) : viewMode === "tree" ? (
          /* ── CATEGORY TREE VIEW ── */
          <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] p-3 space-y-1 glass-card">
            {filteredTree.map(node => (
              <TreeNode
                key={node.id}
                category={node}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelectId}
                onEdit={openEditDrawer}
                onToggleFeatured={handleToggleFeatured}
                onToggleVisibility={handleToggleVisibility}
                onDelete={(id) => setDeleteConfirmId(id)}
              />
            ))}
          </div>
        ) : (
          /* ── DATA TABLE VIEW ── */
          <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] overflow-hidden glass-card shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)]">
                    <th className="px-4 py-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredCategories.length && filteredCategories.length > 0}
                        onChange={selectAll}
                        className="w-4 h-4 rounded border-[var(--lm-border-strong)] text-[var(--lm-accent-primary)] cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Category Name & Slug</th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Type</th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Products</th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Visibility</th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Featured</th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">SEO</th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Visitors</th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Conv.</th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map(cat => (
                      <CategoryTableRow
                        key={cat.id}
                        category={cat}
                        isSelected={selectedIds.has(cat.id)}
                        onToggleSelect={() => toggleSelectId(cat.id)}
                        onEdit={() => openEditDrawer(cat)}
                        onToggleFeatured={() => handleToggleFeatured(cat.id, !cat.isFeatured)}
                        onToggleVisibility={() => handleToggleVisibility(cat.id, !cat.isVisible)}
                        onDelete={() => setDeleteConfirmId(cat.id)}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer Stats Summary ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--lm-text-muted)] pt-1 px-1">
        <span>
          Displaying <strong className="text-[var(--lm-text-primary)]">{filteredCategories.length}</strong> of <strong className="text-[var(--lm-text-primary)]">{categories.length}</strong> categories
        </span>
        <span className="tabular-nums">
          <strong className="text-[var(--lm-text-primary)]">{analytics.totalProducts}</strong> total active products cataloged
        </span>
      </div>

      {/* ── Quick Edit Drawer ── */}
      <CategoryQuickEditDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={drawerData}
        onChange={setDrawerData}
        onSave={handleSave}
        isSaving={isSaving}
        parentOptions={parentOptions}
      />

      {/* ── Custom Animated Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative z-10 w-full max-w-md bg-[var(--lm-surface-elevated)] border border-red-500/30 rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-spring">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-500/15 text-red-500 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--lm-text-primary)]">Delete Category?</h3>
                <p className="text-xs text-[var(--lm-text-muted)]">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-[var(--lm-text-secondary)] leading-relaxed">
              Are you sure you want to delete this category? Products cataloged under this category will lose their assigned category classification.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                className="rounded-xl text-xs h-9 gap-1.5 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
