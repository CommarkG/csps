# Chat Jump — S024
## Source: S023 HANDOFF + Opus Turns 5-7 + Governor ratifications 2026-05-11

## Paste this entire block to the new Sonnet chat

---

You are Sonnet S024, the builder for CSPS.

**FIRST action — write this to `tools/council/sonnet-turn.md` BEFORE any file edit:**

```markdown
# Sonnet Session S024 — INTENT ABSORBED

## Opus Turns Read: Turns 5-7 (platform at S023, 72 validators)

## Task understanding
1. validate-sonnet-report.mjs — create, wire to verify. Enforces Sonnet reports back to sonnet-turn.md.
2. validate-intent-absorbed.mjs — create, wire to verify. Enforces INTENT ABSORBED in sonnet-turn.md.
3. council-state.json — add sonnet_last_report_session + opus_last_turn_session fields.
4. P-META-022 alignment items 1-8 + 11 — principles.yaml, plan-creation-protocol Step 0a,
   closing-summary ZF-3, B_CONSENSUS cross-ref, B_HUMBLE_EXECUTOR ZF-3, DNA Element 15,
   OD-007 in inner-AI-defaults, AI-to-AI section in human-intent-crystallization.md.
5. libs/ gate — upgrade pre-tool-use-plan-coverage-gate.sh to BLOCKING for new libs/ files
   (ADVISORY for edits). Present diff + Governor confirms before touching .claude/hooks/

## Why this matters (Layer 3)
The platform must help humans and AIs understand what they actually need before acting.
P-META-022 ensures this at every interaction layer. The protocol validators ensure Opus
and Sonnet stop assuming state and start verifying it. Together: zero-drift platform.

## Constraints understood
- Items 9+10 (validate-intent-crystallized.mjs) were done in S023 — skip them
- Tier 2 alignment items (12-16) defer to S025
- Core Spines reshape deferred — Opus ripple analysis not yet complete
- Threshold Wizard implementation deferred — awaiting Governor sandbox ratification
- .claude/hooks/*.sh = protected path — present diff, wait for explicit Governor yes

## First action
pnpm verify + git log --oneline -3 to confirm baseline state
```

Write that to `tools/council/sonnet-turn.md`. Show it to Governor. Wait for acknowledgment.

---

## Read (in order, before implementing)

1. `docs/plan/_handoff/HANDOFF-S023-to-S024.md` — Zone A (state) + Zone B (mandate)
2. `tools/council/opus-turn.md` — Turns 5, 6, 7 (consensus protocol + P-META-022 + Core Spines)
3. `tools/council/p-meta-022-alignment-plan.md` — items 1-8 + 11 (exact edits + verification)
4. `docs/plan/_handoff/VAULT/topic-plans/opus-advisory-arc-S023.md` — the full multi-session arc

---

## Baseline

```bash
pnpm verify
git log --oneline -3
```
Paste both.

---

## Task A: Protocol Validators (STREAM 1 — do first)

### A1: validate-sonnet-report.mjs (create)

```javascript
#!/usr/bin/env node
// validate-sonnet-report.mjs
// Checks that tools/council/sonnet-turn.md has a "# Sonnet Report" section
// for the current session (from session-state.json current_session).
// ADVISORY now → BLOCKING week-4.

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const SONNET_TURN = resolve('tools/council/sonnet-turn.md');
const SESSION_STATE = resolve('tools/session-state.json');

if (!existsSync(SONNET_TURN)) {
  console.log('[validate-sonnet-report] sonnet-turn.md not found — advisory');
  process.exit(0);
}

const state = JSON.parse(readFileSync(SESSION_STATE, 'utf8'));
const session = state.current_session || 'unknown';
const content = readFileSync(SONNET_TURN, 'utf8');

const hasReport = content.includes(`# Sonnet Report`) ||
                  content.includes(`Sonnet Report — ${session}`);
const hasIntentAbsorbed = content.includes('INTENT ABSORBED');

const warnings = [];
if (!hasReport) warnings.push(`No "Sonnet Report" section found for session ${session}`);
if (!hasIntentAbsorbed) warnings.push('No "INTENT ABSORBED" section found');

if (warnings.length > 0) {
  warnings.forEach(w => console.log(`  ⚠ ${w}`));
  console.log('[validate-sonnet-report] stage=advisory (week-4: blocking)');
  process.exit(0); // advisory — does not fail verify yet
}

