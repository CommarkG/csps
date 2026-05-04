---
id: csps.pillar-0-governance.naming-policy
name: naming-policy
description: Canonical naming rules for CSPS artifacts. Names MUST be simple + clear for human users while using industry-standard vocabulary. Engraved S006 turn 24 user directive — replaces ad-hoc naming with mechanically enforced policy. 4 rules govern always-current vs per-session vs per-topic vs governance-internal artifacts; case conventions per artifact-type; English words over abbreviations except for engraved canonical terms (P-META-* / B_* / FSE / RZF / CEC / HPFA / MUV / AAP / CCA / ZModel).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: novel-pending-pattern-evaluation
core_spine: ARCH
core_spines: [ARCH, GVRN]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../../../packages/principles/principles.yaml }
  - { rel: contract, href: ./behavioral-contracts.md }
  - { rel: audit, href: ./audit-runner.md }
---

# Naming Policy

> Names are infrastructure. Bad names compound: every reader pays the cost on every read; every search returns wrong results; every cross-reference rots.
>
> **Per S006 turn 24 user directive verbatim:** "names are simple and clear for human users while using industry standard vocabulary."

## The 4 rules

### Rule 1 — Always-current artifacts: simple noun; no session/version/level suffix in filename

Always-current artifacts represent THE LATEST state of something — not a snapshot in time. Filename stays stable across sessions; frontmatter `version:` field tracks revisions.

| Pattern | Example | Industry standard |
|---|---|---|
| `<noun>.md` | `quick-context.md` / `OVERVIEW.md` / `README.md` | README convention (universal) |
| `<noun-phrase>.md` (kebab-case) | `template-registry.md` / `audit-hub.md` / `naming-policy.md` | Tech docs convention |

**FORBIDDEN suffixes in always-current filenames:** `-S<NNN>` / `-v<N>` / `-L<N>` / `-final` / `-latest` / `-current` / `-new` / `-old`. Version goes in frontmatter, not filename.

### Rule 2 — Per-session artifacts: include `S<NNN>` suffix (immutable historical record)

Per-session artifacts are point-in-time records. Each session writes its own; previous sessions' files remain untouched.

| Pattern | Example |
|---|---|
| `<type>-S<NNN>.md` | `closing-summary-S006.md` / `governor-prompts/S006.md` |
| `<type>-S<NNN>-to-S<NNN+1>.md` | `HANDOFF-S005-to-S006.md` / `chat-jump-prompt-S005-to-S006.md` |
| `<type>-S<NNN>-to-S<NNN+1>-detailed.md` | `chat-jump-prompt-S005-to-S006-detailed.md` |

These follow CSP precedent (immutable point-in-time) and are correctly session-coded.

### Rule 3 — Per-topic artifacts: topic-id only; no session suffix (multi-session arc; latest state)

Per-topic artifacts span multiple sessions. Filename uses topic-id only; the file evolves session-to-session in place.

| Pattern | Example |
|---|---|
| `topic-plans/<topic-id>.md` | `s006-governance-foundation.md` / `zero-laptop-dependency-setup.md` / `foundation-slices.md` |
| `element-reviews/<element-id>-S<NNN>.md` | `csps-core-spines-S006.md` (review IS session-coded; the reviewed element is not) |

**Topic-id convention:** kebab-case; descriptive noun phrase; may include the originating session (`s006-...`) when the topic is session-anchored.

### Rule 4 — Governance-internal layer artifacts: layer prefix preserved (load-bearing identity)

Some artifacts have layer identity that IS the load-bearing meaning. The prefix conveys amendment protocol + sealing status.

| Pattern | Example | Why prefix is load-bearing |
|---|---|---|
| `L1_CORE_<SPINE>.md` | `L1_CORE_GVRN.md` | L1 = sealed; CC-equivalent amendment; do_not_expand list applies |
| `L2_DOMAIN_<SPINE>_<DOMAIN>.md` | `L2_DOMAIN_ARCH_COMPOSITION.md` | L2 = normal review amendment |
| `L3_INSTANCES_<SPINE>.md` | `L3_INSTANCES_GVRN.md` | L3 = per-session edit |

These follow CSP S331 Bundle 1 Scope A precedent. The prefix is part of the artifact's structural identity; renaming would lose semantic meaning.

## Case conventions per artifact-type

