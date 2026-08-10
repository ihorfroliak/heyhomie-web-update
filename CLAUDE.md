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
docs/website/      project state, audits, plans, content + analytics specs
docs/legal/        customer-facing documents (key-handover act, PL/EN .docx)
preview/           static HTML previews for visual approval (not shipping code)
tools/             make_handoff_pdf*.py (needs reportlab)
.claude/roles/     website-architect, seo-specialist, cro-specialist, analytics-engineer,
                   content-localization-specialist, qa-engineer
.claude/skills/    website-audit, seo-engineering, conversion-optimization,
                   analytics-engineering, content-localization, qa-testing, release-validation
```

## Where the code actually goes
This repo is **staging, not production**. Origin is GitHub
(`ihorfroliak/heyhomie-web-update`); the deployed site is built from **Gitea**
`gitea.stuzer.link/heyhomie/heyhomie-client`. Changes land here first, then move across.

`../_reference/heyhomie-gitea/heyhomie-client` is a read-only export of the Gitea baseline —
diff against it to see exactly what this repo adds on top of production.

`.gitea/workflows/ci.yaml` runs **lint → docker build → push image**. The `cd` (deploy) job is
commented out, so **deployment is manual and nobody has documented who does it** (decision D9).

## Run — Node 12 only, use Docker
The app is Next 10 / React 17 with `engines.node: 12`. On a modern Node it fails at build with
`ERR_PACKAGE_PATH_NOT_EXPORTED: postcss/lib/parser` (Next 10 bundles webpack 4). `npm run dev`
on Node 18+ will not work — do not spend time on it.

```bash
# lint exactly as CI does
docker run --rm -v "$PWD/heyhomie-client:/app" -w /app node:12.22.12-bullseye-slim \
  bash -lc 'npm ci && npm run lint'

# production-parity build + run
cd heyhomie-client && docker build -t heyhomie-client:dev .
docker run -d --name hh -p 3401:3000 heyhomie-client:dev   # → http://localhost:3401
```

`package-lock.json` is gitignored here, so `npm ci` regenerates it. Generate it **inside node:12** —
a lockfile written by npm 9+ is `lockfileVersion: 3`, which npm 6 cannot read and the Docker build
then fails on `npm ci`.

## Line endings — the lint trap
CI gates on `npm run lint`, and prettier is set to `endOfLine: "lf"`. Without the repo
`.gitattributes` (`* text=auto eol=lf`) a Windows clone gets CRLF and lint reports ~38k
`Delete ␍` errors before any real check runs. If you see that, fix the checkout, not the code.

## Fixed constraints (do not renegotiate)
Existing URL architecture is source of truth — PL unprefixed, EN under `/en`, 6 cities
(krakow, warsaw, wroclaw, poznan, katowice, rzeszow) × 2 languages; no `/pl/` prefix;
no IP-based redirects; do not break booking context; do not invent product functionality;
no duplicate analytics events; tests are mandatory; production changes require validation.

**Brand tokens are settled** — `heyhomie-shared/BRAND.md` is the canon (Manrope + Montserrat
wordmark, mint `#77ECC8`, ink `#141338`, pink `#EB4E87`, indigo `#414483`, light `#F6FBFF`).
All four surfaces are migrated. Do not hand-edit a token here; change `BRAND.md` first.

**"Homies"** is the brand term for our cleaners — always capitalised in user-facing copy.
Polish proper nouns (districts, streets) keep their Polish spelling in **both** locales; they are
the literal strings people search for.

**All user-visible strings** live in `messages/{pl,en}.json`, added to both files in the same edit.
Never put copy in a component. `intl-messageformat` treats `<...>` as tag syntax, so message values
must contain **no HTML** — the cleaning FAQ uses a markdown-lite renderer instead.

## Tests
Jest 26 — the last line that runs on the Node 12 pin, so it is not a choice, and Vitest/Playwright
are out until `engines.node` moves. CI gates on `lint` **and** `test:ci`.

```bash
docker run --rm -v "$PWD/heyhomie-client:/app" -w /app node:12.22.12-bullseye-slim \
  bash -lc 'npm install && npx jest'
```

`__tests__/` guards the rules this repo keeps breaking, not code coverage for its own sake:
`messages` (PL/EN key parity, no HTML in formatter-rendered values, Homies capitalised),
`cityDistricts` (Polish locative — `we Wrocławiu` not `w`), `brandCanon` (no legacy token creeps
back), `seoRouting` (PL unprefixed / EN under `/en`, sitemap shape, JSON-LD stays plain text).

Values that really are raw HTML (fed to `dangerouslySetInnerHTML`) are allowlisted by path in
`__tests__/messages.test.js`. Add to that list only when the value is genuinely rendered raw.

## Known gaps (as of 2026-08)
- **No E2E and no component tests.** The suite is unit + data-integrity only; the booking flow is
  still verified by hand. Playwright needs a Node newer than the pin, so it would have to run on the
  host against the Docker container.
- No GTM, no data layer, no custom GA4 events, no Ads conversion tag, no consent management.
  GA4 `G-RY504GZ2G0` is hardcoded for **both** dev and prod, so dev traffic pollutes production data.
- `icon_hex_color` still arrives as legacy mint `#36F0C780` from the Rails API — backend fix, not here.
