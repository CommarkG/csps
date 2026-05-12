---
id: csps.template.domain-card
name: domain-card
description: >
  Canonical template for CSPS domain cards — the §1-§11 structured artifact that makes
  every platform element self-describing for both human and AI readers simultaneously.
  Every spine artifact and platform-service artifact follows this template exactly.
  When this template evolves, validate-template-compliance.mjs detects all artifacts
  at an older schema_version and flags them for update. One template; infinite instances;
  one update propagates everywhere.
version: 1.0
template_grade: B  # Opus Turn 15 S026
schema_version: "1.1"
owner: group:finky
lifecycle: production
lifecycle_state: active
template_status: stable
core_spine: GVRN
schema_anchor: templates
tags:
  - domain:governance
  - domain:platform
  - type:template
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ../../docs/platform-audit/README.md }
  - { rel: registry, href: ../../docs/plan/_handoff/VAULT/template-registry.md }
  - { rel: validator, href: ../validators/validate-template-compliance.mjs }
  - { rel: example-gvrn, href: ../../docs/platform-audit/spines/GVRN.md }
consolidation_cross_refs:
  - docs/platform-audit/spines/GVRN.md
  - docs/platform-audit/spines/ARCH.md
  - docs/platform-audit/spines/AI.md
  - docs/platform-audit/spines/VALD.md
  - docs/platform-audit/spines/OPER.md
  - docs/platform-audit/platform-services/vocabulary.md
---

# Domain Card Template — §1-§11

> **Living Template Notice:** This template evolves as the platform learns what questions matter.
> `schema_version` is bumped when a section is added, removed, or restructured.
> `validate-template-compliance.mjs` detects all domain card artifacts at an older
> `template_version` and surfaces them as needing review.
> The template is the single source of truth. The artifacts are its instances.
> **GDE (Gradual Depth Engine):** Every domain card must declare depth_levels: with L1/L2/L3 token targets. Without this, the context orchestrator cannot select the right depth, and MCP cannot serve depth-parameterized queries.

---

## Schema Version History

| Version | What changed | Session |
|---|---|---|
| 1.1 | Added depth_levels: frontmatter field (GDE standard — L1/L2/L3 tokens + locations) | S018 |
| 1.0 | Initial §1-§11 structure (Identity/Problem/Principles/HowItWorks/Dependencies+BR/Personas/Journeys/Vocabulary/MCPSurface/CurrentState/ConnectionMap) | S018 |

---

## depth_levels Frontmatter Field (GDE Standard)

Every domain card must include in its frontmatter:

```yaml
depth_levels:
  l1: "One sentence: what this element is and does"
  l1_tokens: 150
  l2: "Brief operational description — how it works"
  l2_tokens: 1500
  l3: "Reference to full implementation detail"
  l3_location: "./this-file.md#section-or-subsection"
```

Required for: context orchestrator depth selection + MCP depth-parameterized queries + GDE escalation ladders.
The orchestrator reads l1_tokens to select the L1 bundle; escalation ladder (Task Complexity, Rung 1-2) reads l2 and l3 when L1 is insufficient.

---

## The §1-§11 Sections

Every domain card artifact MUST contain these 11 sections in this order.
Sections may be brief (2-3 sentences) or deep (multiple subsections).
A section marked `N/A — see [parent/spine]` is acceptable when genuinely not applicable.

---

### §1 Identity

```
**What I am:** [One sentence: what this element is and does]
**Core spine position:** [Which spine + precedence position]
**Who I am part of:** [Parent: platform-level / which spine / which element]
**My sub-parts:** [Bullet list of child elements / sub-domains]
```

**Required fields:** all 4. Sub-parts may be empty list if truly atomic.

---

### §2 The Problem I Solve

```
**Without me:** [What fails when this element is absent]
**What breaks specifically:** [2-4 concrete failure modes, with examples]
```

**Required fields:** both. Must be concrete, not abstract.

---

### §3 My Principles

