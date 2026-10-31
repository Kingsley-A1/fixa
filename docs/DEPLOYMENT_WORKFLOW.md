# Fixa deployment & responsive release controls
Updated: 31 October 2026 · Scope: Fixa only

## Deployment discipline
Previous source-file-by-source-file commits caused repeated previews and exhausted Vercel's Hobby deployment budget. A draft change is not a deployment-ready unit.

**Vercel setting:** `previewDeploymentsDisabled=true` for project `fixa` (team `king-tech-foundation`). Only the Fixa project is changed; this is intentionally kept enabled after release. Do not re-enable automatic previews as a workaround for visual QA.

### Normal development and production path
1. Start from the current `main`; create a feature branch.
2. Stage all cohesive files and create **one batched commit** (or a small number of reviewable commits). Avoid one push per file.
3. Open one PR. GitHub Actions runs install, Prisma client generation, lint, strict type checking, unit tests, optimized production build and Playwright viewport QA. CI does **not** deploy.
4. Review QA screenshots and ensure checks are green before merging. Fix failed tests on the same branch and rerun checks.
5. Merge once to `main`. Vercel's Git integration automatically creates a **single production deployment** for the merge. Do not manually redeploy the same commit.
6. Verify READY state, exact Git SHA, domain aliases, `/`, `/about`, `/faq`, `/support`, `/terms`, `/privacy`, login and service availability. Verify customer data isn't exposed.
7. If a release fails after merge, restore the last known-good production deployment; investigate before another release. Record that rollback may require explicit promotion to resume assignment.

## Visual QA
Pull request CI visits six public pages at **320, 390, 768, 1024, 1280 and 1440px** (36 screenshots). QA asserts no horizontal overflow, brand/nav/action separation, centered policy and FAQ text columns, visible shared footer, compact-menu navigation, desktop navigation, and one-open-at-a-time FAQ behaviour. Screenshots are attached to the CI workflow artifact for human review.

Do not change the internal repair workspace or service-ticket header through public CSS. Shared public navigation should appear only on visitor-facing pages; the shared footer has the same boundary.

## Release guards
- Preview deployments disabled for Fixa to protect deployment quotas.
- `.github/workflows/quality.yml` is the pre-merge quality gate; if GitHub branch-protection settings permit it, require this check before merging.
- Browser tests are product QA, not substitutes for DB-backed integration tests of OAuth, repair operations or marketplace.
- Retain feature flags, credentials and migrations from earlier releases; don't run schema changes as part of this public layout change.
- Do not assume a GitHub merge means production is READY. Check Vercel target and alias explicitly.
