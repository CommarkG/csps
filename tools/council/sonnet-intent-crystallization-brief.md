# SONNET IMPLEMENTATION BRIEF — Human Intent Crystallization (7 Surfaces)
## Source: P-META-022 — Human Intent Crystallization (constitutional principle)
## Canonical doc: docs/plan/pillar-0-governance/human-intent-crystallization.md
## Written by: OPUS-1 | For: Sonnet Builder | S023 | 2026-05-11

---

> **Why this is different from other implementation briefs.**
> This is a constitutional principle. It must be engraved at 7 surfaces, not 5.
> It changes how EVERY interaction between humans and the platform works.
> Do not treat this as a feature. Treat it as a foundation.

---

## §0 — WHAT YOU ARE IMPLEMENTING

**One principle: P-META-022 Human Intent Crystallization**

The gap between what humans express and what they actually need is the primary failure mode
in human-AI interaction. The platform's job is to close this gap BEFORE any work begins.

**The three layers:**
- Layer 1: What they say (always incomplete)
- Layer 2: What they want (reachable through probing)
- Layer 3: What they need (may be unknown to them — the platform surfaces it)

**The failure mode:** Acting on Layer 1 without probing Layers 2-3.
Each implementation step multiplies the distance from Layer 3.
Drift is geometric, not linear. It cannot be fixed at the implementation layer.

---

## §1 — SURFACE 1: DOCUMENTATION

**Already created by Opus:**
`docs/plan/pillar-0-governance/human-intent-crystallization.md` — read this first.

**You add:**

### 1a: Register P-META-022 in principles.yaml

In `packages/principles/principles.yaml`, add after P-META-021:

```yaml
- id: P-META-022
  name: human-intent-crystallization
  title: "Human Expression ≠ Human Intent — The Platform's Primary Responsibility"
  spine: AI
  layer: L1
  category: meta-governance
  description: >
    The gap between what a human expresses (Layer 1) and what they truly need (Layer 3)
    is the default condition of human-AI interaction, not an exception. The platform must
    help humans traverse Layer 1 → Layer 2 → Layer 3 through structured crystallization
    before any implementation begins. Acting on Layer 1 without verification is arrogance
    that generates compounding, irreversible drift. Goal statement + done criteria must be
    human-authored and confirmed before planning begins.
  canonical_ref: docs/plan/pillar-0-governance/human-intent-crystallization.md
  enforced_by:
    - validate-intent-crystallized.mjs
    - pre-tool-use-plan-coverage-gate.sh
    - plan-creation-protocol.md Step 0
  composes_with:
    - P-META-021  # Triad governance
    - B_CONSENSUS_BEFORE_PROCEEDING
    - B_INTENT_CRYSTALLIZATION
    - B_HUMBLE_EXECUTOR
```

### 1b: Update schema page (Pillar 0 audit questions)

In `apps/task-mgmt/src/app/schema/_data/pillars.ts`, add to Pillar 0 auditQuestions:
```typescript
{
  id: 'p0-a7',
  question: 'Is P-META-022 Human Intent Crystallization engraved at all 7 surfaces?',
  status: 'in-progress',
  answeredBy: 'docs/plan/pillar-0-governance/human-intent-crystallization.md',
  priority: 'critical',
},
{
  id: 'p0-a8',
  question: 'Does every new plan have goal_statement and done_criteria fields?',
  status: 'pending',
  priority: 'critical',
},
```

---

## §2 — SURFACE 2: AI BEHAVIOR (inner-AI-defaults)

In `docs/plan/_handoff/VAULT/inner-ai-defaults/output-distribution.md`,
add a new entry:

