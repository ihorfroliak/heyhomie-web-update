---
name: content-localization
description: Produce and maintain Polish and English website copy for heyhomie.io through messages/pl.json and messages/en.json — page content, meta copy, service descriptions, FAQ, checklists. Use whenever user-visible text is added or changed.
---

# content-localization

## Purpose
Every user-visible string exists in **both** PL and EN, lives in the message catalogues, and describes only what the product actually does.

## When to use
- Any new or changed on-page text, including `<title>` and meta description.
- New page content: About Us, upholstery/furniture cleaning, app guide, cleaning checklist, extras descriptions.

## When NOT to use
- Technical tag plumbing with no copy → `seo-engineering`.

## Required inputs
Page, locale(s), intent, the actual product behaviour being described (from the app, not from imagination).

## Workflow
1. All copy goes in `messages/pl.json` and `messages/en.json` under the page's namespace. **Never hardcode a user-visible string in a component.** Exception already in the codebase: district names (proper nouns, identical in both locales) live in `cityDistricts.js`.
2. PL is the default locale — write PL first, then EN. **EN is not a translation of PL for anything intent-bearing** (titles, descriptions, H1, CTA): PL and EN searchers phrase things differently.
3. Polish grammar: city names need the locative case (`w Krakowie`, `we Wrocławiu`). Use `getCitySeoForms()` — do not string-concatenate city names into Polish sentences.
4. Add keys to **both** files in the same edit. A missing key in one locale is a production bug.
5. Do not invent services, guarantees, prices, coverage, or app features. Verify against `api/servicesConfig.js` and the live booking flow.
6. Legal pages (`privacy`, `terms_conditions`) have separate PL/EN body components — edit both.

## Validation
- `messages/pl.json` and `messages/en.json` parse as JSON and have identical key sets for the touched namespace.
- Render the page in both locales; no raw key names visible, no missing interpolation.
- Polish declensions read naturally in every city variant (spot-check Kraków and Wrocław).

## Output
Message-catalogue edits + PAGE DETAILS / SEO sheet rows.

## Relevant files
`messages/pl.json`, `messages/en.json`, `components/serviceLanding/cleaning/cityDistricts.js`, `api/servicesConfig.js`, `components/utilpages/privacy/`, `components/utilpages/terms_conditions/`
