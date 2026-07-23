---
name: analytics-engineering
description: Design and implement GA4/GTM measurement for heyhomie.io — data layer, canonical event taxonomy, funnel tracking, consent mode, Google Ads conversions, deduplication, PII safety. Use for any tracking, event, or conversion work.
---

# analytics-engineering

## Purpose
One canonical, privacy-compliant measurement layer covering traffic → landing → CTA → booking → payment → completion.

## When to use
- Adding, renaming, or debugging any analytics/conversion event.
- Data layer, consent, GA4 config, Ads conversion tracking.

## When NOT to use
- Interpreting results / proposing UX changes → `conversion-optimization`.

## Required inputs
Funnel stage being instrumented, the component that owns the user action, whether the event is a conversion.

## Workflow
1. **Read `docs/website/WEBSITE_ANALYTICS_SPEC.md` first.** It is the canonical event list. If an event is not in it, add it there before writing code.
2. Naming: `snake_case`, verb-object, past tense for completions (`booking_completed`), present for starts (`booking_started`). No aliases, no per-page variants.
3. Fire through a single wrapper (`lib/analytics.js`) that pushes to `window.dataLayer` — never call `gtag`/`fbq` directly from a component.
4. Data layer keys: `page_type`, `language`, `city`, `service`, `booking_stage`, `funnel_stage`, `value`, `currency`, `user_type`, `transaction_id`.
5. **Never send PII**: no name, email, phone, full address, payment data. Use hashed/anonymous IDs only. The application database stays the system of record.
6. Conversions: exactly one primary (`booking_completed` / payment success) with `transaction_id` for deduplication. Secondary: `booking_started`, `phone_click`, `whatsapp_click`, `contact_submitted`.
7. Consent: nothing non-essential fires before consent. Consent Mode v2 signals (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`) set before any tag loads.
8. Existing tags to reconcile, not duplicate: GA4 `G-RY504GZ2G0` in `pages/_document.js`; Facebook Pixel `413439836489386` (`PageView`, `CompleteRegistration` in `userSlice`, `Purchase` in `orderSlice`).

## Validation
- GA4 DebugView shows the event once, with all required params.
- Complete a booking end-to-end: exactly **one** `booking_completed` and **one** Ads conversion, same `transaction_id`.
- Route change fires exactly one `page_view`.
- Network inspection: no PII in any request payload or URL.
- Consent denied → no analytics/ads requests at all.

## Output
Code + `WEBSITE_ANALYTICS_SPEC.md` update + ANALYTICS sheet rows in the workbook.

## Relevant files
`pages/_document.js`, `pages/_app.js`, `components/FacebookPixel.js`, `lib/fpixel.js`, `lib/slices/orderSlice.js`, `lib/slices/userSlice.js`, `components/citypage/menus/bookingmenu/`
