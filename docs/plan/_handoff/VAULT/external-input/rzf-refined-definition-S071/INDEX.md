---
id: csps.vault.external-input.rzf-refined-definition.index
name: INDEX-rzf-refined-definition-S071
description: >
  OPUS-14 absorption decisions for the external "RZF — Repeated Zero Finding"
  document (pasted Governor S071 Turn 9). Records which terms/structures were
  ACCEPTED into RZF-LATEST v1.1 and which were REJECTED (duplicate of existing
  CSPS-native vocabulary or acronym-collision risk). Source preserved in
  sibling SOURCE.md. Decision-of-record audit trail.
type: vault
diataxis_type: reference
protection_level: archival
status: vaulted
core_spine: AI
core_spines: [AI, GVRN]
schema_anchor: vault_files
version: "1.0"
session: S071
owner: group:finky
authored_by: OPUS-14
lifecycle: production
lifecycle_state: archived
inherits_from: "SOURCE.md (the external document) + RZF-LATEST.md v1.0 (the doctrine that was amended to v1.1)"
links:
  - { rel: source, href: ./SOURCE.md }
  - { rel: target-doctrine, href: ../../../../pillar-0-governance/RZF-LATEST.md }
---

# INDEX — External RZF Absorption (S071 Turn 9)

**Decision-of-record:** Governor S071 Turn 9 ratified `Option 1: small amendment + vault source`.
**Result:** RZF-LATEST.md v1.0 → v1.1 (3 absorbed extractions). Source preserved here for provenance + audit.

## ACCEPTED — 3 extractions absorbed into RZF-LATEST v1.1

| # | External term | CSPS-native form (after absorption) | Where it lands in RZF-LATEST v1.1 |
|---|---|---|---|
| A1 | PSP — Premature Satisfaction Point | PSP (kept name; genuinely new failure-mode class) | §3 — new sibling to FCC at parent level |
| A2 | FCC — False Completion Claim | FCC (kept name; broader parent class) | §3 — parent class; EP-008 Nominal-RZF becomes a subclass |
| A3 | "Iteration is a virtue until it becomes avoidance of closure" aphorism | Sibling `context_quote:` line | Frontmatter `context_quote:` (sibling, not replacement of CSP S333 quote) |
| A4 (refinement) | Explicit classify-severity step in the cycle | "classify each finding as BLOCKING / ADVISORY / DEFERRABLE-to-vault-pending BEFORE deciding fix-now-vs-vault" | §1 mechanics — Cycle bullet |

## REJECTED — 6 items not absorbed (duplicates CSPS-native or collision)

| # | External term | CSPS-native canonical | Reject reason |
|---|---|---|---|
| R1 | **RZF = Repeated Zero Finding** | RZF = **Real Zero Findings** ([RZF-LATEST.md](../../../../pillar-0-governance/RZF-LATEST.md)) | Acronym collision. Same letters, different expansion. Importing "Repeated" silently overwrites "Real" — the canonical-drift ONE-SOURCE-OF doctrine forbids. |
| R2 | CEC — Complete Extraction Cycle | CEC is **already CSPS-native** ([RZF-LATEST §2](../../../../pillar-0-governance/RZF-LATEST.md)) | CSPS originated CEC; external doc listed it for "translation" but it's ours. |
| R3 | Material Finding / Non-Material Finding | BLOCKING vs ADVISORY validator severity (platform-wide) + CIP RIPPLE-QC | Parallel taxonomy for the same severity distinction. |
| R4 | Declared Review Scope / Named Re-Examination | [RZF-LATEST §1](../../../../pillar-0-governance/RZF-LATEST.md) — *"Cycle 2+ re-examines Cycle-1 areas by NAME"* + `validate-zf-cycle-format.mjs` (file-extension citation enforced) | Exact-same thing already mandated. |
| R5 | Save-and-Schedule | VAULT_DEFER + `vault-pending.yaml` + prevention-class register + WIRING PASS pattern | CSPS has 4 mechanisms already; adding a 5th term = scatter. |
| R6 | `completion_evidence:` YAML block (full schema) | ZF cycle block + `verify_top_exit:<int>` structured field (RZF-LATEST §6.I3) | Adding a parallel YAML structure for the same evidence = duplicate canonical. |

## Why this approach (the meta-decision)
The external document was respectful and asked the right meta-question (*"review what already exists; don't duplicate"*). Applying that test to itself: ~80% of its proposed vocabulary rediscovers what CSPS already has under better-named terms. Wholesale absorption would create the exact parallel machinery the document warns against. The 3 genuinely new extractions (PSP + FCC + the aphorism + the refinement sub-step) ARE valuable — they fill real taxonomic gaps in RZF-LATEST §3 — but as small additive amendments, NOT as a new doctrine file.

## S071 scope impact
**ZERO.** No new milestone. No change to the M1–M9 SEAL sequence. Sonnet's ZF blocks cite the same `verify_top_exit:<int>` field — v1.1 is additive. The amendment lands as a Governor-ratified edit parallel to the build.

— OPUS-14 (S071, Turn 9 absorption · 2026-05-30)
