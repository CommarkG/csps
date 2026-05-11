# P-META-022 Alignment Plan — Every Existing Element, Every Exact Edit
## Governor challenge: "I do not see a detailed plan making sure all existing elements are updated"
## Written by: OPUS-1 | S023 | 2026-05-11
## Status: Complete — 16 items, exact file paths, exact edits, exact verification

---

> This is not a list of "cross-references to add."
> This is a file-by-file, section-by-section, exact-text plan.
> Sonnet reads this. Sonnet edits. Sonnet verifies. No guessing.

---

## Session Budget

**Sonnet available: ~80K tokens. Chat close required: ~25K tokens.**
**Available for implementation: ~55K tokens.**

**Tier 1 — This session (~30K tokens of implementation):**
Items 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 → then chat close

**Tier 2 — Next session:**
Items 11, 12, 13, 14, 15, 16

---

## TIER 1 — This Session

---

### ITEM 1: principles.yaml — Add P-META-022

**File:** `packages/principles/principles.yaml`
**Find:** The last P-META-* entry (P-META-021 Triad Governance)
**Add after it:**

```yaml
- id: P-META-022
  name: human-intent-crystallization
  title: "Human Expression ≠ Human Intent — The Platform's Primary Responsibility"
  description: >
    The gap between what a human expresses (Layer 1) and what they truly need (Layer 3)
    is the DEFAULT condition of human-AI interaction. Acting on Layer 1 without probing
    Layer 2-3 is arrogance that generates compounding drift. The platform must help humans
    traverse L1→L2→L3 through the Reflect-Until-Match protocol before any planning begins.
    goal_statement must be human-authored. done_criteria must be measurable.
    Drift generated at the understanding layer cannot be fixed at the implementation layer.
  spine: AI
  layer: L1
  category: meta-governance
  enforces:
    - B_HUMAN_INTENT_CRYSTALLIZATION
    - B_INTENT_CRYSTALLIZATION
  canonical_ref: docs/plan/pillar-0-governance/human-intent-crystallization.md
  composes_with:
    - P-META-021
    - B_CONSENSUS_BEFORE_PROCEEDING
    - B_HUMBLE_EXECUTOR
  session: S023
```

**Verify:** `grep -n "P-META-022" packages/principles/principles.yaml` — must show the entry.

---

### ITEM 2: plan-creation-protocol.md — Add Step 0 (Intent Crystallization)

**File:** `docs/plan/pillar-0-governance/plan-creation-protocol.md`
**Find:** Line with `### Step 0 — Completion + Foundation gate`
**Action:** Rename existing Step 0 → Step 0b. Insert new Step 0a BEFORE it:

```markdown
### Step 0a — Intent Crystallization (P-META-022 — mandatory for new initiatives)

**Before any other step. Exempt situations in §0a.1.**

The three questions (ask in order, one at a time):

**Q1: "What specific problem are we solving? One sentence."**
Human responds in their own words.
AI reflects: "I understand the problem as: [restatement]. Correct?"
Human corrects. AI updates. Repeat until human confirms.

**Q2: "What does success look like when this is done?"**
Human responds.
AI reflects: "So success means: [restatement]. Correct?"
Human confirms. → This becomes goal_statement.

**Q3: "How will we know it is done — what is measurable?"**
Human responds.
AI reflects: "[measurable criteria restatement]. Correct?"
Human confirms. → These become done_criteria.

AI records after all three confirmed:
```yaml
goal_statement: "[from confirmed Q2 — human's words]"
done_criteria:
  - "[from confirmed Q3]"
```
AI asks: "Is this an accurate record?" Human confirms → proceed to Step 0b.

**§0a.1 — Exemptions:**
| Situation | Fast path |
|---|---|
| Production emergency | Q1=restore service, Q2=system up, Q3=monitoring green |
| Continuation — goal_statement already confirmed in active plan | Skip |
| Bug fix in defined scope | Skip |
| Governor provides all three explicitly upfront | Record + confirm |
| Governor: "just figure it out" | Document goal_statement as AI-inferred, flag unconfirmed |

### Step 0b — Completion + Foundation gate (formerly Step 0)
```

**Verify:** `grep -n "Step 0a\|Step 0b\|Intent Crystallization" docs/plan/pillar-0-governance/plan-creation-protocol.md` — both must appear.

---

### ITEM 3: closing-summary-template.md — Add ZF-3 Intent Drift Check

