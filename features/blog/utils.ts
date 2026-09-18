/** Rough reading-time estimate for a blog post, shown on listing/detail pages. */
export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
