/**
 * Centralized slug generator — used by products, categories, and blog posts.
 * Replaces any duplicate inline slugify logic in feature actions.
 */
export function slugify(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")   // strip non-word chars
    .replace(/[\s_-]+/g, "-")   // collapse whitespace/underscores to a single dash
    .replace(/^-+|-+$/g, "")    // trim leading/trailing dashes
}

/** Appends a short random suffix, useful when uniqueness must be guaranteed. */
export function slugifyUnique(input: string): string {
  const base = slugify(input)
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}
