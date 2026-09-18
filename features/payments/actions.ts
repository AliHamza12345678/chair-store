"use server"

import { stripe } from "@/lib/stripe"
import { getAuthRedirectUrl } from "@/features/auth/utils"

export async function createStripePayment(orderId: string, amount: number) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: "LUMINA Order",
            },
            unit_amount: amount * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    })

    return { url: session.url }
  } catch (error: any) {
    return { error: error.message || "Stripe session creation failed" }
  }
}
