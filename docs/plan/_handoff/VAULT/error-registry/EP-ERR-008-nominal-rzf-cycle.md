---
id: EP-ERR-008
name: EP-ERR-008-nominal-rzf-cycle
description: "Writing 'Cycle 2: 0 new findings' as a ritual without actually running a second iteration"
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: error_registry
links:
  - { rel: parent, href: ../README.md }
  - { rel: composes-with, href: EP-ERR-006-context-fades-mid-session.md }
---

# EP-ERR-008 — Nominal RZF Cycle

**Pattern:** nominal-rzf-cycle
**First observed:** S037 (multiple turns)
**Recurrence count:** 10+

**Trigger:** Any turn where "Cycle 2: 0 new findings" appears without naming WHAT was re-examined.

**Sample incident:**
```
## RZF VERIFICATION
Cycle 1: [genuine finding F1]
Cycle 2: 0 new findings.
Status: ZF ACHIEVED
```
This is nominal. Cycle 2 did not actually check whether F1's mitigation introduced new gaps or whether the F1 area had adjacent unexplored surfaces.

**Correct behavior:**
```
## RZF VERIFICATION
Cycle 1: Finding F1 — [specific gap]
Cycle 2: Re-examined: (a) Does F1 mitigation introduce orphans? No. 
         (b) Does F1 relate to enforcement trio? Checked — not applicable.
         0 new findings.
Status: ZF ACHIEVED
```

**Mechanical prevention:**
- T3 only (cannot detect in committed files or output regex) — accept drift, document explicitly
- The Governor's question itself is the detection mechanism
- P-META-006 RZF: cycle count is MEASUREMENT not formality

**Root cause:** RZF became a required closing ritual; the form was easier to repeat than the substance.
