# iron-session instead of a full auth provider

- Status: Accepted
- Date: 2026-11-19

## Context

Admin/staff need cookie sessions; consultation/partnership portals need a separate unlock cookie. A full IdP (Auth.js, Clerk, Keycloak) is heavier than the current two-role MySQL user model.

## Decision

Use `iron-session` with sealed cookies: `tn_admin_session` for admin/staff and `tn_tracking_session` for portal unlock. Passwords hashed with bcryptjs; `SESSION_SECRET` seals cookies.

## Consequences

- Small dependency surface; no external auth SaaS.
- No SSO/MFA/out-of-the-box account recovery — ops use controlled admin bootstrap scripts (not published here).
- Session secret mismanagement breaks or weakens both admin and tracking auth.
