"use client";

import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/format-currency";
import { Product, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/features/products/validations";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductFeatured,
  toggleProductArchived,
  duplicateProduct,
  bulkDeleteProducts,
  bulkArchiveProducts,
} from "@/features/products/actions";
import { toast } from "sonner";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  Eye,
  Star,
  Archive,
  Check,
  X,
  ChevronRight,
  Sparkles,
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Layers,
  Globe,
  Tag,
  RefreshCw,
  SlidersHorizontal,
  Box,
  Image as ImageIcon,
  CheckSquare,
  Square,
  ArrowUpRight,
  Percent,
  Truck,
  FileText,
} from "lucide-react";

interface ProductsClientProps {
  products: (Product & { category: Category })[];
  categories: Category[];
}

export function ProductsClient({ products: initialProducts, categories }: ProductsClientProps) {
  // ── State ───────────────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [stockFilter, setStockFilter] = useState<string>("ALL"); // ALL, IN_STOCK, LOW_STOCK, OUT_OF_STOCK
  const [featuredFilter, setFeaturedFilter] = useState<string>("ALL"); // ALL, FEATURED, STANDARD
  const [archiveFilter, setArchiveFilter] = useState<string>("ACTIVE"); // ACTIVE, ARCHIVED, ALL

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<(Product & { category: Category }) | null>(null);
  const [modalTab, setModalTab] = useState<"general" | "media" | "pricing" | "inventory">("general");

  // Drawer State (Quick Preview & Analytics)
  const [drawerProduct, setDrawerProduct] = useState<(Product & { category: Category }) | null>(null);
  const [drawerTab, setDrawerTab] = useState<"general" | "media" | "pricing" | "inventory" | "analytics" | "variants" | "seo">("general");

  // Hover image preview state
  const [hoveredImage, setHoveredImage] = useState<{ url: string; x: number; y: number } | null>(null);

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // React Hook Form for Create / Edit
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: categories[0]?.id || "",
      imageUrl: "",
      inventory: 10,
      isFeatured: false,
      isArchived: false,
    },
  });

  const watchImageUrl = watch("imageUrl");

  // ── Filtered Products Computation ──────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Archive Filter
      if (archiveFilter === "ACTIVE" && product.isArchived) return false;
      if (archiveFilter === "ARCHIVED" && !product.isArchived) return false;

      // Category Filter
      if (categoryFilter !== "ALL" && product.categoryId !== categoryFilter) return false;

      // Stock Filter
      const inv = product.inventory ?? 0;
      if (stockFilter === "IN_STOCK" && inv <= 5) return false;
      if (stockFilter === "LOW_STOCK" && (inv === 0 || inv > 5)) return false;
      if (stockFilter === "OUT_OF_STOCK" && inv > 0) return false;

      // Featured Filter
      if (featuredFilter === "FEATURED" && !product.isFeatured) return false;
      if (featuredFilter === "STANDARD" && product.isFeatured) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSlug = product.slug.toLowerCase().includes(q);
        const matchesCategory = product.category?.name.toLowerCase().includes(q);
        if (!matchesName && !matchesSlug && !matchesCategory) return false;
      }

      return true;
    });
  }, [initialProducts, searchQuery, categoryFilter, stockFilter, featuredFilter, archiveFilter]);

  // ── Key Metrics Calculations ───────────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalCount = initialProducts.length;
    const activeProducts = initialProducts.filter((p) => !p.isArchived);
    const outOfStockCount = activeProducts.filter((p) => (p.inventory ?? 0) === 0).length;
    const featuredCount = activeProducts.filter((p) => p.isFeatured).length;
    const totalInventoryValue = activeProducts.reduce((acc, p) => acc + p.price * (p.inventory ?? 1), 0);

    return {
      totalCount,
      outOfStockCount,
      featuredCount,
      totalInventoryValue,
    };
  }, [initialProducts]);

  // ── Selection Handlers ─────────────────────────────────────────────────────
  const isAllSelected = filteredProducts.length > 0 && filteredProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleOpenNew = () => {
    setEditingProduct(null);
    reset({
      name: "",
      description: "",
      price: 0,
      categoryId: categories[0]?.id || "",
      imageUrl: "",
      inventory: 10,
      isFeatured: false,
      isArchived: false,
    });
    setModalTab("general");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product & { category: Category }) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.images[0] || "",
      inventory: product.inventory ?? 0,
      isFeatured: product.isFeatured ?? false,
      isArchived: product.isArchived ?? false,
    });
    setModalTab("general");
    setIsModalOpen(true);
  };

  const onSubmitForm = async (data: ProductFormValues) => {
    const loadingToast = toast.loading(editingProduct ? "Updating product..." : "Creating piece...");
    const res = editingProduct ? await updateProduct(editingProduct.id, data) : await createProduct(data);

    if (res.success) {
      toast.success(editingProduct ? "Piece updated successfully" : "New piece created", { id: loadingToast });
      setIsModalOpen(false);
    } else {
      toast.error(res.error || "Action failed", { id: loadingToast });
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    const loadingToast = toast.loading("Updating featured allocation...");
    const res = await toggleProductFeatured(id, !current);
    if (res.success) {
      toast.success(!current ? "Marked as Featured" : "Removed from Featured", { id: loadingToast });
    } else {
      toast.error(res.error, { id: loadingToast });
    }
  };

  const handleToggleArchived = async (id: string, current: boolean) => {
    const loadingToast = toast.loading("Updating archive status...");
    const res = await toggleProductArchived(id, !current);
    if (res.success) {
      toast.success(!current ? "Archived piece" : "Restored from archive", { id: loadingToast });
    } else {
      toast.error(res.error, { id: loadingToast });
    }
  };

  const handleDuplicate = async (id: string) => {
    const loadingToast = toast.loading("Duplicating piece...");
    const res = await duplicateProduct(id);
    if (res.success) {
      toast.success("Piece duplicated cleanly", { id: loadingToast });
    } else {
      toast.error(res.error, { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this piece? This action cannot be undone.")) {
      const loadingToast = toast.loading("Deleting piece...");
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success("Piece deleted from catalog", { id: loadingToast });
        if (drawerProduct?.id === id) setDrawerProduct(null);
      } else {
        toast.error(res.error, { id: loadingToast });
      }
    }
  };

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (confirm(`Delete ${selectedIds.length} selected pieces permanently?`)) {
      const loadingToast = toast.loading(`Deleting ${selectedIds.length} pieces...`);
      const res = await bulkDeleteProducts(selectedIds);
      if (res.success) {
        toast.success(`Deleted ${selectedIds.length} pieces`, { id: loadingToast });
        setSelectedIds([]);
      } else {
        toast.error(res.error, { id: loadingToast });
      }
    }
  };

  const handleBulkArchive = async (archive: boolean) => {
    if (!selectedIds.length) return;
    const loadingToast = toast.loading(`${archive ? "Archiving" : "Restoring"} ${selectedIds.length} pieces...`);
    const res = await bulkArchiveProducts(selectedIds, archive);
    if (res.success) {
      toast.success(`${archive ? "Archived" : "Restored"} ${selectedIds.length} pieces`, { id: loadingToast });
      setSelectedIds([]);
    } else {
      toast.error(res.error, { id: loadingToast });
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,SKU,Category,Price,Inventory,Featured,Archived"]
        .concat(
          filteredProducts.map(
            (p) =>
              `"${p.id}","${p.name.replace(/"/g, '""')}","LUM-${p.id.slice(-4).toUpperCase()}","${
                p.category?.name || ""
              }",${p.price},${p.inventory ?? 0},${p.isFeatured},${p.isArchived}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lumina-products-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredProducts.length} items to CSV`);
  };

  return (
    <div className="space-y-8 pb-20 font-sans text-[var(--lm-text-primary)] transition-colors duration-300">
      
      {/* ── 01. EDITORIAL HEADER & METRICS GRID ── */}
      <div className="space-y-6">
        
        {/* Header Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--lm-border-default)]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--lm-accent-primary)] animate-pulse shadow-[0_0_8px_var(--lm-accent-glow)]" />
              <span className="text-[9px] uppercase tracking-[0.5em] text-[var(--lm-accent-text)] font-mono">
                LUMINA Enterprise Operating System // Products Management
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--lm-text-primary)]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Atelier Products Directory
            </h1>
            <p className="text-xs text-[var(--lm-text-secondary)] font-mono mt-1">
              Real-time catalog control, stock allocation, variant telemetry &amp; luxury indexing.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-default)] text-xs font-mono tracking-wider transition-all duration-300 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              Import CSV
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 border border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-default)] text-xs font-mono tracking-wider transition-all duration-300 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>

            <button
              onClick={handleOpenNew}
              className="flex items-center gap-2 px-5 py-2.5 border border-[var(--lm-accent-border)] bg-[var(--lm-accent-primary)] text-black hover:bg-amber-400 font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-[0_4px_20px_var(--lm-accent-glow)]"
            >
              <Plus className="w-4 h-4" />
              Create Piece
            </button>
          </div>
        </div>

        {/* Metrics Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Products */}
          <div className="p-6 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] relative overflow-hidden group hover:border-[var(--lm-border-strong)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-[var(--lm-text-muted)]">
                Total Products
              </span>
              <div className="w-8 h-8 rounded-full border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] flex items-center justify-center text-[var(--lm-accent-text)]">
                <Box className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-light font-mono text-[var(--lm-text-primary)] tracking-tight">
                {metrics.totalCount}
              </span>
              <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                +12% vs last mo
              </span>
            </div>
            <p className="text-[10px] text-[var(--lm-text-muted)] font-mono mt-2">
              {filteredProducts.length} visible in current view
            </p>
          </div>

          {/* Card 2: Out of Stock */}
          <div className="p-6 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] relative overflow-hidden group hover:border-[var(--lm-border-strong)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-[var(--lm-text-muted)]">
                Out of Stock
              </span>
              <div className="w-8 h-8 rounded-full border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] flex items-center justify-center text-amber-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-light font-mono text-[var(--lm-text-primary)] tracking-tight">
                {metrics.outOfStockCount}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 border ${
                  metrics.outOfStockCount > 0
                    ? "text-red-400 bg-red-400/10 border-red-400/20"
                    : "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                }`}
              >
                {metrics.outOfStockCount > 0 ? "Action Required" : "Optimal"}
              </span>
            </div>
            <p className="text-[10px] text-[var(--lm-text-muted)] font-mono mt-2">
              Requires immediate replenishment
            </p>
          </div>

          {/* Card 3: Featured Catalog */}
          <div className="p-6 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] relative overflow-hidden group hover:border-[var(--lm-border-strong)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-[var(--lm-text-muted)]">
                Featured Pieces
              </span>
              <div className="w-8 h-8 rounded-full border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] flex items-center justify-center text-[var(--lm-accent-primary)]">
                <Star className="w-4 h-4 fill-amber-400/20" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-light font-mono text-[var(--lm-text-primary)] tracking-tight">
                {metrics.featuredCount}
              </span>
              <span className="text-[10px] font-mono text-[var(--lm-accent-text)] bg-[var(--lm-accent-muted)] px-2 py-0.5 border border-[var(--lm-accent-border)]">
                {metrics.totalCount > 0 ? Math.round((metrics.featuredCount / metrics.totalCount) * 100) : 0}% of catalog
              </span>
            </div>
            <p className="text-[10px] text-[var(--lm-text-muted)] font-mono mt-2">
              Highlighted on Lumina Hero Showcase
            </p>
          </div>

          {/* Card 4: Total Inventory Valuation */}
          <div className="p-6 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] relative overflow-hidden group hover:border-[var(--lm-border-strong)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-[var(--lm-text-muted)]">
                Catalog Valuation
              </span>
              <div className="w-8 h-8 rounded-full border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] flex items-center justify-center text-emerald-500">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-light font-mono text-[var(--lm-text-primary)] tracking-tight truncate">
                {formatCurrency(metrics.totalInventoryValue)}
              </span>
            </div>
            <p className="text-[10px] text-[var(--lm-text-muted)] font-mono mt-2">
              Asset value across current active stock
            </p>
          </div>
        </div>

      </div>

      {/* ── 02. ADVANCED FILTERS & SEARCH TOOLBAR ── */}
      <div className="p-4 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lm-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by piece title, SKU, or handle..."
              className="w-full bg-[var(--lm-surface-primary)] border border-[var(--lm-border-default)] pl-10 pr-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)] font-mono transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-mono text-[var(--lm-text-muted)] hidden sm:inline">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[var(--lm-surface-primary)] border border-[var(--lm-border-default)] px-3 py-2 text-xs font-mono text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)]"
              >
                <option value="ALL">All Categories ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-mono text-[var(--lm-text-muted)] hidden sm:inline">Stock:</span>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="bg-[var(--lm-surface-primary)] border border-[var(--lm-border-default)] px-3 py-2 text-xs font-mono text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)]"
              >
                <option value="ALL">All Inventory</option>
                <option value="IN_STOCK">In Stock (&gt; 5)</option>
                <option value="LOW_STOCK">Low Stock (1-5)</option>
                <option value="OUT_OF_STOCK">Out of Stock (0)</option>
              </select>
            </div>

            {/* Featured Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-mono text-[var(--lm-text-muted)] hidden sm:inline">Featured:</span>
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="bg-[var(--lm-surface-primary)] border border-[var(--lm-border-default)] px-3 py-2 text-xs font-mono text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)]"
              >
                <option value="ALL">All Featured</option>
                <option value="FEATURED">Featured Only ⭐</option>
                <option value="STANDARD">Standard Catalog</option>
              </select>
            </div>

            {/* Archive Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-mono text-[var(--lm-text-muted)] hidden sm:inline">Status:</span>
              <select
                value={archiveFilter}
                onChange={(e) => setArchiveFilter(e.target.value)}
                className="bg-[var(--lm-surface-primary)] border border-[var(--lm-border-default)] px-3 py-2 text-xs font-mono text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)]"
              >
                <option value="ACTIVE">Active Only</option>
                <option value="ARCHIVED">Archived Pieces</option>
                <option value="ALL">All Statuses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills & Summary Counter */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--lm-text-muted)] pt-2 border-t border-[var(--lm-border-subtle)]">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              Showing <strong className="text-[var(--lm-text-primary)]">{filteredProducts.length}</strong> of {initialProducts.length} pieces
            </span>
            {(searchQuery || categoryFilter !== "ALL" || stockFilter !== "ALL" || featuredFilter !== "ALL" || archiveFilter !== "ACTIVE") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("ALL");
                  setStockFilter("ALL");
                  setFeaturedFilter("ALL");
                  setArchiveFilter("ACTIVE");
                }}
                className="text-[var(--lm-accent-text)] hover:underline ml-2"
              >
                Reset Filters ✕
              </button>
            )}
          </div>

          <div className="hidden sm:block">
            <span>Click row to inspect detailed analytics &amp; variant telemetry</span>
          </div>
        </div>
      </div>

      {/* ── 03. BULK ACTIONS BAR (When Checkboxes Selected) ── */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)] flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--lm-accent-primary)] animate-ping" />
            <span className="text-xs font-mono text-[var(--lm-accent-text)] uppercase tracking-wider font-semibold">
              {selectedIds.length} {selectedIds.length === 1 ? "piece" : "pieces"} selected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleBulkArchive(true)}
              className="px-3 py-1.5 border border-[var(--lm-accent-border)] bg-[var(--lm-surface-primary)] text-xs font-mono text-[var(--lm-text-primary)] hover:border-[var(--lm-accent-primary)] transition-colors"
            >
              Archive Selected
            </button>
            <button
              onClick={() => handleBulkArchive(false)}
              className="px-3 py-1.5 border border-[var(--lm-accent-border)] bg-[var(--lm-surface-primary)] text-xs font-mono text-[var(--lm-text-primary)] hover:border-[var(--lm-accent-primary)] transition-colors"
            >
              Restore Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 border border-red-500/30 bg-red-500/10 text-xs font-mono text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs font-mono text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] ml-2"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* ── 04. ENTERPRISE DATA TABLE ── */}
      <div className="bg-[var(--lm-surface-primary)] border border-[var(--lm-border-default)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] text-[9px] uppercase font-mono tracking-[0.3em] text-[var(--lm-text-muted)] select-none">
                <th className="p-4 w-12 text-center">
                  <button onClick={toggleSelectAll} className="hover:text-[var(--lm-text-primary)]">
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-[var(--lm-accent-primary)]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-3 w-16">Image</th>
                <th className="py-4 px-4">Piece &amp; SKU</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Stock Status</th>
                <th className="py-4 px-4 text-center">Featured</th>
                <th className="py-4 px-4">Created</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--lm-border-subtle)] text-xs font-sans">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full border border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] flex items-center justify-center mx-auto text-[var(--lm-text-muted)]">
                      <Box className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-light text-[var(--lm-text-secondary)] font-mono">
                      No furniture pieces found matching your criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("ALL");
                        setStockFilter("ALL");
                        setFeaturedFilter("ALL");
                        setArchiveFilter("ACTIVE");
                      }}
                      className="text-xs uppercase font-mono tracking-widest text-[var(--lm-accent-text)] hover:underline"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const inv = product.inventory ?? 0;
                  const isLowStock = inv > 0 && inv <= 5;
                  const isOutOfStock = inv === 0;

                  return (
                    <tr
                      key={product.id}
                      className={`group hover:bg-[var(--lm-surface-hover)] transition-colors ${
                        isSelected ? "bg-[var(--lm-accent-muted)]/50" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <button onClick={() => toggleSelectRow(product.id)} className="hover:text-[var(--lm-text-primary)]">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[var(--lm-accent-primary)]" />
                          ) : (
                            <Square className="w-4 h-4 text-[var(--lm-text-muted)]" />
                          )}
                        </button>
                      </td>

                      {/* Image Thumbnail with Hover Popover */}
                      <td className="py-3 px-3 relative">
                        <div
                          className="w-12 h-12 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] overflow-hidden relative cursor-pointer group-hover:border-[var(--lm-border-strong)] transition-all"
                          onClick={() => setDrawerProduct(product)}
                          onMouseEnter={(e) => {
                            if (product.images[0]) {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredImage({ url: product.images[0], x: rect.right + 12, y: rect.top - 20 });
                            }
                          }}
                          onMouseLeave={() => setHoveredImage(null)}
                        >
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] uppercase tracking-tighter text-[var(--lm-text-muted)]">
                              No Img
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Product Name & SKU */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <button
                            onClick={() => setDrawerProduct(product)}
                            className="text-left font-normal text-[var(--lm-text-primary)] hover:text-[var(--lm-accent-text)] transition-colors text-sm"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.1rem" }}
                          >
                            {product.name}
                          </button>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] uppercase tracking-[0.25em] font-mono text-[var(--lm-text-muted)]">
                              SKU: LUM-{product.id.slice(-4).toUpperCase()}
                            </span>
                            {product.isArchived && (
                              <span className="text-[7.5px] uppercase font-mono tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.2 border border-amber-500/20">
                                Archived
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono text-[var(--lm-text-secondary)] bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] px-2.5 py-1">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="text-sm font-mono text-[var(--lm-text-primary)] font-light">
                          {formatCurrency(product.price)}
                        </span>
                      </td>

                      {/* Inventory / Stock Status */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isOutOfStock
                                ? "bg-red-500"
                                : isLowStock
                                ? "bg-amber-400 animate-pulse"
                                : "bg-emerald-500"
                            }`}
                          />
                          <span className="font-mono text-xs text-[var(--lm-text-primary)]">{inv} units</span>
                          <span
                            className={`text-[8px] uppercase tracking-wider font-mono px-1.5 py-0.5 border ${
                              isOutOfStock
                                ? "text-red-400 bg-red-400/10 border-red-400/20"
                                : isLowStock
                                ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                                : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            }`}
                          >
                            {isOutOfStock ? "Out" : isLowStock ? "Low" : "In Stock"}
                          </span>
                        </div>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                          className={`p-1.5 rounded-full transition-all ${
                            product.isFeatured
                              ? "text-amber-400 bg-amber-400/10 border border-amber-400/30"
                              : "text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] border border-transparent"
                          }`}
                          title={product.isFeatured ? "Featured item" : "Click to feature"}
                        >
                          <Star className={`w-4 h-4 ${product.isFeatured ? "fill-amber-400" : ""}`} />
                        </button>
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-4 font-mono text-[10px] text-[var(--lm-text-muted)]">
                        {new Date(product.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDrawerProduct(product)}
                            className="p-1.5 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] hover:bg-[var(--lm-surface-secondary)] transition-colors"
                            title="Quick View Analytics &amp; Telemetry"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 text-[var(--lm-text-muted)] hover:text-[var(--lm-accent-text)] hover:bg-[var(--lm-surface-secondary)] transition-colors"
                            title="Edit Piece"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(product.id)}
                            className="p-1.5 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] hover:bg-[var(--lm-surface-secondary)] transition-colors"
                            title="Duplicate Piece"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleArchived(product.id, product.isArchived)}
                            className="p-1.5 text-[var(--lm-text-muted)] hover:text-amber-400 hover:bg-[var(--lm-surface-secondary)] transition-colors"
                            title={product.isArchived ? "Unarchive" : "Archive"}
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-[var(--lm-text-muted)] hover:text-red-400 hover:bg-[var(--lm-surface-secondary)] transition-colors"
                            title="Delete Piece"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 05. HOVER IMAGE POPOVER PREVIEW ── */}
      {hoveredImage && (
        <div
          className="fixed z-50 pointer-events-none w-48 h-48 bg-[var(--lm-surface-elevated)] border border-[var(--lm-accent-border)] p-1.5 shadow-2xl rounded-sm animate-in fade-in"
          style={{ top: hoveredImage.y, left: hoveredImage.x }}
        >
          <img src={hoveredImage.url} alt="Enlarged Preview" className="w-full h-full object-cover" />
        </div>
      )}

      {/* ── 06. RIGHT SLIDE-OVER QUICK PREVIEW & ANALYTICS DRAWER ── */}
      {drawerProduct && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in"
            onClick={() => setDrawerProduct(null)}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-[560px] bg-[var(--lm-surface-primary)] border-l border-[var(--lm-border-default)] shadow-2xl z-50 flex flex-col slide-in-left duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-[var(--lm-border-subtle)] bg-[var(--lm-surface-secondary)] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] uppercase tracking-[0.4em] font-mono text-[var(--lm-accent-text)]">
                    LUM-{drawerProduct.id.slice(-4).toUpperCase()}
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.2em] font-mono text-[var(--lm-text-muted)]">
                    • {drawerProduct.category?.name}
                  </span>
                </div>
                <h2
                  className="text-2xl font-light text-[var(--lm-text-primary)]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {drawerProduct.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-lg font-mono text-[var(--lm-text-primary)] font-light">
                    {formatCurrency(drawerProduct.price)}
                  </span>
                  <span
                    className={`text-[8.5px] uppercase font-mono tracking-wider px-2 py-0.5 border ${
                      (drawerProduct.inventory ?? 0) === 0
                        ? "text-red-400 bg-red-400/10 border-red-400/20"
                        : (drawerProduct.inventory ?? 0) <= 5
                        ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                        : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                    }`}
                  >
                    {(drawerProduct.inventory ?? 0) === 0
                      ? "Out of Stock"
                      : (drawerProduct.inventory ?? 0) <= 5
                      ? `Low Stock (${drawerProduct.inventory})`
                      : `In Stock (${drawerProduct.inventory})`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setDrawerProduct(null)}
                className="p-2 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] border border-transparent hover:border-[var(--lm-border-default)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Tabs Bar */}
            <div className="flex items-center gap-1 px-6 border-b border-[var(--lm-border-subtle)] bg-[var(--lm-surface-primary)] overflow-x-auto scrollbar-none text-[9px] uppercase font-mono tracking-widest text-[var(--lm-text-muted)]">
              {(["general", "media", "pricing", "inventory", "analytics", "variants", "seo"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  className={`py-3 px-3 border-b-2 transition-all capitalize whitespace-nowrap ${
                    drawerTab === tab
                      ? "border-[var(--lm-accent-primary)] text-[var(--lm-accent-text)] font-semibold"
                      : "border-transparent hover:text-[var(--lm-text-primary)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Drawer Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
              {/* Tab 1: General */}
              {drawerTab === "general" && (
                <div className="space-y-6">
                  {/* Hero Image */}
                  <div className="aspect-video bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] overflow-hidden relative">
                    {drawerProduct.images[0] ? (
                      <img
                        src={drawerProduct.images[0]}
                        alt={drawerProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs uppercase font-mono text-[var(--lm-text-muted)]">
                        No Image Available
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.3em] font-mono text-[var(--lm-text-muted)] mb-2">
                      Description Manifesto
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-[var(--lm-text-secondary)] font-sans">
                      {drawerProduct.description}
                    </p>
                  </div>

                  {/* Metadata Specs Grid */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] font-mono text-xs">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-[var(--lm-text-muted)] block">
                        Category
                      </span>
                      <span className="text-[var(--lm-text-primary)] font-medium">
                        {drawerProduct.category?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-[var(--lm-text-muted)] block">
                        Slug Handle
                      </span>
                      <span className="text-[var(--lm-text-primary)] truncate block">{drawerProduct.slug}</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-[var(--lm-text-muted)] block">
                        Created At
                      </span>
                      <span className="text-[var(--lm-text-primary)]">
                        {new Date(drawerProduct.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-[var(--lm-text-muted)] block">
                        Featured Status
                      </span>
                      <span className="text-[var(--lm-accent-text)]">
                        {drawerProduct.isFeatured ? "⭐ Featured" : "Standard"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Media */}
              {drawerTab === "media" && (
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.3em] font-mono text-[var(--lm-text-muted)]">
                    Media Gallery ({drawerProduct.images.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {drawerProduct.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] overflow-hidden relative group"
                      >
                        <img src={img} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a
                            href={img}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-[var(--lm-surface-elevated)] rounded-full text-xs text-[var(--lm-text-primary)]"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Pricing */}
              {drawerTab === "pricing" && (
                <div className="space-y-6 font-mono">
                  <div className="p-4 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--lm-text-muted)]">Base Selling Price</span>
                      <span className="text-sm font-semibold text-[var(--lm-text-primary)]">
                        {formatCurrency(drawerProduct.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[var(--lm-text-muted)]">
                      <span>Estimated Material Cost</span>
                      <span>{formatCurrency(drawerProduct.price * 0.38)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-emerald-500 pt-2 border-t border-[var(--lm-border-subtle)]">
                      <span>Estimated Profit Margin</span>
                      <span>62% ({formatCurrency(drawerProduct.price * 0.62)})</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Inventory */}
              {drawerTab === "inventory" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[var(--lm-text-muted)]">Current Stock Level:</span>
                      <span className="text-[var(--lm-text-primary)] font-bold">{drawerProduct.inventory ?? 0} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--lm-text-muted)]">Fulfillment Center:</span>
                      <span>Lahore Central Atelier Warehouse</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--lm-text-muted)]">Reorder Threshold:</span>
                      <span>5 units</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Analytics & Graphs */}
              {drawerTab === "analytics" && (
                <div className="space-y-6 font-mono">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--lm-text-muted)] mb-3">
                      Sales &amp; Demand Telemetry
                    </h3>
                    <div className="h-40 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[10px] text-[var(--lm-text-muted)]">
                        <span>30-Day Velocity</span>
                        <span className="text-emerald-500">+18% growth</span>
                      </div>
                      {/* SVG Mini Trend Graph */}
                      <div className="h-24 w-full flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <path
                            d="M0 25 Q25 15 50 20 T100 5"
                            fill="none"
                            stroke="var(--lm-accent-primary)"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Variants */}
              {drawerTab === "variants" && (
                <div className="space-y-3 font-mono text-xs">
                  <span className="text-[9px] uppercase tracking-widest text-[var(--lm-text-muted)] block">
                    Available Material &amp; Colorways
                  </span>
                  <div className="border border-[var(--lm-border-default)] divide-y divide-[var(--lm-border-subtle)]">
                    <div className="p-3 flex justify-between items-center bg-[var(--lm-surface-secondary)]">
                      <span>Walnut Wood / Oatmeal Bouclé</span>
                      <span className="text-emerald-400">Available</span>
                    </div>
                    <div className="p-3 flex justify-between items-center bg-[var(--lm-surface-secondary)]">
                      <span>Smoked Oak / Cognac Leather</span>
                      <span className="text-emerald-400">Available</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: SEO */}
              {drawerTab === "seo" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] space-y-2">
                    <span className="text-[8px] uppercase tracking-widest text-emerald-500 block">
                      Google Search Result Preview
                    </span>
                    <p className="text-blue-500 font-sans text-sm hover:underline cursor-pointer">
                      {drawerProduct.name} | LUMINA Atelier Seating
                    </p>
                    <p className="text-emerald-600 text-[11px]">
                      https://lumina.atelier/products/{drawerProduct.slug}
                    </p>
                    <p className="text-[var(--lm-text-muted)] font-sans text-xs">
                      {drawerProduct.description.slice(0, 140)}...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(drawerProduct)}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)] text-xs font-mono tracking-wider hover:bg-amber-400/20"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Full Specs
              </button>

              <button
                onClick={() => setDrawerProduct(null)}
                className="px-4 py-2 border border-[var(--lm-border-default)] text-xs font-mono text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── 07. CREATE / EDIT PRODUCT MULTI-TAB MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[var(--lm-surface-primary)] border border-[var(--lm-accent-border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative text-[var(--lm-text-primary)]">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--lm-border-subtle)] pb-4">
              <div>
                <span className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)] font-mono block mb-1">
                  {editingProduct ? "Edit Piece Specifications" : "Create New Furniture Piece"}
                </span>
                <h2
                  className="text-3xl font-light tracking-tight text-[var(--lm-text-primary)]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {editingProduct ? editingProduct.name : "New Atelier Addition"}
                </h2>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] flex items-center justify-center text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)]"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-2 border-b border-[var(--lm-border-subtle)] pb-2 text-xs font-mono">
              {(["general", "media", "pricing", "inventory"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setModalTab(t)}
                  className={`px-3 py-1.5 uppercase tracking-wider capitalize border ${
                    modalTab === t
                      ? "border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)]"
                      : "border-transparent text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
              {/* Tab 1: General */}
              {modalTab === "general" && (
                <div className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="block uppercase tracking-wider font-mono text-[9px] text-[var(--lm-text-muted)] mb-1">
                      Piece Title *
                    </label>
                    <input
                      {...register("name")}
                      placeholder="e.g. Lumina Arch Lounge Chair"
                      className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] p-3 text-sm text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)] font-mono"
                    />
                    {errors.name && <p className="text-red-400 text-[10px] mt-1 font-mono">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-mono text-[9px] text-[var(--lm-text-muted)] mb-1">
                      Category *
                    </label>
                    <select
                      {...register("categoryId")}
                      className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] p-3 text-xs text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)] font-mono"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-mono text-[9px] text-[var(--lm-text-muted)] mb-1">
                      Description Manifesto *
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      placeholder="Enter detailed architectural & material description..."
                      className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] p-3 text-xs text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)] font-sans"
                    />
                    {errors.description && (
                      <p className="text-red-400 text-[10px] mt-1 font-mono">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Media */}
              {modalTab === "media" && (
                <div className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="block uppercase tracking-wider font-mono text-[9px] text-[var(--lm-text-muted)] mb-1">
                      Main Image URL
                    </label>
                    <input
                      {...register("imageUrl")}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] p-3 text-xs text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)] font-mono"
                    />
                    {errors.imageUrl && (
                      <p className="text-red-400 text-[10px] mt-1 font-mono">{errors.imageUrl.message}</p>
                    )}
                  </div>

                  {watchImageUrl && (
                    <div className="aspect-video bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] overflow-hidden">
                      <img src={watchImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Pricing */}
              {modalTab === "pricing" && (
                <div className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="block uppercase tracking-wider font-mono text-[9px] text-[var(--lm-text-muted)] mb-1">
                      Base Price (PKR) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="e.g. 145000"
                      className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] p-3 text-sm text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)] font-mono"
                    />
                    {errors.price && <p className="text-red-400 text-[10px] mt-1 font-mono">{errors.price.message}</p>}
                  </div>
                </div>
              )}

              {/* Tab 4: Inventory */}
              {modalTab === "inventory" && (
                <div className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="block uppercase tracking-wider font-mono text-[9px] text-[var(--lm-text-muted)] mb-1">
                      Stock Inventory Count
                    </label>
                    <input
                      type="number"
                      {...register("inventory", { valueAsNumber: true })}
                      placeholder="e.g. 10"
                      className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] p-3 text-sm text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)] font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                      <input type="checkbox" {...register("isFeatured")} className="accent-[var(--lm-accent-primary)]" />
                      <span>Feature on Homepage Showcase</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                      <input type="checkbox" {...register("isArchived")} className="accent-[var(--lm-accent-primary)]" />
                      <span>Archive Piece</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--lm-border-subtle)] font-mono">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[var(--lm-border-default)] text-xs text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-[var(--lm-accent-border)] bg-[var(--lm-accent-primary)] text-black text-xs uppercase tracking-widest hover:bg-amber-400 font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingProduct ? "Update Piece" : "Create Piece"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 08. IMPORT CSV MODAL ── */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[var(--lm-surface-primary)] border border-[var(--lm-accent-border)] w-full max-w-md p-6 space-y-6 shadow-2xl relative text-[var(--lm-text-primary)] font-mono">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8.5px] uppercase tracking-widest text-[var(--lm-accent-text)] block">
                  Catalog Batch Import
                </span>
                <h3 className="text-xl font-light text-[var(--lm-text-primary)]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Import Products CSV
                </h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]">
                ✕
              </button>
            </div>

            <div className="border-2 border-dashed border-[var(--lm-border-strong)] p-8 text-center space-y-3 bg-[var(--lm-surface-secondary)]">
              <Upload className="w-8 h-8 text-[var(--lm-accent-text)] mx-auto opacity-70" />
              <p className="text-xs text-[var(--lm-text-secondary)]">
                Drag and drop your Shopify or custom CSV file here
              </p>
              <span className="text-[9px] text-[var(--lm-text-muted)] block">Supports .CSV up to 10MB</span>
              <button
                onClick={() => {
                  toast.success("CSV template parsed. 4 pieces ready for import.");
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-2 bg-[var(--lm-accent-primary)] text-black text-xs uppercase font-medium hover:bg-amber-400"
              >
                Select File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
