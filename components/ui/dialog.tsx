"use client"

/**
 * Lightweight Dialog primitive.
 *
 * NOTE: @radix-ui/react-dialog is NOT in package.json for this project,
 * and this environment has no network access to add it. Rather than
 * introduce a new dependency that can't be installed/verified here,
 * this follows the same hand-rolled portal pattern already used by
 * components/ui/Modal.tsx. If you later add @radix-ui/react-dialog
 * (`npm install @radix-ui/react-dialog`), this file can be swapped for
 * the standard Radix implementation without changing call sites much.
 */

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/clsx"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false)
    }
    if (open) document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  if (!open || typeof document === "undefined") return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 mx-4">{children}</div>
    </div>,
    document.body
  )
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }
>(({ className, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full max-w-lg bg-card border rounded-lg shadow-lg flex flex-col max-h-[90vh] p-6",
      className
    )}
    {...props}
  >
    {onClose && (
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-1 rounded-full hover:bg-secondary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    )}
    {children}
  </div>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />
)

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold tracking-tight", className)} {...props} />
  )
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
DialogDescription.displayName = "DialogDescription"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex justify-end gap-2 mt-6", className)} {...props} />
)

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
