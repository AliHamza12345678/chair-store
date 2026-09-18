"use client";

// ─── Step 3: Payment Method & Order Review ─────────────────────────────────────
// Luxury payment tab selector (COD, JazzCash/Easypaisa Installments, Credit Card)
// with monthly breakdown calculations and final submission CTA.

import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/clsx";

export interface PaymentData {
  method: "COD" | "INSTALLMENT" | "CARD";
  installmentMonths: 3 | 6 | 12;
}

interface CheckoutPaymentFormProps {
  initialData: PaymentData;
  totalAmount: number;
  isProcessing: boolean;
  onUpdatePayment: (data: PaymentData) => void;
  onBack: () => void;
}

export default function CheckoutPaymentForm({
  initialData,
  totalAmount,
  isProcessing,
  onUpdatePayment,
  onBack,
}: CheckoutPaymentFormProps) {
  const handleMethodChange = (method: PaymentData["method"]) => {
    onUpdatePayment({ ...initialData, method });
  };

  const handleMonthsChange = (installmentMonths: 3 | 6 | 12) => {
    onUpdatePayment({ ...initialData, installmentMonths });
  };

  const monthlyAmount = totalAmount / initialData.installmentMonths;

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--lm-border-default)]">
        <div>
          <span
            className="text-[8.5px] uppercase tracking-[0.5em] text-[var(--lm-accent-text)]/70 block mb-1"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Step 03
          </span>
          <h2
            className="text-[var(--lm-text-primary)] text-2xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Payment Method &amp; Order Authorization
          </h2>
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-4">
        
        {/* 1. Cash on Delivery (COD) */}
        <div
          onClick={() => handleMethodChange("COD")}
          className={cn(
            "p-5 border cursor-pointer transition-all duration-300 relative flex items-start justify-between gap-4",
            initialData.method === "COD"
              ? "border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] text-[var(--lm-text-primary)]"
              : "border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-strong)]"
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0",
                initialData.method === "COD" ? "border-[var(--lm-accent-border)]" : "border-[var(--lm-border-strong)]"
              )}
            >
              {initialData.method === "COD" && (
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </div>

            <div>
              <span
                className="text-[var(--lm-text-primary)] text-sm font-medium block mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Cash on Delivery (COD)
              </span>
              <p
                className="text-[var(--lm-text-muted)] text-xs leading-relaxed"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Pay in cash or bank transfer upon physical inspection &amp; delivery at your address.
              </p>
            </div>
          </div>

          <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] font-mono flex-shrink-0">
            Standard
          </span>
        </div>

        {/* 2. Installments via JazzCash / Easypaisa */}
        <div
          onClick={() => handleMethodChange("INSTALLMENT")}
          className={cn(
            "p-5 border cursor-pointer transition-all duration-300 relative flex flex-col gap-4",
            initialData.method === "INSTALLMENT"
              ? "border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] text-[var(--lm-text-primary)]"
              : "border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-strong)]"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0",
                  initialData.method === "INSTALLMENT" ? "border-[var(--lm-accent-border)]" : "border-[var(--lm-border-strong)]"
                )}
              >
                {initialData.method === "INSTALLMENT" && (
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </div>

              <div>
                <span
                  className="text-[var(--lm-text-primary)] text-sm font-medium block mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Pay in Installments (JazzCash / Easypaisa)
                </span>
                <p
                  className="text-[var(--lm-text-muted)] text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Split total into 3, 6, or 12 low monthly payments. Order ships on 1st installment.
                </p>
              </div>
            </div>

            <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-accent-text)] font-mono flex-shrink-0">
              0% Interest
            </span>
          </div>

          {/* Month selector breakdown */}
          {initialData.method === "INSTALLMENT" && (
            <div className="pt-4 border-t border-[var(--lm-border-default)] ml-8 space-y-4">
              <span
                className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] block"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Select Installment Plan *
              </span>

              <div className="flex gap-3">
                {([3, 6, 12] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMonthsChange(m);
                    }}
                    className={cn(
                      "flex-1 py-3 px-3 text-[8.5px] uppercase tracking-[0.3em] border transition-all text-center",
                      initialData.installmentMonths === m
                        ? "border-[var(--lm-accent-border)]/80 bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)] font-medium"
                        : "border-[var(--lm-border-strong)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-strong)]"
                    )}
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {m} Months
                  </button>
                ))}
              </div>

              <div className="p-3 bg-black/40 border border-[var(--lm-border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[var(--lm-text-muted)]" style={{ fontFamily: "var(--font-inter)", fontSize: "7.5px" }}>
                  Monthly Payment:
                </span>
                <span className="text-[var(--lm-accent-text)] font-mono tabular-nums">
                  {formatCurrency(monthlyAmount)} / mo
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Credit / Debit Card (Stripe / Visa / MasterCard) */}
        <div
          onClick={() => handleMethodChange("CARD")}
          className={cn(
            "p-5 border cursor-pointer transition-all duration-300 relative flex items-start justify-between gap-4 opacity-70 hover:opacity-100",
            initialData.method === "CARD"
              ? "border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] text-[var(--lm-text-primary)] opacity-100"
              : "border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-strong)]"
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0",
                initialData.method === "CARD" ? "border-[var(--lm-accent-border)]" : "border-[var(--lm-border-strong)]"
              )}
            >
              {initialData.method === "CARD" && (
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </div>

            <div>
              <span
                className="text-[var(--lm-text-primary)] text-sm font-medium block mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Credit / Debit Card (Visa, MasterCard, Amex)
              </span>
              <p
                className="text-[var(--lm-text-muted)] text-xs leading-relaxed"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Encrypted 256-bit SSL transaction processed directly via Stripe gateway.
              </p>
            </div>
          </div>

          <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] font-mono flex-shrink-0">
            Instant
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-[var(--lm-border-default)] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ← Back to Delivery
        </button>

        <button
          type="submit"
          form="checkout-form"
          disabled={isProcessing}
          className="group flex items-center gap-3 border border-[var(--lm-accent-border)]/80 bg-[var(--lm-accent-muted)] px-9 py-4 text-[9px] uppercase tracking-[0.45em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] transition-all disabled:opacity-40"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {isProcessing ? "Authorizing Order..." : "Authorize & Place Order"}
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
    </div>
  );
}
