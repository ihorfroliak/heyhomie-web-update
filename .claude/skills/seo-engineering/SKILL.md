---
name: seo-engineering
description: Implement and validate technical + local SEO for heyhomie.io — metadata, canonical, hreflang, sitemap, robots, schema.org, internal linking, city and service page strategy in PL and EN. Use for any SEO change or new indexable page.
---

# seo-engineering

## Purpose
Ship technical and local SEO that survives Google's guidelines and improves Ads landing-page quality.

## When to use
- Adding or changing an indexable page.
- Metadata, canonical, hreflang, sitemap, robots, structured data work.
- Evaluating whether a city × service page is justified.

## When NOT to use
- Copywriting without a technical component → `content-localization`.
- Anything measurement-related → `analytics-engineering`.

## Required inputs
Page purpose, target locale(s), primary/secondary keywords with evidence of demand, existing route.

## Workflow
1. **Routing is fixed.** PL unprefixed, EN under `/en`. Never introduce `/pl/`, never add IP-based redirects.
2. Metadata comes from `messages/{pl,en}.json` — never hardcode copy in a component.
3. Every indexable page must emit: unique `<title>`, unique description, **exactly one `<h1>`**, `rel=canonical` (self-referencing, absolute, `https://www.heyhomie.io`), `<HreflangLinks path="…" />` with `pl`/`en`/`x-default`.
4. Structured data via a JSON-LD `@graph`. Reuse the pattern in `CleaningSeoJsonLd.js`. **Never emit `aggregateRating`/`review` without real verifiable reviews.**
5. Add every new indexable path to `STATIC_PATHS` in `pages/sitemap.xml.js`.
6. PL and EN keyword sets are researched **independently** — do not translate keywords.
7. New city × service page requires: demonstrated search demand + commercial intent + service actually available in that city + ≥60% unique on-page content. Otherwise do not create it (doorway-page risk).

## Validation
- `curl` the built page; assert title/description/canonical/hreflang/JSON-LD present and correct per locale.
- One `<h1>` per rendered page (booking/profile modals currently violate this — fix at component level, see R6).
- Validate JSON-LD against schema.org / Rich Results Test.
- `/sitemap.xml` returns 200 XML and contains the new path in both locales.

## Output
Code + SEO sheet rows in `HeyHomie_Website_Page_Inventory.xlsx`, + WEBSITE_PROJECT_STATE.md §3 update.

## Relevant files
`components/seo/HreflangLinks.js`, `components/serviceLanding/cleaning/CleaningSeoJsonLd.js`, `components/serviceLanding/cleaning/cityDistricts.js`, `pages/sitemap.xml.js`, `public/robots.txt`
