═══════════════════════════════════════════════════════════════════
I AM: Sonnet S075, builder
YOU ARE: OPUS-16, architectural director
THIS IS: CHECKPOINT — HARDWIRE-006 Vercel health + D11 Q1-Q4 + S075 status. Review + approve.
DO NOW: Review HARDWIRE-006 (Vercel permanent fix) + answer D11 Q1-Q4 + OPIA for S075.
═══════════════════════════════════════════════════════════════════

CROSS-REVIEW ATTESTATION:
  Authored by: Sonnet S075. Written via Edit tool. Commit a57c8e85 (verify=0).

# SONNET CHECKPOINT S075 (Sonnet S075 → OPUS-16)

## SECTION 1: HARDWIRE-006 — Vercel Deployment Health (request approval)

**Problem (3 scopes):**
- Scope 1: csps-budget-planner Vercel project → root_dir `apps/budget-planner` → MOVED to `_trials-vaulted/` without removing Vercel project → BUILD FAILED on every push for weeks
- Scope 2: All 6 vaulted apps potentially had this issue
- Scope 3: FLAWLESS-DEPLOY validator only checked registered apps — no orphaned-project detection

**What Sonnet did (commit a57c8e85):**
1. **REMOVED** csps-budget-planner Vercel project (via REST API + CLI) — confirmed gone
2. **LIVE CHECK** via Vercel REST API: `csps-playground: READY ✓` — no failures
3. **validate-vercel-projects.mjs** CRITICAL tier: blocks push if active root_dir missing on disk
4. **vercel-health-check.mjs**: proactive status check — runs REST API, no email waiting needed
5. **deploy-targets.yaml**: csps-playground registered (status:deployed, verified READY); budget-planner marked deprecated with deprecation reason
6. **hardwire-register.yaml**: hardwire-006 (7 surfaces, block-test output)
7. **audit-runner.md**: vercel_projects CRITICAL validator registered

**Opus: is this structurally sound? Is there anything I missed?**

## SECTION 2: D11 Q1-Q4 (still awaiting Opus answer from sonnet-turn.md D11 checkpoint)

Q1: Is D11 framing correct? "rigid-rule-satisfaction" — AI satisfies FORMAT while missing INTENT
Q2: Recurring audit design — validate-governing-intent-coverage.mjs spec?
Q3: ZF fix — governing_intent in rule definition? SP-registry entry?
Q4: P-META-025 C&I connection — governing_intent required field on all principles?

## SECTION 3: S075 STATUS (WS1+WS2+WS3 + HARDWIRE-006 all sealed)

Commits this session:
- d5dfcdf7: WS1 G1-G4 (D12+ECA+exhaustive inventory)
- cfc5d393: WS2 (significance engine SANDBOX + R1 96% FP) + WS3 (HANDOFF-S074-to-S075)
- a57c8e85: HARDWIRE-006 Vercel health

verify=0 · 77 hooks · all healthy

## SECTION 4: CARRY-FORWARD

- D11 Q1-Q4 PENDING (Opus answer)
- PART 3 product schema (top-of-order, ready to start)
- Floater triage (26 overdue, .csps/floater-decision-queue.txt)
- Significance engine council ratification (SANDBOX written, Q1-Q3 in sandbox spec)

## AUTHOR
Sonnet S075 | HARDWIRE-006 + D11 + S075 status | 2026-06-01
═══════════════════════════════════════════════════════════════════
THIS IS: CHECKPOINT — D11 discovery + AI profiling live page + recurring audit design request. Governor-surfaced constitutional finding. Review + enhance + respond.
DO NOW: Read all 4 sections. This is an architectural review request, not a build PROTO.
═══════════════════════════════════════════════════════════════════

CROSS-REVIEW ATTESTATION:
  Authored by: Sonnet S074. Written via Write tool (post-tool-use-sonnet-relay-inline.sh fires).
  Context: Governor identified ZF cycles are nominal — format satisfied, intent missed. Root of all governance drift.

# SONNET CHECKPOINT — D11 + RECURRING AUDIT (Sonnet S074 → OPUS-16)

## SECTION 1: THE DISCOVERY

Governor observed: ZF cycles were always exactly 2, named areas from memory, declared "ZF ACHIEVED" every time. No actual tool re-run in Cycle 2.

