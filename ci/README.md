# CI pipeline design (sanitized)

Sanitized copy of the GitLab CI configuration I designed and built for the product. Secrets and internal project URLs are replaced with placeholders. Evidence: [pipeline-green.png](../evidence/pipeline-green.png).

## Design

| Decision | Why |
| --- | --- |
| **Triggers** | Pipelines on merge requests and the default branch. |
| **Stages** | `quality` → `test` (integration + e2e) → `build` (Docker) → `perf` (Lighthouse floors). |
| **Combined coverage** | One MySQL job runs unit + integration (`pnpm test:ci`) so Cobertura / the coverage badge share a single source. |
| **Integration DB safety** | Job DB name must end with `_test` (enforced in app code by `assertSafeIntegrationDatabase`). |
| **E2E listen host** | Ambient `HOSTNAME` in CI is the container name; `E2E_LISTEN_HOST=0.0.0.0` forces a bind the health check can reach. |
| **Lighthouse floors only** | Assert lab LCP/CLS ceilings from documented medians + noise margin — not score/TBT. |
| **Docker build, no push** | Proves the image builds; does not publish to a registry from this showcase. |
| **MR reports** | JUnit and Cobertura artifacts for merge-request widgets. |

## Jobs (summary)

1. **quality** — format check, lint, typecheck  
2. **integration** — MySQL 8.4 service, migrate deploy, combined coverage  
3. **e2e** — Playwright against Next standalone server  
4. **lighthouse** — `perf:ci` floor assertions  
5. **docker** — multi-stage image build (no registry push in this sanitized file)

See [docs/testkonzept.md](../docs/testkonzept.md) and [docs/engineering-journey.md](../docs/engineering-journey.md).
