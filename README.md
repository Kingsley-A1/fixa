# Fixa

**Repair businesses, better managed.** A repair management platform by **Bespoke Technologies**, built for independent repair businesses in Nigeria.

## What is available

- A responsive public product website at `/`.
- An interactive workspace at `/demo`: create repairs, change status, search and filter, explore customer and device directories, and reset the sample data. Demo data stays in the current browser using versioned local storage. Use fictional details; this is not a business data store.
- A database-backed, business-scoped application at `/app` for customers, devices, repair jobs, activity history, and private QR-linked service tickets. This requires CockroachDB and authentication configuration.
- Explicit preview screens when business sign-in is not configured. Public registration stays disabled by default.

Best of Chris Communications is the first pilot business, not a hardcoded product identity.

## Stack

Next.js App Router, React, TypeScript, Prisma with CockroachDB, signed HttpOnly session cookies, bcrypt, Lucide icons, and plain CSS. Vercel hosts the application; CockroachDB hosts business data.

## Development

Use Node.js 22 or newer.

```sh
npm ci
npm run db:generate
npm run dev
```

The public site and demo work without credentials. To develop the business application, copy `.env.example` to `.env.local`, then configure a real TLS-enabled CockroachDB `DATABASE_URL` and a random `AUTH_SECRET` of at least 32 characters. Prisma CLI reads `.env`, not Next.js `.env.local`; supply the database URL through your shell or a gitignored `.env` when running database commands. Never commit credentials.

The repository contains an initial migration generated from the schema. Review it before applying it to a new database with `npm run db:migrate`. For an existing database, reconcile and baseline its schema before applying migrations; do not run the initial migration blindly. No live database was migrated as part of this preview release.

## Verification

```sh
npm run lint
npm run typecheck
npm run build
npm test
```

Browser tests use a production build and Chromium. By default the browser executable is `/usr/bin/chromium`. On other systems, install Chromium and set `CHROMIUM_PATH` to its executable. Set `BASE_URL` to run the tests against an existing preview deployment. The suite assumes business registration is disabled and no business database is connected.

The tests cover desktop and mobile navigation, layout overflow, creating and persisting demo repairs, search and filtering, status changes, directories, empty states, keyboard interaction, corrupt-storage recovery, and account availability. They do not verify live database operations.

## Deploy to Vercel

Import `Kingsley-A1/fixa`, use the Next.js framework preset, repository root, Node.js 24, and `npm run build`. The public site and demo deploy without environment variables.

To enable pilot business sign-in, configure encrypted Vercel environment variables:

| Variable              | Purpose                                                 |
| --------------------- | ------------------------------------------------------- |
| `DATABASE_URL`        | CockroachDB connection URL with TLS                     |
| `AUTH_SECRET`         | Cryptographically random secret, at least 32 characters |
| `NEXT_PUBLIC_APP_URL` | Canonical HTTPS URL used in service-ticket QR codes     |
| `ENABLE_REGISTRATION` | Keep `false` until public onboarding is ready           |

Run reviewed migrations separately, verify schema availability, and redeploy after changing configuration. Test business onboarding, tenant isolation, customers, devices, repairs, status history, and public tickets against the connected database before accepting real business data.

## Release boundary

The deployed site is a **public product preview**, not a production-certified multi-business service. Before opening registration, complete database-backed verification, durable login rate limits, session invalidation, password recovery, email verification, audit logs, ticket-link rotation, and privacy/operational review. Registration requires the explicit server-side `ENABLE_REGISTRATION=true` flag in addition to database/auth configuration.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the domain and security boundaries.
