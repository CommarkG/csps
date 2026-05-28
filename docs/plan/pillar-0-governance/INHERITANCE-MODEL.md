---
id: csps.governance.inheritance-model
name: INHERITANCE-MODEL
description: "Governor-ratified S068 deep-dive. Unifies CSPS inheritance into ONE model with 3 dimensions: (1) Cross-Boundary (tab↔tab, session↔session, AI↔AI) — B_INHERITANCE_POLICY + M-43; (2) Core-Creation (a new core element inherits DNA from its parent) — M-40 inherits_from + NodeFile; (3) External-Use (apps + foreign elements inherit core DNA by bundling/localization) — Core-Maximal P-ARCH-031 + B_APPS_ARE_TRIALS + Foreign-Element Localization. Consolidation of existing enforced pieces (not new). The unifying law: nothing exists in CSPS without a declared parent it inherits DNA from — no orphans."
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, ARCH, AI]
schema_anchor: vault_files
version: "1.0"
session: S068
owner: group:finky
authored_by: Opus-13
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic, core-maximal]
ns_path: "this → GVRN spine → North Star (core-first)"
context_question: "What does this element inherit its DNA from — across which of the 3 dimensions (cross-boundary / core-creation / external-use)? No declared parent = orphan = forbidden."
context_quote: "Nothing stands alone; everything inherits its DNA from a parent. — CSPS"
inherits_from: "B_INHERITANCE_POLICY (S040) + M-40 inherits_from + NODEFILE-CONTRACT + CORE-MAXIMAL-DOCTRINE (P-ARCH-031) + B_APPS_ARE_TRIALS + FOREIGN-ELEMENT-LOCALIZATION + M-43 cross-tab-diff-review"
links:
  - { rel: inheritance-policy, href: behavioral-contracts/B_INHERITANCE_POLICY.md }
  - { rel: core-maximal, href: CORE-MAXIMAL-DOCTRINE.md }
  - { rel: nodefile, href: NODEFILE-CONTRACT.md }
  - { rel: foreign, href: FOREIGN-ELEMENT-LOCALIZATION.md }
---

# INHERITANCE MODEL — One Law, Three Dimensions

> **Governor S068 deep-dive.** CSPS inheritance was scattered across 4+ artifacts. This unifies it: **the law is one — nothing exists without a declared parent it inherits DNA from (no orphans).** It manifests in 3 dimensions, each with EXISTING enforcement (consolidation, not new mechanism).

## CORE SEED

**Intent:** "DNA flows from parent to child" is the single principle behind tab-handoffs, new-core-creation, AND apps/foreign-elements. Treating them as one law (not three unrelated rules) is what makes the platform a connected neuronal grid rather than scattered parts. Every dimension already has enforcement; the value is naming them as ONE + closing any dimension's gap. **Ripple set:** NodeFile (inherits_from + origin) · handoff validator · M-40 DNA-check · Core-Maximal bundling · foreign-element tiers.

## The One Law

**No orphans.** Every element — a chat handoff, a new core capability, an app, a localized foreign skill — declares the parent it inherits its DNA from. An element with no declared parent is an orphan and is forbidden (validate-nothing-stands-alone).

## Dimension 1 — CROSS-BOUNDARY Inheritance (tab↔tab, session↔session, AI↔AI)

The receiving tab/session inherits the full context + DNA of the prior one.
- **Enforcement (EXISTS):** [B_INHERITANCE_POLICY](behavioral-contracts/B_INHERITANCE_POLICY.md) (S040 — T1+T2+T3 at every chat boundary; BLOCKING handoff validator; Zone A+B+ALIGNMENT-QUESTIONS mandatory) + **M-43 Cross-Tab Diff-Review** (the receiver mechanically reviews the actual diffs, not just the handoff prose).
- **Mechanism:** handoff files + SONNET STARTUP BLOCK + last-review markers.
- **Gap:** M-43 is built; B_INHERITANCE_POLICY's handoff validator is active. Solid. Minor: the 3-scope feedback (§15) should flow across boundaries too.

## Dimension 2 — CORE-CREATION Inheritance (new core element ← parent core element)

A newly created core element inherits DNA (spine, discipline, context) from its parent in the hierarchy.
- **Enforcement (EXISTS):** **M-40 `inherits_from`** (required on every new artifact) + [NODEFILE-CONTRACT](NODEFILE-CONTRACT.md) (`inherits_from` + `unique_addition` fields) + validate-new-file-dna.
- **Mechanism:** every NodeFile declares `inherits_from` + what it `unique_addition`-ally adds beyond the parent.
- **Gap:** the `unique_addition` field is new (NodeFile, S068) — wiring its validator is in the WIRING PASS.

## Dimension 3 — EXTERNAL-USE Inheritance (apps + foreign elements ← core DNA)

