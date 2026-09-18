import { NextResponse } from "next/server"
import { Resend } from "resend"
import * as z from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)
const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL || "hello@lumina-chairs.com"

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(5),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured. Contact message logged instead:", parsed.data)
    return NextResponse.json({ message: "OK" }, { status: 200 })
  }

  const { name, email, message } = parsed.data

  try {
        await resend.emails.send({
      // 1. Kyunki abhi domain verified nahi hai, isliye onboarding email hi use karna hoga
      from: 'LUMINA Contact Form <onboarding@resend.dev>', 
      
      // 2. To me abhi sirf aapka apna registered email hi chalega
      to: 'alihamza69856@gmail.com', 
      
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: `
        <div style="font-family: sans-serif;">
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    })

    return NextResponse.json({ message: "OK" }, { status: 200 })
  } catch (error) {
    console.error("Contact form email failed:", error)
    return NextResponse.json({ message: "Failed to send" }, { status: 500 })
  }
}
