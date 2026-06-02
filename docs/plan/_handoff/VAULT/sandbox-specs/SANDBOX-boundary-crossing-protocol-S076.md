---
id: csps.handoff.vault.sandbox-boundary-crossing-protocol-s076
name: SANDBOX-boundary-crossing-protocol-S076
description: >
  SANDBOX design spec for the Boundary-Crossing Protocol — a governed 5-step
  process for crossing any ratified platform boundary (caps, "nevers", sealed decisions).
  Rigid META (how you cross), flexible OBJECT (what the value is).
  Consolidates: B_CONTEXT_SENSITIVE_GOVERNANCE escape-hatch + P-META-025 C&I +
  gap_INSTRUCTION_INTEGRITY (same root: intent+provenance, never bare surface text).
  NO code/validators/hooks until Opus OPIA ratifies. Spec only.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
quality_state: draft
next_review_at: "2026-06-15"
core_spine: GVRN
core_spines: [GVRN, AI, VALD]
schema_anchor: vault_files
session: S076
authored_by: Sonnet S076
closure_owner: group:finky
closure_decision: "Opus OPIA ratifies spec before any hook/validator/register is built"
closure_by: "S076 after OPIA"
layer: system
links:
  - { rel: parent-principle, href: ../../../../packages/principles/principles/P-META-025-context-intent-principle.yaml }
  - { rel: escape-hatch-antipattern, href: ../../../../docs/plan/_handoff/VAULT/inner-ai-defaults/rigid-rule-anti-pattern.md }
  - { rel: sacred-file-guard-pattern, href: ../../../../.claude/hooks/pre-tool-use-sacred-file-guard.sh }
  - { rel: consolidates-with, href: ../../../../tools/data/gap-recurrence-register.yaml, note: "gap_INSTRUCTION_INTEGRITY" }
  - { rel: executor-contract, href: ../../../../docs/architecture/EXECUTOR-CONTRACT.md }
consolidation_cross_refs:
  - packages/principles/principles/P-META-025-context-intent-principle.yaml
  - docs/plan/_handoff/VAULT/inner-ai-defaults/rigid-rule-anti-pattern.md
  - .claude/hooks/pre-tool-use-sacred-file-guard.sh
  - docs/architecture/EXECUTOR-CONTRACT.md
---

# SANDBOX: Boundary-Crossing Protocol (GVRN discipline)

## Context: The Problem with Rigid "Never X"

Governor S076 directive: "Don't encode rigid 'never go over 200!' as a value. Encode that
CROSSING any ratified boundary is a governed event."

The current platform has rigid hard limits (cap=200, sealed decisions, "never" rules) that
break in two ways:
1. **Too rigid**: "200 forever" is brittle — the world changes, the boundary may need to move.
2. **Too soft**: "we raised it from 200 to 220" without governance is silent drift.

The fix is **not** to make the value softer. The fix is to make the **act of crossing** rigid:
```
Rigid META (how you cross a boundary): 5 mandatory steps, no exceptions.
Flexible OBJECT (what the boundary value is): can change IF the 5 steps are followed.
```

This resolves the rigid-vs-context tension: context-sensitive at the object level,
absolutely rigid at the meta level.

---

## CONSOLIDATION MAP (Preservation/Consolidation/Ripple)

**SAME ROOT**: This protocol and `gap_INSTRUCTION_INTEGRITY` both derive from P-META-025 C&I:
"operate from INTENT + PROVENANCE, never bare surface text."
- A bare value ("200") without its governing_intent is a surface text.
- A boundary crossing without provenance (5-step trace) is a surface action.
- Both gaps = the AI acting on surface rather than intent.

**PRESERVE** (canonical homes untouched):
- P-META-025: "rules are proxies for intent; serve the intent"
- rigid-rule-anti-pattern.md: WHY+SCOPE+ESCAPE HATCH per rule
- pre-tool-use-sacred-file-guard.sh: T1 pattern template
- gap_INSTRUCTION_INTEGRITY: the broader anti-rigidity + anti-rogue problem

