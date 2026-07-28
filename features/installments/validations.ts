import * as z from "zod"

export const installmentPlanSchema = z.object({
  orderId: z.string().min(1),
  numberOfMonths: z.union([z.literal(3), z.literal(6), z.literal(12)]),
})

export type InstallmentPlanFormValues = z.infer<typeof installmentPlanSchema>

/**
 * JazzCash callback/webhook payload — field names follow JazzCash's
 * standard Payment Gateway integration guide (pp_* fields). Verify the
 * exact field set against your merchant dashboard's API version before
 * going live; JazzCash has slightly different payloads for Mobile
 * Wallet vs Page Redirect integrations.
 */
export const jazzCashCallbackSchema = z.object({
  pp_TxnRefNo: z.string(),
  pp_Amount: z.string(),
  pp_ResponseCode: z.string(),
  pp_ResponseMessage: z.string().optional(),
  pp_SecureHash: z.string(),
  pp_BillReference: z.string().optional(), // we pass installmentId here when initiating
})

export type JazzCashCallbackPayload = z.infer<typeof jazzCashCallbackSchema>
