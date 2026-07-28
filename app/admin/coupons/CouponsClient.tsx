"use client"

import { useState } from "react"
import { Coupon } from "@prisma/client"
import { DataTable } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { createCoupon, deleteCoupon, updateCoupon } from "@/features/coupons/actions"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { couponSchema, CouponFormValues } from "@/features/coupons/validations"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/format-currency"

interface CouponsClientProps {
  coupons: Coupon[]
}

export function CouponsClient({ coupons }: CouponsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      type: "PERCENTAGE",
      value: 10,
      isActive: true,
    },
  })

  const handleOpenNew = () => {
    setEditingId(null)
    reset({ code: "", description: "", type: "PERCENTAGE", value: 10, isActive: true, minOrderValue: undefined, maxDiscount: undefined, usageLimit: undefined, startsAt: undefined, expiresAt: undefined })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingId(coupon.id)
    reset({
      code: coupon.code,
      description: coupon.description ?? "",
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue ?? undefined,
      maxDiscount: coupon.maxDiscount ?? undefined,
      usageLimit: coupon.usageLimit ?? undefined,
      isActive: coupon.isActive,
      startsAt: coupon.startsAt ? new Date(coupon.startsAt).toISOString().slice(0, 10) : undefined,
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 10) : undefined,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon? This cannot be undone.")) return
    const loadingToast = toast.loading("Deleting coupon...")
    const res = await deleteCoupon(id)
    if (res.success) {
      toast.success("Coupon deleted", { id: loadingToast })
    } else {
      toast.error(res.error, { id: loadingToast })
    }
  }

  const onSubmit = async (data: CouponFormValues) => {
    const loadingToast = toast.loading(editingId ? "Updating coupon..." : "Creating coupon...")
    const res = editingId ? await updateCoupon(editingId, data) : await createCoupon(data)
    if (res.success) {
      toast.success(editingId ? "Coupon updated" : "Coupon created", { id: loadingToast })
      setIsModalOpen(false)
    } else {
      toast.error(res.error, { id: loadingToast })
    }
  }

  const columns = [
    {
      header: "Code",
      cell: (item: Coupon) => <span className="font-mono font-semibold">{item.code}</span>,
    },
    {
      header: "Discount",
      cell: (item: Coupon) => item.type === "PERCENTAGE" ? `${item.value}%` : formatCurrency(item.value),
    },
    {
      header: "Usage",
      cell: (item: Coupon) => `${item.usedCount}${item.usageLimit ? ` / ${item.usageLimit}` : ""}`,
    },
    {
      header: "Status",
      cell: (item: Coupon) => (
        <Badge variant={item.isActive ? "success" : "secondary"}>
          {item.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Expires",
      cell: (item: Coupon) => item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "—",
    },
    {
      header: "Actions",
      cell: (item: Coupon) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(item)}>
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground mt-2">Create and manage discount codes.</p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      <DataTable columns={columns} data={coupons} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Coupon" : "Create New Coupon"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Code</label>
            <Input {...register("code")} disabled={isSubmitting} placeholder="SAVE20" className="uppercase" />
            {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select {...register("type")} disabled={isSubmitting}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (PKR)</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Value</label>
              <Input {...register("value", { valueAsNumber: true })} type="number" step="0.01" disabled={isSubmitting} placeholder="20" />
              {errors.value && <p className="text-xs text-red-500">{errors.value.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Order (PKR, optional)</label>
              <Input {...register("minOrderValue", { valueAsNumber: true })} type="number" disabled={isSubmitting} placeholder="1000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Discount (PKR, optional)</label>
              <Input {...register("maxDiscount", { valueAsNumber: true })} type="number" disabled={isSubmitting} placeholder="500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Starts</label>
              <Input {...register("startsAt")} type="date" disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Expires</label>
              <Input {...register("expiresAt")} type="date" disabled={isSubmitting} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Usage Limit (optional)</label>
            <Input {...register("usageLimit", { valueAsNumber: true })} type="number" disabled={isSubmitting} placeholder="100" />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...register("isActive")} className="h-4 w-4" />
            Active
          </label>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (editingId ? "Save Changes" : "Create Coupon")}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
