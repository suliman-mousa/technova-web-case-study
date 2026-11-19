# i18n & content architecture

## Locales

| Locale | Role | Direction |
| --- | --- | --- |
| `en` | Default | LTR |
| `ar` | Arabic | RTL (`getDirection("ar") === "rtl"`) |
| `de` | German | LTR |

Routes are always prefixed: `/en/...`, `/ar/...`, `/de/...`. Bare paths receive a **308** redirect to the default locale via `src/proxy.ts` ([ADR 0004](adr/0004-locale-routing-proxy.md)). The `[locale]` layout sets `lang` and `dir`.

## Typed content modules (no MDX / CMS)

Marketing copy lives as TypeScript modules under `src/content/**`, loaded through getters in `src/lib/content/**` ([ADR 0001](adr/0001-typescript-content-modules.md)).

Typical catalogs:

- Pages (home, about, partnerships, legal, FAQ, …)
- Services, industries, markets, case studies / work
- Consultation copy (`en` / `ar` / `de` modules)
- Insights listing types; DB-backed insights for published posts
- Entity / metrics helpers used by SEO and GEO surfaces

Compile-time types catch missing locales and shape drift in PRs. Content changes ship with a deploy (no headless CMS editor workflow).

## Dictionaries & UI strings

Shared UI dictionaries live under the i18n lib; page-level narrative stays in content modules. Forms and portals resolve copy by locale (e.g. consultation thanks / errors).

## SEO per locale

- Canonical URLs and `hreflang` / Open Graph locale helpers under `src/lib/seo/**`
- Metadata builders attach canonical + alternate languages per page
- `sitemap.ts`, `robots.ts`, `llms.txt` / `llms-full.txt` for machine discovery
- Structured data modules (Organization, WebPage, Article, FAQ, JobPosting, …)
- Optional IndexNow notify on insight publish when configured

Private surfaces (admin, API, tracking portals, create-account) use noindex; sitemap excludes `/admin`.

## RTL

Arabic pages use `dir="rtl"`. Design-protection forbids silent RTL layout regressions. Automated RTL visual / `dir` smoke remains **Open** in [testkonzept.md](testkonzept.md); path helpers are unit-tested.

## Related

- [arc42 §8.1](architecture/arc42.md#81-i18n-and-rtl)
- [ADR 0001](adr/0001-typescript-content-modules.md), [ADR 0004](adr/0004-locale-routing-proxy.md), [ADR 0005](adr/0005-server-first-client-islands.md)