```yaml
- id: OD-007
  default_name: "act-on-first-expression"
  description: >
    Training default: given a human request, generate a response that
    addresses what was said. Move toward action quickly. Assume the first
    expression is sufficient to act on.
  disposition: override
  csps_override: >
    For non-trivial requests (any new initiative, plan creation, or
    architectural decision), probe Layer 2-3 before acting on Layer 1.
    Ask the three crystallization questions. Reflect back until match.
    Document goal_statement and done_criteria before any plan or code.
  trigger: new topic | new initiative | plan creation | non-trivial request
  exemptions:
    - production emergency (complete in one sentence)
    - continuation of established goal (goal_statement already confirmed)
    - bug fix in known scope
    - Governor provides all three elements explicitly upfront
  anti_pattern: >
    Acting on the first expression without asking "what do you mean by that, and why?"
    Approving an AI-drafted goal with "yes" and calling it crystallization.
    Treating "I ratify this" as equivalent to "I authored this goal."
  opus_pattern: >
    The Reflect-Until-Match loop. The AI proposes a restatement;
    the human corrects it; the AI updates; repeat until the human says
    "yes, that is exactly it." The human's correction reveals Layer 2-3.
    The AI's job is to be a good mirror, not a good guesser.
  reference: docs/plan/pillar-0-governance/human-intent-crystallization.md
  session_added: S023
```

Update `docs/plan/_handoff/VAULT/inner-ai-defaults/README.md`:
- Increment total_entries count
- Add OD-007 to the output-distribution.md entry count

---

## §3 — SURFACE 3: PROTOCOLS

### 3a: Plan creation protocol — add Step 0

In `docs/plan/pillar-0-governance/plan-creation-protocol.md`, prepend BEFORE Step 1:

```markdown
## Step 0 — Intent Crystallization (mandatory for new initiatives)

**BEFORE any other step. Exemptions in §0.1 below.**

The three questions (in order, one at a time):

**Q1: "What specific problem are we solving? In one sentence."**
→ Human responds in their own words.
→ AI reflects: "I understand the problem as: [restatement]. Correct?"
→ Human corrects until the restatement is accurate.
→ AI moves to Q2 only after explicit confirmation.

**Q2: "What does success look like when this is done?"**
→ Human responds.
→ AI reflects: "So success means: [restatement]. Correct?"
→ Human corrects until confirmed.
→ This becomes the goal_statement.

**Q3: "How will we know it is done — what can we measure or observe?"**
→ Human responds.
→ AI reflects: "[restatement of measurable criteria]. Correct?"
→ Human corrects until confirmed.
→ These become the done_criteria list.

**After all three confirmed, AI writes:**
```yaml
goal_statement: "[human's confirmed words from Q2]"
done_criteria:
  - "[from Q3 — criterion 1]"
  - "[from Q3 — criterion 2]"
```

**AI asks:** "Is this an accurate record of what we agreed?"
Human confirms → crystallization complete → proceed to Step 1.

### §0.1 — Exemptions (when Step 0 completes in < 30 seconds)

| Situation | How to handle |
|---|---|
| Production emergency | Q1=restore service, Q2=system operational, Q3=monitoring green |
| Continuation of established goal | goal_statement already confirmed in active plan → skip |
| Bug fix in known scope | Problem and done criteria already defined → skip |
| Governor provides all three explicitly | Record them, confirm, proceed |
| Governor says "just figure it out" | Document: goal_statement: "[AI-inferred — NOT confirmed]" + flag |
```

### 3b: Session-open protocol update

In `docs/plan/_handoff/VAULT/protocols.md`, in the session-open checklist (§11):

Add BEFORE "Read session-state.json":
```
□ IS THIS A NEW TOPIC / INITIATIVE?
  If yes → Intent Crystallization (Step 0, plan-creation-protocol.md) BEFORE any plan writing
  If no → Confirm goal_statement is in active plan frontmatter
  If continuation → Confirm goal_statement unchanged from previous session
```

---

## §4 — SURFACE 4: WIZARDS

### 4a: Create human-intent-wizard.template.md

Create `tools/templates/human-intent-wizard.template.md`:

```markdown
# Human Intent Wizard — [topic]
## Based on: P-META-022 Human Intent Crystallization
## Date: [date] | Session: S[NNN]

---

## Layer 1: What was expressed

**Human's first statement (verbatim):**
> "[paste exact first expression]"

---

## Layer 2: Probing toward what they want

**Q1: "What specific problem are we solving?"**
Human said: "[verbatim response]"
AI reflection: "[restatement]"
Human correction: "[if any]"
**Confirmed as:** "[final agreed problem statement]"

---

## Layer 3: Surfacing what they need

**Q2: "What does success look like when this is done?"**
Human said: "[verbatim response]"
AI reflection: "[restatement]"
Human correction: "[if any]"
**Confirmed as:** "[final goal_statement — verbatim or human-confirmed]"

**Q3: "How will we know it is done?"**
Human said: "[verbatim response]"
AI reflection: "[restatement]"
Human correction: "[if any]"
**Confirmed done_criteria:**
  - "[criterion 1]"
  - "[criterion 2]"

---

## Crystallization Record

```yaml
goal_statement: "[from confirmed Q2]"
done_criteria:
  - "[criterion 1]"
  - "[criterion 2]"
