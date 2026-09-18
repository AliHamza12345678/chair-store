import { describe, it, expect, beforeEach } from "vitest"
import { useCartStore } from "./store"

describe("Cart Store (Zustand)", () => {
  const initialItem = {
    productId: "p1",
    name: "Test Chair",
    price: 100,
    quantity: 1,
    imageUrl: "test.jpg",
  }

  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({ items: [], isCartOpen: false })
  })

  it("should add an item to the cart", () => {
    const store = useCartStore.getState()
    store.addItem(initialItem)
    
    const newState = useCartStore.getState()
    expect(newState.items).toHaveLength(1)
    expect(newState.items[0].name).toBe("Test Chair")
    expect(newState.isCartOpen).toBe(true)
  })

  it("should calculate totals correctly", () => {
    const store = useCartStore.getState()
    store.addItem(initialItem)
    store.addItem({ ...initialItem, productId: "p2", price: 50, quantity: 2 })
    
    // (1 * 100) + (2 * 50) = 200
    expect(useCartStore.getState().cartTotal()).toBe(200)
    expect(useCartStore.getState().cartCount()).toBe(3)
  })

  it("should update quantity", () => {
    const store = useCartStore.getState()
    store.addItem(initialItem)
    
    const item = useCartStore.getState().items[0]
    useCartStore.getState().updateQuantity(item.id, 5)
    
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it("should remove an item", () => {
    const store = useCartStore.getState()
    store.addItem(initialItem)
    
    const item = useCartStore.getState().items[0]
    useCartStore.getState().removeItem(item.id)
    
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})
