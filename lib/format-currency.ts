/**
 * Centralized currency formatting for the store.
 * Store currency defaults to PKR (see prisma StoreSettings.currency),
 * since this is a Pakistan-focused store (JazzCash / installments).
 * Do not hardcode "$" anywhere else — always use this helper.
 */
export function formatCurrency(amount: number, currency: string = "PKR"): string {
  if (currency === "PKR") {
    // Intl's "PKR" symbol renders as "PKR" or "Rs" depending on locale support;
    // we force "Rs" prefix for consistent storefront display.
    return `Rs ${Math.round(amount).toLocaleString("en-PK")}`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}
