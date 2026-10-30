# Fixa — Architecture & Delivery Standard
Status: Engineering specification · v1.1 · 2026-10-30
Owner: Bespoke Technologies · Scope: Releases 1–3

## 1. Intent and product boundaries
Fixa connects two independent but reinforcing experiences: (1) a private, tenant-isolated repair operations workspace and (2) a public technician directory with meaningful evidence, discoverability, and accountable reviews. Fixa is a **discovery and records platform, not a repair guarantor, escrow provider, or employer of listed technicians**. Never market a profile as verified expertise where only contact or identity has been checked.

- Workspace remains valuable to businesses with no public listing.
- Public profiles are optional and **not published on registration**.
- Customers may discover without registration; browser geolocation only after a clear user action and consent, with manual city/area fallback.
- Business service records are private; no phone, IMEI, serial, customer name, job detail, or internal note flows to public discovery.
- Initial free use does not remove moderation, verification, privacy or abuse controls.

## 2. Technology and deployment
Single Next.js App Router + TypeScript application on Vercel; CockroachDB via Prisma `provider = "cockroachdb"`. React server components for reads, Server Actions for authenticated mutations, and narrowly scoped public routes. No separate hosted API. Prisma migrations in `prisma/migrations` are authoritative schema-change history; never silently use `db push` on production. No new infrastructure solely to power discovery v1; use indexed database queries and bounded result sets.

## 3. Domain relationships and scope
- `User` identifies an authenticated account; `Membership` authorizes its role in a `Business`.
- `Business` is a tenant boundary for `Customer`, `Device`, `RepairJob`, `JobEvent`. Service records never cross tenants.
- `TechnicianProfile` is a **public identity proposal** owned by one business and its authorized account, with current workspace affiliation. Future independent technician multi-business membership is a separate migration and policy decision. Do not infer personal reputation from all staff of a business.
- `ServiceArea` is structured by city/state/area and optional approximate coordinates; no private residential address by default.
- `TechnicianSpecialty` stores repair-category capabilities **claimed by a profile**, not externally verified competence unless evaluated.
- `ReviewInvitation` is a one-use or otherwise bounded capability tied to a completed eligible job; never expose its token through publicly enumerable pages or include it in searchable profile data.
- `TechnicianReview` separates moderation status (pending/published/rejected) and evidence status (linked-service / unverified). Do not show unpublished reviews or unverified data as verified.
- `ModerationAction` holds who approved/rejected/disabled a profile or review and a reason. An audit trail is required.
- `PlatformAdmin` or a permission-controlled equivalent authorizes cross-tenant admin actions; account email strings or arbitrary client flags are not authorization.

## 4. Isolation, privacy and trust
Every workspace query/mutation scopes by the authenticated membership and `businessId`. Public profile endpoints return an explicit allowlist only. Use query-level publication filters and hide contact/location for unapproved profiles. Admin decisions require server-side platform authorization. Public write operations require verification/abuse defenses, size bounds and rate limits; avoid enabling unverified open review submission without protective infrastructure.

Verification vocabulary is literal:
- `submitted` evidence has been provided but not checked;
- `contact checked` confirms control of contact channel;
- `identity checked` is separate from professional competence;
- `location checked` confirms business/service area evidence;
- `skills assessed` requires a documented independent test.
No generic "Fixa verified professional" badge without appropriate checks.

Reviews: negative feedback must be allowed, abusive content can be moderated under published policy. Technicians may respond and appeal; evidence-backed reviews take precedence in trust messaging. Don't publish customer identifying information. Prevent review self-submission and duplicate use of invitations. A scanned QR alone is not proof of service.

Geolocation: opt-in; derive nearby suggestions client-side or from minimal ephemeral coordinates, don't persist raw user position without a justified purpose. Provide an equally useful manual location path. No silent geo-permission prompts.

## 5. Search design
Workspace search and public discovery are *distinct domains*:
- Workspace search: normalized Nigerian phone matches (080… ↔ +23480…), customer, device, job code, manufacturer and model identifiers; always tenant-scoped; indexed and paginated for large datasets.
- Directory search: only approved published profiles; filter city, state, area, service category, specialty. Case-insensitive but never produce cross-tenant private fields.
- Ranking starts with explicit relevance + proximity when user opt-ins + sufficient public feedback evidence. New technicians should not be hidden. No fabricated ratings or unearned ranking claims.

## 6. Devices and repair workflow
Device class → Brand → Commercial product name → Exact manufacturer model identifier → Permanent device record. Suggestions must allow precise free entry; categories include phone, laptop, tablet, desktop, smartwatch, console, accessory, other. Apple/iPhone, Samsung, TECNO, Infinix, itel, Xiaomi/Redmi, OPPO, HP, Dell, Lenovo and other are initial suggestions, not a claim of exhaustive device catalog.
Each job has a permanent reference and separate limited-data customer ticket; job state transitions logged atomically. Never treat a service acknowledgement as an invoice, payment receipt or authorization to collect. Handle unexpected errors without losing submitted data; don't leak internal exceptions.

## 7. Release slices / gates
R1 — Workflow reliability: repair search, device taxonomy, job state validation, test real tenant and phone matches. No data loss or unexpected schema incompatibility.
R2 — Technician identity: profile self-service, ownership control, skills claims, areas, admin review and explicit publish approval. No auto-publication.
R3 — Public discovery & reviews: usable no-login location search, privacy-safe profile pages and contact action, invitation-linked reviews and minimal server-verified moderation. Only public-approved records searchable.
Every release requires typecheck, lint, build, tests, migration rehearsal, tenant-crossing abuse tests, responsive accessibility passes, and documented rollback. Do not merge a partial release onto production merely because a preview build is READY.

## 8. Data migration safety
Additive migrations first; backfill existing Device data without dropping `model` or `category`. Existing IDs and ticket links remain stable. Never modify live schema by code-only pushes. For new required fields provide defaults/backfill or permit null until transitioned. Index foreign-key scope and publication status. Review CockroachDB transaction retry and uniqueness behavior. Treat production migrations as a gated, authorized step — currently not executed by this document change.

## 9. Observability and administration
Keep abuse/privacy logs separate from public data. Audit approvals, declines and suspensions with actor and timestamp. Monitor failed searches, sign-ins, service registration errors, and review submissions without logging secrets or excessive PII. Provide takedown/appeal mechanisms before opening unrestricted submissions. Verify available backups, restore practice and retention configuration.

## 10. Authority and documentation
- Product mission and launch strategy approved by Bespoke Technologies' CEO; detailed blueprint to be added separately.
- This document establishes intended architecture and rollout constraints.
- `AGENTS.md` establishes how coding agents work, not a substitute for product approvals.
- `prisma/schema.prisma`, migrations, source files, tests and Vercel state show implemented reality. When architecture and implementation differ, call it out rather than pretend work is complete.