**File:** `docs/plan/_handoff/VAULT/closing-summary-template.md`
**Find:** Line with `### §10.0q SAP Abbreviated` (search: `§10.0q`)
**Add a NEW §10.0r section AFTER the entire §10.0q block, before `### §10.1 Stewardship review`:**

```markdown
### §10.0r Intent Drift Check (P-META-022 ZF-3 — added S023)

Before declaring this session DONE, verify intent did not drift from the original goal:

  goal_statement (from plan frontmatter — paste verbatim):
  what was actually produced (one sentence):
  drift: YES / NO / PARTIAL
  if YES or PARTIAL:
    delta: [what drifted]
    approved drift (VLT): yes / no
    if unapproved: VLT-S{NNN}-INTENT-DRIFT-{slug} raised
  if NO: ✅ Intent preserved — goal_statement matched delivery
```

**CAUTION:** "MILESTONE ASSESSMENT" does NOT exist in closing-summary-template.md — do not search for it here. That text lives in behavioral-contracts.md (B_HUMBLE_EXECUTOR). In this file: add §10.0r as a new section after §10.0q.

**Verify:** `grep -n "§10.0r\|Intent Drift Check" docs/plan/_handoff/VAULT/closing-summary-template.md` — must appear.

---

### ITEM 4: B_CONSENSUS_BEFORE_PROCEEDING — Add P-META-022 cross-reference

**File:** `docs/plan/pillar-0-governance/behavioral-contracts.md`
**Find:** The closing section of B_CONSENSUS_BEFORE_PROCEEDING (line ~1535-1541)
The section ends with: `- memory: feedback_consensus_before_proceeding.md (to be authored)`
**Add after the memory line, before the `---` separator:**

```markdown
**Cross-reference: P-META-022 (Human Intent Crystallization):**
"Consensus" as used in this contract means confirmed Layer 2-3 intent — not just
agreement on a Layer 1 expression. Before consensus can be declared, the five stages
in B_CONSENSUS_BEFORE_PROCEEDING must operate on a crystallized goal (goal_statement
authored by the human, not AI-drafted). See: docs/plan/pillar-0-governance/human-intent-crystallization.md
```

**Verify:** `grep -n "P-META-022\|Layer 2-3 intent" docs/plan/pillar-0-governance/behavioral-contracts.md | head -5` — must find the addition.

---

### ITEM 5: B_HUMBLE_EXECUTOR — Add ZF-3 intent drift check to milestone format

**File:** `docs/plan/pillar-0-governance/behavioral-contracts.md`
**Find:** The `MILESTONE ASSESSMENT` code block inside B_HUMBLE_EXECUTOR (search for `ASSUMPTION CHECK:`)
**Add after the `ASSUMPTION CHECK:` block, before `PE RE-ASSESSMENT:`:**

```
INTENT DRIFT CHECK (ZF-3 — P-META-022):
  goal_statement: [from plan frontmatter — paste verbatim]
  what was built:  [one sentence]
  match: YES / PARTIAL / NO
  if PARTIAL or NO: VLT-S{NNN}-INTENT-DRIFT-{slug}
```

**Verify:** `grep -n "INTENT DRIFT CHECK\|ZF-3" docs/plan/pillar-0-governance/behavioral-contracts.md` — must find in B_HUMBLE_EXECUTOR section.

---

### ITEM 6: csps-platform-dna.md — Add Element 15

**File:** `docs/plan/pillar-0-governance/csps-platform-dna.md`
**Find:** The row for Element 14 (Domain Primitives) in the elements table
**Add after it:**

```markdown
| 15 | **Human Intent Crystallization** (Layer 1 → Layer 3 before implementation) | [human-intent-crystallization.md](./human-intent-crystallization.md) | `validate-intent-crystallized.mjs` |
```

**Also find:** The text `**14 elements**` and change to `**15 elements**`

**Also find:** The DNA gate reference to `13 elements` at bottom of the table description and update to `15 elements`.

**Verify:** `grep -n "Element 15\|Human Intent\|15 elements" docs/plan/pillar-0-governance/csps-platform-dna.md` — all three must appear.

---

### ITEM 7: inner-ai-defaults/output-distribution.md — Add OD-007

**File:** `docs/plan/_handoff/VAULT/inner-ai-defaults/output-distribution.md`
**Find:** The last OD-* entry. Add after it:

