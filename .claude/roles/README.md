# Specialist roles — HeyHomie website project

These are **reasoning roles**, not always-on agents. Adopt one when its expertise is needed; adopt them **sequentially** where dependencies exist.

Do not run several roles in parallel over the same repository — each cold start re-reads the same files and burns tokens for no gain. Every role reads `docs/website/WEBSITE_PROJECT_STATE.md` first and reads only the files its task actually touches.

| Role | File | Owns | Depends on |
|---|---|---|---|
| Website Architect | `website-architect.md` | routing, rendering, structure, performance | — |
| SEO Specialist | `seo-specialist.md` | metadata, schema, indexability, keyword strategy | Architect |
| Analytics Engineer | `analytics-engineer.md` | data layer, events, conversions, consent | Architect |
| CRO Specialist | `cro-specialist.md` | funnel, CTAs, landing-page relevance | Analytics |
| Content & Localization | `content-localization-specialist.md` | PL/EN copy | SEO |
| QA Engineer | `qa-engineer.md` | tests, evidence, regression | all |

Typical order for a page change: **Architect → SEO → Content → Analytics → CRO → QA**.
