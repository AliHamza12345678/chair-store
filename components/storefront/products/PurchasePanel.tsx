"use client";

// ─── Luxury Purchase Panel (Sticky) ───────────────────────────────────────────
// The heart of the buying experience. Includes:
//   • Animated price display with variant-switch morph
//   • Option selectors: color swatches, text chips, size buttons
//   • Quantity stepper with micro-animation
//   • Add-to-cart with ripple + loading state + success flash
//   • Wishlist button integrated inline
//   • Stock level indicator
//   • Delivery / installment trust signals
//   • "Secure checkout" badge row

import { useState } from "react";
import { Product, ProductVariant, ProductOption } from "@prisma/client";
import { useCartStore } from "@/features/cart/store";
import { toggleWishlist } from "@/features/wishlist/actions";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";
import { cn } from "@/lib/clsx";

interface PurchasePanelProps {
  product: Product & {
    variants: ProductVariant[];
    options: ProductOption[];
    category: { name: string; slug: string };
  };
  isWishlisted?: boolean;
}

// ── Option chip button ──────────────────────────────────────────────────────────
function OptionChip({
  value,
  isSelected,
  onClick,
}: {
  value: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 text-[8.5px] uppercase tracking-[0.35em] border transition-all duration-300",
        isSelected
          ? "border-[var(--lm-accent-border)]/60 text-[var(--lm-text-primary)] bg-[var(--lm-accent-muted)]"
          : "border-[var(--lm-border-default)] text-[var(--lm-text-muted)] hover:border-[var(--lm-border-strong)] hover:text-[var(--lm-text-primary)]"
      )}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {isSelected && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-amber-400/60" />
      )}
      {value}
    </button>
  );
}

// ── Quantity stepper ────────────────────────────────────────────────────────────
function QuantityStepper({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  max: number;
}) {
  return (
    <div className="flex items-center border border-[var(--lm-border-default)] divide-x divide-[var(--lm-border-default)]">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="w-10 h-10 flex items-center justify-center text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors duration-200 disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
          <path d="M1 1H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <span
        className="w-12 h-10 flex items-center justify-center text-[var(--lm-text-primary)] font-mono text-sm tabular-nums"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors duration-200 disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ── Stock indicator ─────────────────────────────────────────────────────────────
function StockIndicator({ inventory }: { inventory: number }) {
  if (inventory <= 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
        <span className="text-[8px] uppercase tracking-[0.4em] text-red-400/70" style={{ fontFamily: "var(--font-inter)" }}>
          Out of stock
        </span>
      </div>
    );
  }
  if (inventory <= 3) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400/70 animate-pulse" />
        <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)]/70" style={{ fontFamily: "var(--font-inter)" }}>
          Only {inventory} left
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
      <span className="text-[8px] uppercase tracking-[0.4em] text-emerald-400/60" style={{ fontFamily: "var(--font-inter)" }}>
        In stock
      </span>
    </div>
  );
}

