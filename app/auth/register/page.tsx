"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to create account")
      }

      router.push("/auth/login?registered=true")
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-background">
      {/* Right Panel - Brand (Reversed for visual variation) */}
      <div className="hidden md:flex flex-1 flex-col justify-between bg-secondary p-12 text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-multiply dark:mix-blend-overlay"></div>
        <div className="z-10">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>
        <div className="z-10 max-w-lg">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Join the Lumina Collective.</h1>
          <p className="text-lg opacity-80">
            Create an account to save your favorite pieces, track orders, and experience seamless premium shopping.
          </p>
        </div>
      </div>

      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your details below to create your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