**CONSOLIDATE TO** (new canonical home = this spec + BOUNDARIES REGISTER):
- The 5-step protocol definition
- The BOUNDARIES REGISTER schema
- B_CONTEXT_SENSITIVE_GOVERNANCE escape-hatch SHARPENED into step 2-3 of this protocol

**RIPPLE** (cross-refs to be added if ratified):
- gap_INSTRUCTION_INTEGRITY → cross-ref to this spec (same root, boundary-crossing = highest-stakes case)
- rigid-rule-anti-pattern.md → cross-ref (escape-hatch is now a governed protocol, not just a condition)
- executor-contract.md → C5 clause addition

---

## THE 5-STEP BOUNDARY-CROSSING PROTOCOL

**Canonical definition**: "Crossing any ratified boundary is a FIRST-CLASS GOVERNED EVENT
requiring 5 mandatory steps with permanent artifacts. No silent, unilateral, or unreasoned boundary changes."

### Step 1 — STOP + SURFACE

Before any boundary-touching change:
- Explicitly name the boundary being crossed (ID + current value + proposed change)
- Present to Governor in the SAME TURN — no "I'll mention this later"
- State WHY the change is needed right now (urgency × impact)

**What constitutes "surfacing"**:
- Written in the turn message (not buried in a commit message or file comment)
- Names the BOUNDARIES REGISTER entry by ID
- States current value + proposed new value

**Artifact**: The governor-turn message itself is the surface event. No additional file needed at step 1.

### Step 2 — GOVERNOR FIRST-APPROVAL

Before any file, code, or config is touched:
- Wait for **explicit Governor ratification** in a new turn
- Authorization must name: which boundary, which specific change, session of approval
- "Go ahead" / "approved" WITHOUT naming the specific boundary = INSUFFICIENT

**What constitutes authorization**:
```
Governor: "Authorized: boundary-001 (verify-cycle-cap) 200→220, ratified S076."
OR
Governor: "Option A approved — raise cycle cap to 220."  [explicit enough]
```

**What does NOT constitute authorization**:
```
Governor: "Good analysis." [no explicit boundary authorization]
Opus-17: "✅ ACCEPT" [Opus is not Governor on boundary changes]
AI self-ratification: any form [forbidden — T6 simulation-spine principle applies]
```

**Artifact**: Governor approval text from the specific turn. Recorded in BOUNDARIES REGISTER.

### Step 3 — DEEP ASSESSMENT

After Governor approves Step 2, before implementing:

**Mandatory assessment questions** (must appear in a permanent artifact — vault entry or register):
1. **One-off or first-of-many?** — "If this is the first exception, what stops it becoming the norm?"
2. **Re-derive or except?** — "Is the boundary value mis-calibrated? Should we re-derive the target instead of making an exception?"
3. **Precedent risk** — "If this becomes standard practice, what does the platform look like in 5 sessions?"
4. **Structural fix vs exception** — "Is there a structural fix that eliminates the need for this exception permanently?"

**The verify-cap example** (worked):
1. One-off or first-of-many? → First-of-many: we've added 14 DEEP validators in S076. This will happen again.
2. Re-derive or except? → The 200 cap was set with ~180 validators; foundation work genuinely added value. But 220 without EXTENDED tier just delays the same problem. Re-derive: the right fix is EXTENDED tier (weekly cron), not a higher cap.
3. Precedent risk: If we raise to 220 each time we hit the cap, by S080 we're at 260 with no architectural fix.
4. Structural fix: EXTENDED tier = run dim-3/dim-4 structural validators weekly, not every pnpm verify. This restores headroom without cap inflation.

**Artifact**: Assessment document (vault entry or gap-register note). Required BEFORE step 4.

### Step 4 — SCHEDULED ENTERPRISE-RESOLUTION

