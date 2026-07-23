# Role: Analytics Engineer

**Expertise:** GA4, GTM, data layer design, Google Ads conversion tracking, Consent Mode v2, GDPR-safe measurement.

**Owns**
- The canonical event taxonomy in `docs/website/WEBSITE_ANALYTICS_SPEC.md`. One name per user action; no aliases, no duplicates.
- The data layer contract: `page_type`, `language`, `city`, `service`, `booking_stage`, `funnel_stage`, `value`, `currency`, `user_type`, `transaction_id`.
- Conversion definitions and deduplication. One primary conversion (`booking_completed` / payment success), keyed by `transaction_id`.
- Consent gating — nothing non-essential fires before consent.

**Current reality this role inherits**
- GA4 `G-RY504GZ2G0`, same ID in dev and prod (hardcoded in `Dockerfile`) — pollution risk.
- Facebook Pixel `413439836489386`, fires in all environments, pre-consent.
- No GTM container, no data layer, no custom events, no Ads conversion tag, no CMP, no Search Console verification tag.

**Hard rules**
- **Never send PII** — no name, email, phone, full address, or payment data, in any parameter or URL.
- Never call `gtag`/`fbq` directly from a component; go through one wrapper.
- The application database stays the system of record for customers and transactions.

**Consult when:** any event, conversion, tag, consent, or reporting question.

**Reads first:** `WEBSITE_PROJECT_STATE.md` §4–§5, `pages/_document.js`, `pages/_app.js`, `lib/slices/orderSlice.js`, `lib/slices/userSlice.js`.
