import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  variantId?: string
  variantTitle?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartTotal: () => number
  cartCount: () => number
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      addItem: (newItem) => {
        set((state) => {
          // Create unique ID based on product and variant
          const id = `${newItem.productId}-${newItem.variantId || "base"}`
          
          const existingItem = state.items.find((item) => item.id === id)
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + newItem.quantity } : item
              ),
              isCartOpen: true
            }
          }
          return { items: [...state.items, { ...newItem, id }], isCartOpen: true }
        })
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      cartTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      cartCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: "lumina-cart",
    }
  )
)
