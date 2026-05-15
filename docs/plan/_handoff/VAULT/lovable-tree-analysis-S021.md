---
id: csps.handoff.vault.lovable-tree-analysis.S021
name: lovable-tree-analysis-S021
description: >
  Full analysis of Lovable's Knowledge Hub Empty Tree Scaffold against CSPS domain
  taxonomy. Identifies alignment, gaps, conflicts, and resolution recommendations.
  Saved from Governor directive S021 — will be refined through consensus turns
  before any implementation. This is the AI behavior + UX consideration document.
version: 1.0
lifecycle: production
lifecycle_state: pending-review
next_review_at: S022
dynamic: true
owner: group:finky
core_spine: GVRN
schema_anchor: platform_plans
session: S021
domain_path: platform
wisdom_class: reference
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: csps-taxonomy, href: ./platform-excellence-consolidated-S021.md }
  - { rel: completion-circle, href: ../../../../tools/validators/validate-completion-circle.mjs }
scope_level: S1
---

# Lovable Knowledge Tree — CSPS Analysis
## Consensus-Building Document: Turn-by-Turn Alignment

---

> **Process:** The Governor reviews each Issue in sequence. We agree on each before
> proceeding. This document updates as consensus is reached.
> Lovable file: `knowledge-tree-empty.md` (provided by Governor, S021)

---

## The Lovable Tree Structure (Parsed)

**Top Level (3 branches):**
- `builder` — HOW to construct the platform (developer-facing)
- `user` — WHAT domains users need (end-user-facing)
- `crosscut` — Cross-cutting concerns (both)

**Lovable Node Schema (every node has):**
```yaml
id: builder.architecture.data
description: _(fill in)_
background: _(fill in)_
context_bullets: [3 items]
typed_edges: [DERIVES_FROM | REFINES | DEPENDS_ON]
owner: single-owner
plane: Foundation | Domain | Spec
maturity: seed | draft | proven | battle-tested | canonical
```

**Lovable Maturity Model:**
```
seed → draft → proven → battle-tested → canonical
```

---

## Full Node Inventory (All IDs from Lovable)

### Builder Branch