```yaml
- id: OD-007
  default_name: act-on-first-expression
  description: >
    Training default: given a human request, generate a response addressing what was said.
    Move toward action quickly. Treat first expression as sufficient to act on.
  disposition: override
  csps_override: >
    For non-trivial requests (new initiative, plan creation, architectural decision):
    probe Layer 2-3 before acting on Layer 1. Apply the Reflect-Until-Match protocol.
    Ask the three crystallization questions. Document goal_statement and done_criteria
    before any plan or implementation begins. The human's correction is the crystallization —
    not their approval of an AI-drafted goal.
  trigger: "new topic | new initiative | plan creation | non-trivial request"
  exemptions:
    - production emergency
    - continuation of established goal (goal_statement confirmed in active plan)
    - bug fix in known scope
    - Governor provides all three elements explicitly
  anti_pattern: >
    Generating a goal_statement and asking 'does this capture it?' then treating 'yes'
    as crystallization. This is the satisfaction-point anti-pattern dressed as a protocol.
  opus_pattern: >
    The mirror, not the guesser. AI reflects → human corrects → AI updates →
    repeat until human says 'yes, exactly that.' The correction reveals Layer 2-3.
  reference: docs/plan/pillar-0-governance/human-intent-crystallization.md §3-§4
  session_added: S023
```

**Verify:** `grep -n "OD-007\|act-on-first-expression" docs/plan/_handoff/VAULT/inner-ai-defaults/output-distribution.md` — must appear.

---

### ITEM 8: inner-ai-defaults/README.md — Update entry count

**File:** `docs/plan/_handoff/VAULT/inner-ai-defaults/README.md`
**Find:** The line showing total entry count for output-distribution.md
**Update:** Increment by 1 (OD-007 added)

**Verify:** `grep -n "output-distribution\|OD-" docs/plan/_handoff/VAULT/inner-ai-defaults/README.md` — count should reflect the addition.

---

### ITEM 9: validate-intent-crystallized.mjs — Create validator (ZF-1)

**File to create:** `tools/validators/validate-intent-crystallized.mjs`
**Content:** Full validator from `tools/council/sonnet-intent-crystallization-brief.md §7a`

The validator:
- Scans all `docs/plan/_handoff/VAULT/topic-plans/*.md`
- Plans with `session: S023+` and `execution_mode: deep_quality` → BLOCKING if no goal_statement
- Plans earlier or with `execution_mode: velocity` → ADVISORY
- Goal_statement must be non-empty and not start with "EXEMPTED" to pass

**Verify:**
```bash
node tools/validators/validate-intent-crystallized.mjs
# Must run without crash. Plans from S023+ missing fields show as blocking.
```

---

### ITEM 10: tools/verify.mjs + audit-runner.md — Wire ZF-1 validator

**File 1:** `tools/verify.mjs`
**Find:** The `opus_turn_rzf` cycle entry
**Add after it:**
```javascript
{
  // NEW S023 — P-META-022 ZF-1: pre-planning crystallization gate
  // BLOCKING for S023+ deep_quality plans without goal_statement + done_criteria
  // ADVISORY for earlier plans (grandfathered)
  name: 'intent_crystallized',
  command: 'node tools/validators/validate-intent-crystallized.mjs',
  parse_output: (out) => {
    const m = out.match(/plans_scanned=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/);
    return m ? { plans_scanned: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]) } : {};
  },
},
```

**File 2:** `docs/plan/pillar-0-governance/audit-runner.md`
**Find:** The `opus_turn_rzf` slug row
**Add after it:**
```
| `intent-crystallization-coverage` | PR + per-session | error (S023+ plans) | P-META-022 ZF-1 gate: topic-plans from S023 with execution_mode:deep_quality must have goal_statement (human-authored) + done_criteria (measurable list). BLOCKING for S023+ plans. ADVISORY for pre-S023 plans (grandfathered). Validator: validate-intent-crystallized.mjs. |
```

**Then run:** `pnpm audit-runner:split`

**Verify:** `node tools/verify.mjs` — exit_code=0. New `intent_crystallized` cycle appears in output.

---

### ITEM 11: human-intent-crystallization.md — Extend P-META-022 to AI-to-AI communication

**File:** `docs/plan/pillar-0-governance/human-intent-crystallization.md`
**Find:** End of §5 (WHERE THIS APPLIES IN CSPS) — after the "External User Experience" subsection
**Add new subsection:**

