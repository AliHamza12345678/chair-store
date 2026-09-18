"use client";

// ─── Product Details Accordion ─────────────────────────────────────────────────
// Specs, Materials, Designer Notes, Shipping — each as a collapsible luxury panel
// with staggered entrance, animated height, and editorial typography.

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/clsx";

interface AccordionItem {
  id: string;
  label: string;
  eyebrow?: string;
  content: React.ReactNode;
}

function AccordionPanel({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <div
      className="border-b border-[var(--lm-border-subtle)] animate-in"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between py-6 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          {/* Index */}
          <span
            className="font-mono text-[8px] text-[var(--lm-text-muted)] tracking-[0.3em] w-8 text-right"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* Label */}
          <span
            className={cn(
              "transition-colors duration-300",
              isOpen ? "text-[var(--lm-text-primary)]" : "text-[var(--lm-text-secondary)] group-hover:text-[var(--lm-text-primary)]"
            )}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "1.1rem",
              letterSpacing: "0.025em",
            }}
          >
            {item.label}
          </span>
        </div>

        {/* Animated +/× icon */}
        <div
          className={cn(
            "relative w-5 h-5 flex-shrink-0 transition-all duration-400",
            isOpen ? "rotate-45" : ""
          )}
        >
          <span
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block w-full h-px transition-colors duration-300",
              isOpen ? "bg-amber-400/60" : "bg-white/20 group-hover:bg-white/40"
            )}
          />
          <span
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block w-px h-full transition-colors duration-300",
              isOpen ? "bg-amber-400/60" : "bg-white/20 group-hover:bg-white/40"
            )}
          />
        </div>
      </button>

      {/* Content with animated max-height */}
      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{ maxHeight: isOpen ? `${height + 48}px` : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <div ref={contentRef} className="pb-8 pl-12 pr-4">
          {item.content}
        </div>
      </div>
    </div>
  );
}

// ─── Spec row ──────────────────────────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[var(--lm-border-subtle)] gap-8">
      <span
        className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] flex-shrink-0"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {label}
      </span>
      <span
        className="text-[var(--lm-text-secondary)] text-right"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.8rem",
          fontWeight: 300,
          letterSpacing: "0.04em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Material pill ─────────────────────────────────────────────────────────────
function MaterialPill({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex flex-col gap-1.5 border border-[var(--lm-border-default)] p-4 hover:border-[var(--lm-border-strong)] transition-colors duration-300">
      <span
        className="text-[9px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)]/50"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {name}
      </span>
      <span
        className="text-[var(--lm-text-muted)]"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.75rem",
          fontWeight: 300,
          lineHeight: 1.6,
        }}
      >
        {desc}
      </span>
    </div>
  );
}

interface ProductDetailsAccordionProps {
  product: {
    description: string;
    price: number;
    inventory: number;
    options: { id: string; name: string; values: string[] }[];
    variants: { id: string; title: string; price: number | null; inventory: number }[];
  };
}

export default function ProductDetailsAccordion({ product }: ProductDetailsAccordionProps) {
  const [openId, setOpenId] = useState<string | null>("specs");

  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

  const items: AccordionItem[] = [
    {
      id: "specs",
      label: "Specifications",
      eyebrow: "Technical",
      content: (
        <div>
          <SpecRow label="Category" value="Premium Seating / Furniture" />
          <SpecRow label="SKU" value={product.variants[0]?.id?.slice(0, 10).toUpperCase() ?? "—"} />
          <SpecRow label="Base Price" value={`Rs ${Math.round(product.price).toLocaleString("en-PK")}`} />
          {product.variants.length > 0 && (
            <SpecRow
              label="Variants"
              value={product.variants.map(v => v.title).join(", ")}
            />
          )}
          <SpecRow
            label="Availability"
            value={product.inventory > 0 ? `In Stock (${product.inventory} units)` : "Out of Stock"}
          />
          {product.options.map(opt => (
            <SpecRow key={opt.id} label={opt.name} value={opt.values.join(", ")} />
          ))}
        </div>
      ),
    },
    {
      id: "materials",
      label: "Materials & Craftsmanship",
      eyebrow: "Composition",
      content: (
        <div className="flex flex-col gap-4">
          <p
            className="text-[var(--lm-text-muted)] leading-relaxed mb-4"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.8rem",
              fontWeight: 300,
              lineHeight: 1.9,
              letterSpacing: "0.04em",
            }}
          >
            Each piece is constructed with materials selected for longevity, comfort, and
            aesthetic integrity. We source only from certified suppliers committed to
            sustainable production practices.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MaterialPill
              name="Frame"
              desc="Kiln-dried solid hardwood, hand-mortised joinery. Rated to 180kg."
            />
            <MaterialPill
              name="Upholstery"
              desc="Grade-A Italian leather or premium bouclé, stitched by artisans."
            />
            <MaterialPill
              name="Foam Core"
              desc="High-resilience HR40 foam with memory topper. 10-year shape guarantee."
            />
            <MaterialPill
              name="Finish"
              desc="Hand-applied matte lacquer or oil-wax in 6 curated tones."
            />
          </div>
        </div>
      ),
    },
    {
      id: "designer",
      label: "Designer Notes",
      eyebrow: "Editorial",
      content: (
        <div className="flex flex-col gap-6">
          {/* Pull quote */}
          <blockquote className="relative pl-5">
            <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-amber-400/60 to-transparent" />
            <p
              className="text-[var(--lm-text-secondary)] italic leading-relaxed"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "1.2rem",
                letterSpacing: "0.02em",
              }}
            >
              "This piece was born from studying the proportional language of mid-century
              Scandinavian design — where restraint is itself the decoration."
            </p>
            <footer className="mt-4 text-[8px] uppercase tracking-[0.45em] text-[var(--lm-text-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
              — Lumina Design Studio
            </footer>
          </blockquote>

          <p
            className="text-[var(--lm-text-muted)] leading-relaxed"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.78rem",
              fontWeight: 300,
              lineHeight: 1.9,
              letterSpacing: "0.04em",
            }}
          >
            {product.description}
          </p>
        </div>
      ),
    },
    {
      id: "shipping",
      label: "Delivery & Returns",
      eyebrow: "Logistics",
      content: (
        <div className="flex flex-col gap-4">
          {[
            { heading: "Standard Delivery", body: "4–7 business days to major cities. Free on orders above Rs 50,000." },
            { heading: "White-Glove Delivery", body: "Available in Karachi, Lahore, and Islamabad. Our team delivers, unpacks, and positions your piece." },
            { heading: "Returns Policy", body: "14-day hassle-free returns on all in-stock items. Custom orders are final sale. Items must be unused and in original packaging." },
            { heading: "Installments", body: "0% financing available via JazzCash and Easypaisa. Contact our concierge team for eligibility." },
          ].map(({ heading, body }) => (
            <div key={heading} className="flex flex-col gap-1.5">
              <p
                className="text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {heading}
              </p>
              <p
                className="text-[var(--lm-text-muted)]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.78rem",
                  fontWeight: 300,
                  lineHeight: 1.8,
                  letterSpacing: "0.03em",
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col border-t border-[var(--lm-border-subtle)]">
      {items.map((item, i) => (
        <AccordionPanel
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => toggle(item.id)}
          index={i}
        />
      ))}
    </div>
  );
}
