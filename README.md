# Fixa

**Repair businesses, better managed.** A multi-tenant repair management platform from **Bespoke Technologies**.

Fixa is designed for independent repair businesses throughout Nigeria. Best of Chris Communications is the first pilot business, **not** a hardcoded product identity.

## Stack

- Next.js App Router + TypeScript + React
- CockroachDB + Prisma (CockroachDB provider)
- One Vercel app: pages, Route Handlers and Server Actions together
- Plain lightweight CSS, Lucide icons, responsive layout
- Signed HttpOnly session cookies; bcrypt password hashes
- QR-linked service tickets and browser Save as PDF

## Current features

- Sign up / sign in / business workspace setup
- Dashboard with key repair and customer metrics
- Customer registration and customer search
- Permanent device IDs with search by model, serial or IMEI
- Repair jobs, estimate/deposit fields, expected dates and activity log
- Public **limited-data** digital service ticket with QR and printable PDF
- Business-scoped queries and mutations

## Local setup

1. Run `npm install` with Node.js 22+.
2. Copy `.env.example` to `.env.local` and enter a **real CockroachDB TLS connection URL**, random `AUTH_SECRET` of at least 32 characters, and your app URL.
3. Run `npx prisma generate`.
4. For a fresh non-production database, create and review an initial migration with `npx prisma migrate dev --name init`.
5. Run `npm run dev` and visit http://localhost:3000.
6. In managed environments, use reviewed migrations with `npm run db:migrate` before exposing app traffic.

**Do not commit .env files or database credentials.** Do not point a development migration command at a production database.

## Deployment

The Vercel project should use Next.js with the repository root. Configure `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL` in Vercel environment settings. Deploy database migrations separately and verify their completion before accepting writes. Vercel is the **only application host**; CockroachDB remains the managed database provider.

## Security and release status

**Foundation only: not production-certified.** Before public multi-business onboarding, complete database-backed verification, build/browser tests, rate limits and abuse protection on sign-in, session invalidation, password recovery/email verification, operational audit logs and customer ticket-link rotation. Protect customer and device data in line with applicable privacy law. Avoid publishing a public signup until these requirements are met.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

© Bespoke Technologies.
