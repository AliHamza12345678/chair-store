"use client";

// ─── Apple-Level Checkout Step Wizard Indicator ─────────────────────────────
// Minimal luxury step navigation with hairline connectors, active glow states,
// and step number / checkmark icons.

import { cn } from "@/lib/clsx";

export type CheckoutStep = 1 | 2 | 3;

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
  onStepClick: (step: CheckoutStep) => void;
}

const STEPS = [
  { step: 1 as const, title: "Shipping", subtitle: "Address & Contact" },
  { step: 2 as const, title: "Delivery", subtitle: "Method & Options" },
  { step: 3 as const, title: "Payment", subtitle: "Review & Order" },
];

export default function CheckoutSteps({ currentStep, onStepClick }: CheckoutStepsProps) {
  return (
    <div className="py-6 border-b border-[var(--lm-border-default)] mb-12">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        
        {/* Hairline connector line */}
        <div className="absolute top-4 left-6 right-6 h-px bg-[var(--lm-surface-active)] -z-0" />
        <div
          className="absolute top-4 left-6 h-px bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-500 -z-0"
          style={{
            width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "calc(100% - 48px)",
          }}
        />

        {STEPS.map(({ step, title, subtitle }) => {
          const isCurrent = currentStep === step;
          const isCompleted = currentStep > step;

          return (
            <button
              key={step}
              onClick={() => isCompleted && onStepClick(step)}
              disabled={!isCompleted && !isCurrent}
              className="flex flex-col items-center group relative z-10 disabled:cursor-default"
            >
              {/* Circle badge */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono transition-all duration-400 border",
                  isCompleted
                    ? "bg-amber-400 border-[var(--lm-accent-border)] text-black font-bold"
                    : isCurrent
                    ? "bg-[var(--lm-surface-elevated)] border-[var(--lm-accent-border)] text-[var(--lm-accent-text)] shadow-[0_0_15px_rgba(212,175,80,0.3)]"
                    : "bg-[var(--lm-surface-elevated)] border-[var(--lm-border-strong)] text-[var(--lm-text-muted)]"
                )}
              >
                {isCompleted ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                ) : (
                  <span>0{step}</span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="mt-3 text-center">
                <span
                  className={cn(
                    "text-[8.5px] uppercase tracking-[0.35em] block transition-colors duration-300",
                    isCurrent ? "text-[var(--lm-text-primary)] font-medium" : isCompleted ? "text-[var(--lm-text-secondary)]" : "text-[var(--lm-text-muted)]"
                  )}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {title}
                </span>
                <span
                  className="text-[7.5px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)] hidden sm:block mt-0.5"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {subtitle}
                </span>
              </div>
            </button>
          );
        })}

      </div>
    </div>
  );
}
