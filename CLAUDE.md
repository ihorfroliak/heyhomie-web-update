# HeyHomie Web Update — heyhomie.io

Project root. Code, docs, previews and tooling all live under this one directory.

## Read first, every session
`docs/website/WEBSITE_PROJECT_STATE.md` — operational source of truth (phase, reconciliation,
open decisions). Page-level status: `HeyHomie_Website_Page_Inventory.xlsx`.

**Cross-repo source of truth (shared with the mobile apps):** before changing any pricing, brand
token, product copy or cleaning-domain rule, read [`../heyhomie-shared/`](../heyhomie-shared/README.md)
— `PRODUCT.md`, `DOMAIN_RULES.md`, `BRAND.md`, `ROADMAP.md`. HeyHomie is one product across four
surfaces (this web site + the `heyhomie-mobile` monorepo). The `/cleaning` calculator MUST match
`DOMAIN_RULES.md` (prices, add-ons, frequency, cancellation) and `BRAND.md` (tokens) — do not invent
prices or tokens. Any domain/brand change goes **into `heyhomie-shared` first**, then this repo.

## Layout
```
heyhomie-client/   the heyhomie.io website (Next.js 10, Pages Router, React 17,
                   Redux Toolkit, next-intl, styled-components + twin.macro, Stripe)
docs/website/      project state, audits, plans
preview/           static HTML previews for visual approval (not shipping code)
tools/             make_handoff_pdf*.py (needs reportlab)
.claude/roles/     website-architect, seo-specialist, cro-specialist, analytics-engineer,
                   content-localization-specialist, qa-engineer
.claude/skills/    website-audit, seo-engineering, conversion-optimization,
                   analytics-engineering, content-localization, qa-testing, release-validation
```

## Risk R1 — no git
`heyhomie-client` is a ZIP export: **no `.git`, no history, no rollback.** It carries an
undeployed homepage + SEO batch from 2026-06-29 that exists nowhere else:

- new: `components/home/HomeLanding.js`, `components/seo/HreflangLinks.js`,
  `components/serviceLanding/cleaning/{cityDistricts,CleaningSeoJsonLd,CleaningSeoSection}.js`,
  `pages/sitemap.xml.js`
- modified: `components/citypage/menus/bookingmenu/BookingMenu.js`,
  `components/citypage/servicesContainer/ServicesSlider.js`, `messages/{en,pl}.json`,
  `pages/{index,cleaning}.js`, `public/robots.txt`

Baseline for diffing: `../_reference/heyhomie-gitea/heyhomie-client`.
Put this under git before changing anything (decision D2).

## Fixed constraints (do not renegotiate)
Existing URL architecture is source of truth — PL unprefixed, EN under `/en`, 6 cities
(krakow, warsaw, wroclaw, poznan, katowice, rzeszow) × 2 languages; no `/pl/` prefix;
no IP-based redirects; do not break booking context; do not invent product functionality;
no duplicate analytics events; tests are mandatory; production changes require validation.

## Run
```
cd heyhomie-client && npm install && npm run dev
```
`node_modules` is not installed.
