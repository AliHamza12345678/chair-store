"use client";

// ─── Product Grid ──────────────────────────────────────────────────────────────
// Masonry-inspired staggered grid with view-mode switching and animated entrance.

import ProductCard, { type ProductCardProduct } from "./ProductCard";
import { cn } from "@/lib/clsx";

interface ProductGridProps {
  products: ProductCardProduct[];
  wishlistedIds?: string[];
  view?: "grid" | "grid-dense" | "list";
}

export default function ProductGrid({
  products,
  wishlistedIds = [],
  view = "grid",
}: ProductGridProps) {
  if (view === "list") {
    return (
      <div className="flex flex-col">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-in"
            style={{
              animationDelay: `${Math.min(index * 40, 300)}ms`,
              animationFillMode: "both",
            }}
          >
            <ProductCard
              product={{ ...product, index }}
              wishlisted={wishlistedIds.includes(product.id)}
              view="list"
            />
          </div>
        ))}
      </div>
    );
  }

  if (view === "grid-dense") {
    return (
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-in"
            style={{
              animationDelay: `${Math.min(index * 30, 300)}ms`,
              animationFillMode: "both",
            }}
          >
            <ProductCard
              product={{ ...product, index }}
              wishlisted={wishlistedIds.includes(product.id)}
              view="grid-dense"
              priority={index < 6}
            />
          </div>
        ))}
      </div>
    );
  }

  // ── Standard staggered grid (signature look) ──────────────────────────────
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product, index) => {
        // Every second column offset for stagger rhythm
        const isOffsetCol = index % 3 === 1;
        const isThirdCol = index % 3 === 2;

        return (
          <div
            key={product.id}
            className={cn(
              "animate-in",
              isOffsetCol && "xl:mt-20",
              isThirdCol && "xl:mt-10",
            )}
            style={{
              animationDelay: `${Math.min(index * 50, 400)}ms`,
              animationFillMode: "both",
            }}
          >
            <ProductCard
              product={{ ...product, index }}
              wishlisted={wishlistedIds.includes(product.id)}
              view="grid"
              priority={index < 3}
            />
          </div>
        );
      })}
    </div>
  );
}
