---
id: csps.pillar-0-governance.zf-moat
name: zf-moat
description: Formal declaration of CSPS Zero-Findings as a competitive moat. Documents what makes CSPS ZF unique vs industry standard (RZF + CEC + per-session + EP learning + graduated provenance). Per S011 user question "Is ZF mentioned in the moat? Is it unique in the way we enhanced it so far?" — YES and YES.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: VALD
core_spines: [VALD, GVRN, AI]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: explanation
session: S011
impl_status: sealed-zf
impl_sealed_at: S011
file_depth_markers:
  l1_lines: "1-60"
  l2_lines: "61-end"
  read_protocol: "L1 = ZF moat summary table + unique aspects. L2 = per-aspect deep explanation."
links:
  - { rel: principle, href: ../../../packages/principles/principles/P-META-006.yaml }
  - { rel: system-health-plan, href: ./system-health-plan.md }
  - { rel: qc-coverage-map, href: ./qc-coverage-map.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# ZF as a Moat — CSPS

> **The answer:** YES to both questions. ZF IS a unique moat element. The CSPS ZF discipline (RZF + CEC + per-session + EP learning + provenance) is not found on any other platform I know of. Here is the formal declaration.

## §1 — The moat table

| ZF aspect | Industry standard | CSPS unique | Competitive advantage |
|---|---|---|---|
| **When ZF runs** | CI pipeline on merge (once per PR) | Every session close + per DONE claim + pnpm verify on demand | Governance quality checked continuously, not just at merge |
| **What ZF checks** | Tests passing + lint clean | Governance + schema + artifacts + behavior + knowledge + council alignment | Full-spectrum quality, not just code correctness |
| **Evidence quality** | "tests passed" claim | **RZF discipline: THIS-SESSION pnpm verify output is the proof** | Cannot fake ZF; must produce the output in the same response |
| **Learning from failures** | Retry (run tests again) | **EP-NNN: every ZF failure creates a pattern that prevents recurrence** | ZF quality improves session over session; compound learning |
| **Positive extraction** | None | **CEC (Complete Extraction Cycle): after every ratification, ask "where does this apply?"** | Insights propagate across ALL relevant surfaces, not just the immediate context |
| **Provenance** | In CI logs (ephemeral, not in repo) | **In the repository — graduated apps carry CSPS ZF evidence chain** | Any app that graduates from CSPS provably satisfied governance at every development session |
| **Self-improvement** | Static (CI rules don't learn) | **ZF failures → EP-NNN → pre-plan checklist → better plans → fewer failures** | The ZF system improves itself; early sessions have more failures; later sessions have fewer |

## §2 — RZF: the uniquest aspect

**Re-Zero Findings discipline** (P-META-006 §RZF): *"Re-run IS the proof — not memory of earlier call."*

No other platform distinguishes between:
- "Tests passed (I remember from 3 turns ago)"
- "Tests passed (here is the output from THIS response)"

CSPS treats these as fundamentally different. The second is evidence. The first is nominal.

This matters because AI sessions are long. An AI can claim "pnpm verify passed" based on a run from earlier in the session while having introduced errors since then. RZF forces the re-run to be adjacent to the claim.

**Mechanical enforcement:** `validate-rzf-evidence.mjs` checks `verify-last-run.md` for THIS-SESSION evidence before accepting any ZF claim.

## §3 — CEC: the propagation discipline

**Complete Extraction Cycle** (P-META-006 §CEC): *"After any ratification, walk ALL artifacts asking: where does the essence enhance?"*

Industry standard after a new rule/pattern is established: document it and move on.
CSPS CEC after a new rule/pattern is established: walk the platform systematically asking "where does this apply?" until the walk returns 0 new opportunities.

**Example from S011:** After B_KNOW_HOW_DISCIPLINE was engraved:
1. pre-plan-creation.md → add §KH Step 6 ✅
2. plan-creation-protocol.md → add Step 6 ✅
3. closing-summary-template.md → add pre-session-close checklist reference ✅
4. All SKILL.md files → add know_how_consulted to AAP fields (backfill) ✅
5. audit-runner.md → add plan-know-how slug ✅

Without CEC: step 1 only. With CEC: all 5. The platform is coherent because CEC forces coherence.

## §4 — Per-session ZF: not just at merge

The CSPS session model means every AI work session is governed. The session cannot close without:
- pnpm verify exit_code 0 (22 validators)
- §10.0 pre-close verification block citing THIS-SESSION output
- HPFA 9 checks
- §10.0j enhancement-proposals scan

This is ZF-per-session, not ZF-per-PR. The difference: a PR might aggregate 3 sessions of work. Per-PR ZF catches the end-state. Per-session ZF catches every intermediate state.

**Why this matters for 30 apps:** An app that was built over 50 sessions has 50 ZF gates, not 5 PR reviews. The quality assurance is 10× denser.

## §5 — The provenance chain (graduated apps inherit ZF history)

Per P-META-002 (principles-travel-with-artifacts): when an app graduates from CSPS, it takes its principles + behavioral contracts + ZF evidence with it.

The graduated app's history shows:
- Every session that built it had ZF exit_code 0
- Every EP-NNN pattern that applied was addressed
- Every principle cited in the code was validated

No standalone app can claim this provenance because no standalone app has the CSPS governance layer. **The ZF history IS a moat artifact.**

## §6 — Implementation status + ZF integration

The new `impl_status` state machine connects ZF to every implementation:

```
swift-implemented (built but not validated)
    ↓ pnpm verify PASS + no new EP findings
audit-1-complete
    ↓ ZF cycle + RZF evidence + CEC walk complete
sealed-zf          ← THE ZF MOAT STATUS
    ↓ registered in weekly recurring-audit-pending
recurring-audit-pending → sealed-zf (after weekly audit)
```

**The moat element:** `sealed-zf` status means: this implementation has passed full CSPS ZF scrutiny. The evidence chain is in the repository. Any auditor can reproduce the findings.
