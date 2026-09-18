/**
 * This project uses `sonner` for toasts (see components/providers/ToastProvider.tsx,
 * already mounted in the root layout). This file exists only so that any code
 * importing `toast` from "@/components/ui/toast" (a common shadcn convention)
 * keeps working, instead of building a second, separate toast system.
 * Prefer importing directly from "sonner" in new code.
 */
export { toast } from "sonner"