| Artifact type | Convention | Example |
|---|---|---|
| Filenames (markdown / yaml) | kebab-case | `template-registry.md` / `priority-engine.schema.yaml` |
| Layer-prefixed sealed doctrine | UPPER_SNAKE for prefix; UPPER for spine; rest as needed | `L1_CORE_GVRN.md` |
| Universal entry-points (README-class) | UPPER | `README.md` / `AGENTS.md` / `MASTER_PLAN.md` |
| Code identifiers (TS/JS) | camelCase (functions/vars) / PascalCase (types/components) | `validateFrontmatter` / `EntityList` |
| Database tables / Zod schemas | PascalCase | `Tenant` / `AuditEvent` |
| Audit slugs | kebab-case | `template-citation-on-creation` |
| Engraved canonical terms | as engraved (preserved) | `P-META-015` / `B_TEMPLATE_FIRST_CREATION` / `FSE` / `RZF` |
| Git branches | kebab-case + scope prefix | `feat/foundation-slices` / `fix/yaml-quote-drift` |
| Commit messages | Sentence case; imperative mood | "S006 governance-foundation closure" |

## Vocabulary rules

1. **English words preferred over abbreviations** — `template-registry.md` not `tmpl-reg.md`
2. **Engraved canonical terms preserved** — `P-META-*` / `B_*` / `FSE` / `RZF` / `CEC` / `HPFA` / `MUV` / `AAP` / `CCA` / `ZModel` / `BaseAgent` / `RLS` are platform DNA; do not rename
3. **Industry-standard vocabulary preferred** — `slice` / `template` / `audit` / `validator` / `registry` / `manifest` / `schema` / `pillar` (architectural concept) over invented terms
4. **Avoid synonyms drift** — once a term is chosen for a concept (e.g., `slice` for feature-with-bounded-contract), use that term consistently; don't introduce `module` / `feature` / `component` for the same concept
5. **Glossary-pinned terms** for domain entities — Booking's `Customer` ≠ CRM's `Customer`; per ADR-0023 schema-per-app boundary

## Mechanical enforcement (5/5 surfaces)

| Surface | Artifact |
|---|---|
| Schema | this file (the canonical spec) + frontmatter `name:` field on every artifact |
| Validator (atomic registration) | `naming-policy-compliance` (registered in audit-runner.md; impl week-4) |
| Hook | `.claude/hooks/pre-tool-use-naming-policy.sh` (PreToolUse — refuses Write/Edit on filenames violating policy; planned week-4) |
| Memory | `feedback_naming_policy.md` (cognitive layer) |
| Contract | `behavioral-contracts.md § B_NAMING_POLICY` + `AGENTS.md` hard NO + `principles.yaml#P-ARCH-029` + `ai-behavior-spine.md` matrix row |

## Validator behavior

`naming-policy-compliance` (PR-blocking warn; impl week-4):

```
For each modified artifact filename:
  1. Detect artifact class (always-current / per-session / per-topic / layer-prefixed)
  2. Apply class-specific rules:
     always-current: filename has no -S<NNN> / -v<N> / -L<N> suffix
     per-session: filename has S<NNN> suffix (closing-summary / governor-prompts / handoff)
     per-topic: filename has no session suffix UNLESS element-review (allowed both)
     layer-prefixed: prefix matches load-bearing pattern (L1_CORE / L2_DOMAIN / L3_INSTANCES)
  3. Apply universal rules:
     case-convention matches artifact-type table
     no forbidden suffixes (-final / -latest / -new / -current / -old)
     vocabulary check: no abbreviation drift (jscpd-style detection)
  4. WARN on violation (PR-blocking warn); ratchet to ERROR after K=5 fires (per ratchet protocol)
```

## Renaming protocol

When renaming an existing artifact:
1. `git mv <old-path> <new-path>` (preserves history)
2. Update internal frontmatter `id:` and `name:` fields
3. Grep for inbound references; update each cross-reference in same commit
4. Add entry to `_handoff/VAULT/spine-attribution-history.jsonl` if `core_spine:` field changed
5. Validator must PASS before commit

## Carry-forward — walk all CSPS files for compliance (queued S007)

This engraving (S006 turn 24) creates the mechanical enforcement. The CSPS corpus may contain pre-engraving naming inconsistencies. Element-review queued for S007: walk all artifacts + identify violations + propose batch renames per Rule 1-4. Reference: `_handoff/VAULT/element-reviews/csps-naming-walk-S007.md` (to be authored S007).

**Naming policy signature:** `S006-AI-naming-policy-2026-05-04T21:30:00Z`
