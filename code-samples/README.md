# Code samples (excerpts only)

Four short excerpts from the private application. They illustrate engineering decisions; they are not a runnable app.

| File | Topic |
| --- | --- |
| [01-file-content-matches-extension.ts](./01-file-content-matches-extension.ts) | Sniffed MIME must match file extension (ADR 0007) |
| [02-honeypot-discarded-flow.ts](./02-honeypot-discarded-flow.ts) | Honeypot → `discarded` + fake success, no persist (ADR 0006) |
| [03-integration-database-guard.ts](./03-integration-database-guard.ts) | Integration tests only against `*_test` databases |
| [04-app-env-helper.ts](./04-app-env-helper.ts) | Explicit `APP_ENV` for production detection |

No other application source is published in this repository.
