import { ReactNode } from "react"
import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"
import { CartSheet } from "@/components/storefront/CartSheet"

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartSheet />
      <main className="flex-grow flex flex-col relative w-full overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  )
}
