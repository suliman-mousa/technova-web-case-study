# Locale routing in proxy.ts

- Status: Accepted
- Date: 2026-11-19

## Context

All public routes are locale-prefixed (`/en`, `/ar`, `/de`). Bare paths and `/` must land on the default locale without a legacy `src/middleware.ts`.

## Decision

Implement locale detection/redirect in `src/proxy.ts`: if the pathname lacks a locale segment, respond with **308** to `/{defaultLocale}` or `/{defaultLocale}{pathname}`. Matcher excludes `api`, `_next`, static files, sitemap, and robots.

## Consequences

- Single edge entry for locale redirects aligned with Next 16 proxy convention.
- Non-prefixed bookmarks always redirect to `en` today (`defaultLocale`), not Accept-Language negotiation (**Open** if that is desired later).
