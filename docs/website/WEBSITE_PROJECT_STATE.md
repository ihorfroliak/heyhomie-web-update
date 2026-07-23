# WEBSITE_PROJECT_STATE.md

**Operational source of truth for the HeyHomie website improvement project.**
Read this first in every session. Do not paste code here. Keep it compact.

| Field | Value |
|---|---|
| Last updated | 2026-07-23 (paths rewritten after workspace reorganisation) |
| Current phase | **PHASE A–D complete (audit + context recovery). Awaiting approval to implement.** |
| Production site | https://heyhomie.io |
| Project root (session cwd) | `C:\Users\ihorf\Projects\heyhomie-web` |
| Frontend repo (source of truth) | `C:\Users\ihorf\Projects\heyhomie-web\heyhomie-client` |
| Working/docs directory | `C:\Users\ihorf\Projects\heyhomie-web\docs` |
| Static preview artifacts | `C:\Users\ihorf\Projects\heyhomie-web\preview\` (index.html, krakow.html) |

---

## 0. Repository map (which repo is which)

All projects were consolidated under `C:\Users\ihorf\Projects\` on 2026-07-23; the
website code, docs and previews now live in **one** tree so a single session cwd covers them.

| Path | What it is | Relevant? |
|---|---|---|
| `Projects\heyhomie-web\heyhomie-client` | **The heyhomie.io website.** Next.js 10, Pages Router, React 17, Redux Toolkit, next-intl, styled-components + twin.macro/Tailwind 2, Stripe. | **YES — the project repo** |
| `Projects\heyhomie-web\preview\` | Two static HTML previews (`index.html`, `krakow.html`, 2026-06-30) rendering the new homepage/city SEO layout for visual approval. Not shipping code. | Reference only |
| `Projects\heyhomie-web\tools\` | `make_handoff_pdf.py`, `make_handoff_pdf_multilang.py` — handoff PDF generators (need `reportlab`). | Tooling |
| `Projects\heyhomie-mobile` | Mobile monorepo (admin/client/worker, Expo). GitHub `heyhomie-mobile-apps-`. | No |
| `Projects\homies` | Backend/platform rewrite + API + docs. | No (booking API reference only) |
| `Projects\_reference\heyhomie-gitea` | Read-only export of the 10 company Gitea repos (api, client, admin, employee, helm, …). Baseline for diffing this repo. | Reference only |

> **Risk R1:** the website repo is a ZIP export — **there is no `.git` directory**, so there is no history, no branches, no diff, no rollback. All "what changed" knowledge comes from file mtimes and the reconciliation below.

---

## 1. Current architecture

- **Next.js 10.0.5**, Pages Router (`pages/`), Node 12 engine pin, custom `server.js` (Express + ssl-redirect).
- **i18n:** built-in Next i18n. `locales: ['en','pl']`, `defaultLocale: 'pl'`. Copy in `messages/pl.json` (~101 KB) and `messages/en.json` (~96 KB) via `next-intl`.
- **Routing (do not change):** PL unprefixed, EN under `/en`.
  - `/` and `/en` — homepage
  - `/[city]` and `/en/[city]` — city page + full booking flow (6 cities × 2 = 12 variants)
  - `/cleaning`, `/flowers`, `/massage`, `/about`, `/privacy`, `/terms_conditions` (+ `/en/…`)
  - `/account/*` — private, `noindex` via robots
  - `/sitemap.xml` — SSR route (in repo, **not live**)
- **Cities:** `krakow, warsaw, wroclaw, poznan, katowice, rzeszow`. City list is fetched at request time from the Rails API `GET {BASE_URL}api/v1/cities`; SEO metadata for cities lives in `components/serviceLanding/cleaning/cityDistricts.js` (`seoCitiesOrder` = krakow, warsaw, poznan, wroclaw, katowice, rzeszow).
- **State:** Redux Toolkit slices (`user`, `order`, `addresses`, `cards`, `ui`). Booking flow entirely client-side inside the city page (`BookingMenu` + submenus). Payments via Stripe Elements.
- **CI:** `.gitea/workflows/ci.yaml` — lint → Docker build/push to `gitea.stuzer.link`. **CD job is commented out** → deploys are manual.

---

## 2. Reconciliation — neighbouring Claude Code context

A batch of work was done on **2026-06-29 (21:59–22:59)**. Everything else in the repo dates from the **2026-03-23** export. That timestamp split is the reconciliation key.

### A. Already implemented (in repo, DO NOT redo)

| File | What was done |
|---|---|
| `pages/index.js` | Homepage rebuilt as an **indexable landing page**. Geolocation auto-redirect **removed** (comment documents it); returning visitors with `user.selectedCity` still bounce to their city. Localised `<title>`/description/OG from `IndexPage.meta`. |
| `components/home/HomeLanding.js` | New homepage component: hero + H1, city picker grid (SEO-ordered), 4 value cards, CTA to `/cleaning`. |
| `components/seo/HreflangLinks.js` | Reusable `pl` / `en` / `x-default` hreflang emitter. |
| `pages/sitemap.xml.js` | SSR sitemap: static paths + cities from the API, with `xhtml:link` alternates. |
| `public/robots.txt` | `Allow: /`, disallow `/account/` and `/*/account/`, `Sitemap:` directive. |
| `pages/[city].js` | City-templated `<title>`, description, OG (`meta.title_city` etc. with `{cityLocative}`), `<HreflangLinks path={city.name} />`, renders `CleaningSeoSection`. |
| `components/serviceLanding/cleaning/CleaningSeoSection.js` | ~370-line SEO content block for city pages (districts, FAQ, services, cross-links). |
| `components/serviceLanding/cleaning/CleaningSeoJsonLd.js` | schema.org `@graph`: LocalBusiness/CleaningService + Service/OfferCatalog + BreadcrumbList + FAQPage, **plus the only `rel=canonical` in the codebase**. Deliberately omits `aggregateRating` (no fake reviews) — keep that decision. |
| `components/serviceLanding/cleaning/cityDistricts.js` | 6 cities, Polish locative forms, district lists, `seoCitiesOrder`, `getCitySeoForms()`. |
| `pages/cleaning.js` | Hreflang added. |
| `messages/en.json`, `messages/pl.json` | New keys: `IndexPage.meta.*`, `IndexPage.landing.*`, `meta.title_city` / `og_title_city`, `CleaningSeoSection.*`. |
| `components/citypage/menus/bookingmenu/BookingMenu.js`, `…/servicesContainer/ServicesSlider.js` | Touched in the same batch — scope not yet verified. **Open item O1.** |

### B. Partially implemented

- **Canonicals** — only on city pages (inside `CleaningSeoJsonLd`). Missing on `/`, `/cleaning`, `/flowers`, `/massage`, `/about`, `/privacy`, `/terms_conditions`.
- **Hreflang** — only on `/`, `/[city]`, `/cleaning`. Missing on `/flowers`, `/massage`, `/about`, `/privacy`, `/terms_conditions`.
- **Structured data** — only the cleaning/city graph. No Organization/WebSite schema sitewide, none on service landings.
- **Sitemap** — code exists, **404 in production**.

### C. Planned only / not started

Upholstery & furniture cleaning page; customer app guide; updated cleaning checklist page; extras/additional-services descriptions; About Us update; GA4 event taxonomy; data layer; Google Ads conversion tracking; consent management; heatmaps/session recording; any automated tests.

### D. **Nothing from the 2026-06-29 batch is deployed.** Verified live 2026-07-23 (see §7).

### E. Duplicate work to avoid

Do **not** re-audit or rewrite: the homepage layout, the geo-redirect removal, hreflang component, sitemap route, robots.txt, city SEO dataset, the city JSON-LD graph, or the city-page meta templates. Do **not** re-derive the city list or district data. Do **not** rebuild the static previews.

---

## 3. SEO state

**Live (production) — old build:**
- `/en/krakow` → `<title>Heyhomie.io - Get the services you need`; generic meta description listing every service; **no canonical, no hreflang, no JSON-LD**; **6 `<h1>` elements** on one page (booking menu, confirm-code menu, profile menu, "Unfinished order" ×2 all render `<h1>`); ~221 KB HTML.
- `/robots.txt` → 2 lines, `Disallow: /account/`, **no `Sitemap:` directive**.
- `/sitemap.xml` → **404** (Next.js 404 page, 81 KB).
- `/` → `<title>Heyhomie.io - Korzystaj wygodnie z usług w swoim domu`, 200 OK.

**In repo, undeployed:** everything in §2.A.

**Known gaps:** no canonical strategy sitewide; duplicate-H1 problem is a component-level bug (menus/modals use `<h1>`); no Organization/WebSite schema; no city × service pages; no Search Console verification tag found in `_document.js`; Core Web Vitals unmeasured (Next 10, no `next/image`, raw `<img>`, Google Fonts render-blocking in `<head>`).

---

## 4. Analytics state

- **GA4** `G-RY504GZ2G0` — hardcoded in `.env.dev`, `.env.prod` **and** `Dockerfile` (same ID for dev and prod → **dev traffic pollutes production data**, risk R2). Loaded in `pages/_document.js` only when `NEXT_PUBLIC_NODE_ENV === 'production'`. Config sets `page_path` once on load; **SPA route changes are not tracked** for GA4.
- **Facebook Pixel** `413439836489386` — loaded unconditionally (also in dev), `PageView` on route change via `components/FacebookPixel.js`; `CompleteRegistration` in `lib/slices/userSlice.js`; `Purchase` in `lib/slices/orderSlice.js`.
- **GTM:** not installed. Only the raw `gtag.js` snippet (which creates `window.dataLayer`, but no GTM container).
- **Data layer:** none. No structured `dataLayer.push` anywhere.
- **Custom GA4 events:** none. Zero of the 20 required funnel events exist.
- **Consent management:** none found — no CMP, no Consent Mode v2. **Compliance risk R3** (GDPR; PL/EU traffic; FB Pixel fires before consent).
- **Search Console:** no verification meta tag in `_document.js`.

## 5. Google Ads tracking state

- **No `AW-` conversion tag, no `gtag('event','conversion')`, no enhanced conversions, no transaction ID, no conversion value.** Nothing exists. Conversions today can only come from GA4 imports — and GA4 has no purchase event either.

## 6. Heatmaps / session recording state

- **None.** No Microsoft Clarity, no Hotjar, no alternative. Greenfield.

## 7. Testing state

- **No test runner, no tests.** `package.json` has `dev`/`build`/`start`/`lint` only. No Jest, Playwright, or Cypress config.
- CI runs `npm run lint` then builds a Docker image. No test gate, no build validation of the changed pages beyond compile.
- **Evidence collected 2026-07-23** (live HTTP checks, `Invoke-WebRequest`): `/en/krakow` 200 / no canonical / no hreflang / no ld+json / 6 H1 / GA4 + FB Pixel present / no Clarity / no Hotjar / no `AW-`; `/robots.txt` 200, 33 bytes, no sitemap directive; `/sitemap.xml` → 404; `/` 200.

---

## 8. Known issues

| ID | Issue | Severity |
|---|---|---|
| R1 | Website repo has no git history — no rollback, no diff, no branch safety | High |
| R2 | Same GA4 property ID in dev and prod (`Dockerfile` hardcodes it) | High |
| R3 | No consent management; FB Pixel fires pre-consent | High (legal) |
| R4 | 2026-06-29 SEO/homepage work is undeployed; CD job commented out — deploy path unproven | High |
| R5 | `/sitemap.xml` 404 in prod; robots has no `Sitemap:` | Medium |
| R6 | Multiple `<h1>` per page from booking/profile/modal components | Medium |
| R7 | Next 10 / React 17 / Node 12 — EOL stack, limits CWV work (`next/image`, script strategies) | Medium |
| R8 | `getServerSideProps` on `/` and `/[city]` calls the Rails API on every request — no ISR/caching; TTFB and API coupling | Medium |
| R9 | Homepage still client-redirects returning visitors to their city — bots are fine, but real-user landing-page reports will be skewed | Low |
| O1 | `BookingMenu.js` / `ServicesSlider.js` changed 2026-06-29, purpose unverified | Open |

## 9. Open decisions

| ID | Decision needed |
|---|---|
| ~~D1~~ | ~~Which directory is the working repo?~~ **RESOLVED 2026-07-23:** the repo was moved into `Projects\heyhomie-web\heyhomie-client`; docs, previews and tools sit beside it under the same root. |
| D2 | Put the website repo under git (strongly recommended before any change) — new local repo, or push to an existing Gitea/GitHub remote? |
| D3 | GTM container vs. direct gtag for the event layer |
| D4 | Consent platform (custom banner vs. Cookiebot/Iubenda) + Consent Mode v2 |
| D5 | Microsoft Clarity (free, GDPR-friendly, no sampling) vs. Hotjar — pick **one** |
| D6 | Separate GA4 dev property / stream |
| D7 | Whether city × service pages are justified (per-city demand evidence required first) |
| D8 | Test stack: Playwright for E2E + Vitest/Jest for unit — and whether Node 12 pin gets lifted for the test toolchain |
| D9 | Who deploys, and how, given CD is disabled |

## 10. Next recommended action

1. Answer D1 + D2 — **put the repo under git before touching anything** (R1 blocks safe work).
2. Verify the 2026-06-29 batch builds and renders (`npm install && npm run build`, then smoke `/`, `/krakow`, `/en/krakow`).
3. Verify O1 (what changed in `BookingMenu` / `ServicesSlider`).
4. Ship the undeployed SEO batch (R4/R5) — highest value per unit of risk, code already written.
5. Then: consent + GA4 event layer + Ads conversions (§ analytics spec, to be written).

## 11. Files changed (this project, cumulative)

Recorded in `HeyHomie_Website_Page_Inventory.xlsx` → **CHANGELOG** sheet. 2026-06-29 batch = 13 files (§2.A). This session: **0 production files changed** (audit only).

## 12. Tests passed / pending

- Passed: live HTTP evidence checks (§7).
- Pending: everything else — no automated suite exists yet.
