# Honeypot submissions discarded but answered with fake success

- Status: Accepted
- Date: 2026-11-19

## Context

Bots submit consultation/partnership forms. Rejecting with an error teaches bots; persisting honeypot hits pollutes the database and may trigger email.

## Decision

If the honeypot field `website` is non-empty, processors return status `discarded` with a success-shaped message. API/action callers must **not** persist or send email, but still respond like success to the client.

## Consequences

- Less spam in DB/inbox; bots get no clear signal.
- Metrics that count HTTP “success” overstate real leads unless they filter `discarded` server-side.
