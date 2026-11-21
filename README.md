# TechNova Eagle — Web Case Study (public showcase)

Public portfolio repository that documents the **quality system** behind [technova-eagle.com](https://technova-eagle.com) **without publishing the application source**.

> **All rights reserved** — see [LICENSE](./LICENSE). Readable for employers; not reusable as a starter kit.

## For reviewers (30 seconds)

1. **Role:** Architect and lead developer of the live site.
2. **Proof:** **159** tests (100% passing) and **two** security bugs found test-first (honeypot persist; PNG-as-`.pdf`).
3. **Architecture:** [arc42](./docs/architecture/arc42.md) + [ADRs 0001–0007](./docs/adr/).
4. **Story + screenshots:** [engineering-journey.md](./docs/engineering-journey.md) · [evidence/](./evidence/)

---

## Kurzüberblick (DE)

Mehrsprachige Unternehmenswebsite für **TechNova Eagle** (Live: [technova-eagle.com](https://technova-eagle.com)). Rolle: **Architekt und Lead-Entwickler**. Stack: Next.js 16, React 19, TypeScript, Prisma/MySQL, iron-session, Zod, Vitest, Playwright. Ergebnisse u. a.: **159** Tests (142 Unit+Integration, 17 E2E, 100 % grün), **52,86 %** kombinierte Line-Coverage (vorher 40,66 %), GitLab CI/CD, Security-Härtung (Honeypot, Upload-Sniff, `APP_ENV`), WCAG-Prüfung (axe), Performance-Arbeit unter Design-Schutz. Dieses Repo enthält dokumentierte Architektur, ADRs, Konzepte und 4 Code-Ausschnitte — **keinen** produktiven Quellcode.

---

## What this is

Multilingual corporate site for **TechNova Eagle** — software and digital solutions: marketing (services, work, industries, markets, insights), lead generation (consultation + partnerships), careers, public tracking portals, and an authenticated admin area on MySQL.

- **Live:** https://technova-eagle.com  
- **Locales:** `en` (default), `ar` (RTL), `de`  
- **My role:** Architect and lead developer (architecture, CI/quality, security hardening, performance under design constraints, documentation)

This showcase is intentionally **docs-first**.

---

## Tech stack

Versions from the product `package.json` / `packageManager` / Docker image.

| Layer | Choice | Version |
| --- | --- | --- |
| Package manager | pnpm | 12.6.0 |
| Runtime (Docker) | Node.js | 22 |
| Framework | Next.js (App Router, standalone) | 16.4.6 |
| UI | React / React DOM | 19.2.8 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| ORM / DB | Prisma + MySQL | Prisma 6.19.3 |
| Auth sessions | iron-session | ^9.0.1 |
| Password hashing | bcryptjs | ^3.0.3 |
| Validation | Zod | ^4.6.5 |
| Motion | Motion, GSAP | ^13.4.4 / ^3.15.0 |
| Unit / integration | Vitest | ^5.1.0 |
| E2E | Playwright | ^1.63.0 |
| A11y automation | @axe-core/playwright | ^4.14.0 |
| Lint | ESLint + eslint-config-next | ^9 / 16.4.6 |

Content: typed TypeScript modules (`src/content/**`). UI: custom components (not shadcn/Radix).

### UI engineering

Motion (Motion, GSAP) and animated canvas backgrounds are **progressive enhancement** on top of server-rendered HTML: primary copy stays crawlable, canvases boot after LCP where needed, and **reduced-motion** preferences are respected. Visual identity is guarded by [design-protection rules](./docs/engineering-rules/design-protection.md) — performance work must not change pixels without approval.

---

## Key results

| Area | Fact |
| --- | --- |
| Tests | **159** automated tests — **142** unit + integration, **17** e2e; **100%** passing (pipeline `#3085809308`) |
| Coverage | **52.86%** combined line coverage (`src/lib/**` + `src/server/**`); was **40.66%** before the testing work |
| CI | GitLab CI/CD I designed and built (quality, MySQL integration + coverage, Playwright e2e, Docker, Lighthouse floors) — see [ci/](./ci/) and [evidence](./evidence/) |
| Security | Honeypot discarded flow, file content↔extension sniff, `APP_ENV`, headers (partial CSP), rate limits, Turnstile |
| Accessibility | WCAG 2.2 AA statement; **21/21** axe checks; known visual limits: `color-contrast`, `target-size` |
| Performance | Arabic mobile LCP **5.75 s → 4.92 s** (lab, 5-run medians) by deferring canvases after LCP, zero visual change; CI LCP/CLS floors |
| SEO / GEO | Canonical + hreflang (`x-default`), JSON-LD, sitemap/robots, `llms.txt` / `llms-full.txt`, IndexNow — [seo-geo-architecture.md](./docs/seo-geo-architecture.md) |

![Test summary — 159 tests, 100% success](./evidence/test-summary.png)

![Green GitLab pipeline #3085809308](./evidence/pipeline-green.png)

---

## How I work

Development under explicit project rules:

- **Design protection** — visual identity is a business asset; no silent regressions for perf/a11y/refactors ([design-protection.md](./docs/engineering-rules/design-protection.md))
- **Project rules** — no silent outbound telemetry; no secret logging ([project.md](./docs/engineering-rules/project.md))
- **Test-first bug fixes** — honeypot persistence and PNG-as-`.pdf` uploads caught by failing integration cases before the fix
- **Small reversible commits** — including explicit reverts when experiments fail the design bar (Arabic font preload)

---

## C4 container diagram

```mermaid
C4Container
  title Containers — TechNova Eagle (showcase)
  Person(user, "User")
  Container_Boundary(c1, "compose service") {
    Container(next, "Next.js app", "Node 22 standalone", "SSR/RSC, Route Handlers, Server Actions")
  }
  ContainerDb(db, "MySQL 8+", "Prisma schema")
  Container(fs, "Upload volume", "persistent volume", "UPLOAD_DIR")
  System_Ext(email, "Resend")
  System_Ext(cf, "Turnstile")
  Rel(user, next, "HTTPS")
  Rel(next, db, "DATABASE_URL")
  Rel(next, fs, "UPLOAD_DIR")
  Rel(next, email, "optional")
  Rel(next, cf, "optional")
```

Full architecture: [docs/architecture/arc42.md](./docs/architecture/arc42.md).

---

## Repository map

| Path | Contents |
| --- | --- |
| [docs/architecture/arc42.md](./docs/architecture/arc42.md) | arc42 architecture |
| [docs/adr/](./docs/adr/) | ADRs 0001–0007 |
| [docs/testkonzept.md](./docs/testkonzept.md) | Test concept |
| [docs/sicherheitskonzept.md](./docs/sicherheitskonzept.md) | Security concept |
| [docs/iso-alignment.md](./docs/iso-alignment.md) | ISO alignment (not certification) |
| [docs/barrierefreiheit.md](./docs/barrierefreiheit.md) | Accessibility (WCAG) |
| [docs/seo-geo-architecture.md](./docs/seo-geo-architecture.md) | SEO / GEO architecture |
| [docs/performance/results.md](./docs/performance/results.md) | Mobile Lighthouse results |
| [docs/engineering-journey.md](./docs/engineering-journey.md) | Problem → action → result by phase |
| [docs/domain-model.md](./docs/domain-model.md) | Entities & relations (no sensitive fields) |
| [docs/i18n-content-architecture.md](./docs/i18n-content-architecture.md) | Typed content, locales, RTL, SEO |
| [docs/engineering-rules/](./docs/engineering-rules/) | Design protection + project rules |
| [ci/](./ci/) | Sanitized GitLab CI + design notes |
| [code-samples/](./code-samples/) | Four short excerpts only |
| [evidence/](./evidence/) | Pipeline, tests, coverage, and a11y screenshots |
| [LICENSE](./LICENSE) | All rights reserved |

---

## What is not here

Application source, operations runbooks, secrets, and internal templates — this repo is documentation and evidence only.