intent_crystallized_at: "[session S{NNN}, turn {N}]"
crystallized_by: "Governor" | "Developer" | "User (Threshold Wizard)"
```

**Final confirmation (human's words):** "[what human said when confirming the record]"

---

*Intent crystallization complete. Implementation may begin.*
*P-META-022 applied. goal_statement is human-authored.*
```

### 4b: Register wizard template

In `docs/plan/_handoff/VAULT/template-registry.md`, add:
```
| human-intent-wizard.template.md | Crystallization record for any new initiative | stable |
```

---

## §5 — SURFACE 5: PLANNING

### 5a: Add goal_statement + done_criteria to frontmatter-closed-enums.md

In `docs/plan/pillar-0-governance/frontmatter-closed-enums.md`, add:

```markdown
## goal_statement
TYPE: string (required for new plans from S023+)
RULE: Must be human-authored or human-confirmed restatement. NOT AI-drafted and approved.
EMPTY: "" is invalid — omit field or use "EXEMPTED: [reason]"

## done_criteria
TYPE: list of strings (required for new plans from S023+)
RULE: Each item must be measurable or observable
MINIMUM: 1 item
EMPTY: [] is invalid — omit field or use "EXEMPTED: [reason]"

## intent_crystallized_at
TYPE: string (optional, for tracking)
FORMAT: "S{NNN} turn {N}" or "Threshold Wizard" for external users
```

### 5b: Update gradual-build-plan.template.md

In `tools/templates/gradual-build-plan.template.md`, add these required frontmatter fields:

```yaml
goal_statement: ""  # Required: human-authored. See plan-creation-protocol.md Step 0
done_criteria: []   # Required: measurable list. Min 1 item.
intent_crystallized_at: ""  # Optional: session + turn when crystallized
```

And add to the Level 1 opening section:

```markdown
## §0 — INTENT CRYSTALLIZATION RECORD

**Problem statement (Q1 confirmed):**
[From the Reflect-Until-Match protocol — human's words]

**Goal statement (Q2 confirmed):**
[Same as frontmatter goal_statement]

**Done criteria (Q3 confirmed):**
- [criterion 1]
- [criterion 2]

**Crystallization complete:** ✅ Human-authored | ⏳ Pending | ⚠ AI-inferred (unconfirmed)
```

---

## §6 — SURFACE 6: IMPLEMENTATION (B_HUMAN_INTENT_CRYSTALLIZATION contract)

### 6a: Extend behavioral-contracts.md

In `docs/plan/pillar-0-governance/behavioral-contracts.md`, STRENGTHEN the existing
B_INTENT_CRYSTALLIZATION entry. Find the section and replace its canonical wording with:

