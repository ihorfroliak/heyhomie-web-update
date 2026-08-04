# CONTENT_INSERTION_SPEC.md

How new content/SEO blocks are added to existing HeyHomie pages.
Approved reference design: `preview/index.html`, `preview/krakow.html` (static mockups, **not shipping code**).

---

## 1. The scheme

Never rebuild a page. Take the page that already exists, and **insert the new block at a named anchor**
between two existing blocks. Everything above and below the anchor stays untouched — including the
booking flow, the services slider, and the testimonials.

Applies identically to **PL and EN**, and to **all 6 cities**.

## 2. City page — anchor (`pages/[city].js`)

Render order today:

```
ServicesContainer          services slider + hero
CitypageBody
  ├─ BlocksDiv             block_1 / block_2 / block_3  ("Wybierz usługę" → "That's it")
  ├─ BulletPoints          heading = CityPage.CitypageBody.row.heading
  │                        PL "To jest całkiem proste" · EN "It's easy"
  └─ TestimonialsDiv       heading = CityPage.CitypageBody.testimonials.heading
                           PL "Nasi klienci i zespół" · EN "Our customers speak for us"
CleaningSeoSection         ← currently HERE (after testimonials, before footer)
Footer
```

**Required position:** immediately **after `</BulletPoints>`** and **before `<TestimonialsDiv>`**
— i.e. between "To jest całkiem proste" and "Nasi klienci i zespół", inside `CitypageBody`.

Anchor coordinates: `components/citypage/body/CitypageBody.js` — `</BulletPoints>` line 736,
`<TestimonialsDiv>` line 737.

**Implementation rule:** `[city].js` stays the composition root. Pass the block down
(`<CitypageBody seoSection={<CleaningSeoSection city={city} />} />`) and render `{seoSection}`
at the anchor. Do not move the SEO content *into* `CitypageBody`, and do not duplicate the mount —
the current mount in `[city].js` is removed in the same change, never left in place.

## 3. Homepage — anchor

`/` and `/en` render `HomeLanding`, which has **no** "To jest całkiem proste" / "Nasi klienci"
blocks — those exist only on city pages. The homepage therefore needs its own anchor decision
before any homepage block is inserted. **Open question — do not guess.**

Separately, the homepage still ships stale meta copy: `IndexPage.meta.title` is the old
`"Heyhomie.io - Korzystaj wygodnie z usług w swoim domu"` and `meta.description` names Kraków on a
national page. Homepage also has no canonical and no Organization/WebSite schema.

## 4. Content status — already built, do not rebuild

`components/serviceLanding/cleaning/CleaningSeoSection.js` already implements `preview/krakow.html`
block for block:

| Preview block | Implementation |
|---|---|
| Intro H2 + 3 paragraphs | `intro.heading`, `intro.para_1..3` |
| 4 trust cards | `trust.*` |
| Standard vs generalne + CTA | `plans.standard`, `plans.general`, `plans.linkText` |
| 6 service cards | `services.*` |
| District chips + footnote | `districts.*` + `cityDistricts.js` |
| FAQ (9 items, accordion) | `faq.q1..9` / `faq.a1..9` |
| Other cities cross-links | `otherCities.*` + `seoCitiesOrder` |

Only the **placement** differs from the brief. Content work here is done.

## 5. Language rules

- Every user-visible string lives in `messages/pl.json` and `messages/en.json`. PL first, then EN.
- EN is **not** a translation of PL for intent-bearing text (H1/H2, title, description, CTA).
- **Polish proper nouns stay in Polish in both locales** — district, quarter and street names are
  kept exactly as they appear in Polish (`Stare Miasto`, `Prądnik Czerwony`, `Nowa Huta`,
  `Bieżanów`, `Łagiewniki`). Never translate, never transliterate, never strip diacritics.
  Reason: these are the literal query strings users type and Google matches on, in both languages.
  This is already how `cityDistricts.js` stores them — keep it.
- City names themselves are localised (`Kraków` / `Kraków`, `Warszawa` / `Warsaw`), and Polish copy
  uses the locative via `getCitySeoForms()` — never concatenate a nominative into a Polish sentence.

## 6. Visual bar

The block must read as part of the existing site, not as a bolted-on SEO slab. Design tokens already
used by both the previews and `CleaningSeoSection`:

| Token | Value |
|---|---|
| Headings | Quicksand, bold, uppercase |
| Body | Lato |
| Ink | `#14133a` |
| Accent / CTA | `#36f0c7` |
| Card title accent | `#FF3C87` |
| Card surface | `#f4f7ff` |
| Card shadow | `0 8px 15px 0 rgba(67,108,203,.2)` |
| Radius | 8px (cards/CTA) · 12px (tiles) · 20px (chips) |
| Grids | trust 4→2 · plans 2→1 · services 3→1 at 760px |

## 7. Priority order when trade-offs appear

1. Keyword coverage and search intent
2. Content logic and internal linking
3. Visual polish
4. Everything else

## 8. Definition of done

- [ ] Block renders at the anchor on all 6 cities × PL/EN (12 routes)
- [ ] Exactly one `<h1>` per rendered page
- [ ] `npm run lint` exit 0
- [ ] `docker build` (node:12) exit 0
- [ ] Smoke: title, canonical, hreflang, JSON-LD present per locale
- [ ] Booking flow still completes (regression)
- [ ] `WEBSITE_PROJECT_STATE.md` + workbook updated
