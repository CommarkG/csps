---
id: csps.handoff.vault.inner-ai-defaults.code-patterns
name: inner-ai-defaults-code-patterns
description: Inner AI training-baked code patterns vs CSPS-aligned overrides. Per P-META-017 (CSPS-Alignment-Over-Inner-Defaults). Per-entry schema in parent README.md. Skeleton at S006 L1; populated through K=2 promotion from continuous-drift-log.md.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: registry-canonical
template_status: novel-pending-pattern-evaluation
core_spines: [AI, GVRN]
tags:
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
session: S006
---

# Inner-AI-Defaults — Code Patterns

Code-shape inner defaults vs CSPS-aligned overrides. Promoted from continuous-drift-log after K=2.

## Active entries

### code-reflexive-try-catch
- **default_pattern:** Wrap every external call in `try { ... } catch (e) { ... }` even when error path is undefined / call is internal-trusted
- **csps_aligned_pattern:** Result-type / explicit error union per slice contract; trust internal calls; only wrap at system boundaries
- **disposition:** override
- **reason:** Generic try/catch hides error semantics; CSPS slice contract makes error paths explicit per [P-ARCH-006](../../pillar-0-governance/architecture-principles.md)
- **caught_by_validator:** csps-eslint-no-bare-throw (registered; impl deferred)
- **example_default:** `try { return await api.fetchUser(id); } catch (e) { console.error(e); return null; }`
- **example_aligned:** `return Result.fromAsync(() => api.fetchUser(id))` returning `Result<User, ApiError>`
- **status:** active
- **discovered_in_session:** S006

### code-generic-naming
- **default_pattern:** Use generic names ("user", "admin", "manager", "data", "result") without checking glossary
- **csps_aligned_pattern:** Glossary-pinned canonical IDs from [packages/principles/glossary.yaml](../../../../packages/principles/principles.yaml); Vale dict + ESLint id-denylist enforce
- **disposition:** override
- **reason:** Generic names create cross-app collisions (Booking's Customer ≠ CRM's Customer); per ADR-0023 schema-per-app boundary
- **caught_by_validator:** glossary-id-citation (registered; impl deferred week-2)
- **status:** active
- **discovered_in_session:** S006

### code-narrative-comments
- **default_pattern:** Add comments explaining WHAT the code does (e.g., `// loop through users`)
- **csps_aligned_pattern:** Comments only when WHY is non-obvious; no narration of self-evident code
- **disposition:** override
- **reason:** Per global-instructions + CSPS DNA; well-named identifiers ARE the documentation
- **caught_by_validator:** comment-only-where-why-non-obvious (registered; impl deferred)
- **status:** active
- **discovered_in_session:** S006

### code-loose-json-default
- **default_pattern:** Use plain TypeScript interfaces / loose JSON shapes with optional fields default
- **csps_aligned_pattern:** Zod schemas with id-from-glossary, narrow Brand types, explicit nullability
- **disposition:** override
- **reason:** Loose shapes drift between apps; runtime validation absent; Zod composes with ZModel + RLS + audit triggers
- **caught_by_validator:** zod-schema-required-on-boundaries (registered; impl deferred)
- **status:** active
- **discovered_in_session:** S006

### code-mock-by-default
- **default_pattern:** Mock external dependencies (DB, HTTP, file system) reflexively in tests
- **csps_aligned_pattern:** Integration tests hit real DB (Postgres + RLS); only unit tests mock
- **disposition:** adjust
- **adjust_specifics:** Mock for unit tests YES; for integration tests NO (mocks of DB hide RLS bugs + migration failures)
- **reason:** Memory entry on database integration testing — past incident with mocked tests passing while migration broke prod
- **caught_by_validator:** integration-test-no-db-mocks (registered; impl deferred)
- **status:** active
- **discovered_in_session:** S006

## How to add new entries

See [parent README §"How to add a new entry"](./README.md#how-to-add-a-new-entry).

## Status

Skeleton — 5 entries seeded from S006 turn 3 user-surfaced inner-default table. K=2 promotion to other category files as patterns recur across categories.
