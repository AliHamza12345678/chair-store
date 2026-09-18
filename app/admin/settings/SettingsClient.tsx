"use client"

import { useState } from "react"
import { StoreSettings } from "@prisma/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { toast } from "sonner"
import { updateStoreSettings } from "@/features/settings/actions"
import Link from "next/link"

export function SettingsClient({ settings }: { settings: StoreSettings | null }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const loadingToast = toast.loading("Saving settings...")
    const res = await updateStoreSettings(formData)
    
    setIsLoading(false)
    if (res.success) {
      toast.success("Settings updated", { id: loadingToast })
    } else {
      toast.error(res.error, { id: loadingToast })
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-x-4">
          <Link href="/admin/settings" className="font-semibold text-primary">Store Settings</Link>
          <Link href="/admin/settings/profile" className="text-muted-foreground hover:text-foreground transition-colors">Admin Profile</Link>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your store's configuration.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border">
        <div className="space-y-2">
          <label className="text-sm font-medium">Store Name</label>
          <Input name="storeName" defaultValue={settings?.storeName} required />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Support Email</label>
          <Input name="storeEmail" type="email" defaultValue={settings?.storeEmail || ""} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <select 
              name="currency" 
              defaultValue={settings?.currency || "PKR"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="PKR">PKR (Rs)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tax Rate (%)</label>
            <Input name="taxRate" type="number" step="0.01" defaultValue={settings?.taxRate || 0} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Flat Shipping ($)</label>
            <Input name="shippingRate" type="number" step="0.01" defaultValue={settings?.shippingRate || 50} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            name="maintenanceMode" 
            id="maintenanceMode" 
            defaultChecked={settings?.maintenanceMode}
            className="rounded border-input text-primary focus:ring-primary h-4 w-4"
          />
          <label htmlFor="maintenanceMode" className="text-sm font-medium">Maintenance Mode (Disable Storefront)</label>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  )
}
