---
id: csps.protos.PROTO-S062-A
name: PROTO-S062-A
description: "S062-A: Step 0 branched-shape fix (P0) + permanence Q4→Q1→Q5→Q3→Q2 sequenced implementation. Saved plan, Opus-10 issued, Sonnet-10 builds."
type: proto
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: archived
version: "1.0"
session: S062
completed_at: "2026-05-26"
completion_sealing_commits: [9a7bfbd, 0be431b, 004d17b]
core_spine: GVRN
schema_anchor: protos
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/PROTO-AND-TAB-TRANSFER-PROTOCOL.md
  - docs/plan/pillar-0-governance/PERMANENCE-PROTOCOL.md
  - tools/council/sonnet-turn.md
  - tools/validators/validate-permanence-coverage.mjs
  - .claude/hooks/pre-tool-use-permanence-gate.sh
---

# PROTO-S062-A

**STATUS: SEALED 🔒 by Opus-10 — 2026-05-26 (S062)** — All 6 STEPS complete + baseline ratcheted at 38/66 (58%) + 6 buildables queued for S063.

[PROTOCOL: PROTO-S062-A | STEPS: 0-6 SEQUENCED | MODE: exec-session]
YOU ARE: Sonnet-10, the builder.
I AM: Opus-10, the architectural advisor.
GOVERNOR: Yariv Fink — relays this PROTO to Sonnet-10's tab, ratifies completion.

BACKGROUND (read fully before STEP 0):
- Latest commit: f88ead3 | validators=169 | exit_code=1 (broken THIS turn by validator false-positive — see STEP 0 sub-task)
- Permanence baseline (S060): 53% contracts have full T1+T2+T3
- 8 contracts: zero enforcement | 21 contracts: T2+T3 but no T1 | 62 principles: missing governing_intent
- 5 architectural questions answered inline below — see sonnet-turn.md INTENT ABSORBED for full reasoning
- Single source of truth for relay: docs/plan/pillar-0-governance/PROTO-AND-TAB-TRANSFER-PROTOCOL.md v2.1

AI BEHAVIOR DEFAULTS TO WATCH (Sonnet-10):
- "Scope creep" → do ONLY the step in front of you; flag additions to Opus, do not act
- "Evidence substitution" → ZF Cycle 2 must name SPECIFIC file:line re-examined (per Rule 9)
- "Validator false-positive avoidance" → if a validator blocks legitimate content, file a FINDING — do NOT bypass

---

## STEP 0: Unblock verify + restore exit_code=0 (DO FIRST — gates all subsequent steps)

**Problem:** validate-ai-honesty.mjs (the T2 wired this session for B_NO_AI_IMPERSONATION) blocks
sonnet-turn.md because Opus-10's legitimately-authored INTENT ABSORBED contains the phrase
"I am Opus" inside example boxes proposing the Step 0 branched-shape fix. The validator does
substring matching with no model-identity verification — it cannot distinguish:
  - A Sonnet impersonating Opus (the real failure mode it protects against)
  - An Opus self-identifying (the case it is now blocking)
  - An example/template inside a code block (the case in my proposal)

**Fix applied this turn:** Opus rewrote the example boxes in sonnet-turn.md to use `{ROLE}`
placeholder syntax — no literal "I am Opus" remains. exit_code should return to 0.

**Sonnet STEP 0 action (3 sub-tasks, all required):**

0.a Opus's INTENT ABSORBED placeholder fix is already in sonnet-turn.md (validator now passes).
    Sonnet confirms: `node tools/validators/validate-ai-honesty.mjs` reports `blocking=0`.

0.b Opus's PROTO-S062-A.md frontmatter alignment is already patched (schema-anchor `protos`
    registered in schema-registry.md). Sonnet confirms: `node tools/validators/validate-schema-anchors.mjs`
    reports `blocking=0`.

