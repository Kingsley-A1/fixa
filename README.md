# Fixa

**Repair businesses, better managed.** A repair operations and evidence-based technician discovery platform by **Bespoke Technologies**, built for Nigeria-first users.

## Release 1–3 feature branch (not yet a public marketplace launch)

- **R1:** normalized customer-phone search across customer/device/job records, guided device class → brand → product → exact model, protected job-state transitions and documented collection handover.
- **R2:** private technician profiles, specialties, service areas, opt-in publication and audited platform-admin approvals/suspensions.
- **R3:** opt-in approximate city suggestion, public discovery/profile pages, service-linked one-use customer review invitations, moderated publication and accurate aggregate reviews.
- Public discovery is **OFF by default** (`ENABLE_DISCOVERY=false`). Do not enable before production migration, database-backed authorization and trust checks, security review, operational moderation and privacy readiness.
- Profile images, strong skills verification, independent review reporting/appeals and durable anti-abuse rate-limiting remain **launch blockers**, not completed claims.
- Review `docs/ARCHITECTURE.md`, `AGENTS.md`, and `docs/RELEASE_1_3_RUNBOOK.md` before implementing or releasing.

## Candidate expansion: Google, email, repair portfolio

- Google OAuth (PKCE, nonce, state) is opt-in when Google client ID/secret are securely configured. Existing password users sign in first, then link Google; email matches alone never auto-link accounts.
- Password registration can send a minimal verification email using a Resend-verified sender. Email confirmation is single-use and expires after 20 minutes.
- An assigned technician may optionally add up to three photos of genuine completed/ready repairs, held privately pending consent and moderation. Public profiles display three calm 4:5 work cards with no social features.
- `ENABLE_PORTFOLIO=false` is required until schema migrations, admin workflow and privacy checks are accepted. Discovery is governed by a separate `ENABLE_DISCOVERY` flag.
- These are candidate changes on a stacked feature branch, not live until the referenced rollout gates pass. See [setup/verification runbook](docs/GOOGLE_EMAIL_PORTFOLIO_RUNBOOK.md).

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
npm run test:unit
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
| `ENABLE_DISCOVERY`    | Keep `false` until the trust/discovery launch gate passes |

Run reviewed migrations separately, verify schema availability, and redeploy after changing configuration. Test business onboarding, tenant isolation, customers, devices, repairs, status history, and public tickets against the connected database before accepting real business data.

## Release boundary

The deployed site is a **public product preview**, not a production-certified multi-business service. Before opening registration, complete database-backed verification, durable login rate limits, session invalidation, password recovery, email verification, audit logs, ticket-link rotation, and privacy/operational review. Registration requires the explicit server-side `ENABLE_REGISTRATION=true` flag in addition to database/auth configuration.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the domain and security boundaries.
