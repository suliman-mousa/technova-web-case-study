# SEO & GEO architecture

Short, sanitized overview of how TechNova Eagle is discoverable for search engines and AI crawlers. Live site: [technova-eagle.com](https://technova-eagle.com).

## Central metadata

Page metadata is built through shared SEO helpers (title, description, Open Graph, robots). Public pages get locale-aware metadata; private surfaces (admin, API, tracking portals, create-account) use **noindex**.

## Canonical & hreflang

- Each public page emits a **canonical** URL for its locale.
- **hreflang** alternates cover `en` / `ar` / `de`, plus **`x-default`** pointing at the default locale.
- Open Graph locale tags align with the same helpers.

## JSON-LD

Structured data modules emit types such as **Organization**, **WebPage**, **Article**, **FAQ**, and **JobPosting** where the page type warrants it. Organization fields that are unknown are **omitted** — no invented legal or contact facts.

## Sitemap & robots

- `sitemap` lists public locale routes; admin and other private paths are excluded.
- `robots` allows public crawl; private HTML still relies on noindex (Disallow for private HTML remains an open hardening item in the test concept).

## llms.txt for AI search

- **`/llms.txt`** — short company summary and curated public links per locale.
- **`/llms-full.txt`** — fuller public content dump for generative-engine discovery.
- Generators assert that emitted URLs are public (no private path leakage).

## IndexNow

When configured in production, insight publish notifies search engines via **IndexNow** for the affected URLs (no-op without a key / outside production rules).

## Market landing pages

Locale-prefixed market pages support regional discovery alongside services, industries, and work. Content stays in typed TypeScript modules (see [i18n-content-architecture.md](i18n-content-architecture.md)).

## “No invented facts” policy

Organization and entity data used in JSON-LD / llms must come from verified product facts. Unknown fields are left out rather than guessed — especially legal name, addresses, and contact details beyond what the live site already publishes.
