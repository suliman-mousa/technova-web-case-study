# Manual-only CI pipelines with a local verify gate

- Status: Accepted
- Date: 2026-11-19

## Context

GitLab CI runs quality, MySQL integration coverage, Playwright e2e, Docker build, and Lighthouse floors. Automatic pipelines on every push are costly and noisy for this repo’s workflow.

## Decision

Restrict GitLab `workflow.rules` to `CI_PIPELINE_SOURCE == "web"` (Run pipeline from the UI). Developers run `pnpm verify` (`lint` + `typecheck` + `test` + `build`) locally before merge; Prettier via `pnpm format:check`.

## Consequences

- Lower CI spend; intentional full runs.
- Broken main is possible if local verify is skipped — discipline required.
