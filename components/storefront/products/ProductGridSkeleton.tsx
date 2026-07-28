// ─── Product Grid Skeleton ─────────────────────────────────────────────────────
// Premium shimmer skeleton matching the exact card layout — no generic rectangles.

interface ProductGridSkeletonProps {
  count?: number;
  view?: "grid" | "grid-dense" | "list";
}

function shimmer(
  w: number,
  h: number,
) {
  return `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="var(--lm-surface-secondary)" offset="20%" />
          <stop stop-color="var(--lm-border-subtle)" offset="50%" />
          <stop stop-color="var(--lm-surface-secondary)" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="var(--lm-surface-primary)" />
    </svg>`;
}

function CardSkeleton({ view = "grid" }: { view?: "grid" | "grid-dense" | "list" }) {
  if (view === "list") {
    return (
      <div className="flex items-center gap-8 py-6 border-b border-[var(--lm-border-subtle)]">
        {/* Thumb */}
        <div className="w-24 h-24 flex-shrink-0 bg-[var(--lm-surface-secondary)] relative overflow-hidden">
          <div className="skeleton-shimmer absolute inset-0" />
        </div>
        {/* Content */}
        <div className="flex-1 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="skeleton-shimmer h-2 w-20 rounded-none" />
            <div className="skeleton-shimmer h-5 w-48 rounded-none" />
          </div>
          <div className="skeleton-shimmer h-4 w-24 rounded-none" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Image */}
      <div
        className="relative overflow-hidden bg-[var(--lm-surface-secondary)] w-full"
        style={{ aspectRatio: view === "grid-dense" ? "3/4" : "4/5" }}
      >
        <div className="skeleton-shimmer absolute inset-0" />
      </div>

      {/* Info */}
      <div className="mt-5 space-y-3">
        <div className="skeleton-shimmer h-2 w-16 rounded-none" />
        <div className="skeleton-shimmer h-5 w-3/4 rounded-none" />
        <div className="skeleton-shimmer h-px w-8 rounded-none" />
        <div className="skeleton-shimmer h-3 w-20 rounded-none" />
      </div>
    </div>
  );
}

export default function ProductGridSkeleton({
  count = 9,
  view = "grid",
}: ProductGridSkeletonProps) {
  const items = Array.from({ length: count });

  if (view === "list") {
    return (
      <div className="flex flex-col">
        {items.map((_, i) => (
          <CardSkeleton key={i} view="list" />
        ))}
      </div>
    );
  }

  if (view === "grid-dense") {
    return (
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
      >
        {items.map((_, i) => (
          <CardSkeleton key={i} view="grid-dense" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((_, i) => (
        <div
          key={i}
          className={
            i % 3 === 1 ? "xl:mt-20" : i % 3 === 2 ? "xl:mt-10" : ""
          }
        >
          <CardSkeleton key={i} view="grid" />
        </div>
      ))}
    </div>
  );
}
