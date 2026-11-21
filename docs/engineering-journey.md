# Engineering journey

Short phases from CHANGELOG facts, ADRs, and project docs. Problem → What I did → Result.

---

## 1. CI design

**Problem.** No continuous integration: quality, database-backed tests, e2e, image build, and performance floors were not automated together.

**What I did.** Designed and built a GitLab CI/CD pipeline: quality gates (format, lint, typecheck), MySQL-backed integration tests with combined unit + integration coverage, Playwright e2e against the Next.js standalone server, Docker image build, Lighthouse LCP/CLS floors, and JUnit / Cobertura reports for merge requests. See [ci/](../ci/).

**Result.** Pipeline `#3085809308` green: **159** tests (142 unit + integration, 17 e2e, 100% passing) and **52.86%** combined line coverage (up from **40.66%** before the testing work). Proof: [pipeline-green.png](../evidence/pipeline-green.png), [test-summary.png](../evidence/test-summary.png), [coverage.png](../evidence/coverage.png).

---

## 2. Integration tests

**Problem.** Lead forms and portals needed real MySQL proof, without risking production data. Two production bugs were still open: honeypot spam was being persisted, and PNG files renamed to `.pdf` were accepted.

**What I did.** Added integration suites (consultation, partnership, careers) with Turnstile/Resend mocked. Enforced `assertSafeIntegrationDatabase` (DB name must end with `_test`; refuse `NODE_ENV=production`). Wrote failing tests first for both bugs: honeypot cases until processors returned explicit `discarded` and callers skipped persist/email ([ADR 0006](adr/0006-honeypot-fake-success.md)); upload sniff cases until content had to match extension ([ADR 0007](adr/0007-file-content-matches-extension.md)). First migrate deploy also hit a UTF-8 **BOM** in the initial migration SQL — stripped so Prisma could apply cleanly.

**Result.** Real-DB confidence in CI; honeypot hits no longer pollute DB/inbox; renamed PNG-as-`.pdf` rejected with code `type`; safer integration runs against `*_test` databases only.

---

## 3. Performance

**Problem.** Mobile LCP on `/ar` and `/de` exceeded the lab stop rule (&lt; 4 s median). Temptation to cut motion quality conflicted with design protection.

**What I did.** Kept visual identity fixed. Wired the hero eagle as the real LCP image (`priority` / `fetchPriority` + matching `sizes`). Deferred network/hero canvases until after LCP (`runAfterLcp`). Tried Arabic font preload on `ar` only — then **reverted**: preload competed with the LCP image (~194 KiB Noto at High) and switching font loading changed Arabic glyph metrics (screenshot drift). Documented medians and CI LCP/CLS **floors only** ([performance/results.md](performance/results.md)).

**Result.** Arabic mobile LCP **5.75 s → 4.92 s** (lab, 5-run medians) by deferring canvases until after LCP, with **zero visual change**. `/en` and case-study under 4 s; `/ar` / `/de` stop rule still open; CI guards against floor regressions.

---

## 4. Security hardening

**Problem.** Bots filled forms; production detection needed an explicit env signal for fail-closed paths.

**What I did.** Honeypot fake-success path (caught test-first in phase 2). Added `APP_ENV` helper with fallback warning. Global security headers (short HSTS, nosniff, Referrer-Policy, `frame-ancestors 'none'`, Permissions-Policy); no full CSP yet. Gated public admin bootstrap behind `ALLOW_ADMIN_BOOTSTRAP`.

**Result.** Clearer production detection; residual risks documented (in-memory rate limit, no full CSP, serve trusts stored extension). Upload content↔extension enforcement lives with the integration-test story in phase 2.

---

## 5. Documentation

**Problem.** Architecture and quality practice lived mostly in code and chat — hard to show employers or onboard reviewers.

**What I did.** Wrote arc42, MADR ADRs 0001–0007, testkonzept (29119-oriented), sicherheitskonzept (STRIDE + selected ASVS), ISO alignment (not certification), accessibility statement, SEO/GEO overview, and performance results. Engineering rules encode design protection and no-secret/no-silent-external-CI habits.

**Result.** Durable, reviewable architecture and quality evidence without publishing the private app source.

---

## 6. Accessibility

**Problem.** Need WCAG 2.2 AA evidence without changing brand colors or control sizes (design protection).

**What I did.** Automated a11y suite (Playwright + axe). Fixed non-visual issues: org-chart accessible names, case-study `<dl>` structure, consultation `aria-live` errors. Recorded `color-contrast` and `target-size` as known limitations that do not fail the suite until an approved visual change ([barrierefreiheit.md](barrierefreiheit.md)).

**Result.** **21/21** automated checks green (7 pages × en/ar/de); partial conformance documented; invisible semantics covered; visual trade-offs explicit ([a11y-results.png](../evidence/a11y-results.png)).

---

## Cross-cutting: e2e HOSTNAME

**Problem.** In CI, ambient `HOSTNAME` is the container name, so the standalone e2e server did not listen where the health check expected.

**What I did.** Forced `E2E_LISTEN_HOST=0.0.0.0` in e2e/lighthouse jobs and started the server via a dedicated script that does not inherit ambient `HOSTNAME`.

**Result.** Reliable ready-check against the local e2e origin in CI.
