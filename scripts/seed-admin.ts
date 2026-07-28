/**
 * Admin creation now lives in prisma/seed.ts (the standard Prisma seed
 * entrypoint), so it runs automatically as part of `npx prisma db seed`
 * alongside categories and store settings. This file is kept only so any
 * existing tooling/docs that reference "scripts/seed-admin.ts" still
 * resolve to something.
 *
 * To create/update the admin account, run:
 *   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=YourPassword123! npx prisma db seed
 */
export {}
