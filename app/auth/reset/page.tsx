"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { resetPassword } from "@/features/auth/password-reset-actions"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token") || ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.")
      return
    }
    if (!token) {
      toast.error("Missing reset token.")
      return
    }
    setIsLoading(true)
    const res = await resetPassword(token, password)
    setIsLoading(false)
    if (res.success) {
      toast.success("Password reset. Please log in.")
      router.push("/auth/login")
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Set a new password</h1>
        {!token && (
          <p className="text-sm text-red-500 mb-4">
            No reset token found. Use the link from your email, or{" "}
            <Link href="/auth/forgot" className="underline">request a new one</Link>.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading || !token}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