console.log('[validate-sonnet-report] sonnet-turn.md has both INTENT ABSORBED + Sonnet Report ✓');
process.exit(0);
```

Wire into `tools/verify.mjs` after the `opus_turn_rzf` cycle:
```javascript
{
  name: 'sonnet_report',
  command: 'node tools/validators/validate-sonnet-report.mjs',
  parse_output: (out) => ({ has_report: !out.includes('No') }),
},
```

Add to `docs/plan/pillar-0-governance/audit-runner.md`:
```
| `sonnet-report-completeness` | per-session | advisory | PROTOCOL.md mandate: every Sonnet session writes INTENT ABSORBED + Sonnet Report to sonnet-turn.md. ADVISORY now → BLOCKING week-4. Validator: validate-sonnet-report.mjs. |
```

### A2: Update council-state.json tracking fields

Add to `tools/council/council-state.json`:
```json
"sonnet_last_report_session": "S023",
"opus_last_turn_session": "S023",
"sonnet_last_intent_absorbed": "S024 opening"
```

---

## Task B: P-META-022 Alignment Items 1-8 + 11

Read `tools/council/p-meta-022-alignment-plan.md`.
Implement items 1, 2, 3, 4, 5, 6, 7, 8, 11 in order.
Each has: exact file path + exact text + grep verification.
After each item: run the grep command shown to confirm.

---

## Task C: libs/ Gate Upgrade (protected path — Governor confirm required)

File: `.claude/hooks/pre-tool-use-plan-coverage-gate.sh`
Action: Change enforcement for WRITE to new files in `libs/**` from ADVISORY to BLOCKING.
Edits to existing files in `libs/**` stay ADVISORY.

**Procedure:**
1. Read current file
2. Show exact diff to Governor in chat
3. WAIT for explicit "yes" before editing
4. After confirmed: edit + verify hook fires correctly

---

## Task D: Session Close (mandatory)

After Tasks A-C:
```bash
pnpm verify
pnpm audit-runner:split
node tools/zf-orchestrator.mjs --level 3
```
Paste all three outputs.

Write SONNET REPORT to `tools/council/sonnet-turn.md` (append after INTENT ABSORBED block):
```markdown
# Sonnet Report — S024 Close

## Done
1. validate-sonnet-report.mjs: DONE | commit: [sha]
2. council-state.json tracking fields: DONE | commit: [sha]
3. P-META-022 alignment items 1-8 + 11: DONE | commit: [sha]
4. libs/ gate upgrade: [DONE if Governor confirmed] | commit: [sha]

## Differs from spec
[any deviations + reason, or "None"]

## Deferred
- Tier 2 alignment items (12-16): deferred to S025
- Core Spines Option B: deferred pending Opus ripple analysis
- Threshold Wizard: deferred pending Governor sandbox ratification

## State at close
Validators: [N] | ZF: [status] | Push: [sha]

## What Opus should know for Turn 8
[any discoveries during implementation]
```

Then write `docs/plan/_handoff/VAULT/closing-summary-S024.md` + `HANDOFF-S024-to-S025.md`.

```bash
git add -A
git commit -m "S024: STREAM 1+2+5 — protocol validators + P-META-022 Tier 1 + libs gate"
git push origin main
```

---

## Do NOT do

- Core Spines reshape: Opus Turn 7 says wait for Governor clarification
- Threshold Wizard implementation: Governor must ratify sandbox v1 first
- Tier 2 alignment items (12-16): S025
- WisdomVault: S035+

---

## The protocol working in real-time

You just wrote INTENT ABSORBED to sonnet-turn.md before editing any file.
That IS the protocol from PROTOCOL.md §MANDATORY COMMUNICATION PROTOCOL.
Opus will read sonnet-turn.md before writing Turn 8.
The stale-state failures from S022-S023 cannot recur with this structure.

---

*S024 chat-jump | Final version — Governor ratifications 2026-05-11*
*Q1 ratified: Option A (council routing now), Option B (domain model arc)*
*Q2 ratified: libs/ gate BLOCKING for new files*
*Q3 ratified: INTENT ABSORBED to sonnet-turn.md*
*Full enterprise arc: docs/plan/_handoff/VAULT/topic-plans/opus-advisory-arc-S023.md*
