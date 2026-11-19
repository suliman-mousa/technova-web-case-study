# Test concept (Testkonzept)

ISTQB vocabulary; document structure aligned with ISO/IEC/IEEE 29119-3 (test plan / test design). Evidence from code, Vitest, Playwright, and CI only. Gaps marked **Open**.

Related: [arc42 §10](architecture/arc42.md#10-quality-requirements), [iso-alignment.md](iso-alignment.md), [ADR 0008](adr/0008-manual-ci-local-verify.md).

---

## 1. Scope

**In scope**

- Public locale site (`en` / `ar` / `de`), lead forms (consultation, partnership, careers), tracking portals, admin auth surfaces that have tests.
- SEO machine routes (`robots`, `sitemap`, `llms.txt`), upload validation, rate limit helper, Turnstile helper, i18n path helpers, motion/canvas smoke.
- Local gate `pnpm verify`; manual GitLab pipeline (see [ci/](../ci/)).

**Out of scope / not automated today**

- Full visual regression in CI (design-protection + local visual review only).
- Full accessibility score gates.
- Production load / multi-instance rate-limit behaviour.
- Live Resend / live Cloudflare Turnstile end-to-end (mocked in integration).

---

## 2. Product risks

| Risk                         | Likelihood | Impact | Covering tests / jobs                                                                                          |
| ---------------------------- | ---------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| Lost lead submission         | Medium     | High   | Integration suites for consultation, partnership, careers                                                      |
| Spam persisted               | High       | Medium | Honeypot cases in those integration suites + partnership unit tests; ADR 0006                                  |
| Malicious upload             | Medium     | High   | Unit `validate-store` tests; portal oversize/mismatch in consultation-portal integration                       |
| Private pages indexed        | Medium     | High   | E2E SEO smoke (sitemap excludes `/admin`); layouts use `noindexMetadata`; robots still allow crawl             |
| Broken RTL                   | Medium     | High   | **Open** — locale path helpers only; no RTL visual                                                             |
| LCP regression               | Medium     | Medium | GitLab `lighthouse` / `pnpm perf:ci`; floors in `docs/performance/results.md`                                  |
| Broken animations / canvases | Medium     | Medium | E2E canvas-live; unit animation-budget and motion-preference tests                                             |

---

## 3. Test levels

| Level       | Tool                        | Command / job                       | What it proves                                       |
| ----------- | --------------------------- | ----------------------------------- | ---------------------------------------------------- |
| Unit        | Vitest                      | `pnpm test` / coverage in `test:ci` | Pure helpers under `src/lib/**`, `src/server/**`     |
| Integration | Vitest + MySQL              | `pnpm test:integration` / CI job    | Real DB for forms, portal, Prisma smoke              |
| E2E         | Playwright (chromium)       | `pnpm test:e2e` / CI `e2e`          | HTTP SEO smoke, GEO FAQ/reveal, live site behaviour  |
| Canvas-live | Playwright                  | canvas-live spec (in e2e)           | Network + hero canvases paint; reduced-motion paints |
| Lighthouse  | Lighthouse CI script        | CI `lighthouse` / `pnpm perf:ci`    | LCP/CLS **floors only** (not score/TBT)              |

Coverage floors: lines ≥ 40%, functions ≥ 44%, branches ≥ 22% for `src/lib/**` + `src/server/**`.

**Measured combined coverage (unit + integration):** **53.95%** lines.  
**Automated tests counted across unit + integration + e2e:** **156**.

---

## 4. Techniques

| Technique                    | Application                                                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Equivalence partitioning     | Allowed vs rejected file kinds/extensions; honeypot empty vs filled                                                                                    |
| Boundary values              | Rate limit: under limit then block (default limit 5 / 1h); file size at/over `maxBytes`                                                                |
| Decision tables / conditions | Turnstile secret missing: allow non-prod, fail closed in production (`APP_ENV`)                                                                        |
| Smoke / monitoring-style     | SEO routes, canvas paint, Lighthouse floors                                                                                                            |

---

## 5. Environments

| Environment                         | Notes                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------- |
| Local                               | Node 22; `pnpm verify` = lint + typecheck + unit + build                  |
| Local integration                   | MySQL URL must end with `_test` (`assertSafeIntegrationDatabase`)         |
| GitLab (manual `web` pipeline only) | Jobs: `quality`, `integration` (MySQL 8.4), `e2e`, `lighthouse`, `docker` |

---

## 6. Entry / exit criteria

**Entry (feature ready to test)**

- Code builds; no secrets in tree; design-protection respected for UI work.

**Exit (merge-ready for docs/code changes that touch tested areas)**

- `pnpm verify` green locally.
- Coverage thresholds not lowered.
- Relevant unit/integration/e2e updated when behaviour changes.
- For perf-sensitive changes: CI lighthouse floors still pass when pipeline is run.

---

## 7. Traceability (risk → test area)

| Risk                  | Test / artifact focus                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| Lost lead             | Consultation / partnership / careers integration                                                       |
| Spam persisted        | Same + partnership unit honeypot                                                                       |
| Malicious upload      | validate-store unit; consultation-portal integration                                                   |
| Private pages indexed | E2E SEO smoke; sitemap / insights-indexability unit; robots                                            |
| Broken RTL            | **Open** (path helpers only)                                                                           |
| LCP regression        | `docs/performance/results.md`, Lighthouse CI job                                                       |
| Broken animations     | canvas-live e2e; animation-budget / motion-preference unit                                             |

---

## 8. Gaps and next tests

| Gap                                         | Suggested next test                                    |
| ------------------------------------------- | ------------------------------------------------------ |
| No automated RTL visual / dir=rtl assertion | Playwright screenshot or `dir`/`lang` smoke on `/ar`   |
| robots.txt still allows private HTML paths  | After Search Console de-index: Disallow + e2e assert   |
| Serving path does not re-sniff Content-Type | Unit/integration on media Content-Type vs bytes        |
| No CI visual gate                           | **Open** by design (ADR 0008 + design-protection)      |
| Live Turnstile / Resend                     | Optional staging smoke (manual)                        |
| Multi-instance rate limit                   | Documented accepted risk (arc42 §11); no shared store  |
