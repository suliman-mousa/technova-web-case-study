# Prisma as data layer

- Status: Accepted
- Date: 2026-11-19

## Context

DB-backed features (users, insights, careers, consultations, partnerships, uploads metadata) need a typed ORM and migrate-friendly schema on MySQL.

## Decision

Use Prisma 6 with MySQL (`prisma/schema.prisma`). Production/Docker apply schema via `prisma migrate deploy`. Optional-DB mode uses safe fallbacks for marketing pages when the database is unavailable.

## Consequences

- Typed queries and migration history; entrypoint fails closed if migrate fails.
- Push-era databases must be baselined before first `migrate deploy`.
- MySQL-specific ops and coupling remain.
