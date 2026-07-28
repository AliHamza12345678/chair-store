// ─── Category Page ─────────────────────────────────────────────────────────────
// Fully redesigned luxury category page featuring:
//   • CategoryHero          — Editorial header with particle canvas & background blur
//   • CategoryNav           — Pill tab switcher across all salon categories
//   • CategoryFeaturedBanner— Spotlight banner for the flagship category piece
//   • CategoryGrid          — Staggered masonry layout with premium product cards
//   • CollectionStory       — Design manifesto & 3 pillars of craftsmanship

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryHero from "@/components/storefront/category/CategoryHero";
import CategoryNav from "@/components/storefront/category/CategoryNav";
import CategoryFeaturedBanner from "@/components/storefront/category/CategoryFeaturedBanner";
import CategoryGrid from "@/components/storefront/category/CategoryGrid";
import CollectionStory from "@/components/storefront/category/CollectionStory";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Not Found" };
  return {
    title: `${category.name} Salon | LUMINA`,
    description: category.description || `Explore Lumina's ${category.name} collection.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch current category with non-archived products
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isArchived: false },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        include: { category: true },
      },
    },
  });

  if (!category) notFound();

  // 2. Fetch all categories for navigation switcher
  const allCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  // 3. Identify featured flagship product for spotlight banner
  const featuredProduct = category.products.find((p) => p.isFeatured) || category.products[0];

  // 4. Products for main grid (excluding featured if banner rendered)
  const gridProducts = featuredProduct
    ? category.products.filter((p) => p.id !== featuredProduct.id)
    : category.products;

  return (
    <div className="bg-[var(--lm-surface-primary)] text-[var(--lm-text-primary)] min-h-screen">
      {/* ── Editorial Hero ── */}
      <CategoryHero
        name={category.name}
        description={category.description}
        totalCount={category.products.length}
        imageUrl={category.imageUrl}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20 py-12">
        {/* ── Category Navigation Bar ── */}
        <CategoryNav categories={allCategories} currentSlug={category.slug} />

        {/* ── Featured Cornerstone Spotlight Banner ── */}
        {featuredProduct && (
          <CategoryFeaturedBanner
            product={{
              id: featuredProduct.id,
              name: featuredProduct.name,
              slug: featuredProduct.slug,
              price: featuredProduct.price,
              description: featuredProduct.description,
              images: featuredProduct.images,
            }}
            categoryName={category.name}
          />
        )}

        {/* ── Product Grid Header ── */}
        <div className="flex items-center justify-between mb-12 mt-16 pt-8 border-t border-[var(--lm-border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[var(--lm-accent-primary)]/50" />
            <h2
              className="text-[var(--lm-text-primary)] text-2xl font-light"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                letterSpacing: "0.02em",
              }}
            >
              The Full {category.name} Salon
            </h2>
          </div>
          <span
            className="text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {gridProducts.length} {gridProducts.length === 1 ? "piece" : "pieces"}
          </span>
        </div>

        {/* ── Luxury Staggered Product Grid ── */}
        <CategoryGrid
          products={gridProducts.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            images: p.images,
            category: { name: p.category.name, slug: p.category.slug },
            isFeatured: p.isFeatured,
          }))}
        />

        {/* ── Collection Story & Craftsmanship ── */}
        <CollectionStory categoryName={category.name} />
      </div>
    </div>
  );
}