```markdown
### AI-to-AI Domain (Opus → Sonnet → Haiku)

The same Layer 1-3 gap exists in AI-to-AI communication.
When Sonnet receives Opus output (e.g., tools/council/opus-turn.md), the gap is:
- Layer 1: What Opus wrote (literal text)
- Layer 2: What it means for this session (which actions to take)
- Layer 3: Why it matters (the platform intent it serves)

A Sonnet that reads Opus output and immediately executes — without reflecting back
its understanding — commits the same arrogance as acting on a human's first expression.

**The INTENT ABSORBED Protocol:**

At the start of every session where Opus output is present, Sonnet MUST emit:

```
INTENT ABSORBED — Opus Turn [N]:
  Task understanding:  [one sentence per major action Opus specified]
  Why this matters:    [the platform goal this serves — Layer 3]
  Constraints understood: [what NOT to do, deferrals, protected paths]
  First action: [Item 1]
```

This block is the Governor's intervention window. If the reflection is wrong,
the Governor redirects BEFORE Sonnet edits 10 files.

**Mechanical enforcement:**
- session-open.sh: if opus-turn.md was modified since last session → inject
  "Opus output present. Emit INTENT ABSORBED before any file edit."
- B_MUTUAL_UNDERSTANDING_VALIDATION: the INTENT ABSORBED block IS the output_contract
  verification for AI-to-AI boundary type 2 (subagent return confirmation)
```

**Verify:** `grep -n "INTENT ABSORBED\|AI-to-AI Domain" docs/plan/pillar-0-governance/human-intent-crystallization.md` — must appear.

---

## TIER 2 — Next Session (defer all items below)

---

### ITEM 11: B_INTENT_CRYSTALLIZATION — Add P-META-022 upgrade note

**File:** `docs/plan/pillar-0-governance/behavioral-contracts.md`
**Find:** `## B_INTENT_CRYSTALLIZATION` section header (line ~1920)
**Add to the Source/context section:**
```
**P-META-022 constitutional upgrade (S023):**
B_INTENT_CRYSTALLIZATION is the operational CONTRACT. P-META-022 is the governing PRINCIPLE.
The principle establishes WHY this matters (Layer 1-3 gap, compounding drift).
The contract defines HOW it operates (wizard match, threshold_route, intent_crystallized field).
See: docs/plan/pillar-0-governance/human-intent-crystallization.md for the constitutional framing.
```

---

### ITEM 12: B_AUTONOMOUS_BATCH_WITH_PREFLIGHT — Add Q-CRYSTALLIZED

**File:** `docs/plan/pillar-0-governance/behavioral-contracts.md`
**Find:** The pre-flight format block inside B_AUTONOMOUS_BATCH_WITH_PREFLIGHT
The Q-GATE block currently has: Q-GATE, Q-COMPLETE, Q-GLOBAL, Q-INITIATED
**Add Q-CRYSTALLIZED after Q-GATE:**
```
Q-CRYSTALLIZED: Is goal_statement present and human-authored for this work?
  IF NO: run Reflect-Until-Match before this batch (plan-creation-protocol Step 0a)
  IF YES: proceed
```

---

### ITEM 13: gradual-build-plan.template.md — Add intent fields

**File:** `tools/templates/gradual-build-plan.template.md`
**Find:** The frontmatter section
**Add to required frontmatter fields:**
```yaml
goal_statement: ""       # REQUIRED S023+: human-authored. Run plan-creation-protocol Step 0a.
done_criteria: []        # REQUIRED S023+: measurable list. Min 1 item.
intent_crystallized_at: ""  # Optional: "S{NNN} turn {N}"
```

**Also add to Level 1 opening section:**
```markdown
## §0 — INTENT CRYSTALLIZATION RECORD

**Problem (Q1 confirmed):** [human's words]
**Goal (Q2 confirmed):** [same as frontmatter goal_statement]
**Done criteria (Q3 confirmed):**
- [criterion 1]

**Crystallization status:** ✅ Human-authored | ⏳ Pending | ⚠ AI-inferred (flag)
```

---

### ITEM 14: B_ASK_WHEN_FILLING_GAPS — Add P-META-022 cross-reference

**File:** `docs/plan/pillar-0-governance/behavioral-contracts.md`
**Find:** The Mechanical surfaces section of B_ASK_WHEN_FILLING_GAPS
**Add to the Cross-references line (or add a new one):**
```
**Cross-reference: P-META-022** — B_ASK_WHEN_FILLING_GAPS is the operational 4-condition gate
for WHEN to ask. P-META-022 is the governing principle for WHY the gap exists in the first place
(Layer 1-3 gap). The 4-condition gate fires because the human's expression is incomplete;
P-META-022 explains why that incompleteness is the default, not the exception.
```

---

### ITEM 15: ai-behavior-spine.md — Add P-META-022 row