| ID | Name | CSPS Mapping |
|---|---|---|
| `builder` | Code & Craft | platform |
| `builder.architecture` | Architecture | ARCH spine |
| `builder.architecture.data` | Data model & schemas | libs/policies/schema.zmodel |
| `builder.architecture.server` | Server / edge functions | apps/*/src/app/api/ |
| `builder.architecture.routing` | Routing & SSR | Next.js app router |
| `builder.architecture.state` | State management | ??? (not defined in CSPS) |
| `builder.architecture.integrations` | Integrations | libs/integrations/ |
| `builder.governance` | Governance | GVRN spine |
| `builder.governance.constitution` | Constitution & principles | principles.yaml + AGENTS.md |
| `builder.governance.error-pipeline` | Error accountability | ZF discipline + RZF |
| `builder.governance.audit` | Audit trails / forensic logs | AuditEvent model |
| `builder.governance.versioning` | Versioning & change control | Git + session protocols |
| `builder.governance.rls` | Roles, permissions, RLS | ZenStack @@allow policies |
| `builder.ux` | UX Patterns | NOT YET IN CSPS |
| `builder.ux.choice` | Choice design | NOT YET IN CSPS |
| `builder.ux.onboarding` | Onboarding & intent capture | NOT YET IN CSPS |
| `builder.ux.escalation` | Escalation & nudges | Context orchestrator triggers |
| `builder.ux.states` | Empty / loading / error states | NOT YET IN CSPS |
| `builder.ux.i18n` | Accessibility & i18n (EN/HE/RTL) | NOT YET IN CSPS |
| `builder.ai` | AI Layer | AI spine |
| `builder.ai.prompts` | Prompts & system messages | AGENTS.md + inner-ai-defaults |
| `builder.ai.decide` | Decision logic | Priority Engine |
| `builder.ai.memory` | Memory & context | GRACE + session-state.json |
| `builder.ai.trust` | Trust framing (GTP / MethodBot) | B_AI_PROFESSIONAL_VOICE |
| `builder.antipattern` | Anti-patterns | **NEW — not in CSPS** |
| `builder.antipattern.code` | Code / architecture anti-patterns | inner-ai-defaults code-patterns |
| `builder.antipattern.ux` | UX anti-patterns | **NEW** |
| `builder.ops` | Ops | OPER spine |
| `builder.ops.deploy` | Deployment, env, secrets | .env.example + Supabase |
| `builder.ops.observability` | Observability | **PARTIAL — AuditEvent only** |
| `builder.ops.testing` | Testing | pnpm verify + validators |

### User Branch

| ID | Name | CSPS Mapping | Gap? |
|---|---|---|---|
| `user` | Subjects & Domains | personal + business + social | Partial |
| `user.business` | Business | business.* | ✓ |
| `user.business.management` | Management / leadership | business.strategy | Partial |
| `user.business.hr` | HR & people | business.hr | ✓ |
| `user.business.finance` | Finance | business.finance | ✓ |
| `user.business.marketing` | Marketing | business.marketing | ✓ |
| `user.business.sales` | Sales | business.sales | ✓ |
| `user.business.ops` | Operations | business.operations | ✓ |
| `user.business.strategy` | Strategy & planning | business.strategy | ✓ |
| `user.business.crm` | Customer / CRM | business.customer-success | ✓ |
| `user.personal` | Personal | personal.* | Partial |
| `user.personal.physical` | Physical (health, fitness, sleep) | personal.health.physical | ✓ |
| `user.personal.mental` | Mental & emotional | personal.health.mental | Partial — CSPS bundles under health |
| `user.personal.spiritual` | Spiritual / religious | personal.spiritual | ✓ |
| `user.personal.relationships` | Relationships | personal.relationships | ✓ |
| `user.personal.parenting` | Parenting & children | personal.family.children.* | Partial — CSPS has full age tree |
| `user.personal.learning` | Learning & growth | personal.academic + personal.career | ✓ |
| `user.personal.finance` | Personal finance | personal.finance | ✓ |
| `user.personal.habits` | Time & habits | **MISSING FROM CSPS** | Gap |
| `user.social` | Social | social.* | ✓ |
| `user.social.community` | Community | social.community | ✓ |
| `user.social.civic` | Society & civic | social.civic | ✓ |
| `user.social.culture` | Nationality / culture | **MISSING FROM CSPS** | Gap |
| `user.social.care` | Care circles | personal.family.extended.elderly_parent | Partial |

### Cross-cutting Branch

| ID | Name | CSPS Mapping | Gap? |
|---|---|---|---|
| `crosscut` | Cross-cutting | **MISSING FROM CSPS** | Gap |
| `crosscut.accountability` | Accountability | behavioral contracts (AI-side) | Partial |
| `crosscut.intent` | Goal setting & intent | **MISSING** | Gap |
| `crosscut.decision` | Decision making | PCR + VLT system | Partial |
| `crosscut.feedback` | Feedback & reflection | CEC + extraction | Partial |

---

## Issue Analysis (Turn-by-Turn Consensus)

### ISSUE 1 — Organizing Axis Difference [STATUS: Pending Governor response]

**The fundamental difference:**
- CSPS: organized by WHAT (subject matter: business/personal/social/knowledge/platform)
- Lovable: organized by WHO (builder vs. user) and WHAT APPLIES EVERYWHERE (crosscut)

**Recommendation:** Add `builder_surface` field to CSPS schema alongside `domain_path`:
```yaml
domain_path: "personal.health.sleep"   # WHAT subject
builder_surface: "user"               # WHO consumes: builder | user | both | platform-only
```

**Tier 1 update:** Add `crosscut` as 6th Tier 1:
```
business | personal | social | knowledge | platform | crosscut
```

**Maturity alignment:**
Lovable: `seed → draft → proven → battle-tested → canonical`
CSPS cdp_status (implementation lifecycle): `raw → ratified → implementing → implemented → zf-achieved → measured → sealed`
Recommendation: Use Lovable's maturity for ARTIFACTS; keep cdp_status for IMPLEMENTATION TRACKING.

---

### ISSUE 2 — What Lovable Has That CSPS Is Missing

1. **`builder.antipattern.*`** — Anti-patterns as first-class nodes. CSPS has inner-AI-defaults with "override" patterns but no explicit anti-pattern catalog.
   Recommendation: Add `docs/plan/pillar-0-governance/anti-patterns.md` with structured catalog.

2. **`builder.ux.*` (entire section)** — UX patterns library. CSPS has zero developer UX guidance.
   Recommendation: Add to Platform Phase H roadmap (developer frontend). Define now as `seed` maturity.

3. **`user.personal.habits`** — Time & habits tracking. CSPS personal domain doesn't have this.
   Recommendation: Add `personal.habits` as a Tier 2 domain alongside health, relationships, finance.

4. **`user.social.culture`** — Nationality / culture. CSPS social domain missing this.
   Recommendation: Add `social.culture` as a Tier 2 domain.

5. **`user.social.care`** — Care circles (broader than just family/elderly). Caring relationships that are NOT family (neighbors, friends in need).
   Recommendation: Add `social.care` as Tier 2. Distinct from `personal.family.extended`.

6. **`crosscut.*` (entire section)** — Accountability, goal-setting, decision-making, feedback as explicit cross-domain concerns.
   Recommendation: These become the 6th Tier 1 (`crosscut`) in CSPS taxonomy.

---

### ISSUE 3 — What CSPS Has That Lovable Is Missing

1. **`knowledge` meta-domain** — WisdomVault, research, learning as a top-level meta-domain. Lovable only has `user.personal.learning` (individual growth). CSPS's `knowledge` is platform-level accumulated wisdom (cross-domain patterns, benchmarks, insights). Lovable has no equivalent.

2. **The Family sub-tree depth** — Lovable has `user.personal.parenting`. CSPS has the full lifecycle: couple → children by age (infant/toddler/child/teen/young_adult) → extended (elderly_parent, grandparents, siblings) → single_parent. This is a significant competitive moat.

3. **Hybrid domains** — Freelance, creator economy, family business, dual-income household. These are first-class in CSPS's taxonomy but absent from Lovable's.

4. **Compliance layer** — HIPAA, COPPA, GDPR, SOX per domain. Lovable has no compliance mapping.

5. **The WisdomVault concept** — Cross-domain intelligence (sleep → work → relationships). Lovable doesn't have this.

---

### ISSUE 4 — Lovable's Node Schema vs. CSPS Frontmatter

Lovable's node schema has unique elements CSPS should adopt:

| Lovable field | CSPS equivalent | Action |
|---|---|---|
| `id` (hierarchical: `builder.ux.onboarding`) | `id` (non-hierarchical: `csps.xxx`) | Adopt Lovable's hierarchical ID convention for domain nodes |
| `background` | No equivalent | Add `background:` to domain cards |
| `context_bullets: [3]` | Partial (in §4 domain cards) | Standardize 3 context bullets in domain card schema |
| `typed_edges` (DERIVES_FROM/REFINES/DEPENDS_ON) | `links:` (generic) | Adopt Lovable's typed edge system in frontmatter |
| `plane` (Foundation/Domain/Spec) | `cdp_status` partially | Map: Foundation=ratified+sealed, Domain=implementing, Spec=ratified |
| `maturity` (seed/draft/proven/battle-tested/canonical) | `maturity:` tag dimension | Align CSPS maturity closed enum to Lovable's 5 values |
| `owner` (single-owner) | `owner: group:finky` | ✓ Already aligned |

**Typed edges are a significant upgrade.** Currently CSPS uses generic `links:` arrays. Lovable's typed edges (DERIVES_FROM, REFINES, DEPENDS_ON) make the relationship machine-queryable:
- `personal.health DERIVES_FROM personal` (inheritance)
- `personal.health.mental REFINES personal.health` (specialization)
- `business.finance DEPENDS_ON platform.foundation-slices` (dependency)

This enables true graph-based "nothing stands alone" auditing.

---

### ISSUE 5 — AI Behavior Implications

Lovable's tree structure has specific implications for AI behavior in CSPS:

**`builder.ai.trust` — Trust framing (GTP / MethodBot):**
This suggests Lovable's apps have specific AI trust concepts (GTP = some trust protocol, MethodBot = some AI assistant). CSPS should profile these and calibrate if CSPS AI is used in Lovable-generated apps.

**`builder.ux.onboarding & intent capture`:**
Lovable explicitly calls out "intent capture" as part of onboarding. This maps to CSPS's Question Protocol (Full Context = F+C+G+Q). The WisdomVault onboarding ("here's what people like you start with") is CSPS's implementation of Lovable's `builder.ux.onboarding`.

**AI behavior recommendation from this analysis:**
Every AI session operating on CSPS should know the Lovable taxonomy IDs (builder.*, user.*, crosscut.*) because:
1. Apps built with Lovable will use these IDs
2. When CSPS routes context to domain agents, the Lovable IDs are the app-level vocabulary
3. Cross-domain intelligence (WisdomVault) needs to map between Lovable's user.* IDs and CSPS's personal.*/business.* IDs

