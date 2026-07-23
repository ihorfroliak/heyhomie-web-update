---
name: conversion-optimization
description: Improve booking conversion on heyhomie.io — CTA placement, landing-page relevance for Google Ads, funnel drop-off analysis, friction removal in the booking flow. Use when the goal is more completed bookings, not new tracking or new copy.
---

# conversion-optimization

## Purpose
Increase completed bookings per session without breaking the existing booking flow.

## When to use
- Funnel drop-off analysis; CTA/hero changes; Ads landing-page quality work.
- Deciding what to test and how to measure it.

## When NOT to use
- Instrumenting the measurement itself → `analytics-engineering`.
- Pure translation/copy production → `content-localization`.

## Required inputs
Funnel stage and its measured drop-off, traffic segment (city, language, device, source), current CTA, the conversion goal.

## Workflow
1. **Evidence before opinion.** Name the metric and its source. If measurement does not exist yet, the measurement is the task.
2. Map the friction to a concrete step of: landing → CTA → booking_started → service → property/rooms → extras → date/time → address → contact → checkout → payment → completed.
3. Ads relevance: keyword theme → landing page → above-the-fold headline must share intent. A city+service query must not land on a generic homepage.
4. Propose the smallest change that could move the metric. One variable at a time.
5. **Never invent product functionality.** The application is the source of truth for what can be booked.
6. Preserve booking context (selected city, service, locale) across every navigation you touch.

## Validation
- Booking regression E2E passes on the changed route (see `qa-testing`).
- The target event's parameters still fire correctly after the change.
- Before/after metric named, with the observation window.

## Output
Recommendation + implementation + PAGE DETAILS / ANALYTICS sheet rows in the workbook.

## Relevant files
`components/home/HomeLanding.js`, `pages/[city].js`, `components/citypage/menus/bookingmenu/BookingMenu.js`, `components/serviceLanding/`
