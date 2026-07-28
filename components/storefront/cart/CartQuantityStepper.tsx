"use client";

// ─── Luxury Cart Quantity Stepper ──────────────────────────────────────────────
// Elegant quantity control with monospaced numbers, micro-animated buttons,
// and trash removal action.

import { cn } from "@/lib/clsx";

interface CartQuantityStepperProps {
  quantity: number;
  onUpdate: (newQty: number) => void;
  onRemove: () => void;
  size?: "sm" | "md";
}

export default function CartQuantityStepper({
  quantity,
  onUpdate,
  onRemove,
  size = "sm",
}: CartQuantityStepperProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-[var(--lm-border-default)] divide-x divide-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)]">
        <button
          onClick={() => onUpdate(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className={cn(
            "flex items-center justify-center text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors duration-200 disabled:opacity-20",
            size === "sm" ? "w-7 h-7" : "w-9 h-9"
          )}
          aria-label="Decrease quantity"
        >
          <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
            <path d="M1 1H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>

        <span
          className={cn(
            "flex items-center justify-center text-[var(--lm-text-primary)] font-mono tabular-nums",
            size === "sm" ? "w-8 h-7 text-xs" : "w-10 h-9 text-sm"
          )}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {String(quantity).padStart(2, "0")}
        </span>

        <button
          onClick={() => onUpdate(quantity + 1)}
          className={cn(
            "flex items-center justify-center text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors duration-200",
            size === "sm" ? "w-7 h-7" : "w-9 h-9"
          )}
          aria-label="Increase quantity"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M4 1V7M1 4H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <button
        onClick={onRemove}
        className="p-1.5 text-[var(--lm-text-muted)] hover:text-red-400/90 transition-colors duration-300 group"
        aria-label="Remove item"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          className="transition-transform duration-300 group-hover:scale-110"
        >
          <path
            d="M2 3.5H11M4.5 3.5V2.5C4.5 1.94772 4.94772 1.5 5.5 1.5H7.5C8.05228 1.5 8.5 1.94772 8.5 2.5V3.5M5.5 6V9.5M7.5 6V9.5M3 3.5L3.5 10.5C3.5 11.0523 3.94772 11.5 4.5 11.5H8.5C9.05228 11.5 9.5 11.0523 9.5 10.5L10 3.5"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
