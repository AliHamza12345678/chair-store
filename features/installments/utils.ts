import crypto from "crypto"

/**
 * Splits totalAmount into `numberOfMonths` equal installments, due on the
 * same day-of-month as the order, starting one month out. Any rounding
 * remainder (from dividing a non-round PKR amount) is added to the last
 * installment so the sum always equals totalAmount exactly.
 */
export function generateInstallmentSchedule(totalAmount: number, numberOfMonths: number, startDate: Date = new Date()) {
  const base = Math.floor((totalAmount / numberOfMonths) * 100) / 100
  const schedule: { amount: number; dueDate: Date }[] = []

  let runningTotal = 0
  for (let i = 1; i <= numberOfMonths; i++) {
    const dueDate = new Date(startDate)
    dueDate.setMonth(dueDate.getMonth() + i)

    const isLast = i === numberOfMonths
    const amount = isLast ? Math.round((totalAmount - runningTotal) * 100) / 100 : base

    runningTotal += amount
    schedule.push({ amount, dueDate })
  }

  return schedule
}

/**
 * JazzCash secure-hash verification (HMAC-SHA256 over the '&'-joined,
 * alphabetically-sorted pp_* field values, prefixed with the Integrity
 * Salt from your JazzCash merchant dashboard).
 *
 * ⚠️ Verify this exact construction against your JazzCash Integration
 * Guide / Postman collection before going live — different JazzCash
 * products (Mobile Wallet Payment vs Page Redirection) have historically
 * used slightly different field sets and separators. This is the
 * standard pattern documented for the Page Redirection API.
 */
export function verifyJazzCashSignature(fields: Record<string, string>, integritySalt: string): boolean {
  const { pp_SecureHash, ...rest } = fields
  if (!pp_SecureHash) return false

  const sortedKeys = Object.keys(rest).filter((k) => rest[k] !== "" && rest[k] != null).sort()
  const hashString = integritySalt + "&" + sortedKeys.map((k) => rest[k]).join("&")

  const computedHash = crypto.createHmac("sha256", integritySalt).update(hashString).digest("hex").toUpperCase()

  return computedHash === pp_SecureHash.toUpperCase()
}
