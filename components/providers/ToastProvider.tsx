"use client"

import { Toaster } from "sonner"

export function ToastProvider() {
  return (
    <Toaster 
      position="bottom-right" 
      toastOptions={{
        className: 'bg-background border border-border text-foreground',
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))'
        }
      }}
    />
  )
}