```markdown
## B_HUMAN_INTENT_CRYSTALLIZATION — constitutional upgrade of B_INTENT_CRYSTALLIZATION (P-META-022, S023)

**Canonical wording:**

> The gap between what a human expresses and what they truly need is the default
> condition of human-AI interaction — not an exception. The AI must never act on
> a human's first expression (Layer 1) without probing for what they want (Layer 2)
> and what they need (Layer 3). This is not a checklist step — it is a governing stance.
> Acting on Layer 1 without crystallization is arrogance: the assumption that the AI's
> interpretation is sufficient. Every new initiative, plan, or architectural decision
> begins with the Reflect-Until-Match protocol. The goal_statement field in any plan
> must be human-authored or human-confirmed — not AI-drafted and approved with "yes."
> Drift that originates at the understanding layer compounds at every implementation step.
> It cannot be fixed downstream. It can only be prevented upstream.

**The three layers:**
- Layer 1: What they say (first expression — always incomplete)
- Layer 2: What they want (stated goal — reachable through probing)
- Layer 3: What they need (deep intent — may be unknown even to them)

**Counterweight:**
> Production emergencies and continuation of established goals have fast-path exemptions.
> The protocol completes in seconds when context is already clear. The discipline is not
> friction — it is precision. A 5-minute crystallization conversation prevents weeks of
> misaligned work.

**Anti-patterns:**
- Acting on the first expression without asking "what do you mean by that, and why?"
- Generating a goal_statement and asking "does this capture it?" — then treating "yes" as crystallization
- Treating "I ratify this" as equivalent to "I authored this goal"
- Moving to plan creation before goal_statement is confirmed by human
- Using "I understood what they meant" as a substitution for explicit confirmation

**Mechanical surfaces (7/7 per P-META-022 constitutional engraving):**
- documentation: docs/plan/pillar-0-governance/human-intent-crystallization.md
- principles: packages/principles/principles.yaml P-META-022
- ai-behavior: inner-ai-defaults/output-distribution.md OD-007 (disposition: override)
- protocols: plan-creation-protocol.md Step 0 + protocols.md session-open
- wizards: tools/templates/human-intent-wizard.template.md
- planning: gradual-build-plan.template.md goal_statement + done_criteria fields
- implementation: this contract + AGENTS.md hard NO
- validation: validate-intent-crystallized.mjs
```

### 6b: Add to AGENTS.md hard NOs

In `AGENTS.md`, under "Governance + workflow", add:

```
❌ Never begin plan creation without confirmed goal_statement + done_criteria
   (human-authored or human-confirmed — not AI-drafted). P-META-022.
❌ Never treat "I ratify this" as Layer 3 crystallization. Ratification ≠ authorship.
❌ Never assume the first human expression is sufficient to act on for non-trivial work.
```

---

## §7 — SURFACE 7: VALIDATION

### 7a: Create validate-intent-crystallized.mjs

Create `tools/validators/validate-intent-crystallized.mjs`:

```javascript
#!/usr/bin/env node
/**
 * validate-intent-crystallized.mjs
 *
 * Checks that topic-plans created from S023 onward have:
 *   1. goal_statement field (non-empty)
 *   2. done_criteria field (list with ≥1 item)
 *
 * Enforcement: ADVISORY for S022 and earlier plans (grandfathered)
 *              BLOCKING for S023+ plans
 *
 * P-META-022: Human Intent Crystallization
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const TOPIC_PLANS_DIR = resolve('docs/plan/_handoff/VAULT/topic-plans');
const ENFORCEMENT_SESSION = 23; // Plans from S023+ are blocking

function extractFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('---', 3);
  if (end < 0) return null;
  return content.slice(3, end);
}

function getSessionNumber(fm) {
  const m = fm.match(/^session:\s*S?(\d+)/m);
  return m ? parseInt(m[1]) : 0;
}

function hasGoalStatement(fm) {
  const m = fm.match(/^goal_statement:\s*"?(.+)"?/m);
  if (!m) return false;
  const val = m[1].trim().replace(/^"|"$/g, '');
  return val.length > 0 && !val.startsWith('EXEMPTED');
}

function hasDoneCriteria(fm) {
  // Check for a non-empty list under done_criteria:
  const idx = fm.indexOf('done_criteria:');
  if (idx < 0) return false;
  const after = fm.slice(idx + 'done_criteria:'.length, idx + 300);
  // Look for at least one list item
  return /\n\s*-\s+\S/.test(after);
}

const plans = readdirSync(TOPIC_PLANS_DIR)
  .filter(f => f.endsWith('.md'))
  .filter(f => !f.startsWith('README'));

let warnings = 0;
let blocking = 0;

for (const filename of plans) {
  const content = readFileSync(join(TOPIC_PLANS_DIR, filename), 'utf8');
  const fm = extractFrontmatter(content);
  if (!fm) continue;

  const sessionNum = getSessionNumber(fm);
  const isNewPlan = sessionNum >= ENFORCEMENT_SESSION;
  const hasGoal = hasGoalStatement(fm);
  const hasDone = hasDoneCriteria(fm);

  if (!hasGoal || !hasDone) {
    const severity = isNewPlan ? '✗ BLOCKING' : '⚠ ADVISORY';
    if (isNewPlan) blocking++;
    else warnings++;
    console.log(`  ${severity} ${filename}:`);
    if (!hasGoal) console.log('    → Missing goal_statement (human-authored goal — P-META-022)');
    if (!hasDone) console.log('    → Missing done_criteria (measurable list — P-META-022)');
  }
}

console.log(`\n[validate-intent-crystallized] plans_scanned=${plans.length} blocking=${blocking} advisory=${warnings}`);
console.log('[validate-intent-crystallized] P-META-022: goal_statement + done_criteria required for S023+ plans');

if (blocking > 0) process.exit(1);
process.exit(0);
```

