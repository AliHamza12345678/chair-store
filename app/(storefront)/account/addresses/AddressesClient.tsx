"use client";

// ─── Luxury Saved Addresses Client ───────────────────────────────────────────
// Manage white-glove delivery residences with custom dark luxury modal,
// gold default indicators, and address CRUD actions.

import { useState } from "react";
import { Address } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormValues } from "@/features/addresses/validations";
import { createAddress, deleteAddress, updateAddress } from "@/features/addresses/actions";
import { toast } from "sonner";
import { cn } from "@/lib/clsx";

export function AddressesClient({ addresses }: { addresses: Address[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", province: "", postalCode: "", isDefault: false },
  });

  const handleOpenNew = () => {
    setEditingId(null);
    reset({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", province: "", postalCode: "", isDefault: addresses.length === 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingId(addr.id);
    reset({
      fullName: addr.fullName, phone: addr.phone, addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 ?? "", city: addr.city, province: addr.province ?? "",
      postalCode: addr.postalCode ?? "", isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteAddress(id);
    setDeletingId(null);
    if (res.success) toast.success("Delivery residence deleted");
    else toast.error(res.error);
  };

  const onSubmit = async (data: AddressFormValues) => {
    const res = editingId ? await updateAddress(editingId, data) : await createAddress(data);
    if (res.success) {
      toast.success(editingId ? "Address updated successfully" : "New residence added");
      setIsModalOpen(false);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-8 animate-in">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[var(--lm-border-default)] gap-4">
        <div>
          <span
            className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)]/80 block mb-2 font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Destinations &amp; Residences
          </span>
          <h1
            className="text-[var(--lm-text-primary)] text-3xl sm:text-4xl font-light tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Saved Delivery Addresses
          </h1>
          <p
            className="text-[var(--lm-text-secondary)] text-xs mt-2 font-light max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Maintain your preferred residential addresses for white-glove interior assembly and freight delivery.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-6 py-3.5 border border-[var(--lm-accent-border)]/50 bg-[var(--lm-accent-muted)] text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] transition-all font-mono whitespace-nowrap self-start sm:self-auto"
        >
          + Add New Residence
        </button>
      </div>

      {/* ── Address Cards Grid ── */}
      {addresses.length === 0 ? (
        <div className="p-16 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] text-center max-w-md mx-auto my-8 space-y-4">
          <span className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)]/70 block font-mono">
            No Residences Saved
          </span>
          <h3
            className="text-[var(--lm-text-primary)] text-2xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Your address book is empty
          </h3>
          <p className="text-[var(--lm-text-secondary)] text-xs leading-relaxed font-light">
            Add a primary shipping address to streamline your atelier orders and checkout process.
          </p>
          <button
            onClick={handleOpenNew}
            className="px-6 py-3 border border-[var(--lm-accent-border)]/40 bg-[var(--lm-accent-muted)] text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] font-mono"
          >
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={cn(
                "relative p-6 bg-[var(--lm-surface-secondary)] border transition-all duration-300 flex flex-col justify-between space-y-6 group",
                addr.isDefault
                  ? "border-[var(--lm-accent-border)]/40 shadow-[0_0_25px_rgba(212,175,80,0.08)]"
                  : "border-[var(--lm-border-default)] hover:border-white/[0.2]"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--lm-text-primary)] text-xl font-light tracking-wide" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {addr.fullName}
                  </span>
                  {addr.isDefault && (
                    <span className="px-2.5 py-0.5 text-[7.5px] uppercase tracking-[0.35em] bg-amber-400/15 border border-[var(--lm-accent-border)]/40 text-[var(--lm-accent-text)] font-mono">
                      ★ Primary Residence
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs text-[var(--lm-text-secondary)] font-light leading-relaxed">
                  <p className="text-[var(--lm-text-primary)]">{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>
                    {addr.city}{addr.province ? `, ${addr.province}` : ""} {addr.postalCode || ""}
                  </p>
                  <p className="text-[var(--lm-text-muted)] font-mono text-[10px] tracking-wider pt-1">
                    Phone: {addr.phone}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[var(--lm-border-subtle)] flex items-center justify-between text-[8px] uppercase tracking-[0.3em] font-mono">
                <span className="text-[var(--lm-text-muted)]">
                  {addr.country || "Pakistan"}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="text-[var(--lm-text-secondary)] hover:text-[var(--lm-accent-text)] transition-colors"
                  >
                    Edit
                  </button>
                  <span className="text-[var(--lm-text-muted)]">•</span>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    disabled={deletingId === addr.id}
                    className="text-[var(--lm-text-muted)] hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {deletingId === addr.id ? "Deleting..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Address Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[var(--lm-surface-elevated)] border border-[var(--lm-accent-border)] w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
            
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] flex items-center justify-center text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] transition-colors"
            >
              ✕
            </button>

            <div>
              <span className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)] font-mono block mb-1">
                {editingId ? "Modify Residence" : "Register Residence"}
              </span>
              <h2
                className="text-[var(--lm-text-primary)] text-2xl font-light tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {editingId ? "Edit Delivery Address" : "Add New Delivery Residence"}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  placeholder="Recipient full name"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
                />
                {errors.fullName && <p className="text-[9px] text-red-400 mt-1 font-mono">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
                  Contact Phone Number
                </label>
                <input
                  {...register("phone")}
                  placeholder="+92 300 1234567"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
                />
                {errors.phone && <p className="text-[9px] text-red-400 mt-1 font-mono">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
                  Street Address Line 1
                </label>
                <input
                  {...register("addressLine1")}
                  placeholder="House #, Street name, Area"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
                />
                {errors.addressLine1 && <p className="text-[9px] text-red-400 mt-1 font-mono">{errors.addressLine1.message}</p>}
              </div>

              <div>
                <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
                  Address Line 2 (Optional)
                </label>
                <input
                  {...register("addressLine2")}
                  placeholder="Apartment, suite, unit, building floor"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
                    City
                  </label>
                  <input
                    {...register("city")}
                    placeholder="Lahore, Karachi, etc."
                    disabled={isSubmitting}
                    className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
                  />
                  {errors.city && <p className="text-[9px] text-red-400 mt-1 font-mono">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
                    Province / Region
                  </label>
                  <input
                    {...register("province")}
                    placeholder="Punjab, Sindh, etc."
                    disabled={isSubmitting}
                    className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
                  Postal Code
                </label>
                <input
                  {...register("postalCode")}
                  placeholder="54000"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  {...register("isDefault")}
                  className="h-4 w-4 rounded border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] text-[var(--lm-accent-primary)] focus:ring-[var(--lm-accent-primary)]"
                />
                <label htmlFor="isDefault" className="text-xs text-[var(--lm-text-secondary)] font-mono">
                  Set as primary white-glove delivery residence
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[var(--lm-border-strong)] text-[8.5px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)]/50 text-[var(--lm-accent-text)] text-[8.5px] uppercase tracking-[0.3em] font-mono hover:bg-amber-400/30 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Save Residence Changes" : "Register Residence"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

