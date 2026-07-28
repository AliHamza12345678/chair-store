import { toast } from "sonner"

/**
 * Thin convenience hook so components can `const { toast } = useToast()`
 * (shadcn-style) while actually using the sonner instance that's already
 * mounted via components/providers/ToastProvider.tsx. There is only one
 * toast system in this app — this is not a second implementation.
 */
export function useToast() {
  return { toast }
}
