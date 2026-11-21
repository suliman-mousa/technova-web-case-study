# ISO alignment (not certification)

This document records **alignment** of the TechNova Eagle web project with selected international standards. It is **not** an ISO certification, audit opinion, or compliance claim.

Sources of truth: code, tests, [arc42](architecture/arc42.md), [ADRs](adr/), [testkonzept.md](testkonzept.md), [sicherheitskonzept.md](sicherheitskonzept.md), [docs/performance/](performance/). Gaps marked **Open**.

---

## ISO/IEC 25010 — System and software quality

Maps to [arc42 §10](architecture/arc42.md#10-quality-requirements).

| Requirement (characteristic) | Implementation                                      | Evidence                                 | Gap                                  |
| ---------------------------- | --------------------------------------------------- | ---------------------------------------- | ------------------------------------ |
| Functional suitability       | Forms → DB + tracking; admin CRUD                   | Integration lead suites; Q1–Q3 scenarios | —                                    |
| Performance efficiency       | LCP-aware images/canvas; CI floors                  | `docs/performance/results.md`, `perf:ci` | `/ar` `/de` stop rule unmet          |
| Compatibility                | Modern browsers; `ar` RTL layout                    | Locale routing; design-protection        | Automated RTL visual **Open**        |
| Usability / accessibility    | Semantic hero copy; reduced-motion helpers          | motion-preference, canvas-live           | Full a11y score targets **Open**     |
| Reliability                  | `migrate deploy` fail-closed; optional DB marketing | Docker entrypoint; DB safe wrappers      | —                                    |
| Security                     | Sessions, RL, honeypot, Turnstile, sniff, headers   | sicherheitskonzept; ADRs 0002/0006/0007  | Full CSP, re-sniff serve **Open**    |
| Maintainability              | Typed content, Vitest, Playwright, `pnpm verify`    | package scripts, vitest thresholds       | CI visual gate removed **Open**      |
| Portability                  | Docker standalone Node 22                           | Dockerfile, `.nvmrc`                     | Playwright CI image Node 24 **Open** |

---

## ISO/IEC/IEEE 42010 — Architecture description

| Requirement              | Implementation                        | Evidence                     | Gap |
| ------------------------ | ------------------------------------- | ---------------------------- | --- |
| Architecture viewpoints  | arc42 document                        | `docs/architecture/arc42.md` | —   |
| Decision records         | MADR ADRs 0001–0008                   | `docs/adr/`                  | —   |
| Stakeholder concerns     | arc42 §1.3                            | Same                         | —   |
| Rationale / consequences | ADR Context / Decision / Consequences | Each ADR                     | —   |

---

## ISO/IEC/IEEE 29119 — Software testing

| Requirement                 | Implementation                 | Evidence                       | Gap                 |
| --------------------------- | ------------------------------ | ------------------------------ | ------------------- |
| Test planning / design docs | Testkonzept (29119-3 oriented) | `docs/testkonzept.md`          | —                   |
| Test levels                 | Unit, integration, e2e, perf   | Vitest, Playwright, lighthouse | —                   |
| Risk-based focus            | Product risk table             | testkonzept §2                 | RTL visual **Open** |
| Exit criteria               | Coverage floors + verify       | Vitest thresholds, ADR 0008    | —                   |

---

## ISO/IEC 27001:2022 — Selected Annex A controls

Alignment only — no ISMS certification.

| Control | Requirement (short)               | Implementation                                      | Evidence                                        | Gap                                     |
| ------- | --------------------------------- | --------------------------------------------------- | ----------------------------------------------- | --------------------------------------- |
| A.5.15  | Access control                    | Admin session + tracking unlock; bootstrap gate     | Admin guards; `ALLOW_ADMIN_BOOTSTRAP`           | No MFA **Open** / N/A for product       |
| A.8.5   | Secure authentication             | bcrypt + iron-session; `SESSION_SECRET`             | ADR 0002; password/session modules              | Soft-fail short secret in prod          |
| A.8.13  | Information backup                | Ops: MySQL dump + upload volume (runbook, private)  | Operations docs not published in this showcase  | No automated backup job in repo         |
| A.8.15  | Logging                           | Entrypoint / app error logs; CI artifacts           | Docker logs; GitLab artifacts                   | Central SIEM **Open**                   |
| A.8.24  | Use of cryptography               | bcrypt; sealed cookies; HTTPS/HSTS expected in prod | password/session helpers; security headers      | DB/disk encryption host-side **Open**   |
| A.8.25  | Secure development life cycle     | Local verify + manual CI; design-protection         | ADR 0008; `docs/engineering-rules/design-protection.md` | Auto pipeline on push intentionally off |
| A.8.26  | Application security requirements | Forms defense-in-depth; upload sniff                | arc42 §4; ADRs 0006–0007                        | Full CSP **Open**                       |
| A.8.27  | Secure system architecture        | Server-first; trust boundaries documented           | arc42; sicherheitskonzept                       | —                                       |
| A.8.28  | Secure coding                     | Zod, typed TS, ESLint, Prettier                     | `pnpm lint` / `format:check`                    | —                                       |
| A.8.29  | Security testing in development   | Unit/integration security-relevant cases            | honeypot, validate-store, turnstile, portal     | Live Turnstile/Resend e2e **Open**      |
