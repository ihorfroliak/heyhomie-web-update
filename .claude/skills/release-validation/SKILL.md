---
name: release-validation
description: Validate a heyhomie.io change is safe to ship and confirm what production actually serves after deploy — build, lint, smoke routes, live tag checks, rollback plan, state/changelog update. Use before and after every deploy.
---

# release-validation

## Purpose
Close the loop between "code written" and "production serves it", with evidence.

## When to use
- Before requesting a deploy.
- Immediately after a deploy.
- When production behaviour and repo code appear to disagree.

## When NOT to use
- Mid-development, before the change is complete.

## Required inputs
Changed files, affected routes, the deploy mechanism, the rollback plan.

## Workflow
### Pre-deploy
1. `npm run lint` — must pass (CI gates on it).
2. `npm run build` — must pass. Next 10 / Node 12; do not silently upgrade the toolchain to make a build pass.
3. Smoke locally: `/`, `/en`, `/krakow`, `/en/krakow`, plus any changed route. Booking flow opens and reaches at least service selection.
4. Confirm the rollback path exists. **The repo currently has no git history (R1)** — until that is fixed, "rollback" means a filesystem copy of the previous state, taken *before* the change.

### Post-deploy
5. Re-run the live checks from `website-audit` §3–§4 on every changed route.
6. Confirm `/robots.txt` and `/sitemap.xml` return the expected content and status.
7. Confirm tags fire once, not twice, on a real route change.
8. Record evidence: command, result, timestamp, route, artifact.

## Validation
A release is validated only when the live checks match the intended change. Repo-side success is not release validation.

## Notes on this project's deploy path
`.gitea/workflows/ci.yaml` runs lint → Docker build/push to `gitea.stuzer.link`. **The `cd` job is commented out — deployment is manual and unverified (R4).** Confirm who deploys and how before promising a ship date.

## Output
WEBSITE_PROJECT_STATE.md §7/§11/§12 update + TESTING and CHANGELOG sheet rows.

## Relevant files
`.gitea/workflows/ci.yaml`, `Dockerfile`, `entrypoint.sh`, `server.js`, `package.json`