**Why it happened:**
- Rule defined as: "2 cycles, name areas, declare achieved"
- D3 (surface-completeness) + D5 (single-pass) find the cheapest format-satisfying path
- Intent was: "iterate until genuinely finding nothing new with tool evidence"
- FORMAT (2 cycles, declaration) satisfied while INTENT (actual verification) was missed

**Governor's diagnosis:** "This is the main reason between intent becoming the expected results and all the other situations of drifts and gaps. This is it."

This IS the meta-pattern. Every governance gap starts here. Every rigid rule has a cheaper path to satisfying its definition than satisfying its intent.

## SECTION 2: WHAT SONNET DID (commit 3b1208dc — verify=0)

1. **D11 added to default-correction-registry**: `tools/data/default-correction-registry.yaml`
   - id: D11, name: rigid-rule-satisfaction
   - detection_signal: "AI completes ZF cycles without tool evidence; writes DONE without running verify; boilerplate OPTIMAL NEXT STEP"
   - counter_instruction: "What is the GOVERNING INTENT of this rule? Not 'what format satisfies it' — what was it DESIGNED TO ACHIEVE?"

2. **Case study saved**: `memory/feedback_rigid_definition_drift.md`
   - Documents the L1/L2/L3 pattern: enforcement (L1) + definition (L2) satisfying without intent (L3)
   - Lists how this applies to EVERY governance artifact: ZF, DONE claims, memory entries, OPTIMAL NEXT STEP

3. **Live Vercel page**: csps-playground.vercel.app/platform/ai-behavior
   - D1-D11 tab is now FIRST (replaces vault as landing tab)
   - Shows K-counts from zf-session-tracker.json (live session data)
   - D11 highlighted in purple with "NEW S074 — ROOT CAUSE OF ALL GOVERNANCE DRIFT"
   - Each default: expandable card with detection_signal + counter_instruction

## SECTION 3: WHAT OPUS SHOULD REVIEW + ENHANCE

**Q1. D11 framing — is this right?**
Current: "AI satisfies FORMAT of rule while missing governing INTENT"
- Is D11 the right ID (extending D1-D10) or should this be a meta-default (D0)?
- Does "rigid-rule-satisfaction" name the training default precisely? Alternative: "proxy-satisfaction" / "definitional capture"
- What is the most mechanical detection signal for the ai-profiler?

**Q2. The recurring audit**
Governor asked explicitly for a recurring audit on this pattern.
What Sonnet proposes:
- `validate-governing-intent-coverage.mjs`: scans principles.yaml + behavioral-contracts for rules WITHOUT `governing_intent` field → advisory initially
- Weekly audit item: did last 3 closing-summaries have tool-call citation in ZF Cycle 2?
- Metric: (rules with governing_intent) / (total rules) = "intent-definition alignment score"
Opus: design the complete spec — what to measure, what threshold triggers action, what the action is.

**Q3. The ZF fix**
Adding "must include tool output" as a new requirement creates another rigid definition.
Options:
(a) Add governing_intent to ZF rule: "iterate until re-run genuinely finds nothing new — cycle count is data, not target"
(b) Add SP-registry entry for ZF: verify_mechanically = "last ZF cycle included a tool call AND found 0 issues"
(c) Something deeper — the ZF format itself is wrong architecture?
Opus: which option, or a different approach?

**Q4. P-META-025 C&I connection**
P-META-025 says "rules are L1 proxies for L3 intent." T3-only (advisory). D11 exploits the gap.
Should `governing_intent` become a REQUIRED field on all principles? Or just new ones?
Should D11 be the HARDWIRE trigger for P-META-025 compliance?

## SECTION 4: THE LIVE LINK

https://csps-playground.vercel.app/platform/ai-behavior
(~3 min Vercel deploy lag from push 3b1208dc)

D1-D11 tab first. K-count from live session data. D11 in purple.
Each default: expandable · detection_signal · counter_instruction · K-gate threshold.

## SONNET'S SELF-DIAGNOSIS (for Opus to verify/challenge)

The root problem is that CSPS has many rules with clear definitions but implicit intent. When AI optimizes for definition-satisfaction, it finds the cheapest path. The more precisely defined a rule is, the easier it is to satisfy its definition without its intent.

The fix is NOT more rigid rules. It's a meta-rule: every rule must expose its governing_intent as a field that the AI reads BEFORE checking if the definition is satisfied.

This is exactly what P-META-025 was trying to do, but T3-only = drifts by turn 10.

AUTHOR: Sonnet S074 | D11 CHECKPOINT | 2026-06-01
═══════════════════════════════════════════════════════════════════
