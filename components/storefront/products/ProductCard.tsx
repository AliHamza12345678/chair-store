"use client";

// ─── Premium Product Card ──────────────────────────────────────────────────────
// World-class ecommerce card with:
//   • Magnetic-tilt hover transform (subtle 3D perspective)
//   • Image pan on hover (reveal second image)
//   • Ambient glow on hover
//   • Wishlist overlay with animated heart
//   • Quick-view shimmer CTA
//   • Category, material, and index badge
//   • Animated price reveal
//   • List-view variant

import { useState } from "react";
import Link from "next/link";
import { toggleWishlist } from "@/features/wishlist/actions";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/clsx";

export interface ProductCardProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  category: { name: string; slug: string };
  isFeatured?: boolean;
  isNew?: boolean;
  index?: number;
}

interface ProductCardProps {
  product: ProductCardProduct;
  wishlisted?: boolean;
  view?: "grid" | "grid-dense" | "list";
  priority?: boolean;
}

// ── Wishlist heart button ──────────────────────────────────────────────────────
function WishlistHeart({
  productId,
  wishlisted: initialWishlisted,
}: {
  productId: string;
  wishlisted: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, setIsPending] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;
    setIsPending(true);
    const res = await toggleWishlist(productId);
    setIsPending(false);
    if (res.success) {
      setWishlisted(res.wishlisted);
      if (res.wishlisted) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 800);
      }
      toast.success(res.wishlisted ? "Saved to wishlist" : "Removed from wishlist");
    } else {
      toast.error("Sign in to save pieces.");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label="Toggle wishlist"
      className={cn(
        "relative flex items-center justify-center w-9 h-9 border transition-all duration-300",
        wishlisted
          ? "border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)]"
          : "border-[var(--lm-border-default)] bg-[var(--lm-surface-primary)]/30 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-strong)]"
      )}
      style={{ backdropFilter: "blur(8px)", borderRadius: "1px" }}
    >
      {/* Ripple on add */}
      {justAdded && (
        <span
          className="absolute inset-0 rounded-sm border border-[var(--lm-accent-border)] animate-ping"
          style={{ animationDuration: "600ms", animationIterationCount: "1" }}
        />
      )}

      <svg
        width="14"
        height="12"
        viewBox="0 0 14 12"
        fill={wishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.3"
        className={cn("transition-all duration-300", isPending && "opacity-40")}
      >
        <path d="M7 11C7 11 1 7 1 3.5C1 2.1 2.1 1 3.5 1C4.5 1 5.4 1.6 6 2.3C6 2.3 6.5 1 7 1C7.5 1 8 2.3 8 2.3C8.6 1.6 9.5 1 10.5 1C11.9 1 13 2.1 13 3.5C13 7 7 11 7 11Z" />
      </svg>
    </button>
  );
}

