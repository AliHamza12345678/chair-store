"use client";

// ─── Step 1: Shipping Address & Contact Form ──────────────────────────────────
// Minimal luxury inputs with gold focus rings, clear fields, and continue button.

import { useState } from "react";

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface CheckoutShippingFormProps {
  initialData: ShippingData;
  onNext: (data: ShippingData) => void;
}

export default function CheckoutShippingForm({ initialData, onNext }: CheckoutShippingFormProps) {
  const [formData, setFormData] = useState<ShippingData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
            Step 01
          </span>
          <h2
            className="text-[var(--lm-text-primary)] text-2xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Shipping &amp; Contact Information
          </h2>
        </div>
        <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] font-mono">
          Required *
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="e.g. Alexander"
            className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-3.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="e.g. Wright"
            className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-3.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="alexander@domain.com"
            className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-3.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+92 300 1234567"
            className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-3.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>

        {/* Address */}
        <div className="sm:col-span-2 space-y-2">
          <label
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Street Address *
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="House / Apartment / Suite, Street, Block"
            className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-3.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <label
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            City *
          </label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Lahore / Karachi / Islamabad"
            className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-3.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <label
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Postal / Zip Code *
          </label>
          <input
            type="text"
            name="zipCode"
            required
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="54000"
            className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-3.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6 border-t border-[var(--lm-border-default)] flex justify-end">
        <button
          type="submit"
          className="group flex items-center gap-3 border border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] px-8 py-4 text-[8.5px] uppercase tracking-[0.45em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] transition-all"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Continue to Delivery Options
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