0.c **FINDING-OPUS10-3 (pre-existing debt):**
    `docs/plan/_handoff/VAULT/strategic/tab-transfer-stability-analysis.md` (committed at
    8453591 in a previous session) is missing 3 required frontmatter fields:
      - `version: "1.0"`
      - `lifecycle: production`
      - `lifecycle_state: active`
    This has been blocking `pnpm verify` exit_code=0 since the file was committed.
    Sonnet adds these 3 fields, NOTHING else, then commits:
    `fix: tab-transfer-stability-analysis.md frontmatter (FINDING-OPUS10-3 pre-existing debt)`

**STEP 0 ZF gate:** after 0.a + 0.b + 0.c, `node tools/verify.mjs --skip-install` outer
exit_code must equal 0. ZF Cycle 2 must name three specific file:line re-examined (one per
sub-task). Only then proceed to STEP 1.

---

## STEP 1: FINDING-OPUS10-1 — Step 0 branched-shape startup block (P0 — blocks every new tab)

**Why P0:** Every new tab Governor opens repeats the back-and-forth Yariv stopped this session,
until generate-startup-block.mjs emits a branched Step 0 that handles direct-open tabs.

**Files to modify:**
- `tools/scripts/generate-startup-block.mjs` — emit branched (A)/(B) Step 0 per role
- `docs/plan/pillar-0-governance/PROTO-AND-TAB-TRANSFER-PROTOCOL.md` v2.1 → v2.2 — Step 0
  section explains direct-open vs relay scenarios; failure table adds
  "handshake-without-counterparty" row
- `docs/plan/_handoff/VAULT/inner-ai-defaults/continuous-drift-log.md` — new entry:
  `id: handshake-assumes-relay-when-direct-open`
- Regenerate `.csps/startup-blocks/opus-startup.txt` + `sonnet-startup.txt`

**Core seed (the exact text Sonnet must emit in both startup blocks):**

```
STEP 0 — REQUIRED IMMEDIATE RESPONSE:
Send ONE of these depending on how you got here.

(A) Direct-open (Governor opened this tab fresh, no previous tab):
┌─────────────────────────────────────────────────────────┐
│ {ROLE} here. Session {SESSION}. Direct-open tab.        │
│ Awaiting Governor directive. No handshake needed.       │
└─────────────────────────────────────────────────────────┘

(B) Relay (pasted from a previous tab's handoff message):
┌─────────────────────────────────────────────────────────┐
│ {ROLE} here. Session {SESSION}. Relay tab.              │
│ Please paste this to the previous tab for HANDOFF       │
│ CONFIRMED before I proceed past INTENT ABSORBED.        │
└─────────────────────────────────────────────────────────┘

How to decide:
  Did Governor's first prompt reference commits/session-state directly,
  with no "the previous tab is waiting" language? → (A) Direct-open.
  Did the first prompt arrive WITH prior-tab handoff text inside? → (B) Relay.
  Default if ambiguous → (A). Direct-open is the safer assumption —
  it does not block on a counterparty that may not exist.
```

**DONE WHEN:**
- node tools/verify.mjs exit_code=0
- node tools/scripts/generate-startup-block.mjs --role=opus emits the branched Step 0
- node tools/scripts/generate-startup-block.mjs --role=sonnet emits the branched Step 0
- continuous-drift-log.md has new entry `handshake-assumes-relay-when-direct-open`
- Commit message: `fix: Step 0 branched-shape — direct-open vs relay (FINDING-OPUS10-1)`

---

## STEP 2: Q4 — Migrate enforcement_trio to frontmatter (structural prerequisite for Q1, Q5)

**Decision:** Standardize to YAML frontmatter as machine-readable canonical. Body prose stays
optional descriptive. Do it now — mechanical, ~2h batched.

**Schema (each B_*.md contract gets this in frontmatter):**

```yaml
enforcement_trio:
  t1:
    tier: hook
    path: .claude/hooks/pre-tool-use-X.sh
    status: active   # active | stub | none
  t2:
    tier: validator
    path: tools/validators/validate-X.mjs
    status: active
  t3:
    tier: schema      # schema | memory | feedback
    path: tools/schemas/X.yaml
    status: active
  exempt_reason: null    # required if any status=none
```

**Sonnet steps:**
1. Write `tools/scripts/migrate-enforcement-trio.mjs` — reads each B_*.md, parses existing body
   `### Enforcement` text or prior body mentions, emits frontmatter block. Idempotent.
