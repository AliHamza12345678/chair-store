import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJazzCashSignature } from "@/features/installments/utils"
import { markInstallmentPaidByRef } from "@/features/installments/actions"
import { jazzCashCallbackSchema } from "@/features/installments/validations"

/**
 * JazzCash Page Redirection callback. JazzCash POSTs form-encoded data here
 * after a customer completes (or fails) a payment.
 *
 * Setup required on your side (see DEPLOYMENT_CHECKLIST.md):
 *  - Set this URL as the "Return URL" in your JazzCash merchant dashboard.
 *  - Set JAZZCASH_INTEGRITY_SALT, JAZZCASH_MERCHANT_ID in .env.
 *  - When you *initiate* a JazzCash payment for an installment (not built
 *    here — that's the "pay now" button on the customer's installment
 *    plan page, a follow-up piece), pass the installment's id as
 *    pp_BillReference so this webhook can look it up on the way back.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || ""
  const raw = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries())

  const parsed = jazzCashCallbackSchema.safeParse(raw)
  if (!parsed.success) {
    console.error("JazzCash webhook: malformed payload", parsed.error)
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 })
  }

  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT
  if (!integritySalt) {
    console.error("JazzCash webhook: JAZZCASH_INTEGRITY_SALT is not set")
    return NextResponse.json({ message: "Server not configured" }, { status: 500 })
  }

  const isValid = verifyJazzCashSignature(raw as Record<string, string>, integritySalt)
  if (!isValid) {
    console.error("JazzCash webhook: signature verification failed")
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
  }

  const { pp_ResponseCode, pp_TxnRefNo, pp_BillReference } = parsed.data

  // JazzCash: "000" = success. Any other code = declined/failed.
  if (pp_ResponseCode !== "000") {
    console.warn(`JazzCash payment failed for txn ${pp_TxnRefNo}: ${parsed.data.pp_ResponseMessage}`)
    return NextResponse.json({ message: "OK" }, { status: 200 })
  }

  const installmentId = pp_BillReference
  if (!installmentId) {
    console.error("JazzCash webhook: no pp_BillReference (installment id) on successful payment")
    return NextResponse.json({ message: "OK" }, { status: 200 })
  }

  const installment = await prisma.installment.findUnique({ where: { id: installmentId } })
  if (!installment) {
    console.error(`JazzCash webhook: installment ${installmentId} not found`)
    return NextResponse.json({ message: "OK" }, { status: 200 })
  }

  if (installment.status === "PAID") {
    // Already processed (JazzCash can retry callbacks) — idempotent no-op.
    return NextResponse.json({ message: "OK" }, { status: 200 })
  }

  await markInstallmentPaidByRef(installmentId, pp_TxnRefNo)

  return NextResponse.json({ message: "OK" }, { status: 200 })
}

export async function GET() {
  return NextResponse.json({ message: "JazzCash webhook endpoint — POST only" })
}
