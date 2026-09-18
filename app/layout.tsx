import { Inter } from "next/font/google"
import "./globals.css"
import { ReactNode } from "react"
import { ToastProvider } from "@/components/providers/ToastProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata = {
  title: "LUMINA | Premium Seating",
  description: "Elevating your space with premium seating.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