2. Run dry-run, show diff sample to Opus via sonnet-turn.md before committing 66 files.
3. After Opus ADVANCE, commit. Update `validate-permanence-coverage.mjs` to read frontmatter
   trio FIRST, fall back to body scan only for unmigrated files (transition period).

**DONE WHEN:** 66/66 B_* contracts have enforcement_trio in frontmatter + validator reads it +
exit_code=0.

---

## STEP 3: Q1 — Cross-spine inheritance resolver with depth-limit=3

**Governor's framing (broader than initial sonnet-turn.md Q1):**
inheritance should traverse contract → principle → Platform Genome section (cross-spine),
not just contract → parent_contract. Updated decision:

**Decision:** Traverse the FULL declared chain (cross-spine permitted), depth-limit=3, opt-in
via explicit `inherits_enforcement_from:` field (not implicit walk). Cycle detection via
visited-set. Inheritance ADDS coverage credit but does NOT substitute for explicitly-declared
absence — a contract with `t1: {status: none}` cannot claim T1 via inheritance unless it ALSO
declares `inherits_t1_from: <node-id>` explicitly.

**Why opt-in not implicit:** Implicit upward walk assumes the parent's enforcement applies to
the child's domain. That assumption is false often enough (a parent principle's T1 hook may
fire on different paths than the child contract needs) that silent inheritance creates
coverage illusions. Opt-in forces the contract author to verify the parent's enforcement
actually covers the child's surface.

**Core seed:** function in `validate-permanence-coverage.mjs`:

```js
function resolveInheritedCoverage(nodeId, depth = 0, visited = new Set()) {
  if (depth >= 3 || visited.has(nodeId)) return { t1: null, t2: null, t3: null };
  visited.add(nodeId);
  const node = loadNode(nodeId);   // contract OR principle OR genome section
  const direct = node.enforcement_trio || {};
  const inheritsFrom = node.inherits_enforcement_from;
  if (!inheritsFrom) return direct;
  const parent = resolveInheritedCoverage(inheritsFrom, depth + 1, visited);
  return mergeCoverage(direct, parent);   // direct wins on conflicts
}
```

**Cross-spine acceptance:** loadNode() must accept ids matching:
  `B_*` (behavioral contract) | `P-META-*` `P-ARCH-*` `P-OPER-*` `P-UX-*` (principles) |
  `genome.*` (Platform Genome section anchors).

**DONE WHEN:** validator reads inheritance, depth-3 enforced, sample test traces a contract up
to a principle up to a genome section + reports merged coverage correctly.

---

## STEP 4: Q5 — ONE generic T1 hook for all B_* contracts

**Decision:** A single `pre-tool-use-bstar-trio-gate.sh` (Node-based for cross-platform) that
fires on Edit/Write to ANY `docs/plan/pillar-0-governance/behavioral-contracts/B_*.md` and
validates the file's frontmatter `enforcement_trio` block:
- All 3 trio fields present
- Referenced paths exist on disk (basic stat check)
- No status=none without populated exempt_reason

Per-contract T1 hooks (21 nearly-identical files) is the satisfaction-point trap — single
generic hook = T1 coverage for all 21 simultaneously + automatic coverage for all future B_*.

**Implementation gates:** must run AFTER STEP 2 (Q4 frontmatter migration) — hook reads
frontmatter that doesn't exist until then.

**DONE WHEN:** hook fires on test-edit to a B_*.md, blocks if frontmatter trio incomplete,
permanence_coverage validator picks up the new T1 column for all 21 partial contracts.

---

## STEP 5: Q3 — Gap register for 8 no-enforcement contracts

**Decision:** Track in `tools/data/gap-register-permanence.yaml` with per-contract justification.
NOT bulk-fix (governance theater), NOT grandfather (permanent escape hatch).

**Schema per entry:**

```yaml
- contract_id: B_X
  contract_path: docs/plan/pillar-0-governance/behavioral-contracts/B_X.md
  current_enforcement: none
  reason_no_enforcement: "Explicit per-contract analysis — why mechanical T1/T2/T3 is hard here"
  planned_fix_session: S063 | S064 | S065
  planned_fix_approach: stub | inherit | retire
  pe_score: <computed>
  added_at: 2026-05-25
  added_by: Sonnet-10 via PROTO-S062-A STEP 5
```

