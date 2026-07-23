---
name: qa-testing
description: Write and run tests for heyhomie.io — unit, integration, SEO assertions, analytics event assertions, and E2E booking journeys — and record the evidence. Use before marking any implementation task complete.
---

# qa-testing

## Purpose
No production change is complete without validation and recorded evidence.

## When to use
- Before marking any implementation task done.
- After any change to routing, booking flow, metadata, or tracking.

## When NOT to use
- Pure documentation edits.

## Required inputs
Changed files, affected routes, the behaviour that must not regress.

## Workflow
1. **Current baseline: there is no test runner in the repo.** The first testing task is standing one up (proposed: Playwright for E2E, Vitest/Jest for unit). Until then, tests are manual and must still produce evidence.
2. Test layers:
   - **Unit** — pure logic: `getCitySeoForms`, price calculators, `api/timeUtils.js`, sitemap URL builder.
   - **Integration** — page components render with expected metadata; analytics wrapper pushes the expected `dataLayer` payload.
   - **E2E** — mandatory journeys: homepage→booking; city page→booking; `/en/[city]`→booking; service page→booking; booking completion; payment completion where testable; language switch preserves context; city context preserved; analytics event fires; conversion event fires.
   - **SEO** — title, description, single H1, canonical, hreflang, sitemap 200, robots, JSON-LD valid, indexability.
   - **Analytics** — event names, params, no duplicate conversions, `transaction_id` present, conversion value correct.
   - **Regression** — the existing booking flow still completes.
3. Run in this order: `npm run lint` → typecheck (none configured; skip and say so) → unit → integration → E2E → `npm run build`.
4. If a step is skipped or unavailable, **say so explicitly**. Never report a skipped step as passed.

## Validation
Evidence = command run + result + timestamp + route + artifact/screenshot reference. Failures are reported with the actual output.

## Output
TESTING sheet rows in `HeyHomie_Website_Page_Inventory.xlsx` + WEBSITE_PROJECT_STATE.md §7 and §12.

## Relevant files
`package.json`, `.gitea/workflows/ci.yaml`, `pages/`, `components/citypage/menus/bookingmenu/`
