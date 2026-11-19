# Accessibility (WCAG 2.2 AA)

**Status:** partially conformant  
**Scope:** public marketing pages (home, services, work, case studies, contact/consultation, careers) in `en`, `ar`, and `de`.  
**Automated check:** `pnpm test:a11y` (Playwright + `@axe-core/playwright`, desktop Chromium). Not part of `pnpm verify`.

## Conformance statement

Invisible semantics, names, landmarks, language/direction, and form error announcements are covered by automated axe checks (excluding the visual rules below). Color and target-size issues remain by design until an approved visual change.

## Known limitations (visual — not fixed)

These axe findings are **recorded** by `test:a11y` and do not fail the suite. Fixing them would require visual changes (colors, contrast, sizes), which are out of scope without explicit approval (design-protection rule).

| Rule ID | WCAG | Where observed | Notes |
| --- | --- | --- | --- |
| `color-contrast` | 1.4.3 Contrast (Minimum) | All scanned routes (`en`/`ar`/`de`): home, services, work, rento-car, contact, careers, consultation form | Low-contrast text against dark/brand surfaces (muted labels, accents, chrome). |
| `target-size` | 2.5.8 Target Size (Minimum) | Intermittently on dense chrome (e.g. locale controls on home) | Controls below the 24×24 CSS px minimum; resizing would change layout. |

**Count of known limitation types:** 2 (`color-contrast`, `target-size`).

## What was fixed (non-visual)

- Org chart controls: accessible names without Label-in-Name conflicts (SVG visuals separated from the interactive control).
- Case study fact list: valid `<dl>` structure (`dt`/`dd` for project links).
- Consultation form: `aria-live` region for error announcements.

## How to re-check

```bash
pnpm build
pnpm test:a11y
```
