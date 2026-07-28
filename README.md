# LUMINA E-Commerce Platform

LUMINA is a massive, highly scalable, full-stack Next.js 15 application designed for premium furniture retailers. It features a completely bespoke customer-facing Storefront and a secure, role-based Admin CMS.

## Features

### Storefront
- **SEO Optimized**: Dynamic OpenGraph tags, Canonical URLs, Schema.org Structured Data JSON-LD, and dynamic `sitemap.xml`.
- **Global Cart State**: Instant UI updates powered by Zustand persistence.
- **Product Variants**: Full support for complex product variants (colors, materials, sizes).
- **Checkout & COD**: Integrated mock checkout flow with Flat Rate Shipping calculation.
- **Customer Dashboard**: Secure order tracking and profile management.

### Admin CMS
- **Role-Based Security**: Strict NextAuth middleware and Server Action verification (`checkAdmin`).
- **Full CRUD**: Manage Categories, Products, Options, Variants, Orders, and Customers.
- **Cloudinary Integration**: First-class image uploading with graceful fallbacks.
- **Analytics Dashboard**: Real-time sales metrics and active customer aggregations.
- **Global Settings**: Configure Store Name, Currency, Tax Rates, and Maintenance Mode globally.

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **Database**: PostgreSQL (hosted on Neon), accessed via Prisma ORM v7
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Validation**: Zod + React Hook Form
- **Styling**: Tailwind CSS + UI components via lucide-react / sonner
- **Testing**: Vitest + React Testing Library
- **Rate Limiting**: Upstash Redis (Serverless)
- **Email Notifications**: Resend

## Local Setup

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Environment Setup**: Copy `.env.example` to `.env` and fill in the required placeholders (at minimum, a Neon Postgres database URL).
4. **Database Sync**: Run `npx prisma db push` to generate the schema in your database.
5. **Start Dev Server**: Run `npm run dev`.

### Unlocking the Admin Panel
To access `/admin`, you must have an Admin account:
1. Register a standard user account on the frontend.
2. Open your database GUI (e.g., Neon Dashboard or Prisma Studio).
3. Find your user record and change the `role` enum from `USER` to `ADMIN`.

## Production Deployment
Please refer to the `DEPLOYMENT_CHECKLIST.md` file in this repository for exact, step-by-step instructions on deploying this architecture to Vercel.

## Scripts
- `npm run dev`: Starts the local development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the production server.
- `npm run test`: Runs the Vitest test suite.
