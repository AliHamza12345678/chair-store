/**
 * Convenience re-export so components can `import { useCart } from "@/hooks/use-cart"`.
 * Backed by the single canonical cart store in features/cart/store.ts.
 */
export { useCartStore as useCart } from "@/features/cart/store"
