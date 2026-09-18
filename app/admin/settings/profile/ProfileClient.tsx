"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { toast } from "sonner"
import { updateProfile } from "@/features/settings/actions"
import Link from "next/link"

export function ProfileClient({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(user.image || "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    formData.append("imageUrl", imageUrl) // Ensure image is appended
    
    const loadingToast = toast.loading("Updating profile...")
    const res = await updateProfile(formData)
    
    setIsLoading(false)
    if (res.success) {
      toast.success("Profile updated", { id: loadingToast })
    } else {
      toast.error(res.error, { id: loadingToast })
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-x-4">
          <Link href="/admin/settings" className="text-muted-foreground hover:text-foreground transition-colors">Store Settings</Link>
          <Link href="/admin/settings/profile" className="font-semibold text-primary">Admin Profile</Link>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account credentials and personal details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border">
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Image</label>
          <ImageUpload 
            value={imageUrl} 
            onChange={setImageUrl} 
            disabled={isLoading} 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input name="name" defaultValue={user.name || ""} required />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input name="email" type="email" defaultValue={user.email || ""} required />
        </div>

        <div className="space-y-2 border-t pt-4 mt-4">
          <h3 className="font-medium text-sm">Change Password</h3>
          <p className="text-xs text-muted-foreground mb-4">Leave blank to keep your current password.</p>
          <label className="text-sm font-medium">New Password</label>
          <Input name="password" type="password" />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Update Profile"}
        </Button>
      </form>
    </div>
  )
}
