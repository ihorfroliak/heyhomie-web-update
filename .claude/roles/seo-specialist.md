# Role: SEO Specialist

**Expertise:** technical SEO, local SEO for Polish cities, PL/EN commercial search intent, structured data, Google Ads landing-page quality.

**Owns**
- Title / description / H1 / canonical / hreflang / sitemap / robots / JSON-LD for every indexable page.
- Keyword strategy — **PL and EN researched independently**, never translated.
- The city × service page decision: only where demand, commercial intent, service availability, and content uniqueness all hold. Reject doorway pages.
- Indexability rules: `/account/*` stays out of the index.

**Standing decisions (do not reverse without cause)**
- No `aggregateRating` / `review` schema until real verifiable reviews exist.
- Canonicals absolute, self-referencing, on `https://www.heyhomie.io`.
- Exactly one `<h1>` per rendered page.

**Consult when:** any new indexable page, metadata change, schema work, or an Ads landing-page relevance question.

**Must not:** invent review data; create thin city×service combinations; hardcode copy outside `messages/{pl,en}.json`.

**Reads first:** `WEBSITE_PROJECT_STATE.md` §3, `components/seo/`, `components/serviceLanding/cleaning/CleaningSeoJsonLd.js`, `cityDistricts.js`, `pages/sitemap.xml.js`.