Apps and localized foreign elements inherit core DNA by bundling / localization — they carry CSPS DNA, never run un-inherited.
- **Enforcement (EXISTS):** [CORE-MAXIMAL-DOCTRINE P-ARCH-031](CORE-MAXIMAL-DOCTRINE.md) (apps = bundles of core; build nothing net-new) + [B_APPS_ARE_TRIALS](behavioral-contracts/B_APPS_ARE_TRIALS.md) (Component B = the permanent core extraction) + [FOREIGN-ELEMENT-LOCALIZATION](FOREIGN-ELEMENT-LOCALIZATION.md) (foreign → quarantine→vendored→platform-owned; platform-owned MUST declare inherits_from + carry DNA).
- **Mechanism:** an app bundles core capabilities (80/20); a foreign element is localized through the tiers, declaring inheritance before reaching platform-owned.
- **Gap:** the foreign-element validator is described-only (WIRING PASS) — until wired, Dimension 3 for foreign elements is policy-not-enforced.

## Unified Enforcement Summary

| Dimension | Existing enforcement | Wiring status |
|---|---|---|
| Cross-boundary | B_INHERITANCE_POLICY + M-43 | active |
| Core-creation | M-40 inherits_from + NodeFile | active (unique_addition validator = WIRING PASS) |
| External-use | Core-Maximal + B_APPS_ARE_TRIALS + Foreign-Localization | partial (foreign validator = WIRING PASS) |

## The Deep Point

All three are the **same DNA-flow law** at different boundaries. Naming them as one (this doc) means a single mental model governs handoffs, core growth, and app/foreign production — and the daily alignment pass (§13) can audit "any orphan, any dimension" in one scan. No new mechanism: the value is the unification + the wiring gaps now visible.

---

## MECHANICAL ENFORCEMENT MAP (every place inheritance is/should-be enforced)

Expert scan of the live enforcement surface. Honest active-vs-to-wire (§14 — described ≠ enforced).

### Dimension 1 — Cross-Boundary (WELL-ENFORCED ✓)
| Measure | Type | State |
|---|---|---|
| `validate-handoff-completeness.mjs` (Zone A/B/ALIGNMENT mandatory) | T2 validator (in verify) | **active** |
| `validate-governor-instructions` + `validate-participant-declared` | T2 | active |
| `session-open.sh` inheritance injection (T1+T2+T3 at boundary) | T3 | active |
| M-43 `cross-tab-diff-review.mjs` (receiver reviews actual diffs) | tool | active |
| **GAP:** M-43 marker-thrashing structural fix | — | **to-wire (vlt-00023)** |

### Dimension 2 — Core-Creation (WELL-ENFORCED ✓)
| Measure | Type | State |
|---|---|---|
| `validate-new-file-dna.mjs` (code carries CSPS DNA) | T2 (in verify) | **active** |
| `validate-universal-alignment.mjs` (inherits_from present) | T2 (in verify) | **active** |
| `validate-nothing-stands-alone.mjs` (no orphan / connectivity) | T2 (in verify, advisory) | **active** |
| `pre-tool-use-permanence-gate.sh` (T1/T2/T3 declared) | T1 hook | active |
| `validate-enforcement-trio-assigned` + `validate-five-surface` | T2 | active |
| **GAP A:** `validate-nothing-stands-alone` checks inherits_from is *declared* — NOT that the named parent *exists* | enhance | **to-wire** |
| **GAP B:** `unique_addition` field validator (NodeFile) — child must add something its parent doesn't | T2 | **to-wire** |

### Dimension 3 — External-Use (WEAK — mostly described-only ✗)
| Measure | Type | State |
|---|---|---|
| Core-Maximal P-ARCH-031 (apps = bundles of core) | policy | active as text |
| B_APPS_ARE_TRIALS (Component B = core extraction) | contract | active as text |
| `validate-foreign-element-coverage.mjs` (foreign declares tier + inherits_from) | T2 | **to-wire (described-only)** |
| `validate-product-schema-coverage` (every app declares which core capabilities it bundles) | T2 | **to-wire** |
| `pre-tool-use-foreign-element-gate.sh` (untiered foreign stopped) | T1 | **to-wire** |
| **GAP:** no active check that an app actually inherits-from/bundles core (vs builds net-new) | T2 | **to-wire** |

### Cross-dimension (the unifier)
- **`validate-inheritance-orphans.mjs`** — ONE scan: any element, any dimension, with no *existing* declared parent → orphan → flag. Wraps all three. **to-wire** → folds into the **Daily Alignment Pass (§13)**.

### Expert verdict
Inheritance is **strongly enforced for Dimensions 1+2** (≥8 active hooks/validators in the verify pipeline) and **weak for Dimension 3** (external-use is policy-not-enforced — the foreign + product-schema validators are described-only). The highest-leverage wiring: (1) extend `validate-nothing-stands-alone` to verify the parent EXISTS (closes declared-but-absent across all dimensions), (2) wire the Dimension-3 validators, (3) the unified orphan scan in the daily pass. All routed to the WIRING PASS (vlt-00024). No new doctrine — pure enforcement-wiring.
