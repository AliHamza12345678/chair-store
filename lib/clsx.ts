import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind class names safely (dedupes conflicting utility classes).
 * Central copy — import this everywhere instead of redefining `cn` locally.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