export default function PurchasePanel({ product, isWishlisted: initialWishlisted = false }: PurchasePanelProps) {
  const addItem = useCartStore(state => state.addItem);

  // Selected options state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    product.options.forEach(opt => {
      if (opt.values.length > 0) init[opt.name] = opt.values[0];
    });
    return init;
  });

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [wishlistPending, setWishlistPending] = useState(false);

  // Resolve active variant
  const currentVariant = product.variants.find(variant => {
    const vOpts = variant.options as Record<string, string>;
    if (!vOpts) return false;
    return Object.entries(selectedOptions).every(([k, v]) => vOpts[k] === v);
  });

  const price = currentVariant?.price ?? product.price;
  const inventory = currentVariant ? currentVariant.inventory : product.inventory;
  const isOutOfStock = inventory <= 0;

  // Add to cart handler
  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    await new Promise(r => setTimeout(r, 600)); // deliberate luxury pause
    addItem({
      productId: product.id,
      name: product.name,
      price,
      quantity,
      imageUrl: product.images[0] || "",
      variantId: currentVariant?.id,
      variantTitle: currentVariant?.title,
    });
    setIsAdding(false);
    setJustAdded(true);
    toast.success("Added to your collection");
    setTimeout(() => setJustAdded(false), 2000);
  };

  // Wishlist toggle
  const handleWishlist = async () => {
    if (wishlistPending) return;
    setWishlistPending(true);
    const res = await toggleWishlist(product.id);
    setWishlistPending(false);
    if (res.success) {
      setWishlisted(res.wishlisted);
      toast.success(res.wishlisted ? "Saved to wishlist" : "Removed from wishlist");
    } else {
      toast.error("Sign in to save pieces.");
    }
  };

  return (
    <div className="flex flex-col gap-8">

      {/* ── Category breadcrumb ── */}
      <div className="flex items-center gap-3">
        <div className="h-px w-8 bg-amber-400/40" />
        <a
          href={`/category/${product.category.slug}`}
          className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)]/60 hover:text-[var(--lm-accent-text)]/90 transition-colors duration-300"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {product.category.name}
        </a>
      </div>

      {/* ── Product name ── */}
      <div>
        <h1
          className="text-[var(--lm-text-primary)] leading-[0.95]"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
            letterSpacing: "-0.015em",
          }}
        >
          {product.name}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-amber-400/50 to-transparent" />
          <span
            className="text-[var(--lm-text-muted)] italic"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "1rem",
            }}
          >
            Lumina Atelier
          </span>
        </div>
      </div>

      {/* ── Price ── */}
      <div className="flex items-baseline gap-4">
        <span
          key={price} // re-mount on price change for animation
          className="text-[var(--lm-text-primary)] tabular-nums animate-in"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "1.9rem",
            fontWeight: 300,
            letterSpacing: "-0.02em",
          }}
        >
          {formatCurrency(price)}
        </span>
        {product.inventory > 0 && (
          <span
            className="text-[var(--lm-text-muted)] text-xs tabular-nums"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Incl. taxes
          </span>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-[var(--lm-border-subtle)]" />

      {/* ── Option selectors ── */}
      {product.options.length > 0 && (
        <div className="flex flex-col gap-6">
          {product.options.map(option => (
            <div key={option.id}>
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-[8.5px] uppercase tracking-[0.5em] text-[var(--lm-text-muted)]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {option.name}
                </p>
                <p
                  className="text-[8.5px] tracking-[0.2em] text-[var(--lm-text-muted)] italic"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.85rem" }}
                >
                  {selectedOptions[option.name]}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {option.values.map(val => (
                  <OptionChip
                    key={val}
                    value={val}
                    isSelected={selectedOptions[option.name] === val}
                    onClick={() =>
                      setSelectedOptions(prev => ({ ...prev, [option.name]: val }))
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Quantity + Stock ── */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <p
            className="text-[8.5px] uppercase tracking-[0.5em] text-[var(--lm-text-muted)]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Quantity
          </p>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            max={Math.max(1, inventory)}
          />
        </div>
        <div className="pt-5">
          <StockIndicator inventory={inventory} />
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-3">

        {/* Add to Cart — full width, centrepiece CTA */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={cn(
            "relative flex-1 h-14 flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden",
            justAdded
              ? "bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)]/50"
              : isOutOfStock
              ? "border border-[var(--lm-border-strong)] text-[var(--lm-text-muted)] cursor-not-allowed"
              : "border border-[var(--lm-border-strong)] hover:border-white/40 hover:bg-[var(--lm-surface-hover)] text-[var(--lm-text-primary)]"
          )}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {/* Shimmer sweep on hover */}
          <span
            className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
            }}
          />

          {isAdding ? (
            <span className="flex items-center gap-2">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-amber-400/70"
                  style={{ animation: `toolbar-pulse 1s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </span>
          ) : justAdded ? (
            <span className="flex items-center gap-3 text-[var(--lm-accent-text)]">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[8.5px] uppercase tracking-[0.5em]">Added</span>
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 12.5C5.27614 12.5 5.5 12.2761 5.5 12C5.5 11.7239 5.27614 11.5 5 11.5C4.72386 11.5 4.5 11.7239 4.5 12C4.5 12.2761 4.72386 12.5 5 12.5Z" stroke="currentColor" strokeWidth="1.1" />
                <path d="M10.5 12.5C10.7761 12.5 11 12.2761 11 12C11 11.7239 10.7761 11.5 10.5 11.5C10.2239 11.5 10 11.7239 10 12C10 12.2761 10.2239 12.5 10.5 12.5Z" stroke="currentColor" strokeWidth="1.1" />
                <path d="M1 1H2.5L3.8 8.3C3.88 8.72 4.25 9 4.68 9H10.3C10.73 9 11.09 8.73 11.18 8.31L12.5 3H3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              <span className="text-[8.5px] uppercase tracking-[0.5em]">
                {isOutOfStock ? "Unavailable" : "Add to collection"}
              </span>
            </span>
          )}
        </button>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          disabled={wishlistPending}
          aria-label="Save to wishlist"
          className={cn(
            "w-14 h-14 flex items-center justify-center border transition-all duration-400",
            wishlisted
              ? "border-[var(--lm-accent-border)]/40 bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)]"
              : "border-[var(--lm-border-default)] text-[var(--lm-text-muted)] hover:border-[var(--lm-border-strong)] hover:text-[var(--lm-text-primary)]"
          )}
        >
          <svg
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.2"
            className={cn("transition-transform duration-300", wishlisted && "scale-110")}
          >
            <path d="M8 13C8 13 1 8.5 1 4.5C1 2.567 2.567 1 4.5 1C5.74 1 6.83 1.66 7.5 2.66C8.17 1.66 9.26 1 10.5 1C12.433 1 14 2.567 14 4.5C14 8.5 8 13 8 13Z" />
          </svg>
        </button>
      </div>

      {/* ── Trust signals ── */}
      <div className="grid grid-cols-3 gap-4 py-5 border-t border-b border-[var(--lm-border-subtle)]">
        {[
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4L8 1L14 4V9C14 12 8 15 8 15C8 15 2 12 2 9V4Z" stroke="currentColor" strokeWidth="1" />
              </svg>
            ),
            label: "Secure\nPayment",
          },
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 5H11M15 11H5M11 1V5M5 11V15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <rect x="1" y="5" width="10" height="6" stroke="currentColor" strokeWidth="1" />
              </svg>
            ),
            label: "Free\nDelivery",
          },
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1ZM8 5V9L11 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            ),
            label: "14-Day\nReturns",
          },
        ].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <span className="text-[var(--lm-text-muted)]">{icon}</span>
            <span
              className="text-[7px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] whitespace-pre-line leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Installment note ── */}
      <div className="flex items-start gap-3">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-amber-400/40 mt-0.5 flex-shrink-0">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1" />
          <path d="M7 6V10M7 4V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <p
          className="text-[var(--lm-text-muted)] leading-relaxed"
          style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 300, letterSpacing: "0.03em" }}
        >
          Pay in easy installments via{" "}
          <span className="text-[var(--lm-text-muted)]">JazzCash</span> or{" "}
          <span className="text-[var(--lm-text-muted)]">Easypaisa</span>.
          Contact us for options.
        </p>
      </div>
    </div>
  );
}