---

### ISSUE 6 — The UX Consideration Layer

Lovable's `builder.ux.*` section is entirely about UX PATTERNS for developers building on the platform. CSPS has none of this. For each Lovable UX node, CSPS needs:

| Lovable Node | What CSPS needs to build | Priority |
|---|---|---|
| `builder.ux.onboarding` | Onboarding wizard for each domain_path | Phase H |
| `builder.ux.choice` | Decision-making UI patterns (PCR in UI) | Phase H |
| `builder.ux.escalation` | Nudge system / notification patterns | Phase 2 (notifications) |
| `builder.ux.states` | Empty state templates per domain | Phase H |
| `builder.ux.i18n` | HE/EN/RTL support (the Governor's context: Israeli market) | Phase B |

**The HE/RTL note is significant:** `builder.ux.i18n (EN/HE/RTL)` — this confirms the Governor's use case includes Hebrew + Right-to-Left UI support. CSPS doesn't have this documented anywhere. This should be a VLT: `VLT-S021-I18N-HE-RTL`.

---

## Merged Domain Tree Proposal (Post-Consensus)

*This section fills in as consensus is reached on each Issue.*

### Proposed Tier 1 (6 values — pending Governor ratification):
```
business   — Professional and organizational activities
personal   — Individual life management and growth
social     — Community, relationships, connection
knowledge  — Learning, research, and accumulated wisdom
platform   — CSPS infrastructure and governance
crosscut   — Cross-domain concerns (accountability, goals, decisions, reflection)
```

### Key additions from Lovable not yet in CSPS (to add after Issue consensus):
- `personal.habits` — Time & habits tracking
- `social.culture` — Nationality / culture
- `social.care` — Care circles (broader than family)
- `crosscut.accountability`
- `crosscut.intent` — Goal setting
- `crosscut.decision`
- `crosscut.feedback`
- `builder.antipattern` — Anti-patterns library
- Typed edge system (DERIVES_FROM/REFINES/DEPENDS_ON)
- `builder_surface` field (builder | user | both | platform-only)

### New VLT from this analysis:
- `VLT-S021-I18N-HE-RTL` — Hebrew/RTL support as a platform requirement
- `VLT-S021-TYPED-EDGES` — Adopt Lovable's typed edge system in frontmatter
- `VLT-S021-ANTIPATTERNS` — Create anti-patterns catalog in CSPS

---

*Dynamic — updates as Governor + Opus reach consensus on each Issue.*
*S021 | 2026-05-09*
