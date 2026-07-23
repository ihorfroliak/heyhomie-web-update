---
name: website-audit
description: Audit the HeyHomie website (routes, rendering, metadata, tracking, live-vs-repo drift) before any change. Use when starting a session, verifying whether work is already done, or checking what production actually serves.
---

# website-audit

## Purpose
Establish the real current state of heyhomie.io with the fewest tokens, and detect drift between the repo and production.

## When to use
- Start of a work session, before planning anything.
- Before claiming a task is "not done" — verify first.
- After a deploy, to confirm what production now serves.

## When NOT to use
- Mid-implementation of an already-scoped change.
- To re-derive facts already recorded in `docs/website/WEBSITE_PROJECT_STATE.md` and still valid.

## Required inputs
- `docs/website/WEBSITE_PROJECT_STATE.md` (read first).
- Repo path from that file. Target URLs.

## Workflow
1. Read WEBSITE_PROJECT_STATE.md §2 (reconciliation) and §8 (known issues). Stop if the question is already answered and nothing relevant changed.
2. Repo drift: list files by `LastWriteTime` descending, excluding `node_modules`. The mtime cluster identifies a work batch. (No git history in this repo — mtime is the only signal.)
3. Live check per URL — fetch raw HTML and grep for: `<title>`, `meta description`, `rel="canonical"`, `hreflang=`, `application/ld+json`, `googletagmanager`, `G-`, `AW-`, `clarity.ms`, `hotjar`, `connect.facebook.net`, `<h1`.
4. Check `/robots.txt` and `/sitemap.xml` status codes and bodies.
5. Diff repo intent vs live reality. Anything in repo but not live = undeployed, not missing.

## Validation
Every claim must cite either a file path + line, or an HTTP response with status code and matched string. No inference-only findings.

## Output
Append/update WEBSITE_PROJECT_STATE.md §3–§7 and §8. Never write raw HTML dumps into docs.

## Relevant files
`pages/_document.js`, `pages/index.js`, `pages/[city].js`, `pages/sitemap.xml.js`, `public/robots.txt`, `components/seo/`, `messages/{pl,en}.json`
