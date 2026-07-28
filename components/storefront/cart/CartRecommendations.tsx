"use client";

// ─── In-Cart Recommendations ("Complete the Room") ─────────────────────────────
// Cross-sell recommendations to complement items in cart with 1-click add.

import { formatCurrency } from "@/lib/format-currency";
import { useCartStore } from "@/features/cart/store";
import { toast } from "sonner";

const SAMPLE_RECOMMENDATIONS = [
  {
    id: "rec-1",
    productId: "rec-prod-1",
    name: "Aura Brass Floor Lamp",
    price: 34500,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    category: "Lighting",
  },
  {
    id: "rec-2",
    productId: "rec-prod-2",
    name: "Vogue Velvet Throw Cushion",
    price: 12500,
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&q=80",
    category: "Accessories",
  },
];

export default function CartRecommendations() {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddRec = (item: typeof SAMPLE_RECOMMENDATIONS[0]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
    });
    toast.success(`Added ${item.name} to cart`);
  };

  return (
    <div className="pt-6 border-t border-[var(--lm-border-subtle)]">
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[8px] uppercase tracking-[0.45em] text-[var(--lm-text-muted)]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Complete The Room
        </span>
        <span className="text-[7.5px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)] font-mono">
          Curated
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {SAMPLE_RECOMMENDATIONS.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] hover:border-[var(--lm-border-default)] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 bg-[var(--lm-surface-elevated)] overflow-hidden flex-shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h5
                  className="text-[var(--lm-text-primary)] text-xs truncate"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "0.95rem",
                  }}
                >
                  {item.name}
                </h5>
                <span
                  className="text-[8px] text-[var(--lm-text-muted)] tabular-nums block"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {formatCurrency(item.price)}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleAddRec(item)}
              className="px-3 py-1.5 border border-[var(--lm-border-default)] text-[7.5px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-accent-border)] hover:bg-[var(--lm-accent-muted)] transition-all flex-shrink-0"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
