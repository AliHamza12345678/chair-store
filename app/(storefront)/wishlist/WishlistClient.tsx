"use client";

// ─── Wishlist Page Client ──────────────────────────────────────────────────────
// Luxury saved pieces showcase with staggered grid, instant 1-click Add to Collection,
// removal action, and art-directed empty state.

import Link from "next/link";
import { removeFromWishlist } from "@/features/wishlist/actions";
import { formatCurrency } from "@/lib/format-currency";
import { useCartStore } from "@/features/cart/store";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  product: { id: string; name: string; slug: string; price: number; images: string[] };
}

export function WishlistClient({ items, embedded = false }: { items: WishlistItem[]; embedded?: boolean }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleRemove = async (id: string) => {
    const res = await removeFromWishlist(id);
    if (res.success) toast.success("Piece removed from wishlist");
    else toast.error(res.error);
  };

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: 1,
      imageUrl: item.product.images[0] || "",
    });
    toast.success("Added to your collection");
  };

  const content = (
    <div className="space-y-8 animate-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[var(--lm-border-default)] gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[var(--lm-accent-muted)]0" />
            <span
              className="text-[8.5px] uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/80 font-mono"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Saved Salon Pieces
            </span>
          </div>
          <h1
            className="text-[var(--lm-text-primary)] text-3xl sm:text-4xl font-light tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Atelier Wishlist
          </h1>
          <p
            className="text-[var(--lm-text-secondary)] text-xs mt-2 font-light max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Your curated collection of saved seating, bespoke tables, and salon lighting.
          </p>
        </div>

        <span
          className="text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {items.length} {items.length === 1 ? "Saved Piece" : "Saved Pieces"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="p-16 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] text-center max-w-md mx-auto my-8 space-y-4">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div
              className="absolute inset-0 rounded-full border border-[var(--lm-accent-border)]/20"
              style={{ animation: "spin 20s linear infinite" }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[var(--lm-accent-text)]">
              <svg width="28" height="26" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M8 13C8 13 1 8.5 1 4.5C1 2.567 2.567 1 4.5 1C5.74 1 6.83 1.66 7.5 2.66C8.17 1.66 9.26 1 10.5 1C12.433 1 14 2.567 14 4.5C14 8.5 8 13 8 13Z" />
              </svg>
            </div>
          </div>

          <span
            className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)]/70 block font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Wishlist Empty
          </span>

          <h3
            className="text-[var(--lm-text-primary)] text-2xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            No saved pieces yet
          </h3>

          <p
            className="text-[var(--lm-text-secondary)] text-xs leading-relaxed font-light"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Bookmark your favorite luxury seating, dining tables, and lighting pieces as you explore our catalog.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-3 border border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] px-8 py-3.5 text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] transition-all font-mono"
          >
            Explore Collection →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="group relative flex flex-col bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] hover:border-[var(--lm-accent-border)]/40 transition-all p-4">
              
              {/* Remove button overlay */}
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full border border-[var(--lm-border-strong)] bg-black/60 backdrop-blur flex items-center justify-center text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] hover:border-white/30 transition-all"
                aria-label="Remove item"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>

              {/* Product Image */}
              <Link href={`/products/${item.product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-black mb-4">
                {item.product.images[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: "saturate(0.85)" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[8px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)] font-mono">
                    Piece
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
              </Link>

              {/* Info */}
              <div className="flex flex-col space-y-2 flex-1 justify-between">
                <div>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="text-[var(--lm-text-primary)] group-hover:text-[var(--lm-accent-text)] transition-colors block text-lg font-light"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {item.product.name}
                  </Link>

                  <span
                    className="text-[var(--lm-text-secondary)] font-mono text-xs tabular-nums block mt-1"
                  >
                    {formatCurrency(item.product.price)}
                  </span>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full py-3 border border-[var(--lm-accent-border)]/40 bg-[var(--lm-accent-muted)] text-[8px] uppercase tracking-[0.35em] text-[var(--lm-accent-text)] hover:bg-amber-400/15 transition-all text-center mt-4 font-mono"
                >
                  Add to Collection
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="bg-[var(--lm-surface-elevated)] text-[var(--lm-text-primary)] min-h-screen pt-36 pb-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        {content}
      </div>
    </div>
  );
}