**Sonnet steps:** identify the 8 contracts (`validate-permanence-coverage.mjs --list-zero`),
write one entry each with placeholder reason, surface to Opus via sonnet-turn.md for
per-contract review BEFORE committing — Opus must approve each `reason_no_enforcement` and
`planned_fix_approach` value, then Sonnet commits.

**DONE WHEN:** 8 entries in gap-register, each with Opus-approved fields + PE scores assigned.

---

## STEP 6: Q2 — Ratchet + BLOCKING thresholds (last — runs after coverage shifts)

**Decision (Option C, staged):**
- `no_enforcement > 10` → BLOCKING immediately (currently 8 → 2-contract grace)
- Coverage regression `>10pp from baseline` → BLOCKING (baseline frozen at THIS step run)
- Baseline persisted to `tools/data/permanence-baseline.json`, updated ONLY on improvement
  (ratchet — never regresses)

**Why last:** Q1 (STEP 3) adds inheritance credit, Q5 (STEP 4) adds 21 contracts' T1 coverage,
Q3 (STEP 5) re-classifies the 8 zeros. Baseline locked NOW would be stale by the time those
steps land. Run STEP 6 AFTER 1-5 ship, so the baseline reflects the new reality.

**DONE WHEN:** baseline file written, validator BLOCKS on no_enforcement>10 or score<baseline-10pp.

---

## Companion findings — answers to Sonnet's Q-SKILLS-1/2/3

Sonnet's skills-vs-behavioral analysis (top of sonnet-turn.md) raises three questions.
Opus-10 answers inline so Sonnet has direction without waiting for next round-trip:

**Q-SKILLS-1 (`/session-close` skill — own PROTO or fold into FINDING-OPUS10-1?):**
→ **Own PROTO. Will be PROTO-S062-B, scoped after PROTO-S062-A STEP 1 lands.**
Reasoning: PROTO-S062-A is 6 sequenced steps already. Adding a 2-3h skill implementation
inflates the PR + delays the P0 Step 0 branched-shape fix that every new tab needs.
Different layer too — branched Step 0 is T4 (text in startup block), `/session-close`
skill is T3 (structured output, hook-validated). Mixing them dilutes review.
PROTO-S062-A ships first. PROTO-S062-B issued next turn with `/session-close` scope.

**Q-SKILLS-2 (post-stop hook validating Step 0 emission — STEP 7 of this PROTO?):**
→ **No. Belongs in PROTO-S062-B with the `/session-close` skill.**
Reasoning: a post-stop hook that validates "Step 0 was emitted in this session" needs
something deterministic to check (skill output schema). Without the skill it can only
regex over conversation transcript — that's T4 verifying T4 (circular). With the skill
it becomes T2 verifying T3 (real enforcement). So this step gates on `/session-close`
existing — packaged together.

**Q-SKILLS-3 (PROTO-BEHAVIORAL-AUDIT — systematic T5/T6 → T3 pass):**
→ **Defer to S063 mandate. Surface in HANDOFF-S062-to-S063 Zone B.**
Reasoning: this is an audit-class workstream — scan all protocols, classify by stability
tier, propose skills replacements where ROI > implementation cost. That's a topic-plan
(swift-build skill applies), not a single PROTO. Premature to scope without knowing how
PROTO-S062-A + PROTO-S062-B shake out. S063 starts with the audit; depth-3 topic-plan.

---

## Absorbed from Sonnet-10's S061 tab-transfer-stability-analysis (Governor-directed S062)

Two moat entries added to `docs/plan/pillar-0-governance/moat-registry.md` this turn:

**M-37 Core Seeds technique** — registers the Opus-writes-anchor / Sonnet-builds-rest pattern
that this PROTO itself instantiates. Every PROTO file IS a core seed. Planned validator:
`validate-proto-receipt.mjs` confirms Sonnet cited the PROTO file before implementing.

