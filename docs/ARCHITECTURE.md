# Fixa architecture · foundation v0.1

## Product boundary
Independent, multi-tenant SaaS owned by Bespoke Technologies. BOC is the first pilot workspace, never a product-level hardcoded identity.

## Stack
TypeScript / Next.js App Router; CockroachDB using Prisma CockroachDB connector; Node.js runtime on Vercel; same-deployment Server Actions; CSS design system; Lucide icons.

## Domain model
User → Membership → Business. Business → Customer → Device → RepairJob → JobEvent. Each customer/device/job is scoped to a business. Device code is stable over multiple jobs; every job has its own code and separate unguessable customer ticket token.

## Security constraints
- Check authenticated membership and businessId on *every* business data query and mutation.
- Do not publicly expose IMEI, serial, phone, email, technician information or internal notes.
- Ticket publicToken is an opaque capability. Share only with intended customer. For production, support rotation/revocation of tokens and access review.
- Auth secret and CockroachDB URL must be configured as encrypted Vercel environment variables, not in Git.
- Passwords use bcrypt hashing. Cookies are signed, HttpOnly, SameSite=Lax and Secure in production.
- Add rate limits, CSRF/origin review, email verification, password reset, MFA, event history, photo storage, and session revocation before wider public SaaS launch.

## Database and deployment
- CockroachDB requires TLS. Use the CockroachDB connection URI and a connection pooling approach compatible with the chosen deployment setup.
- Retry P2034 conflicts in contested write transactions with bounded backoff and review idempotency.
- Run Prisma migrations in an authorized deployment or CI step, never ad hoc during user requests. 
- A Vercel deployment is not a successful release until DB env values, migrations, build, browser interactions and auth flows are verified.

## Constraints at current milestone
Foundational code has not yet been integrated with a live CockroachDB instance or passed a production build. The customer receipt uses browser Print → Save as PDF, not a separate server PDF renderer. Pilot functionality is a foundation, not yet production hardened.
