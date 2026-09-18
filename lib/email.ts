import { Resend } from "resend"
import { formatCurrency } from "@/lib/format-currency"

const resend = new Resend(process.env.RESEND_API_KEY)

const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL || "hello@lumina-chairs.com"

export async function sendOrderConfirmationEmail(email: string, orderId: string, total: number) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured. Email skipped.")
    return { success: true, bypassed: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `LUMINA <${STORE_EMAIL}>`,
      to: email,
      subject: `Order Confirmation #${orderId.slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111827;">Thank you for your order!</h1>
          <p>We've received your order and are currently processing it.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order Number:</strong> #${orderId.slice(-8).toUpperCase()}</p>
            <p><strong>Estimated Total:</strong> ${formatCurrency(total)}</p>
            <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
          </div>
          <p>You can track your order status in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/account">Customer Dashboard</a>.</p>
          <br/>
          <p>Best regards,<br/>The LUMINA Team</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend Error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email Sending Exception:", error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    return { success: true, bypassed: true }
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: `LUMINA <${STORE_EMAIL}>`,
      to: email,
      subject: "Welcome to LUMINA Furniture!",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111827;">Welcome, ${name}!</h1>
          <p>We are thrilled to have you join LUMINA. Explore our premium furniture collection today.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 20px;">Shop Now</a>
        </div>
      `,
    })

    if (error) return { success: false, error }
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

export async function sendInstallmentReminderEmail(email: string, name: string, amount: number, dueDate: Date) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured. Reminder email skipped.")
    return { success: true, bypassed: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `LUMINA <${STORE_EMAIL}>`,
      to: email,
      subject: `Upcoming installment payment due ${dueDate.toLocaleDateString()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111827;">Hi ${name || "there"},</h1>
          <p>This is a reminder that an installment payment is due soon.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount Due:</strong> ${formatCurrency(amount)}</p>
            <p><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>
          </div>
          <p>You can review your installment plan in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/account">Customer Dashboard</a>.</p>
          <br/>
          <p>Best regards,<br/>The LUMINA Team</p>
        </div>
      `,
    })

    if (error) return { success: false, error }
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured. Password reset email skipped.")
    return { success: true, bypassed: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `LUMINA <${STORE_EMAIL}>`,
      to: email,
      subject: "Reset your LUMINA password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111827;">Reset your password</h1>
          <p>We received a request to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    })

    if (error) return { success: false, error }
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}
