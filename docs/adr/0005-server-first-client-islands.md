# Server-first rendering with client islands

- Status: Accepted
- Date: 2026-11-19

## Context

SEO, LCP, and design require HTML content on the server. Interactivity (nav, forms UX, motion, canvas/3D) still needs the client.

## Decision

Prefer React Server Components and Server Actions / Route Handlers by default. Mark Client Components only for navigation, form UX, motion, and lazy-loaded 3D/canvas. Keep primary copy in HTML (e.g. hero content vs decorative scene).

## Consequences

- Smaller client boundaries and better crawlable content.
- Contributors must avoid accidental `"use client"` at high tree levels.
