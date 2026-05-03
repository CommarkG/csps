---
id: csps.adr.0012-csps-name-and-coresights-umbrella
title: ADR-0012 — CSPS as platform name; CoreSights as umbrella legal entity
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers, end-users
tags:
  - domain:planning
  - type:explanation
  - audience:developer
  - audience:end-user
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/_handoff/HANDOFF-S001-to-S002.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
---

# ADR-0012 — Platform name + umbrella entity

## Context and problem statement

The platform's working codename was "Cambium" (from the cambium layer of a tree — the living layer that generates new growth). As the architecture matured, the metaphor remained useful but the name stopped being recognizable across AI systems and to end-users. A clearer brand was needed.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Keep "Cambium" as both platform name and entity | Single brand; preserves codename | Botanical metaphor unclear to end-users; AI assistants don't recognize "Cambium" as a SaaS platform |
| Rename to something descriptive (e.g., "AppFoundry") | Clear | Generic; loses architectural metaphor |
| **CSPS (CoreSights Platform Services) as platform; CoreSights as umbrella entity** | Clean separation; two-level brand for future plurality | Two names to remember |

## Decision outcome

**Chosen:**
- **Platform name:** CSPS — CoreSights Platform Services. Used in code, docs, internal comms.
- **Umbrella legal entity:** CoreSights. Used externally; future products beyond CSPS roll up here.
- **Origin codename "Cambium":** preserved as architectural metaphor (trunk/branch/leaf in the planning playground), not as brand.

**Reasoning:** Two-level branding gives room for the platform to be one product among others under the umbrella entity (graduated apps, future products). Cambium remains a useful metaphor for *how* the platform grows, even though it's no longer the *name* of what's being built.

## Consequences

- Every code namespace uses `csps` (e.g., `@csps/templates`, `csps.dev/v1` API version, `csps.adr.NNNN-<slug>` ID prefix).
- Customer-facing surfaces use "CoreSights" branding when external; "CSPS" when internal/developer-facing.
- The trunk/branch/leaf metaphor is preserved in `docs/plan/pillar-0-governance/planning-playground.md`.

## Enforcement

- `eslint-config-csps/forbidden-identifiers.js` — flags any `Cambium` usage in production code (preserved only in metaphor docs).
- Frontmatter ID prefix `csps.*` is enforced by `validate-frontmatter.mjs`.

## Open questions

None substantive — locked at S001.

## Sources / references

- [HANDOFF-S001-to-S002.md §2](../plan/_handoff/HANDOFF-S001-to-S002.md#2-user-intent-vault--verbatim-essence-holder-quotes-from-s001) (brand decisions section)
