# Fixa R1–R3 controlled launch runbook
Version 1.0 · 2026-10-30 · Owner Bespoke Technologies

## Deployment state
This branch implements R1 repair improvements and R2/R3 candidate features, **not** an approved public marketplace launch. `ENABLE_DISCOVERY` defaults to `false`. Do not turn it on to mask missing verification, operational or data protection requirements.

## Preparation
1. Confirm correct Vercel project/team, production branch, current deployment, CockroachDB database and migration history. No secrets in GitHub or support messages.
2. Back up the production CockroachDB database; verify restore steps and a known-good deployment rollback. Rehearse additive SQL migration on a separate copy of the schema and representative data.
3. Run `npx prisma migrate status` and reconcile earlier migration history before applying `20261030030000_repair_discovery_v1`; only then `npx prisma migrate deploy` in the authorized environment.
4. Verify existing customers, devices, jobs and ticket links still work after migration. Confirm query indexes, state transition logging and transaction conflicts.
5. Vercel app envs: `DATABASE_URL` (encrypted, TLS); `AUTH_SECRET` (encrypted, >=32 characters); `NEXT_PUBLIC_APP_URL=https://fixa.bespoketech.com.ng`; `ENABLE_REGISTRATION` controlled; `ENABLE_DISCOVERY=false` until marketplace approval. Preview must use a separate test database if migrations are exercised.

## Platform administrator bootstrapping
No public signup may grant platform-admin status. A DBA must identify an already authenticated, explicitly authorized Fixa user (confirm their identity out of band), then add its UUID to `PlatformAdmin` using CockroachDB's protected SQL console. Example after replacing the UUID:

```sql
INSERT INTO "PlatformAdmin" ("userId") VALUES ('<APPROVED_EXISTING_USER_UUID>');
```

Never use a publicly supplied email string or client-side role to authorize moderation. Verify a non-admin account cannot load `/app/admin` or invoke moderation Server Actions.

## R1 tests
- Returning customer found by name, Nigerian local phone and +234 form, across Customers, Devices and Repair Jobs.
- Search by permanent device code, manufacturer model, serial and IMEI remains tenant-specific.
- Register phone/laptop/tablet/other; choose or type custom brand/product and exact model code. Existing device IDs survive migration.
- Create jobs, assign eligible technicians, restrict invalid status jumps, require collection recipient and confirmation, and retain event trail and private ticket access.
- Simulate concurrent status writes; only one valid transition/event should persist.

## R2 tests
- Create private technician profile, specialties, categories, approved public phone and service area.
- Profile remains DRAFT until submitted, PENDING during checks; it never enters public search without APPROVED.
- Admin checks actual contact and service-area evidence, records decision reason, approves or rejects; approval does **not** signify skill certification.
- A changed approved profile returns to DRAFT, needing reapproval. Suspensions remove listings immediately. Cross-tenant profile writes must fail.
- Staff cannot assign or administer another business's technician.

## R3 tests
- Without location permission, city/area manual search works. Geolocation prompt appears only after pressing "Use my location"; failure is graceful.
- Only APPROVED profiles display. No customer phone, name, repair job ID, IMEI, serial, internal notes or moderation details leak into search HTML, public links or logs.
- Full and partial specialty matching, case differences, empty/no-results, mobile result cards and keyboard navigation.
- A review invitation can be issued only for an eligible COLLECTED job tied to an explicitly assigned, APPROVED profile. Test expiration, duplicate submission, unassigned jobs, staff role and forged token.
- Submitted review remains PENDING; admin approves/rejects with audit trail. Negative reviews are eligible for publication. Customer PII must be removed from published comments; test admin rejection of doxxing.
- Review count and average use **only published** reviews and full aggregate, not a partial page.

## Essential public launch protections still pending
- Durable abuse-rate limits for login, sign-up, review invite/submit and public profile views as appropriate; detection, monitoring and operational response.
- Stronger identity/ownership evidence and a documented manual verification playbook; photo upload to approved storage, image moderation and privacy safeguards. User-managed remote URLs are intentionally not exposed in V1.
- User reporting, review disputes/appeals and complaint handling; privacy notice, terms, data-retention and incident response.
- Account verification/recovery, session invalidation, mandatory auth assurance for admins and audit/alerts.
- Documented human verification and customer support process. Never call a profile "skills verified" without a defined assessment.

## Launch sequence
1. Private migration rehearsal and DB-backed E2E integration.
2. Limited, manually moderated pilot with selected Calabar repair professionals; keep public discovery flag off while building curated profiles.
3. Privacy/legal and abuse-readiness gate, documented admin staffing and operations.
4. Turn on `ENABLE_DISCOVERY=true` in the approved production Vercel project, redeploy and smoke test. Announce only after real profiles and review integrity are verified.

## Rollback
Turn `ENABLE_DISCOVERY` off and redeploy if trust or abuse control fails; preserve data and review records for investigation. Roll back Vercel application if needed, but **do not down-migrate CockroachDB blindly**. Follow a forward-compatible schema change/recovery procedure.
