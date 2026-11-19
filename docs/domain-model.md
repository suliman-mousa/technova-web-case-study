# Domain model (entities & relations)

Sanitized ER view of the Prisma schema. Field lists omit sensitive columns (PII payloads, password hashes, file passwords, admin notes). Relations and lifecycle statuses only.

```mermaid
erDiagram
  User ||--o{ Insight : creates

  JobOpening ||--o{ JobApplication : receives

  ConsultationRequest ||--o{ ConsultationDeliverable : has
  ConsultationRequest ||--o| ConsultationFeedback : has

  PartnershipApplication ||--o{ PartnershipDeliverable : has
  PartnershipApplication ||--o| PartnershipFeedback : has

  User {
    id bigint
    role UserRole
  }

  Insight {
    id bigint
    locale ContentLocale
    status InsightStatus
    slug string
  }

  JobOpening {
    id bigint
    locale ContentLocale
    status JobOpeningStatus
    slug string
  }

  JobApplication {
    id bigint
    status JobApplicationStatus
    locale ContentLocale
  }

  ConsultationRequest {
    id bigint
    publicId string
    status RequestLifecycleStatus
    locale ContentLocale
  }

  ConsultationDeliverable {
    id bigint
    kind DeliverableKind
    sortOrder int
  }

  ConsultationFeedback {
    id bigint
    rating int
  }

  PartnershipApplication {
    id bigint
    publicId string
    status RequestLifecycleStatus
    partnershipType PartnershipType
    locale ContentLocale
  }

  PartnershipDeliverable {
    id bigint
    kind DeliverableKind
    sortOrder int
  }

  PartnershipFeedback {
    id bigint
    rating int
  }
```

## Enums (names only)

| Enum | Values |
| --- | --- |
| `UserRole` | `admin`, `staff` |
| `ContentLocale` | `ar`, `en`, `de` |
| `InsightStatus` | `draft`, `published` |
| `JobOpeningStatus` | `open`, `closed`, `draft` |
| `JobApplicationStatus` | `new`, `reviewing`, `shortlisted`, `rejected`, `hired` |
| `RequestLifecycleStatus` | `under_review`, `contacted`, `in_progress`, `completed` |
| `PartnershipType` | `representation`, `agency` |
| `DeliverableKind` | `study`, `implementation`, `documentation`, `delivery`, `guide`, `other` |

## Notes

- Tracking portals unlock via a separate iron-session cookie after verifying a hashed access password on the request/application row (not shown as an entity).
- Marketing content (services, markets, case studies) lives in typed TypeScript modules, not in MySQL — see [i18n-content-architecture.md](i18n-content-architecture.md).
