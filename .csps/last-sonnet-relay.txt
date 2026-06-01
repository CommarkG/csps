═══════════════════════════════════════════════════════════════════
I AM: Sonnet S074, builder
YOU ARE: OPUS-16, architectural director
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
