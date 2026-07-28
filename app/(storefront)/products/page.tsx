// ─── Products Listing Page ─────────────────────────────────────────────────────
// Fully redesigned world-class ecommerce listing page, wiring:
//   • ProductsHero        — luxury editorial masthead
//   • FiltersSidebar      — collapsible, animated sidebar
//   • MobileFilterDrawer  — mobile slide-in drawer
//   • SortToolbar         — sort pills + 3-view-mode toggle
//   • ProductGrid         — masonry-staggered premium cards
//   • ProductsPagination  — progress-bar pagination
//   • ProductsEmptyState  — art-directed empty state
//   • ProductGridSkeleton — amber-shimmer skeleton (Suspense boundary)

import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductsHero from "@/components/storefront/products/ProductsHero";
import FiltersSidebar from "@/components/storefront/products/FiltersSidebar";
import MobileFilterDrawer from "@/components/storefront/products/MobileFilterDrawer";
import SortToolbar from "@/components/storefront/products/SortToolbar";
import ProductGrid from "@/components/storefront/products/ProductGrid";
import ProductsPagination from "@/components/storefront/products/ProductsPagination";
import ProductsEmptyState from "@/components/storefront/products/ProductsEmptyState";
import ProductGridSkeleton from "@/components/storefront/products/ProductGridSkeleton";

export const metadata = {
  title: "The Collection | LUMINA",
  description:
    "Browse Lumina's complete atelier — premium seating, tables, and accessories designed for sophisticated interiors.",
};

const PER_PAGE = 12;

type SearchParams = {
  sort?: string;
  category?: string;
  price?: string;
  featured?: string;
  view?: string;
  page?: string;
};

export default async function ProductsListingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // ── Parse query params ───────────────────────────────────────────────────
  const sort = searchParams.sort ?? "newest";
  const categorySlug = searchParams.category ?? "";
  const priceRange = searchParams.price ?? "";
  const featured = searchParams.featured === "true";
  const viewRaw = searchParams.view ?? "grid";
  const view: "grid" | "grid-dense" | "list" =
    viewRaw === "grid-dense" ? "grid-dense" : viewRaw === "list" ? "list" : "grid";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));

  // ── Sorting ──────────────────────────────────────────────────────────────
  type SortOrder = "asc" | "desc";
  type OrderByClause = { price?: SortOrder; createdAt?: SortOrder; isFeatured?: SortOrder };
  let orderBy: OrderByClause = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else if (sort === "featured") orderBy = { isFeatured: "desc" };

  // ── Build where clause ────────────────────────────────────────────────────
  const where: Record<string, unknown> = { isArchived: false };
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (featured) {
    where.isFeatured = true;
  }
  if (priceRange) {
    const [min, max] = priceRange.split("-").map(Number);
    where.price = { gte: min, lte: max };
  }

  // ── Fetch categories ─────────────────────────────────────────────────────
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  // ── Fetch total count ─────────────────────────────────────────────────────
  const totalCount = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(page, totalPages);

  // ── Fetch products (paginated) ────────────────────────────────────────────
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (safePage - 1) * PER_PAGE,
    take: PER_PAGE,
    include: { category: true },
  });

  const hasFilters = !!(categorySlug || priceRange || featured);

  // ── Price stats for sidebar slider ────────────────────────────────────────
  const priceStats = await prisma.product.aggregate({
    _min: { price: true },
    _max: { price: true },
    where: { isArchived: false },
  });

  return (
    <div className="bg-[var(--lm-surface-primary)] min-h-screen">

      {/* ── Luxury Hero ── */}
      <ProductsHero totalCount={totalCount} activeCategory={categorySlug || undefined} />

      {/* ── Main layout: sidebar + content ── */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20 py-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">

          {/* ─── Left: Sidebar (desktop) ─────────────────────────────── */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-32">
              <FiltersSidebar
                categories={categories}
                activeCategory={categorySlug}
                totalCount={totalCount}
                minPrice={priceStats._min.price ?? 0}
                maxPrice={priceStats._max.price ?? 999999}
              />
            </div>
          </aside>

          {/* ─── Right: Toolbar + Grid ──────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* ── Mobile: filter trigger + sort toolbar ── */}
            <div className="flex items-center gap-4 mb-0 lg:hidden">
              <MobileFilterDrawer
                categories={categories}
                activeCategory={categorySlug}
                totalCount={totalCount}
                minPrice={priceStats._min.price ?? 0}
                maxPrice={priceStats._max.price ?? 999999}
              />
              {/* Mobile sort toolbar (simplified) */}
              <div className="flex-1">
                <Suspense fallback={<div className="h-12 skeleton-shimmer" />}>
                  <SortToolbar
                    totalCount={totalCount}
                    currentSort={sort}
                    currentView={view}
                  />
                </Suspense>
              </div>
            </div>

            {/* ── Desktop sort toolbar ── */}
            <div className="hidden lg:block">
              <Suspense fallback={<div className="h-12 skeleton-shimmer" />}>
                <SortToolbar
                  totalCount={totalCount}
                  currentSort={sort}
                  currentView={view}
                />
              </Suspense>
            </div>

            {/* ── Product Grid / Empty State ── */}
            <div className="mt-12">
              {products.length === 0 ? (
                <ProductsEmptyState hasFilters={hasFilters} />
              ) : (
                <Suspense
                  fallback={
                    <ProductGridSkeleton
                      count={PER_PAGE}
                      view={view}
                    />
                  }
                >
                  <ProductGrid
                    products={products.map((p) => ({
                      id: p.id,
                      name: p.name,
                      slug: p.slug,
                      price: p.price,
                      images: p.images,
                      category: { name: p.category.name, slug: p.category.slug },
                      isFeatured: p.isFeatured,
                      isNew: false,
                    }))}
                    wishlistedIds={[]}
                    view={view}
                  />
                </Suspense>
              )}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <Suspense fallback={null}>
                <ProductsPagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  perPage={PER_PAGE}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer separator ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--lm-border-subtle)] to-transparent mx-auto max-w-7xl" />
    </div>
  );
}
