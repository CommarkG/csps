---
id: vault.concepts.COMPLETION-TRACKER-DESIGN
name: COMPLETION-TRACKER-DESIGN
description: "Design spec for the playground completion tracker page showing infrastructure and governance completion percentages"
type: vault_concept
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S051
core_spines: [ARCH, OPER]
core_spine: ARCH
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - vault.concepts.MDPE-FORMULA
  - vault.concepts.OPTIMAL-BUILD-ORDER-S050
context_question: "At a glance, what percentage of each infrastructure layer is built vs. designed?"
context_quote: "What gets measured gets managed."
---

# Completion Tracker — Playground Page Design

## Purpose

A live dashboard showing CSPS completion percentages across infrastructure layers.
Visible at `/platform/completion` in the playground.
Updates at build time from git-tracked data sources.

---

## Metrics to Display

### Foundation Infrastructure
| Item | Current % | Source | Path to 100% |
|---|---|---|---|
| Documentation in Schema | 15% | Manual audit | T1 hook + T2 validator + creation gate |
| Threshold (code) | 0% | Plan status | THRESHOLD-CODE plan item |
| Platform Intelligence Engine | 5% | Plan status | advisory validators only |
| Behavioral Hub | 0% | Plan status | BEHAVIOR-HUB plan item |

### Governance Coverage  
| Item | Current % | Source | Path to 100% |
|---|---|---|---|
| Behavioral Contracts | 100% | validate-behavioral-contract-slices.mjs | Done |
| AI Behavioral Enforcement | 15% | vault/ai-conception count × T1 presence | T1/T2 per vault entry |
| Audit Pipeline Coverage | 7% | validate-declared-never-finished | 1/13 pipelines running |
| Developer Journey Validation | 0% | INFRA-FLOW-VALIDATION plan status | End-to-end test |

### Applications
| Item | Current % | Source | Note |
|---|---|---|---|
| APP-001 (Voice Sorting) | Plan: 80% Build: 0% | unified-plan.yaml | Paused, infrastructure pending |
| Habit Tracker | Build: 85% | Done — input specimen | Pre-infrastructure baseline |

---

## Data Sources

- `unified-plan.yaml` — plan item statuses and counts
- `tools/data/gap-vault.yaml` — open gaps from declare-never-finished audit
- `tools/validators/validate-declared-never-finished.mjs` output — pipeline coverage
- `tools/vault/ai-conception/` file count — vault entries
- Manual annotations in each metric's notes field

---

## Visual Design

Progress bars per category (color-coded):
- 0-20%: Red (critical gap)
- 21-50%: Amber (significant gap)
- 51-80%: Yellow (in progress)
- 81-100%: Green (complete or near-complete)

Two numbers per item: DESIGNED% and IMPLEMENTED%.
Many items are 100% designed but 0% implemented — this distinction is important.

---

## Implementation Notes for Sonnet

Create: `apps/csps-playground/src/app/platform/completion/page.tsx`

Read at build time from:
- unified-plan.yaml (count implementing/done/ratified vs total)
- tools/vault/ai-conception/ (file list + check for T1 links)
- tools/data/gap-vault.yaml (open gaps count)

The percentages for "Foundation Infrastructure" items are hardcoded for now
(manual audit values from S051) with a note: "Manual — updated per session."
Future: validate-completion-metrics.mjs reads these automatically.

Add to navigation under Platform.

---

*Completion Tracker Design | Vault concept | S051*