```
**Foundation principles:** [P-* IDs with one-line description]
**Key behavioral contracts:** [B_* IDs with one-line description]
```

**Required fields:** both. At minimum one principle and one contract each.

---

### §4 How I Work

```
**Depth 1 — Executive view:** [≤100 words, high-level operation]
**Depth 2 — Operational view:** [≤200 words, how it actually runs]
**Depth 3 — Implementation view:** [Bullet list: specific files, validators, commands]
```

**Required fields:** all 3 depths. Depth 1 must be understandable by a non-technical reader.

---

### §5 Dependencies & Blast Radiuses

```
**What I depend on:** [Bullet list: which spines/services/external systems]

**Blast Radiuses:**
- **BR1 (element-level):** [What a change to one sub-part affects]
- **BR2 (domain-level):** [What a change to this element affects across its spine]
- **BR3 (platform-wide):** [What a change to this element affects across all 30 apps]
```

**Required fields:** all 4 (dependencies + BR1 + BR2 + BR3).

---

### §6 Personas

```
**Default persona:** [Who operates in this domain — role + brief description]
**Sub-personas:** [Bullet list: name + scope for each]
**AI behavior in this domain:**
- *Spine-level:* [How AI behaves across this spine]
- *Platform-level:* [How the platform-wide AI behavior applies here]
- *[Element]-unique:* [AI behaviors specific to this element that override/extend above]
```

**Required fields:** all 3 AI behavior levels. Sub-personas may be empty if element has one persona.

---

### §7 Human Journeys

```
**[Role 1] journey:** [Step-by-step: what this role does with/in this domain]
**[Role 2] journey:** [Step-by-step: different role's experience]
```

**Required fields:** minimum 2 journeys. Standard roles: developer, external-advisor, Governor, end-user.

---

### §8 Vocabulary

```
**Terms I own:** [Bullet: term — definition (canonical home: this artifact)]
**Terms I use from other elements:** [Bullet: term — which element owns it]
```

**Required fields:** both. Empty list acceptable if element owns no terms.

---

### §9 MCP Surface

```
get_[element_name]("[parameter]")     → [what it returns]
[list all MCP-queryable interfaces for this element]
```

**Required fields:** at minimum 2 MCP queries. For elements not yet MCP-queryable: note
`enforcement_stage: planned` and list intended queries.

---

### §10 Current State & Evolution

```
**Implemented today (enforcement_stage: active):**
- [Bullet list: what's running now with evidence]

**Planned (enforcement_stage: planned / week-4):**
- [Bullet list: what's coming with session target or week-4 tag]
```

**Required fields:** both sections. "Implemented today" must cite actual artifacts/validators.

---

### §11 Connection Map

```
| Connected to | How |
|---|---|
| [Spine/Service name] | [One sentence: how this element connects to that one] |
```

**Required fields:** minimum 4 connections. Include all spines this element meaningfully touches.

---

## Template Compliance Rules

1. All 11 sections must be present (N/A is acceptable for sub-fields, not for entire sections)
2. `template_version` in artifact frontmatter must match this file's `schema_version`
3. §1 must have all 4 required fields
4. §5 must have BR1, BR2, BR3 (not optional)
5. §6 must have all 3 AI behavior levels
6. §9 must list at least 2 MCP queries (actual or planned)
7. §10 must cite actual artifacts for "implemented today" claims
8. §11 must have at least 4 connections

**Escape hatch:** `template_compliance_exceptions: [list of sections + reason]` in frontmatter
allows explicit deviation with documented justification. The validator warns but does not error.

---

## How to Update This Template

1. Bump `schema_version` (e.g., 1.0 → 1.1)
2. Document the change in Schema Version History table
3. `validate-template-compliance.mjs` will surface all artifacts at 1.0 as needing review
4. Update each artifact's `template_version` after review + update
5. `pnpm audit-runner:split` to regenerate audit slices

**The ripple effect:** One template change → all instances flagged → systematic update → consistency restored.
