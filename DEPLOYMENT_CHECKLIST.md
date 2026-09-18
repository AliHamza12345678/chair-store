# DEPLOYMENT CHECKLIST

Follow this exact sequence to deploy LUMINA to a production environment on Vercel.

## 1. Database Provisioning (Neon)
- [ ] Create an account at [Neon.tech](https://neon.tech).
- [ ] Create a new Project (PostgreSQL).
- [ ] Copy the `DATABASE_URL` from the Neon dashboard.

## 2. Cloudinary Setup (Image Hosting)
- [ ] Create an account at [Cloudinary](https://cloudinary.com).
- [ ] Copy your `Cloud Name`.
- [ ] Navigate to Settings > Upload and create a new **Upload Preset** (set to "Unsigned").
- [ ] Note down the Preset Name.

## 3. Email & Rate Limiting (Optional but Recommended)
- [ ] Create an account at [Resend](https://resend.com) and generate an API key.
- [ ] Verify your custom domain in Resend for optimal deliverability.
- [ ] Create an account at [Upstash](https://upstash.com) and create a Redis database.
- [ ] Copy the REST URL and Token.

## 3b. JazzCash Setup (Installment Payments) — required for the "Pay in Installments" checkout option
- [ ] Register for a JazzCash Merchant Account (Page Redirection / Payment Gateway product) at [JazzCash for Business](https://www.jazzcash.com.pk/business/).
- [ ] From the Merchant Dashboard, copy your `Merchant ID`, `Password`, and `Integrity Salt`.
- [ ] In the Merchant Dashboard, set the **Return URL** to `https://your-domain.com/api/webhooks/jazzcash`.
- [ ] Note: this project ships the webhook signature verification and installment-plan logic (`features/installments/`), but does **not** include the "initiate payment" redirect call for an individual installment yet — that's the one piece you'll need to wire up per JazzCash's current Postman collection/integration guide before installments go fully live. Everything downstream of a successful callback (marking paid, completing the plan, marking the order paid) is already built and tested against the documented callback shape.
- [ ] Set up a daily scheduled call to `/api/cron/installment-reminders` (see step 6b) to send due-date reminders and flag overdue installments.

## 3c. Cron Job (Installment Reminders)
- [ ] `vercel.json` in this repo already declares a daily Vercel Cron for `/api/cron/installment-reminders` at 9am UTC — no extra setup needed if deploying to Vercel.
- [ ] If NOT using Vercel, set up any scheduler (cron-job.org, GitHub Actions, etc.) to `GET` that URL once daily with header `Authorization: Bearer <CRON_SECRET>`.

## 4. Vercel Deployment
- [ ] Push this repository to GitHub.
- [ ] Import the repository into [Vercel](https://vercel.com).
- [ ] Ensure the framework preset is set to **Next.js**.

## 5. Environment Variables Configuration
In the Vercel project settings, configure the following Environment Variables exactly:
- `DATABASE_URL` = (Your Neon connection string)
- `NEXTAUTH_URL` = (Your production Vercel domain, e.g., https://lumina.com)
- `NEXTAUTH_SECRET` = (Run `openssl rand -base64 32` in terminal to generate a secret)
- `NEXT_PUBLIC_APP_URL` = (Same as NEXTAUTH_URL)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = (From step 2)
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` = (From step 2)
- `RESEND_API_KEY` = (From step 3)
- `UPSTASH_REDIS_REST_URL` = (From step 3)
- `UPSTASH_REDIS_REST_TOKEN` = (From step 3)
- `JAZZCASH_MERCHANT_ID` = (From step 3b)
- `JAZZCASH_PASSWORD` = (From step 3b)
- `JAZZCASH_INTEGRITY_SALT` = (From step 3b)
- `CRON_SECRET` = (Run `openssl rand -base64 32`)
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` = (Optional — only if enabling card payments alongside COD/Installments)

## 6. Build and Migration
Vercel will automatically run `npm run build`. During the build, it will execute the `postinstall` script defined in `package.json` to generate the Prisma client.
- [ ] **Manual Step Required:** After deployment, you must push the schema to Neon. Connect Vercel CLI locally (`npx vercel link`) and pull the env vars (`npx vercel env pull`). Then run `npx prisma db push`.
- Alternatively, run `npx prisma db push` locally using the production `DATABASE_URL`.

## 7. Admin Initialization
- [ ] Register a new account on your production storefront.
- [ ] Log into the Neon Database dashboard.
- [ ] Navigate to the `User` table, locate your account, and change the `role` from `USER` to `ADMIN`.
- [ ] You can now access the CMS at `https://your-domain.com/admin`.

---
*LUMINA Production Readiness Audit 2026*
