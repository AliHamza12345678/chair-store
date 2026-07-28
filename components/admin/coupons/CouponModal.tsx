"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { X, Ticket, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { couponSchema, CouponFormValues } from "@/features/coupons/validations"
import { createCoupon, updateCoupon } from "@/features/coupons/actions"
import { toast } from "sonner"

interface CouponModalProps {
  isOpen: boolean
  onClose: () => void
  editingCoupon: any | null
}

export function CouponModal({ isOpen, onClose, editingCoupon }: CouponModalProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      type: "PERCENTAGE",
      value: 10,
      isActive: true,
    },
  })

  useEffect(() => {
    if (editingCoupon) {
      reset({
        code: editingCoupon.code,
        description: editingCoupon.description ?? "",
        type: editingCoupon.type,
        value: editingCoupon.value,
        minOrderValue: editingCoupon.minOrderValue ?? undefined,
        maxDiscount: editingCoupon.maxDiscount ?? undefined,
        usageLimit: editingCoupon.usageLimit ?? undefined,
        isActive: editingCoupon.isActive,
        startsAt: editingCoupon.startsAt ? new Date(editingCoupon.startsAt).toISOString().slice(0, 10) : undefined,
        expiresAt: editingCoupon.expiresAt ? new Date(editingCoupon.expiresAt).toISOString().slice(0, 10) : undefined,
      })
    } else {
      reset({
        code: "",
        description: "",
        type: "PERCENTAGE",
        value: 10,
        isActive: true,
        minOrderValue: undefined,
        maxDiscount: undefined,
        usageLimit: undefined,
        startsAt: undefined,
        expiresAt: undefined,
      })
    }
  }, [editingCoupon, reset])

  if (!isOpen) return null

  const handleGenerateCode = () => {
    const prefixes = ["LUMINA", "LUXURY", "SUMMER", "VIP", "SAVE", "PROMO"]
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const randomNum = Math.floor(10 + Math.random() * 90)
    const code = `${randomPrefix}${randomNum}`
    setValue("code", code)
  }

  const onSubmit = async (data: CouponFormValues) => {
    const t = toast.loading(editingCoupon ? "Updating promo coupon..." : "Creating promo coupon...")
    try {
      const res = editingCoupon ? await updateCoupon(editingCoupon.id, data) : await createCoupon(data)
      if (res.success) {
        toast.success(editingCoupon ? "Coupon updated successfully" : "New coupon created successfully", { id: t })
        onClose()
      } else {
        toast.error(res.error || "Failed to save coupon", { id: t })
      }
    } catch {
      toast.error("Error submitting coupon form", { id: t })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-[var(--lm-surface-elevated)] border border-[var(--lm-border-default)] rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-spring glass-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--lm-border-default)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)] border border-[var(--lm-accent-border)]">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--lm-text-primary)]">
                {editingCoupon ? "Edit Promo Coupon" : "Create New Promo Coupon"}
              </h3>
              <p className="text-[11px] text-[var(--lm-text-muted)]">Configure discount codes, usage caps, and validity period.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--lm-surface-hover)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Coupon Code Input with Auto Generator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[var(--lm-text-secondary)]">Coupon Code</label>
              <button
                type="button"
                onClick={handleGenerateCode}
                className="text-[10px] text-[var(--lm-accent-text)] font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Generate Code
              </button>
            </div>
            <Input
              {...register("code")}
              disabled={isSubmitting}
              placeholder="e.g. LUMINA20"
              className="uppercase font-mono font-bold bg-[var(--lm-surface-secondary)] text-xs h-10 tracking-wider"
            />
            {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
          </div>

          {/* Optional Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Description (optional)</label>
            <Input
              {...register("description")}
              disabled={isSubmitting}
              placeholder="Summer discount promotion for VIP clients"
              className="bg-[var(--lm-surface-secondary)] text-xs h-9"
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Discount Type</label>
              <Select {...register("type")} disabled={isSubmitting} className="bg-[var(--lm-surface-secondary)] text-xs h-10">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (PKR)</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Value</label>
              <Input
                {...register("value", { valueAsNumber: true })}
                type="number"
                step="0.01"
                disabled={isSubmitting}
                placeholder="20"
                className="bg-[var(--lm-surface-secondary)] text-xs h-10 font-bold tabular-nums"
              />
              {errors.value && <p className="text-xs text-red-500">{errors.value.message}</p>}
            </div>
          </div>

          {/* Min Order & Max Discount Cap */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Min Order (PKR)</label>
              <Input
                {...register("minOrderValue", { valueAsNumber: true })}
                type="number"
                disabled={isSubmitting}
                placeholder="e.g. 5000"
                className="bg-[var(--lm-surface-secondary)] text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Max Discount Cap (PKR)</label>
              <Input
                {...register("maxDiscount", { valueAsNumber: true })}
                type="number"
                disabled={isSubmitting}
                placeholder="e.g. 2000"
                className="bg-[var(--lm-surface-secondary)] text-xs h-9"
              />
            </div>
          </div>

          {/* Usage Limit & Validity Dates */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Usage Limit</label>
              <Input
                {...register("usageLimit", { valueAsNumber: true })}
                type="number"
                disabled={isSubmitting}
                placeholder="Unlimited"
                className="bg-[var(--lm-surface-secondary)] text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Start Date</label>
              <Input {...register("startsAt")} type="date" disabled={isSubmitting} className="bg-[var(--lm-surface-secondary)] text-xs h-9" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Expiry Date</label>
              <Input {...register("expiresAt")} type="date" disabled={isSubmitting} className="bg-[var(--lm-surface-secondary)] text-xs h-9" />
            </div>
          </div>

          {/* Active Status Toggle */}
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input type="checkbox" {...register("isActive")} className="w-4 h-4 rounded border-[var(--lm-border-default)] accent-[var(--lm-accent-primary)]" />
            <span className="text-xs font-bold text-[var(--lm-text-primary)]">Publish and Activate Coupon immediately</span>
          </label>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--lm-border-default)]">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-xl text-xs h-9">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-xs rounded-xl h-9 px-5 shadow-md"
            >
              {isSubmitting ? "Saving..." : (editingCoupon ? "Save Coupon Changes" : "Create Promo Code")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
