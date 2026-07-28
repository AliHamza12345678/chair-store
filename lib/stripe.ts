import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY environment variable")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-06-24.dahlia",
  appInfo: {
    name: "LUMINA E-Commerce",
    version: "1.0.0",
  },
})
