# AGENTS.md — Fixa engineering instructions
Scope: entire repository | Owner: Bespoke Technologies | 2026-10-30

## Mission
Build Fixa as a professional Nigeria-first repair workspace and evidence-based technician discovery platform. Optimize trustworthy outcomes, concise mobile-first UX, maintainability and business value. Do not overpromise technician competence or fabricate review evidence.

## Source of truth
1. CEO-approved product decisions and project scope.
2. `docs/ARCHITECTURE.md` for boundaries and intended systems.
3. Existing code, Prisma schema and migration history for current implementation.
4. Tests, runtime evidence and Vercel deployment reports for verification.
Inspect existing code before editing. Report differences; do not overwrite operational behavior blindly.

## Technical constraints
- TypeScript strict, Next.js App Router, React, Prisma CockroachDB; Vercel is sole app host.
- Prefer existing CSS design system, Fixa wordmark and Lucide icons. Do not invent alternate logos, brand identities or extra icon libraries.
- No independent NestJS/Express service, microservice or paid integration without approval.
- Server components for reads; server actions/routes for mutations, with Zod parsing, authorization and error handling.
- No credentials or real customer data in git, logs or previews. Never request secrets in chat.

## Trust boundaries — mandatory
- Scope every workspace read/write to authenticated business membership; check entity ownership before linking customers, devices, jobs or profile.
- Public endpoints use allowlisted fields and approved-publication predicate.
- Differentiate contact verification, identity verification, location verification and skills assessment. Never award generic expertise badge by default.
- New public profile defaults to draft; only authorized platform moderation can approve/reject/suspend.
- Reviews are legitimate only with a properly validated invitation/verification flow; moderate abusive submissions without suppressing negative feedback for business interests. Guard duplicates, spam, self-review, unsafe text and PII.
- Protect immutable job history; avoid exposing private repair information via public QR/review tokens.
- Explicit geolocation permission and equivalent manual location selection. Do not persist raw visitor location unnecessarily.
- Treat state-changing requests as untrusted: server-enforced authorization; rate limits and anti-abuse where public.

## Interaction and design standard
Clean, premium, fast, quiet Fixa UI: deep green/olive accents, good contrast, whitespace, precise typography, accessible forms, clear confirmation/error states, responsive phone-first layouts. Reuse existing Fixa mark `fixa.`. Animations should communicate state, support reduced motion, and never block repair tasks. No fabricated statistics, certifications or customer stories in public production.

## Workflow
1. Inspect affected files/schema, routes, Vercel settings, tests and migration versions.
2. Write an executable plan bounded to one vertical slice.
3. Work on a dedicated branch with minimal, reviewable commits.
4. For schema changes: add an **additive** Prisma migration, review SQL for CockroachDB, document backfill and safe rollback. Do not run production migrations without confirming access/recovery and correct environment.
5. Write automated unit/integration/browser checks for success, failure, tenant-crossing and abuse cases. Prefer real DB tests for auth-sensitive features.
6. Run lint, strict typecheck, production build, tests. Inspect Vercel preview build/logs. A green build alone does not prove live DB operations.
7. Produce PR with scope, verification results, migration requirements, feature-flag status, risks and deploy instructions.
8. Merge/deploy only after release gates pass; don't advertise unfinished discovery as live.

## Release order
R1: Search and device registration reliability.
R2: Profile identities, specialties, service areas, approval workflow.
R3: Browse/search, consent-based location, review invitations, moderation.
Keep existing repair SaaS functional during expansion. Do not open unmoderated directory or self-published credentials.

## Definition of done
No regressions; correct tenant isolation; no inadvertent public personal data; accessible keyboard and mobile flows; tests and build pass; migrations reviewed/rehearsed; production monitoring/rollback possible; verifiable report of what *actually* shipped.

## Additional account and media controls
Google sign-in uses OIDC PKCE/state/nonce, verifies Google ID tokens and must not automatically link existing accounts on email alone. Existing password accounts remain usable. Account security email uses short-lived single-use hashes and minimalist Resend transactional templates only. Work Portfolio is optional and tied to real ready/collected jobs; uploaded media must be private, resized/metadata checked, client consent attested and moderator approved before public display. Public work cards have a single image and title only. Do not bypass `ENABLE_PORTFOLIO` or customer privacy gates. Refer to `docs/GOOGLE_EMAIL_PORTFOLIO_RUNBOOK.md` for checks and migration instructions.
