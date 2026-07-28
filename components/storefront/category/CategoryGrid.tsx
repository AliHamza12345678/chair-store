"use client";

// ─── Category Product Grid ─────────────────────────────────────────────────────
// Staggered luxury grid with premium product cards and empty state fallback.

import ProductCard, { ProductCardProduct } from "@/components/storefront/products/ProductCard";
import ProductsEmptyState from "@/components/storefront/products/ProductsEmptyState";
import { cn } from "@/lib/clsx";

interface CategoryGridProps {
  products: ProductCardProduct[];
}

export default function CategoryGrid({ products }: CategoryGridProps) {
  if (!products || products.length === 0) {
    return <ProductsEmptyState hasFilters={false} />;
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product, index) => {
        const isOffsetCol = index % 3 === 1;
        const isThirdCol = index % 3 === 2;

        return (
          <div
            key={product.id}
            className={cn(
              "animate-in",
              isOffsetCol && "xl:mt-20",
              isThirdCol && "xl:mt-10"
            )}
            style={{
              animationDelay: `${Math.min(index * 50, 400)}ms`,
              animationFillMode: "both",
            }}
          >
            <ProductCard
              product={{ ...product, index }}
              view="grid"
              priority={index < 3}
            />
          </div>
        );
      })}
    </div>
  );
}
