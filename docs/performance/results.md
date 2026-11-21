# Performance results (mobile Lighthouse)

Goal: **good enough** — lab LCP median &lt; 4 s per tracked page (ideally &lt; 3 s), CLS ≈ 0, visuals identical. Stop optimizing once the stop rule is met; do not chase score/TBT without a new decision.

Method: local standalone production server, Lighthouse baseline script, same machine. Final series used **median of 5** runs.

## Before / after (LCP ms, CLS)

| Page                 | Baseline `00f0641` (×3) | Ref HEAD `cbf9022` (×5) | After #3 `de8fb67` (×5) | Final #4 `5f88e0d` (×5) | CLS final |
| -------------------- | ----------------------: | ----------------------: | ----------------------: | ----------------------: | --------: |
| `/en`                |                    1229 |                    1232 |                    1232 |                **1229** |     0.000 |
| `/ar`                |                    5531 |                    5751 |                    5748 |                **4923** |     0.000 |
| `/de`                |                    3825 |                    4276 |                    4277 |                **4309** |     0.000 |
| `/en/work/rento-car` |                    3798 |                    3608 |                    3843 |                **3926** |     0.000 |

Stop rule at final `5f88e0d`: **not met** — `/ar` (4923) and `/de` (4309) remain above 4 s. `/en` and the case-study page are under 4 s. No further LCP opts without an explicit decision.

## What was kept

| Item                                                                                                            | Commit    | Effect                                                                                       |
| --------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------- |
| Mobile hero eagle as real LCP image (`priority` / `fetchPriority`, matching sizes; no mismatched eagle preload) | `1ae3ba2` | Large `/ar`/`/de` LCP wins in the early ×3 series; still the right LCP wiring                |
| Case-study cover `fetchPriority="high"` + sizes aligned to layout max width                                     | `de8fb67` | Same asset/crop; local visual compare showed pixel noise &lt; 1%                             |
| Start network / hero canvases only after LCP (`runAfterLcp`)                                                    | `5f88e0d` | Same final visuals; frees the LCP window from particle boot                                  |

## What was reverted (and why)

| Item                             | Commits                                               | Why                                                                                                                                                                                                                         |
| -------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arabic font preload on `ar` only | `d8c7b89` → `055d971`, reverted `0a8c71f` + `cbf9022` | (1) Preloads competed with the eagle on `/ar` (~194 KiB Noto at High with the LCP image). (2) Switching off `next/font` to public `@font-face` changed Arabic glyph metrics — all `ar-*` screenshots differed. Design wins. |

## Postponed

| Item                                                                            | Reason                                                                     |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Arabic font strategy that does not compete with LCP and keeps metrics identical | Needs a new approach (keep `next/font` size-adjust; avoid High contention) |
| Further TBT / main-thread cuts                                                  | Stop rule not met on `/ar`; wait for decision                              |
| Insights cache / ADR / unused client-bundle backlog                             | Explicitly postponed earlier                                               |

## CI floors

GitLab job `lighthouse` (`pnpm perf:ci`) asserts **floors only** from final lab medians + noise margin (`max(median×1.5, median+2500)` for LCP; CLS ≤ 0.05). It does **not** fail on performance score or TBT. Artifacts under CI reports (no external upload).

| Page                 | Lab LCP | CI LCP ceiling |
| -------------------- | ------: | -------------: |
| `/en`                |    1229 |           3729 |
| `/ar`                |    4923 |           7423 |
| `/de`                |    4309 |           6809 |
| `/en/work/rento-car` |    3926 |           6426 |