**File:** `docs/plan/pillar-0-governance/ai-behavior-spine.md`
**Find:** The discipline matrix table (the main B_* table)
**Add row after B_INTENT_CRYSTALLIZATION or in the AI-behavior section:**
```
| P-META-022 | Human Intent Crystallization | AI L1 | constitutional principle — Layer 1-3 gap, Reflect-Until-Match | goal_statement in plan frontmatter | validate-intent-crystallized.mjs | S023 |
```
(Match the column format of existing rows)

---

### ITEM 16: frontmatter-closed-enums.md — Add goal_statement + done_criteria

**File:** `docs/plan/pillar-0-governance/frontmatter-closed-enums.md`
**Find:** End of the file or a logical section for plan fields
**Add:**

```markdown
### `goal_statement:` — human-authored goal (P-META-022)
TYPE: string
REQUIRED: Yes, for topic-plans with session: S023+ and execution_mode: deep_quality
RULE: Must be human-authored or human-confirmed restatement. NOT AI-drafted and approved with "yes."
      Governor's exact words preferred. AI restatement confirmed by human is acceptable.
EMPTY: Omit field (triggers advisory) or set to "EXEMPTED: [reason]"
EXAMPLE: goal_statement: "Ship a working booking app that prevents double-bookings without user confusion"

### `done_criteria:` — measurable completion signals (P-META-022 ZF-4)
TYPE: list of strings
REQUIRED: Yes, same conditions as goal_statement
RULE: Each item must be observable or measurable. "Success" is not a criterion.
MINIMUM: 1 item
EXAMPLE:
  done_criteria:
    - "pnpm verify exit_code=0 with validate-booking-isolation passing"
    - "User can select a slot and receive confirmation without seeing another tenant's slots"
    - "Double-booking attempt returns 409 conflict with clear message"

### `intent_crystallized_at:` — when crystallization was completed (optional tracking)
TYPE: string
FORMAT: "S{NNN} turn {N}" | "Threshold Wizard" | "pre-session Governor confirmation"
EXAMPLE: intent_crystallized_at: "S023 turn 3"
```

---

## Verification Summary (run after Tier 1)

```bash
# After completing Items 1-10:
pnpm verify        # Must exit_code=0
pnpm audit-runner:split  # Sync slices

# Spot-check each item:
grep -n "P-META-022" packages/principles/principles.yaml           # Item 1
grep -n "Step 0a\|Intent Crystallization" docs/plan/pillar-0-governance/plan-creation-protocol.md  # Item 2
grep -n "INTENT DRIFT CHECK" docs/plan/_handoff/VAULT/closing-summary-template.md  # Item 3
grep -n "Layer 2-3 intent" docs/plan/pillar-0-governance/behavioral-contracts.md  # Item 4
grep -n "INTENT DRIFT CHECK" docs/plan/pillar-0-governance/behavioral-contracts.md  # Item 5
grep -n "Element 15\|15 elements" docs/plan/pillar-0-governance/csps-platform-dna.md  # Item 6
grep -n "OD-007" docs/plan/_handoff/VAULT/inner-ai-defaults/output-distribution.md  # Item 7
node tools/validators/validate-intent-crystallized.mjs  # Item 9
node tools/verify.mjs | grep intent_crystallized  # Item 10

# Full verify:
node tools/verify.mjs 2>&1 | grep '"exit_code"' | tail -1  # Must be 0
```

---

## What This Plan Guarantees

When Tier 1 is complete:
- Every new plan from S023+ **cannot be created** without goal_statement + done_criteria (ZF-1)
- Every milestone **must check** for intent drift before declaring done (ZF-3)
- Every AI session **overrides** the act-on-first-expression default (OD-007)
- P-META-022 is formally registered in the principles registry
- B_CONSENSUS_BEFORE_PROCEEDING now says WHAT consensus means (crystallized intent)
- B_HUMBLE_EXECUTOR now checks WHETHER the milestone result matched the original goal

When Tier 2 is complete:
- Every batch starts with a crystallization check (B_AUTONOMOUS_BATCH_WITH_PREFLIGHT)
- Every multi-session plan template carries intent fields (gradual-build-plan.template.md)
- The full behavioral spine matrix reflects P-META-022
- B_INTENT_CRYSTALLIZATION is explicitly connected to its constitutional parent

---

*P-META-022 Alignment Plan — Complete | 16 items | Tier 1 (10) + Tier 2 (6)*
*Written as top-expert response to Governor challenge on missing detail*
*OPUS-1 | S023 | 2026-05-11*