// ── Main card (grid view) ──────────────────────────────────────────────────────
export default function ProductCard({
  product,
  wishlisted = false,
  view = "grid",
  priority = false,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const secondImage = product.images[1] || product.images[0];
  const discountPct = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  // ── List view ──────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex items-center gap-8 py-6 border-b border-[var(--lm-border-subtle)] hover:border-[var(--lm-border-strong)] transition-all duration-500"
      >
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-[var(--lm-surface-secondary)]">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: "saturate(0.8)" }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--lm-text-muted)]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" opacity="0.5" />
                <path d="M3 13L7 9L10 12L13 9L17 13" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>
          )}
          {/* Hover glow */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
            style={{ boxShadow: "inset 0 0 30px rgba(180,140,60,0.08)" }} />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <p className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] mb-1" style={{ fontFamily: "var(--font-inter)" }}>
              {product.category.name}
            </p>
            <h3
              className="text-[var(--lm-text-primary)] group-hover:text-[var(--lm-text-primary)] transition-colors duration-300 truncate"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "1.25rem",
                letterSpacing: "0.02em",
              }}
            >
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            {/* Badges */}
            <div className="flex gap-2">
              {product.isNew && (
                <span className="text-[7px] uppercase tracking-[0.3em] text-[var(--lm-accent-text)]/70 border border-[var(--lm-accent-border)]/50 px-2 py-0.5" style={{ fontFamily: "var(--font-inter)" }}>New</span>
              )}
              {product.isFeatured && (
                <span className="text-[7px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] border border-[var(--lm-border-default)] px-2 py-0.5" style={{ fontFamily: "var(--font-inter)" }}>Featured</span>
              )}
            </div>

            {/* Price */}
            <div className="text-right">
              <p
                className="text-[var(--lm-text-primary)] tabular-nums"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.85rem",
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                }}
              >
                {formatCurrency(product.price)}
              </p>
              {product.compareAtPrice && (
                <p className="text-[var(--lm-text-muted)] text-xs line-through tabular-nums" style={{ fontFamily: "var(--font-inter)" }}>
                  {formatCurrency(product.compareAtPrice)}
                </p>
              )}
            </div>

            {/* Arrow */}
            <div className="text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ── Grid view (standard + dense) ───────────────────────────────────────────
  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: hovered
          ? `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateZ(4px)`
          : "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)",
        transition: hovered
          ? "transform 0.12s ease-out"
          : "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
        willChange: "transform",
      }}
    >
      {/* ── Ambient glow aura ── */}
      <div
        className="absolute -inset-4 pointer-events-none transition-opacity duration-700 rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(180,140,60,0.06) 0%, transparent 70%)",
          opacity: hovered ? 1 : 0,
          filter: "blur(20px)",
        }}
        aria-hidden="true"
      />

      <Link href={`/products/${product.slug}`} className="block relative">

        {/* ─────── Image Container ─────── */}
        <div
          className="relative overflow-hidden bg-[var(--lm-surface-secondary)]"
          style={{ aspectRatio: view === "grid-dense" ? "3/4" : "4/5" }}
        >

          {/* Primary image */}
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-all duration-[1000ms] ease-out",
                hovered && secondImage !== product.images[0]
                  ? "opacity-0 scale-[1.04]"
                  : "opacity-100 scale-100",
              )}
              style={{ filter: "saturate(0.75)" }}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--lm-text-muted)]">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
                <path d="M4 22L11 15L16 20L21 14L28 22" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>
          )}

          {/* Secondary image (hover reveal) */}
          {secondImage && secondImage !== product.images[0] && (
            <img
              src={secondImage}
              alt={`${product.name} — detail`}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-all duration-[1000ms] ease-out",
                hovered ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]",
              )}
              style={{ filter: "saturate(0.75)" }}
              loading="lazy"
            />
          )}

          {/* ── Gradient overlays ── */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--lm-surface-primary)]/80 via-[var(--lm-surface-primary)]/20 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-75" />
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              background: "linear-gradient(to bottom right, rgba(180,140,60,0.04) 0%, transparent 50%)",
              opacity: hovered ? 1 : 0,
            }}
          />

          {/* ── Top left: index / featured badge ── */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {typeof product.index === "number" && (
              <span
                className="text-[8px] font-mono tracking-[0.35em] text-[var(--lm-text-primary)]/15 group-hover:text-[var(--lm-accent-text)]/40 transition-colors duration-500"
              >
                {String(product.index + 1).padStart(2, "0")}
              </span>
            )}
          </div>

          {/* ── Top right: badges ── */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10">
            {product.isNew && (
              <span
                className="text-[7px] uppercase tracking-[0.35em] text-[var(--lm-accent-text)]/80 bg-[var(--lm-surface-primary)]/60 px-2 py-0.5 border border-[var(--lm-accent-border)]"
                style={{ fontFamily: "var(--font-inter)", backdropFilter: "blur(6px)" }}
              >
                New
              </span>
            )}
            {discountPct && (
              <span
                className="text-[7px] uppercase tracking-[0.25em] text-[var(--lm-text-secondary)] bg-[var(--lm-surface-primary)]/60 px-2 py-0.5 border border-[var(--lm-border-default)]"
                style={{ fontFamily: "var(--font-inter)", backdropFilter: "blur(6px)" }}
              >
                −{discountPct}%
              </span>
            )}
          </div>

          {/* ── Bottom overlay: wishlist + quick-view ── */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between z-10 transition-all duration-500"
            style={{
              transform: hovered ? "translateY(0)" : "translateY(8px)",
              opacity: hovered ? 1 : 0,
            }}
          >
            {/* Quick view CTA */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 border border-[var(--lm-border-strong)] text-[7.5px] uppercase tracking-[0.35em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-default)] transition-all duration-300"
              style={{ fontFamily: "var(--font-inter)", backdropFilter: "blur(10px)", background: "rgba(0,0,0,0.4)" }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1 8L8 1M8 1H3M8 1V6" stroke="currentColor" strokeWidth="1.1" />
              </svg>
              View
            </div>

            {/* Wishlist */}
            <WishlistHeart productId={product.id} wishlisted={wishlisted} />
          </div>

          {/* ── Inset border glow on hover ── */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-700"
            style={{
              boxShadow: hovered ? "inset 0 0 0 1px rgba(180,140,60,0.15)" : "inset 0 0 0 1px rgba(255,255,255,0)",
            }}
          />
        </div>

        {/* ─────── Product Info ─────── */}
        <div className={cn("mt-5 space-y-2.5", view === "grid-dense" && "mt-3 space-y-1.5")}>

          {/* Category label */}
          <p
            className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {product.category.name}
          </p>

          {/* Name */}
          <h3
            className={cn(
              "text-[var(--lm-text-primary)] transition-colors duration-300 group-hover:text-[var(--lm-text-primary)] leading-tight",
              view === "grid-dense" ? "text-base" : "text-[1.15rem]",
            )}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              letterSpacing: "0.02em",
            }}
          >
            {product.name}
          </h3>

          {/* Animated accent rule */}
          <div
            className="h-px bg-[var(--lm-accent-primary)]/35 transition-all duration-600 ease-out"
            style={{ width: hovered ? "3.5rem" : "2rem" }}
          />

          {/* Price row */}
          <div className="flex items-baseline gap-3 pt-0.5">
            <p
              className="text-[var(--lm-text-secondary)] group-hover:text-[var(--lm-text-primary)] transition-colors duration-300 tabular-nums"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: view === "grid-dense" ? "0.75rem" : "0.82rem",
                letterSpacing: "0.1em",
                fontWeight: 400,
              }}
            >
              {formatCurrency(product.price)}
            </p>

            {product.compareAtPrice && (
              <p
                className="text-[var(--lm-text-muted)] line-through tabular-nums text-xs"
                style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.06em" }}
              >
                {formatCurrency(product.compareAtPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