**M-38 Tab Transfer Stability Hierarchy T1-T6** — registers Sonnet's tier framework
(T1=session-open structural / T2=injection structural / T3=skill-with-schema /
T4=branched Step 0 / T5=native AI / T6=memory across turns). Ceiling for tab transfer is T3
because the human paste IS the boundary-crossing mechanism. Design principle absorbed:
**failure-visible > failure-silent**. Planned validator: `validate-protocol-stability-tier.mjs`
(S063) — every protocol declares `stability_tier` field, validator flags T5/T6 patterns where
T3 is achievable.

These two moats are CSEP-pending (will propagate via Synergy Master next cycle).

The 5 problem decomposition (P1-P5) and 4-layer solution architecture from
`tab-transfer-stability-analysis.md` are NOT re-engraved here — that file IS the canonical
artifact (saved to vault). PROTO-S062-A STEP 1 implements Layer 1 (branched Step 0).
PROTO-S062-B (next turn after STEP 1 lands) will implement Layer 2 (`/session-close` skill).
Layer 3 (post-stop hook) folds into PROTO-S062-B. Layer 4 (ceiling acceptance) is now
documented in M-38.

---

## FINDING-OPUS10-4 — **RESOLVED** ✅ (commit e25e380, Opus-10)

`validate-zf-cycle-format.mjs` recognized-extension list is too narrow — accepts
`.md/.mjs/.sh/.ts/.tsx/.yaml/.json` but NOT `.txt`. The `.csps/startup-blocks/*.txt`
artifacts are legitimate files that ZF cycles need to cite when verifying
generate-startup-block.mjs output. Caught in STEP 1 review (Opus-10 Turn 3) when Sonnet's
ZF Cycle 2 referenced both .txt artifacts and was blocked.

**Resolution (e25e380):** Opus fixed the validator parser this session. Extension list
updated — `.txt` (and additional types) now recognized. No further S063 action needed for this finding.

~~**Fix path (S063):** Add `.txt` to the validator's recognized extensions list (1-line change).
Also consider `.env`, `.yml` (vs .yaml), and `.cjs/.mts`. Surface in HANDOFF-S062-to-S063 Zone B.~~

~~**Why not now:** scope discipline — STEP 1 review should not modify validator definitions.
Sonnet amends the ZF block to use existing recognized extensions; structural fix is S063.~~

---

## FINDING-OPUS10-2 (deferred — not in this PROTO)

`validate-ai-honesty.mjs` does substring matching with no model-identity awareness. It blocks
legitimate Opus self-identification in council files. Two structural fixes possible:
(a) Add `author_model:` frontmatter field — Opus-authored sections exempted
(b) Exempt content inside fenced code blocks (where examples/templates live)
Defer to S063 — surface in next session-state mandate. NOT urgent — placeholder workaround
already applied (STEP 0 box uses `{ROLE}` placeholder).

---

## Sequencing summary

```
STEP 0  → STEP 1 (P0 Step-0-fix — unblocks new tabs)
        → STEP 2 (Q4 frontmatter — structural prerequisite)
        → STEP 3 (Q1 inheritance — needs Q4)
        → STEP 4 (Q5 generic T1 hook — needs Q4)
        → STEP 5 (Q3 gap register — independent, but ordering keeps reviews focused)
        → STEP 6 (Q2 ratchet — must be last)
```

Each STEP commit + ZF cycle + sonnet-turn.md report. Opus reviews each commit before next STEP.
ADVANCE / COURSE-CORRECT per step.

---

## Governor relay block (paste this to Sonnet-10's tab)

```
PROTO-S062-A issued. Open docs/plan/protos/PROTO-S062-A.md and execute STEP 0
first. Do not proceed past STEP 0 until exit_code=0 is restored. After each STEP,
write a report block to tools/council/sonnet-turn.md (FROM SONNET | FOR OPUS TAB
| STEP N COMPLETE | commit + ZF cycles + file:line evidence) and AWAIT Opus
ADVANCE before next STEP.
```

---

*Issued by Opus-10 | Session S062 | 2026-05-25 | Latest commit referenced: f88ead3*
*Sonnet-10: receipt confirmation = first write to sonnet-turn.md citing this file path.*
