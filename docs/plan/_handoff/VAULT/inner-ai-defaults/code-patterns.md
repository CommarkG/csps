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
domain_path: platform
scope_level: S1
---

# Inner-AI-Defaults — Code Patterns

Code-shape inner defaults vs CSPS-aligned overrides. Promoted from continuous-drift-log after K=2.

## Active entries

### code-reflexive-try-catch
- **default_pattern:** Wrap every external call in `try { ... } catch (e) { ... }` even when error path is undefined / call is internal-trusted
- **csps_aligned_pattern:** Result-type / explicit error union per slice contract; trust internal calls; only wrap at system boundaries
- **disposition:** override
- **reason:** Generic try/catch hides error semantics; CSPS slice contract makes error paths explicit per [P-ARCH-006](../../pillar-0-governance/architecture-principles.md)
- **caught_by_validator:** validate-core-contamination.mjs (LIVE S028 — scans validators/hooks for bare external API calls; the structural equivalent of the reflexive-try-catch pattern in governance code)
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
- **caught_by_validator:** validate-satisfaction-point.mjs (LIVE S026 — catches narration without evidence; SP-004 file-narration is the prose equivalent of narrative comments without WHY)
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

### code-config-silent-override
- **default_pattern:** |
    When creating a child configuration file in a hierarchy (user→project→local settings,
    base→extended schemas), write the OBJECT that contains a critical field but don't
    explicitly declare the field itself. Assume the parent value will be inherited.
    
    Example: write `"permissions": { "allow": [...] }` without `"defaultMode"`.
    The system uses defaultMode's DEFAULT (not the parent's value) — silently.
    AI never notices. User sees unexpected behavior with no obvious cause.
    
    This is the same pattern as: extending a class but not calling super() for a critical
    method, or using tsconfig but not declaring paths, or using .env without DIRECT_URL.
    
- **csps_aligned_pattern:** |
    EXPLICIT OVER IMPLICIT — every critical field must be explicitly declared at
    the level where it matters. When creating any hierarchical config:
    (1) Identify parent-level configs and their critical fields
    (2) Explicitly copy critical fields to child level with values
    (3) Add comment: "explicit — not relying on parent inheritance"
    (4) Verify by reading ONLY the child config: does it stand alone?
    
    For .claude/settings.json: if permissions object exists → defaultMode must be explicit.
    For tsconfig.json: if paths partial exists → @csps/integrations must be explicit.
    For ZModel models: if extends Base → @@allow/@@deny must be explicit per model.
    
- **disposition:** override
- **reason:** S014 canonical instance — user-level bypassPermissions silently overridden by
    project-level permissions{} without defaultMode. Caused permission prompts across the
    entire CSPS project. Root cause: AI (and developers) assume "child inherits from parent"
    but config systems use "child field = system default when field missing."
    The triad context for this pattern: loading the ARCH L2 config domain reveals that
    "inheritance" in config hierarchies is ADDITIVE (child adds fields) not OVERRIDE
    (child inherits parent values). This is counterintuitive and must be explicitly known.
- **caught_by_validator:** config-inheritance-gaps (registered S014; impl deferred week-4)
- **conceptual_sample_of:** ARCH L2 data/config domain — hierarchical config structure
- **status:** active (K=1 in drift-log; promoted to code-patterns.md at K=2)
- **discovered_in_session:** S014

## How to add new entries

See [parent README §"How to add a new entry"](./README.md#how-to-add-a-new-entry).

## Status

Skeleton — 5 entries seeded from S006 turn 3 user-surfaced inner-default table. K=2 promotion to other category files as patterns recur across categories.
