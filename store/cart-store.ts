/**
 * The real cart store lives in features/cart/store.ts (feature-based
 * structure — see project convention). This file existed as an empty
 * duplicate; kept as a re-export for backward compatibility in case
 * anything references "@/store/cart-store", but new code should import
 * directly from "@/features/cart/store".
 */
export { useCartStore } from "@/features/cart/store"
export type { CartItem } from "@/features/cart/store"