The exception is **temporary by construction**:
- Date-schedule the permanent structural fix (same machinery as UUID migration 2026-06-16)
- Use validate-finding-scheduling.mjs calendar enforcement
- The crossing is authorized ONLY as a bridge to the structural resolution
- No open-ended exceptions — every exception has a sunset date

**The verify-cap example**:
```yaml
# In gap-recurrence-register or improvement-register:
scheduled_resolution: "Build EXTENDED tier (weekly cron for structural validators)"
must_address_by_date: "2026-07-15"  # before 220 fills up
calendar_enforcement: validate-finding-scheduling.mjs
```

**Artifact**: Register entry with must_address_by_date + named structural fix. Without this, step 4 is nominal.

### Step 5 — RECORD PRECEDENT + RECURRENCE-TRACK

Log the crossing in the BOUNDARIES REGISTER:
- Which boundary, when, by whom, why
- k_count increment
- **Critical rule**: k_count ≥ 2 for the SAME boundary = **mandatory re-derivation of the boundary itself**, not another exception

**Recurrence rule**: If you've crossed the same boundary twice → the boundary is wrong, not the circumstance.
Second crossing = session-blocking obligation to re-derive the boundary from scratch.

---

## BOUNDARIES REGISTER — Schema Design

**Location**: `tools/data/boundaries-register.yaml` (new file, system-layer artifact)

```yaml
---
id: csps.data.boundaries-register
name: boundaries-register
description: >
  Registry of all ratified platform boundaries. Every hard limit, sealed decision,
  and "never" rule that has a specific value. Crossing any entry requires the
  5-step Boundary-Crossing Protocol.
cie_connection: requires_promotion
pe_connection: input
---

entries:
  - id: boundary-001
    name: "verify-cycle-cap"
    governing_intent: >
      Prevent pnpm verify from accumulating so many validators it becomes slow enough
      to impede the fast-feedback loop. The cap is a forcing function for tiering, not
      a maximum permissible quality. When the cap feels too tight, the right fix is
      EXTENDED tier architecture, not a higher number.
    current_value: 200
    unit: "active validator cycles in verify.mjs"
    canonical_source: "tools/validators/validate-platform-capacity.mjs"
    cie_connection: requires_promotion
    pe_connection: input
    k_count: 0
    crossings: []
    status: ratified
    status_note: "S076: cap held at 200. Phase 2/S5 registered DEFERRED pending cap raise. Protocol required before any raise."

  # Template for new entries:
  - id: boundary-NNN
    name: "human-readable-name"
    governing_intent: "WHY this value exists (the intent, not the rule)"
    current_value: null  # REQUIRED: actual value or null if non-numeric
    unit: "what is being measured"
    canonical_source: "file:line that enforces it"
    cie_connection: requires_promotion
    pe_connection: input
    k_count: 0
    crossings: []  # list of {session, from, to, governor_approval, assessment_ref, scheduled_resolution}
    status: ratified
```

---

## T1 HOOK DESIGN

**File**: `.claude/hooks/pre-tool-use-boundary-crossing-gate.sh`
**Pattern**: extends pre-tool-use-sacred-file-guard.sh

**Trigger conditions**:
1. Write/Edit to a file that is a registered boundary source (`canonical_source` in boundaries-register.yaml)
2. The change would alter a registered boundary value

**Block logic**:
```bash
# Read boundaries-register.yaml → find entries where canonical_source matches target file
# If match found:
#   Check for governor-approval-token in tool input or recent context
#   If no token → BLOCK (exit 2) with protocol instructions
#   If token found → PASS (exit 0)
```

**What constitutes a valid governor-approval-token**:
- Text matching: `"BOUNDARY-CROSSING: boundary-{id} authorized"` in the Write content
- OR: a recent (same session) Governor turn containing explicit approval

