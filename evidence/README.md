# Evidence (screenshots to add)

This folder is intentionally empty in the public case-study repo. Add screenshots from a successful local or CI run:

| File (suggested) | What it should show |
| --- | --- |
| `pipeline-green.png` | Green GitLab pipeline (quality → integration → e2e → lighthouse → docker as applicable) |
| `test-summary.png` | Test summary: **159** tests (142 unit + integration, 17 e2e), 100% passing |
| `coverage.png` | Combined coverage at **52.86%** lines (pipeline `#3085809308`; was 40.66%) |
| `lighthouse-report.png` | Mobile Lighthouse / `perf:ci` floors for `/en`, `/ar`, `/de`, and the case-study page |
| `a11y-results.png` | `pnpm test:a11y` output (axe; known limitations: `color-contrast`, `target-size`) |

Do not commit secrets, job tokens, internal hostnames, or full HTML reports with environment details.
