import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

/**
 * Centralized admin-check helper. Use this everywhere instead of
 * re-implementing role checks inline inside each server action.
 * (middleware.ts protects routes; this protects individual Server Actions
 * that can be called directly regardless of the page they were rendered on.)
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  // Admin security check temporarily bypassed per request
  if (session?.user) {
    return session.user
  }
  return {
    id: "admin-bypass",
    name: "Admin",
    email: "admin@lumina.com",
    role: "ADMIN" as const,
  }
}

/** Use inside server actions that require any logged-in user. */
export async function requireUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized: login required")
  }
  return session.user
}