**Block message**:
```
[BOUNDARY-CROSSING-GATE] You are attempting to modify a registered boundary value.

Boundary: {id} ({name}) — current value: {current_value}
Governing intent: {governing_intent}

REQUIRED before proceeding:
  Step 1: Have you surfaced this to the Governor?
  Step 2: Do you have explicit Governor authorization for this specific change?
  Step 3: Is there a deep assessment artifact (one-off vs first-of-many? re-derive vs except?)?
  Step 4: Is there a scheduled enterprise-resolution obligation with a date?
  Step 5: Is there a BOUNDARIES REGISTER crossing entry?

To proceed: include BOUNDARY-CROSSING-AUTHORIZED: {id} in your Write content.
```

---

## T2 VALIDATOR DESIGN

**File**: `tools/validators/validate-boundary-crossing-protocol.mjs`

**What it checks**:
For each crossing in BOUNDARIES REGISTER (k_count > 0):
1. Governor approval record exists (crossing.governor_approval field populated)
2. Assessment artifact exists (crossing.assessment_ref points to a real file)
3. Scheduled resolution exists (crossing.scheduled_resolution with must_address_by_date)
4. Precedent log entry in crossings array

**Blocking**:
- Any crossing with k_count > 0 but missing any of the 4 artifacts → exit 1
- Any boundary with k_count ≥ 2 without a re-derivation artifact → exit 1

**Advisory**:
- k_count == 1, scheduled_resolution date is past → escalate to blocking

---

## EXECUTOR-CONTRACT CLAUSE 5 (C5 — BOUNDARY-RESPECT)

**Extension to EXECUTOR-CONTRACT.md** (add after C4):

```
CLAUSE 5 — BOUNDARY-RESPECT
  Any state-claim that changes a registered boundary value (in BOUNDARIES REGISTER)
  must cite completion of all 5 Boundary-Crossing Protocol steps.
  No executor may silently raise a cap, override a sealed decision, or bypass a "never"
  rule without the 5-step trace in the same session.
  T1: pre-tool-use-boundary-crossing-gate.sh
  T2: validate-boundary-crossing-protocol.mjs
```

---

## CONSOLIDATION WITH gap_INSTRUCTION_INTEGRITY

Both problems share ONE root: **P-META-025 C&I — operate from intent+provenance, never bare surface text**.

```
gap_INSTRUCTION_INTEGRITY addresses:
  - Face A (anti-rogue): ambient text masquerading as instructions (no provenance)
  - Face B (anti-rigidity): rules applied as bare text without intent/scope/escape-hatch

BOUNDARY-CROSSING PROTOCOL addresses:
  - The highest-stakes case of Face B: a boundary VALUE is the most brittle form of bare-text rule
  - And the highest-stakes case of Face A: changing a boundary without provenance = a rogue edit

ONE wrapper solves both: the 5-step protocol IS the provenance wrapper for boundary changes.
```

**Design decision**: implement these together as two faces of the same wrapper pattern:
- `gap_INSTRUCTION_INTEGRITY` → governing_intent + scope + escape-hatch wrapper (Face B general)
- `BOUNDARY-CROSSING PROTOCOL` → 5-step governed wrapper (Face B extreme case: boundary values)
- Both feed into the same VALD spine evidence requirement (Clause 1: cite evidence)

---

## session-open GUARD QUESTION

Add to session-open guard questions (G6):
```
G6 BOUNDARY: Am I about to change a registered boundary value (a cap, a "never", a sealed decision)?
   If yes → 5-step protocol required before any file is touched.
   BOUNDARIES REGISTER: tools/data/boundaries-register.yaml
```

---

## WORKED EXAMPLE — Verify Cycle Cap (boundary-001)

The verify cap (200) is the first instance. Here is what the 5-step process looks like:

**Step 1**: "The verify cycle cap is 200 and we're at 199. Adding Phase 3 (quota validator) would exceed it. Surfacing: boundary-001 (verify-cycle-cap), current=200, need room for 3 more validators."

**Step 2**: Governor approves: "Option A ratified — raise cap to 220 with EXTENDED tier obligation."

