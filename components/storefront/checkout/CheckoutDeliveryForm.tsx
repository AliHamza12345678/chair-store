"use client";

// ─── Step 2: Delivery Method & Options ─────────────────────────────────────────
// Delivery method selector (Standard Delivery vs White-Glove Concierge),
// delivery instructions, and back/continue actions.

import { useState } from "react";
import { cn } from "@/lib/clsx";

export interface DeliveryData {
  method: "STANDARD" | "WHITE_GLOVE";
  instructions?: string;
  isGift?: boolean;
  giftNote?: string;
}

interface CheckoutDeliveryFormProps {
  initialData: DeliveryData;
  onNext: (data: DeliveryData) => void;
  onBack: () => void;
}

export default function CheckoutDeliveryForm({
  initialData,
  onNext,
  onBack,
}: CheckoutDeliveryFormProps) {
  const [formData, setFormData] = useState<DeliveryData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--lm-border-default)]">
        <div>
          <span
            className="text-[8.5px] uppercase tracking-[0.5em] text-[var(--lm-accent-text)]/70 block mb-1"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Step 02
          </span>
          <h2
            className="text-[var(--lm-text-primary)] text-2xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Delivery Concierge &amp; Method
          </h2>
        </div>
      </div>

      {/* Delivery Method Selector */}
      <div className="space-y-4">
        <label
          className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] block"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Select Delivery Service *
        </label>

        <div className="grid grid-cols-1 gap-4">
          
          {/* Standard Delivery */}
          <div
            onClick={() => setFormData((prev) => ({ ...prev, method: "STANDARD" }))}
            className={cn(
              "p-5 border cursor-pointer transition-all duration-300 relative flex items-start justify-between gap-4",
              formData.method === "STANDARD"
                ? "border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] text-[var(--lm-text-primary)]"
                : "border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-strong)]"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0",
                  formData.method === "STANDARD" ? "border-[var(--lm-accent-border)]" : "border-[var(--lm-border-strong)]"
                )}
              >
                {formData.method === "STANDARD" && (
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </div>

              <div>
                <span
                  className="text-[var(--lm-text-primary)] text-sm font-medium block mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Standard Atelier Express
                </span>
                <p
                  className="text-[var(--lm-text-muted)] text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  4–7 business days. Protective wooden crate packaging, threshold placement.
                </p>
              </div>
            </div>

            <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-accent-text)] font-mono flex-shrink-0">
              Rs 50 (Complimentary over Rs 50k)
            </span>
          </div>

          {/* White-Glove Installation */}
          <div
            onClick={() => setFormData((prev) => ({ ...prev, method: "WHITE_GLOVE" }))}
            className={cn(
              "p-5 border cursor-pointer transition-all duration-300 relative flex items-start justify-between gap-4",
              formData.method === "WHITE_GLOVE"
                ? "border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] text-[var(--lm-text-primary)]"
                : "border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-strong)]"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0",
                  formData.method === "WHITE_GLOVE" ? "border-[var(--lm-accent-border)]" : "border-[var(--lm-border-strong)]"
                )}
              >
                {formData.method === "WHITE_GLOVE" && (
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </div>

              <div>
                <span
                  className="text-[var(--lm-text-primary)] text-sm font-medium block mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  White-Glove Installation &amp; Positioning
                </span>
                <p
                  className="text-[var(--lm-text-muted)] text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Scheduled appointment, two-person delivery team, room placement, full unboxing &amp; packaging removal.
                </p>
              </div>
            </div>

            <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] font-mono flex-shrink-0">
              + Rs 2,500
            </span>
          </div>

        </div>
      </div>

      {/* Special Delivery Instructions */}
      <div className="space-y-2">
        <label
          className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] block"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Special Delivery Instructions (Optional)
        </label>
        <textarea
          rows={3}
          value={formData.instructions || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
          placeholder="e.g. Gate code, call 30 mins before arrival, elevator instructions..."
          className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-3.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-[var(--lm-border-default)] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ← Back to Shipping
        </button>

        <button
          type="submit"
          className="group flex items-center gap-3 border border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] px-8 py-4 text-[8.5px] uppercase tracking-[0.45em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] transition-all"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Continue to Payment &amp; Review
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M1 5H9M9 5L5 1M9 5L5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </form>
  );
}
