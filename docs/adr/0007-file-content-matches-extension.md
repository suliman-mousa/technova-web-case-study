# File content must match its extension

- Status: Accepted
- Date: 2026-11-19

## Context

Uploads (CVs, documents, images, PDFs) can be renamed to bypass naive extension or MIME checks (e.g. PNG bytes as `.pdf`).

## Decision

`validateAndStoreFile` sniffs content and requires it to match the declared extension (with documented DOCX zip MIME handling). Mismatches are rejected with code `type`.

## Consequences

- Blocks simple content-type spoofing at ingest.
- Serving paths still trust the stored extension for `Content-Type` (re-sniff on read is **Open**).