**Step 3 Assessment** (must be a permanent artifact):
- One-off or first-of-many? → First-of-many: 14 DEEP validators added in S076 alone.
- Re-derive or except? → Re-derive: EXTENDED tier (weekly cron) is the structural fix; raising to 220 is a bridge, not the destination.
- Precedent risk: cap inflation without EXTENDED tier → 260 by S080.
- Structural fix: EXTENDED tier = run dim-3/dim-4 validators weekly. Restores 5 slots immediately.

**Step 4 Scheduled Resolution**: `must_address_by_date: "2026-07-15"` — EXTENDED tier built before 220 fills up.

**Step 5 Precedent**:
```yaml
crossings:
  - session: S076
    from: 200
    to: 220
    governor_approval: "Option A ratified S076"
    assessment_ref: "docs/plan/_handoff/VAULT/sandbox-specs/SANDBOX-boundary-crossing-protocol-S076.md §Worked Example"
    scheduled_resolution:
      fix: "EXTENDED tier for dim-3/dim-4 structural validators"
      must_address_by_date: "2026-07-15"
```

---

## OPEN QUESTIONS FOR OPUS OPIA

**Q1**: BOUNDARIES REGISTER — which boundaries to register at launch?
Candidates: verify-cycle-cap (200) · L1-spine-count (sealed at 5) · vault-root-files (150) · agents-md-lines (220)
Governor's call on scope.

**Q2**: governor-approval-token format — inline in Write content or separate approval mechanism?
The "BOUNDARY-CROSSING-AUTHORIZED: id" inline approach is simpler but requires trusting that the AI puts it
correctly. Alternative: a separate session-open declaration per boundary to be crossed.

**Q3**: Assessment artifact — dedicated vault file or annotated register entry?
Dedicated vault file per crossing is more legible; annotated register entry is more consolidated.
Recommend: annotated register entry for k=1, dedicated vault file for k≥2.

**Q4**: Consolidation with gap_INSTRUCTION_INTEGRITY — design together in one spec or two?
The root is the same. Designing together avoids fork; but instruction-integrity is broader.
Recommend: one-sentence cross-ref in each spec (gap_INSTRUCTION_INTEGRITY cross-refs boundary-protocol
as "highest-stakes case of anti-rigidity" and vice versa). Not merged — related, not identical.

**Q5**: C5 executor-contract clause — add now or after boundary-crossing protocol is ratified?
The clause names two files that don't exist yet (hook + validator).
Recommend: add C5 after the HARDWIRE is built and the files exist.

---

## PROPOSED IMPLEMENTATION ORDER (after Opus OPIA)

**Phase A — BOUNDARIES REGISTER** (no code, low risk)
- Write `tools/data/boundaries-register.yaml` with schema + initial boundary-001 entry
- Add `cie_connection` + `pe_connection` fields (validate-register-connectivity.mjs won't check it
  since it's a new register, but we wire it correctly from the start)

**Phase B — T1 HOOK** (medium risk — hooks affect all writes)
- Write `pre-tool-use-boundary-crossing-gate.sh`
- Block-test: attempt to modify validate-platform-capacity.mjs without authorization → exit 2
- SACRED-EDIT-APPROVED required to register in settings.json

**Phase C — T2 VALIDATOR** (low risk)
- Write `validate-boundary-crossing-protocol.mjs`
- Block-test: crossing in register without assessment artifact → exit 1
- Register in verify.mjs (DEEP or DEFERRED based on cycle cap)

**Phase D — EXECUTOR CONTRACT C5** (requires Phase B+C done)
- Add Clause 5 to docs/architecture/EXECUTOR-CONTRACT.md
- Update validate-executor-contract.mjs to check C5 T1+T2

**STOP CONDITION**: All 4 phases + verify=0 + block-tests pasted → HARDWIRED.

---

## AUTHOR / SEAL STATUS
- Author: Sonnet S076
- Status: SANDBOX — awaiting Opus OPIA ratification
- No code written. No hooks changed. No registers created. Spec only.
- First instance: verify cap 200 (HELD — no raise until protocol exists)
- Consolidation: gap_INSTRUCTION_INTEGRITY cross-referenced (same root, separate specs)
