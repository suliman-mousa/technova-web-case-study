# Evidence

Screenshots from a successful GitLab run (pipeline `#3085809308`).

| File | What it shows |
| --- | --- |
| [pipeline-green.png](./pipeline-green.png) | Pipeline `#3085809308` with **quality**, **integration**, **e2e**, and **docker** all passing |
| [test-summary.png](./test-summary.png) | **159** tests, **0** failures, **100%** success (**142** unit + integration, **17** e2e) |
| [coverage.png](./coverage.png) | **52.86%** combined line coverage on the integration job (`src/lib/**` + `src/server/**`) |
| [a11y-results.png](./a11y-results.png) | **21/21** automated WCAG 2.2 AA checks (7 pages × `en` / `ar` / `de`); `color-contrast` and `target-size` recorded as known limitations — see [barrierefreiheit.md](../docs/barrierefreiheit.md) |

`lighthouse-report.png` will be added later.

Do not commit secrets, job tokens, internal hostnames, or full HTML reports with environment details.
