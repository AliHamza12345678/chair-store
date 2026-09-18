"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      toast.success("Message sent — we'll get back to you soon.")
      ;(e.target as HTMLFormElement).reset()
    } catch {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-6 md:px-12 py-32 min-h-screen max-w-xl">
      <h1 className="text-4xl font-bold tracking-tighter mb-4">Get in Touch</h1>
      <p className="text-muted-foreground mb-12">Questions about an order, a product, or anything else — we're here to help.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Your name" required disabled={isSubmitting} />
        <Input name="email" type="email" placeholder="Your email" required disabled={isSubmitting} />
        <Textarea name="message" placeholder="How can we help?" required rows={6} disabled={isSubmitting} />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  )
}
