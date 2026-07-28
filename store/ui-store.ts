import { create } from "zustand"

interface UIStore {
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  isSearchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

/** Small global UI state (mobile nav, search overlay) not tied to any one feature. */
export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}))
