"use client"

import Link from "next/link"
import { Search, ShoppingCart, User, Menu, X, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useCartStore } from "@/features/cart/store"
import { useTheme } from "next-themes"

const links = [
  { name: "Chairs", href: "/category/chairs" },
  { name: "Sofas", href: "/category/sofas" },
  { name: "Tables", href: "/category/tables" },
  { name: "Collections", href: "/collections" },
  { name: "Journal", href: "/blog" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  
  const cartCount = useCartStore((state) => state.cartCount())
  const setCartOpen = useCartStore((state) => state.setCartOpen)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-[var(--lm-nav-bg)] backdrop-blur-xl border-b border-[var(--lm-nav-border)] py-4" 
          : "bg-transparent py-7"
      }`}
    >
      {/* 3-Column Luxury Grid Layout */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 grid grid-cols-3 items-center">
        
        {/* COL 1: Brand Logo (Left Aligned) & Mobile Menu Toggle */}
        <div className="flex items-center justify-start">
          <div className="md:hidden text-[var(--lm-text-primary)] mr-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 hover:text-[var(--lm-accent-hover)] transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          <Link 
            href="/" 
            className="text-xl font-light tracking-[0.45em] text-[var(--lm-text-primary)] hover:text-[var(--lm-accent-hover)] transition-colors z-50 relative"
          >
            LUMINA
          </Link>
        </div>

        {/* COL 2: Mathematical Screen Center Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-10">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-[10.5px] font-medium uppercase tracking-[0.3em] transition-colors relative py-1 ${
                  isActive ? "text-[var(--lm-accent-text)]" : "text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)]"
                }`}
              >
                {link.name}
                {/* Micro premium active/hover dot */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--lm-accent-primary)] transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100"
                }`} />
              </Link>
            )
          })}
        </nav>

        {/* COL 3: Premium Actions (Right Aligned) */}
        <div className="flex items-center justify-end gap-5 sm:gap-7 text-[var(--lm-text-secondary)]">
          <button className="hover:text-[var(--lm-text-primary)] transition-colors hidden sm:block p-1">
            <Search className="w-4 h-4 stroke-[1.25]" />
          </button>
          
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:text-[var(--lm-text-primary)] transition-colors p-1 flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {mounted ? (
              theme === 'dark' ? <Sun className="w-4 h-4 stroke-[1.25]" /> : <Moon className="w-4 h-4 stroke-[1.25]" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
          
          <Link href="/account" className="hover:text-[var(--lm-text-primary)] transition-colors p-1">
            <User className="w-4 h-4 stroke-[1.25]" />
          </Link>
          
          <button 
            className="hover:text-[var(--lm-text-primary)] transition-colors relative p-1 group"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="w-4 h-4 stroke-[1.25] group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--lm-accent-primary)] text-black text-[8.5px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center tracking-tighter">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Luxury Full-Screen Overlay for Mobile Menu */}
      <div 
        className={`fixed inset-x-0 top-[73px] h-screen bg-[var(--lm-mobile-menu-bg)] backdrop-blur-2xl border-t border-[var(--lm-border-subtle)] p-8 flex flex-col gap-6 transition-all duration-500 md:hidden ${
          isMobileMenuOpen 
            ? "opacity-100 translate-y-0 visible" 
            : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <div className="flex flex-col gap-5 mt-4">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-light uppercase tracking-[0.25em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-accent-hover)] transition-colors py-2 border-b border-[var(--lm-border-subtle)]"
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="pt-8 border-t border-[var(--lm-border-subtle)] mt-auto mb-24 flex items-center justify-between text-[var(--lm-text-secondary)]">
          <div className="flex items-center gap-4 hover:text-[var(--lm-text-primary)] transition-colors cursor-pointer">
            <Search className="w-4 h-4 stroke-[1.25]" />
            <span className="text-xs uppercase tracking-[0.2em] font-light">Search Atelier</span>
          </div>
          
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:text-[var(--lm-text-primary)] transition-colors flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {mounted ? (
              theme === 'dark' ? <Sun className="w-4 h-4 stroke-[1.25]" /> : <Moon className="w-4 h-4 stroke-[1.25]" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
