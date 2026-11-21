# Engineering journey

Short phases from CHANGELOG facts, ADRs, and project docs. Problem → What I did → Result.

---

## 1. CI design

**Problem.** Automatic pipelines on every push were costly and noisy for a solo/lead workflow that already needed MySQL, Playwright, Lighthouse, and Docker.

**What I did.** Restricted GitLab `workflow.rules` to manual UI runs (`CI_PIPELINE_SOURCE == "web"`). Made local `pnpm verify` (`lint` + `typecheck` + `test` + `build`) the day-to-day gate, with Prettier via `format:check` ([ADR 0008](adr/0008-manual-ci-local-verify.md)). Combined unit + integration coverage into one MySQL job (`pnpm test:ci`).

**Result.** Intentional full CI; lower spend; single Cobertura source for the coverage badge. Discipline required so main stays green. Measured on pipeline `#3085809308`: **159** tests (142 unit + integration, 17 e2e, 100% passing) and **52.86%** combined line coverage (up from **40.66%** before the testing work).

---

## 2. Integration tests

**Problem.** Lead forms and portals needed real MySQL proof, without risking production data. Early honeypot behaviour still persisted spam rows.

**What I did.** Added integration suites (consultation, partnership, careers) with Turnstile/Resend mocked. Enforced `assertSafeIntegrationDatabase` (DB name must end with `_test`; refuse `NODE_ENV=production`). Wrote honeypot cases first; they failed until processors returned explicit `discarded` and callers skipped persist/email ([ADR 0006](adr/0006-honeypot-fake-success.md)). First migrate deploy also hit a UTF-8 **BOM** in the initial migration SQL — stripped so Prisma could apply cleanly.

**Result.** Real-DB confidence in CI; honeypot hits no longer pollute DB/inbox; safer local integration runs.

---

## 3. Performance

**Problem.** Mobile LCP on `/ar` and `/de` exceeded the lab stop rule (&lt; 4 s median). Temptation to cut motion/3D quality conflicted with design protection.

**What I did.** Kept visual identity fixed. Wired the hero eagle as the real LCP image (`priority` / `fetchPriority` + matching `sizes`). Deferred network/hero canvases until after LCP (`runAfterLcp`). Tried Arabic font preload on `ar` only — then **reverted**: preload competed with the LCP image (~194 KiB Noto at High) and switching font loading changed Arabic glyph metrics (screenshot drift). Documented medians and CI LCP/CLS **floors only** ([performance/results.md](performance/results.md)).

**Result.** `/en` and case-study under 4 s; `/ar` ~4.9 s and `/de` ~4.3 s still open; design unchanged; CI guards against floor regressions.

---

## 4. Security hardening

**Problem.** Renamed uploads could bypass naive extension checks (e.g. PNG as `.pdf`). Bots filled forms; production detection needed an explicit env signal for fail-closed paths.

**What I did.** Required sniffed content to match extension (`validateAndStoreFile`, reject code `type`) ([ADR 0007](adr/0007-file-content-matches-extension.md)). Honeypot fake-success path as above. Added `APP_ENV` helper with fallback warning. Global security headers (short HSTS, nosniff, Referrer-Policy, `frame-ancestors 'none'`, Permissions-Policy); no full CSP yet. Gated public admin bootstrap behind `ALLOW_ADMIN_BOOTSTRAP`.

**Result.** Upload spoofing blocked at ingest; clearer production detection; residual risks documented (in-memory rate limit, no full CSP, serve trusts stored extension).

---

## 5. Documentation

**Problem.** Architecture and quality practice lived mostly in code and chat — hard to show employers or onboard reviewers.

**What I did.** Wrote arc42, MADR ADRs 0001–0008, testkonzept (29119-oriented), sicherheitskonzept (STRIDE + selected ASVS), ISO alignment (not certification), accessibility statement, and performance results. Cursor rules encode design protection and no-secret/no-silent-external-CI habits.

**Result.** Durable, reviewable architecture and quality evidence without publishing the private app source.

---

## 6. Accessibility

**Problem.** Need WCAG 2.2 AA evidence without changing brand colors or control sizes (design protection).

**What I did.** Automated `pnpm test:a11y` (Playwright + axe). Fixed non-visual issues: org-chart accessible names, case-study `<dl>` structure, consultation `aria-live` errors. Recorded `color-contrast` and `target-size` as known limitations that do not fail the suite until an approved visual change ([barrierefreiheit.md](barrierefreiheit.md)).

**Result.** Partial conformance documented; invisible semantics covered; visual trade-offs explicit.

---

## Cross-cutting: e2e HOSTNAME

**Problem.** In CI, ambient `HOSTNAME` is the container name, so the standalone e2e server did not listen where the health check expected.

**What I did.** Forced `E2E_LISTEN_HOST=0.0.0.0` in e2e/lighthouse jobs and started the server via a dedicated script that does not inherit ambient `HOSTNAME`.

**Result.** Reliable ready-check against `http://127.0.0.1:3000/en` in CI.
