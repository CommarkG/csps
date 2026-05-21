---
id: SIA.META-06-EXISTING-FOUNDATION
type: reference
protection_level: active
status: draft
core_spines: [ARCH, GVRN]
context_question: "What already exists in CSPS that the SIA builds on rather than replaces?"
context_quote: "Never recreate a validated element. Stand on top of it."
version: "0.1"
session: S050
name: "SIA-META-existing-foundation"
description: "Mapping of existing CSPS components to SIA architecture — what exists, what needs extending"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# META-06 — Existing CSPS Foundation

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> The SIA does not replace CSPS. It is the correct wiring of what CSPS already is.

---

## 1. What This File Is For

Before building anything in the SIA, this file answers: "Does this already exist?"
The principle: never recreate a validated element. If it exists, extend it. If it's broken, fix it. Only if it truly doesn't exist: create it.

---

## 2. Existing Components Mapped to SIA

### 2.1 R1 — Foundation

| SIA Component | Existing CSPS Artifact | Gap |
|---|---|---|
| R1.1 Node Schema | `dna-registry.yaml`, `@csps-dna` blocks, frontmatter schema | Schema exists but nodes aren't universal — not all elements are structured nodes |
| R1.2 Documentation | `_handoff/VAULT/`, principle .md files | Documentation exists but is external to nodes, not attached |
| R1.3 Creation Gate | `pre-tool-use-schema-registration-gate.sh` (AP-003) | Exists for platform_page type — needs extension to all node types |
| R1.4 Threshold | `user-prompt-submit-intake.sh` | Thin stub — classifies input type only, no routing pipelines |
| R1.4.4 Session Harvest | `post-stop-learning-loop.sh` | Likely stub — needs full implementation |
| R1.5 Tab Types | None | Does not exist — must be created |
| R1.6 AI Behavioral Profile | `_handoff/VAULT/inner-ai-defaults/` | Partial — alignment registry exists, but no formal triggers/satisfaction points registry |
| R1.7 6th Core Spine | None | Does not exist |

### 2.2 R2 — Central Intelligence Engine

| SIA Component | Existing CSPS Artifact | Gap |
|---|---|---|
| R2.1 CIE | None (engine concept) | Does not exist as unified engine |
| PE Sub-engine | `pe-agent skill`, `unified-plan.yaml`, `validate-plan-readiness.mjs` | Exists — PE scorer + PMI gate. Missing: conflict detector, readiness gate, timing dimension |
| Learning Loop Sub-engine | `post-stop-learning-loop.sh` | Likely stub |
| Scope Router Sub-engine | `findings-categorizer.mjs` | Exists — S1/S2/S3 classification. Missing: anti-satisfaction gate (K≥2 block) |
| Seeds Monitor Sub-engine | `validate-core-seeds.mjs`, `dna-registry.yaml` | Exists |
| R2.3 Planning Hub Wiring | `apps/csps-playground` (Planning Hub) | Visual layer exists at Vercel. Missing: wiring from session decisions → hub registration |
| R2.4 AI Conception Vault | None | Does not exist — behavioral contracts cover operational behavior, not conception patterns |
| R2.5 Skills-as-Lens | 20 CSPS skills exist | Skills work as tools. Lens activation model does not exist |

### 2.3 Governance

| Item | Existing | Gap |
|---|---|---|
| Behavioral contracts | `behavioral-contracts.md` ~57K tokens | Approaching hard limit. Shard plan needed. |
| Principles | `principles.yaml` (P-META-, P-ARCH-, P-OPER-) | Exist. Need mapping to SIA components. |
| AGENTS.md | 199/200 lines | At advisory limit. Migration planned. |
| Audit Hub | `audit-hub.md` (9 pipelines defined) | 0 pipelines running. Needs wiring. |
| DNA system | `dna-registry.yaml`, `validate-new-file-dna.mjs` | Exists and working |
| Core seeds | `validate-core-seeds.mjs` | Exists and working |

---

## 3. What Must Be Created (Not Extended)

[TO FILL: Clean list of genuinely new artifacts that don't exist anywhere in CSPS. These require K=0 justification (first-ever, no existing analogue).]

1. Central Intelligence Engine (CIE) as unified container
2. AI Conception Vault directory and format
3. Sacred file enforcement hook
4. Tab Type declaration mechanism in session-open
5. 6th Core Spine (after Governor ratifies scope and name)
6. Threshold full pipeline routing system

---

## 4. Migration / Extension Plan

[TO FILL: For each "exists but needs extension" item — what specifically needs to change, in what order, and what session type handles each change.]

---

*CSPS — SIA | Existing Foundation v0.1 | S050 | Protection: active*
