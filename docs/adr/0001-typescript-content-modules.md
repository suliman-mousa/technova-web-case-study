# TypeScript content modules instead of MDX

- Status: Accepted
- Date: 2026-11-19

## Context

Marketing copy (services, case studies, industries, pages, markets, entity) must stay typed, reviewable in PRs, and free of an extra content toolchain.

## Decision

Store content as TypeScript modules under `src/content/**` and load via getters in `src/lib/content/**`. Do not use MDX or a headless CMS in this codebase.

## Consequences

- Compile-time checking and shared types; no MDX pipeline.
- Content changes require a deploy; non-dev editors are not first-class.
