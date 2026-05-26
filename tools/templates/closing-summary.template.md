---
id: csps.template.closing-summary
name: closing-summary.template
description: "Template for closing-summary-S<NNN>.md. Backward-looking attestation — what happened + proof. Pairs with HANDOFF-S<NNN>-to-S<NNN+1>.md (forward-looking). 7 mandatory sections per Opus-10 seed S064."
type: template
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: handoff_files
session: S064
links:
  - docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md
  - tools/validators/validate-handoff-completeness.mjs
---

# closing-summary-S<NNN>.md — Session Close Attestation

**NOT a handoff** — this is backward-looking only. For what comes next, see HANDOFF-S<NNN>-to-S<NNN+1>.md.

---

## §0 — Session Metadata

```yaml
id: closing-summary-S<NNN>
session: S<NNN>
opened_at: <ISO date>
closed_at: <ISO date>
duration_turns: <N>
sonnet_tabs_used: [C1, C2, ...]
opus_turns_count: <N>
latest_commit: <SHA>
final_exit_code: 0
```

---

## §10.0 — THIS-SESSION Verification Block

```
pnpm verify exit_code: 0
validators_run: <N>
blocking: 0
advisory: <N>
verify evidence: <cite tools/verify-last-run.md>
```

ZF Cycle evidence (file:line citations required):

**ZF Cycle 1:** [content + file citations]

**ZF Cycle 2:** [re-examination of Cycle 1 areas + specific files checked]

Status: ZF ACHIEVED.

---

## §11 — Completion Ledger

### PROTOs sealed this session
| PROTO | Commit | What |
|---|---|---|

### Milestones crossed
| Milestone | Evidence |
|---|---|

### B_* contracts engraved
| Contract | Commit |
|---|---|

### Platform counters changed
- Validators added: <N> (was X → now Y)
- Hooks added: <N>
- Skills added: <N>
- B_* contracts: <N>

### K-gaps closed
| Gap ID | K | Structural fix SHA |
|---|---|---|

### K-gaps still open
| Gap ID | K | Status |
|---|---|---|

---

## §17 — Attestation

```yaml
session_close_attestation:
  session: S<NNN>
  sonnet_role: Sonnet-10 (S<NNN>-C<N>)
  opus_role: Opus-10
  
  zf_deep_run_evidence:
    cycle_1: <cite specific files + what was checked>
    cycle_2: <re-examination files + 0 new findings>
    status: ZF ACHIEVED
  
  governor_acknowledgment: true/false
  
  signature: S<NNN>-close-attest-<ISO>
```

---

## §K — Findings Ledger

Findings filed, promoted, or resolved this session:

| Finding ID | Source | Status Change | Register |
|---|---|---|---|

New entries in:
- improvement-register.yaml: <list>
- gap-recurrence-register.yaml: <list>
- continuous-drift-log.md: <list>
- moat-registry.md: <list>

---

## §M — Moat-Impact Tally

| Moat Element | Change | Evidence |
|---|---|---|

CSEP transitions:
- pending → active: <list>
- active → integrated: <list>

---

## §X — Carry-Forwards Not in HANDOFF Zone B

*(Usually empty — confirm explicitly if so)*

Items that don't fit forward-looking HANDOFF framing:
- [Or write: "§X empty — all carry-forwards captured in HANDOFF Zone B §3"]

---

*Paired with: [HANDOFF-S<NNN>-to-S<NNN+1>.md](../HANDOFF-S<NNN>-to-S<NNN+1>.md)*
*Authored by: Sonnet-10 at session close*