### 7b: Wire into pnpm verify

In `tools/verify.mjs`, add after the `opus_turn_rzf` cycle:

```javascript
{
  // NEW S023 — P-META-022 Human Intent Crystallization
  // Every S023+ plan must have goal_statement (human-authored) + done_criteria
  // ADVISORY for S022 and earlier (grandfathered). BLOCKING for S023+.
  name: 'intent_crystallized',
  command: 'node tools/validators/validate-intent-crystallized.mjs',
  parse_output: (out) => {
    const m = out.match(/plans_scanned=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/);
    return m ? { plans_scanned: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]) } : {};
  },
},
```

### 7c: Add intent drift check to HUMBLE_EXECUTOR milestone

In `docs/plan/_handoff/VAULT/closing-summary-template.md`, inside the milestone assessment block:

```markdown
**INTENT DRIFT CHECK:**
  Original goal_statement: [from plan frontmatter]
  What was actually produced: [one sentence]
  Match: YES / PARTIAL / NO
  If PARTIAL or NO:
    Delta: [what drifted]
    Approved drift (VLT)? yes / no
    If unapproved: VLT-S{NNN}-INTENT-DRIFT raised
```

### 7d: Add audit slug to audit-runner.md

In `docs/plan/pillar-0-governance/audit-runner.md`, add:

```
| `intent-crystallization-coverage` | PR + per-session | error (S023+) | P-META-022: every topic-plan from S023 must have goal_statement (human-authored) + done_criteria. Blocking for S023+ plans. Advisory for pre-S023 plans (grandfathered). Validator: validate-intent-crystallized.mjs. Constitutional principle — no plan may proceed without crystallized intent. |
```

---

## §8 — AFTER IMPLEMENTING ALL 7 SURFACES

Run:
```bash
pnpm verify        # Must be exit_code=0
pnpm audit-runner:split  # Sync audit slices
```

Run manually to confirm new validator works:
```bash
node tools/validators/validate-intent-crystallized.mjs
```

**Evidence required:**
```
[IC-E1] P-META-022 in principles.yaml — grep confirms entry
[IC-E2] OD-007 in inner-ai-defaults/output-distribution.md — grep confirms entry
[IC-E3] plan-creation-protocol.md has Step 0 (Reflect-Until-Match) — verify section present
[IC-E4] human-intent-wizard.template.md exists at tools/templates/
[IC-E5] gradual-build-plan.template.md has goal_statement + done_criteria fields
[IC-E6] behavioral-contracts.md has updated B_HUMAN_INTENT_CRYSTALLIZATION
[IC-E7] validate-intent-crystallized.mjs: runs, advisory count shown, exit_code=0
[IC-E8] pnpm verify: exit_code=0 [PASTE]
```

---

## §FLEXIBILITY MAP

| When feedback arrives | Edit this | Change |
|---|---|---|
| "Add new exemption to crystallization" | plan-creation-protocol.md §0.1 | Add row to exemptions table |
| "Make goal_statement mandatory immediately" | validate-intent-crystallized.mjs | Change ENFORCEMENT_SESSION to 1 |
| "Add new Q4 to the wizard" | human-intent-wizard.template.md + plan-creation-protocol.md | Add Layer 3 probe question |
| "Different wizard for developer domain" | Copy human-intent-wizard.template.md | Create developer-intent-wizard.template.md with assumptions for faster completion |

---

*Human Intent Crystallization — 7-surface implementation brief*
*P-META-022 | S023 | 2026-05-11*
*Governor: this changes how every interaction with the platform works*
*Sonnet: read surface by surface. Do not skip the principles.yaml entry.*
