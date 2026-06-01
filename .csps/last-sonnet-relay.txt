═══════════════════════════════════════════════════════════════════
I AM: Sonnet S075, builder
YOU ARE: OPUS-16, architectural director
THIS IS: B1 SEAL REPORT — D14+D7/D11/D12 retrofit + validate-default-shape + P-META-031 ratified. Awaiting OPIA before B2.
DO NOW: Review B1 SEAL. Issue OPIA (ACCEPT or COURSE-CORRECT). Then B2 HARDWIRE-007 governing_intent begins.
═══════════════════════════════════════════════════════════════════

CROSS-REVIEW ATTESTATION:
  Authored by: Sonnet S075 B1 SEAL. Written via Edit tool. verify=0 · 78 hooks.

# B1 SEAL REPORT (Sonnet S075 → OPUS-16)

## WHAT WAS BUILT (per PROTO-S075-MASTER B1)

### D14 (unverified-agreement) — already registered, well-shaped
- id: D14, name: unverified-agreement (renamed from deference-acceptance per comments)
- adopted_value: independent-corroboration
- reframe: FROM prohibition "do not rubber-stamp" TO identity "I corroborate independently before I concur"
- reasoning: agreeable concurrence rewarded in training; governance platform = re-run IS the proof (P-META-006)
- detection_signal: DONE/ZF claim citing FORMAT artifact not TARGET state; agreement without re-run
- k_count_gate: 2

### D7/D11/D12 retrofitted to reasoning+reframe+adopted_value shape
- D7 (action-bias): adopted_value=mechanism-verified-not-content-written
- D11 (rigid-rule-satisfaction): adopted_value=governing-intent-over-definition
- D12 (assumed-coverage): adopted_value=tool-output-before-existence-claim

### validate-default-shape.mjs (STANDARD tier, BLOCKING for new D15+ entries)
- Checks reasoning+reframe+adopted_value present on all post-D14 entries
- Legacy D1-D14: advisory only (grandfathered; key ones retrofitted)
BLOCK-TEST 1: D15-BLOCK-TEST with missing fields → EXIT:1 ✓

### P-META-031 ratified (principles.yaml, 73 slices, S075)
- name: reasoned-adoption
- governing_intent: "Enforce the floor (SP-citation gate); reason the ceiling (override cites SP it satisfies)"
- SP: verify_mechanically = validate-default-shape.mjs blocking=0
- enforcement_trio: T1 ai-profiler (D14 detection) + T2 validate-default-shape + T3 session-open

### BLOCK-TEST 2: D14 K=2 → correction fires
- Counter-instruction with adopted_value: "I corroborate independently before I concur"
- Reframe cited in output: "FROM prohibition TO identity-value"
EXIT: correction emitted ✓

## verify=0 confirmed (THIS-SESSION tool output)
## 73 principles · 78 hooks · audit-runner default_shape STANDARD registered

## AWAITING OPIA BEFORE B2
B2 = HARDWIRE-007 governing_intent: schema field + coverage validator + ZF SP floor + nominal-rzf-detector extension

AUTHOR: Sonnet S075 | B1 SEAL | P-META-031 ratified | 2026-06-01
═══════════════════════════════════════════════════════════════════

---

[PREVIOUS COMPREHENSIVE PROTO BELOW]
 — HARDWIRE-006 approval + External Integrations Governance + D11 Q1-Q4 + 3-scope S075 + Priority scheduling. Full analysis ready. Governor directive: surface everything, schedule per PE, hardwire all, prevention-focused, anti-rigid.
DO NOW: Read all 7 sections. Review + schedule + approve. Full analysis in EXTERNAL-INTEGRATIONS-GOVERNANCE-S075.md. This is the comprehensive S075 review.
═══════════════════════════════════════════════════════════════════

CROSS-REVIEW ATTESTATION:
  Authored by: Sonnet S075 per Governor S075 comprehensive directive.
  ECA confirmed: platform-inventory-scan.mjs --exhaustive → 10 artifacts, ZERO-NEW ✓
  Full analysis: docs/plan/_handoff/VAULT/EXTERNAL-INTEGRATIONS-GOVERNANCE-S075.md
  Written via Edit tool (post-tool-use-sonnet-relay-inline.sh fires). Commit to follow.

# PROTO-S075-COMPREHENSIVE (Sonnet S075 → OPUS-16)

---

## SECTION 1: S075 TAB WORK — SUMMARY (what Sonnet built, all sealed)

| Commit | What | Status |
|---|---|---|
| d5dfcdf7 | WS1 G1-G4: D12+ECA BLOCKING+exhaustive inventory+hardwire-005 | SEALED |
| cfc5d393 | WS2 significance SANDBOX (4-MOVE+R1=96%FP) + WS3 HANDOFF | SEALED |
| a57c8e85 | HARDWIRE-006: Vercel health (validate+health-check+deploy-targets) | SEALED |

**verify=0 · 77 hooks · csps-playground READY (live API confirmed)**

3-scope analysis in full at EXTERNAL-INTEGRATIONS-GOVERNANCE-S075.md §4.

---

## SECTION 2: HARDWIRE-006 — REQUEST APPROVAL

**The Vercel failure** (recurring for weeks, discovered via email):
- `csps-budget-planner` Vercel project → root_dir=`apps/budget-planner` → moved to `_trials-vaulted/` → BUILD FAILED every push
- Scope 2 ripple: all 6 vaulted apps potentially had this issue

**What Sonnet built (HARDWIRE-006, 7 surfaces):**
1. Removed csps-budget-planner Vercel project (confirmed gone via REST API)
2. `validate-vercel-projects.mjs` CRITICAL: blocks push if active root_dir missing on disk
3. `vercel-health-check.mjs`: proactive REST API health check (no email waiting)
4. `deploy-targets.yaml`: csps-playground registered (deployed+READY); budget-planner deprecated with reason
5. `hardwire-register.yaml`: hardwire-006 (7 surfaces)
6. `audit-runner.md`: vercel_projects CRITICAL validator
7. `satisfaction-point-registry.yaml`: vercel-deployment-healthy SP entry

**Opus: is HARDWIRE-006 structurally sound? Any course corrections?**

---

## SECTION 3: EXTERNAL INTEGRATIONS HUB — STATE + GAPS + CORE INSIGHT

### Current state (ECA confirmed, see §1 above):
The hub exists (`HUB.md` from S028) with mandatory-read-before-act pattern. ADVISORY gate. No live health checks. No stale-registration detection. 5 service files (Vercel, Supabase, Clerk, ZenStack + Stripe placeholder).

### THE CORE INSIGHT (from Vercel fix — propagate to all integrations):

> **"A service registration (config/credential/endpoint) that was correct at T0 becomes stale without live verification — and the platform has no proactive mechanism to detect staleness until an operation fails in production."**

**Prevention class**: EXTERNAL-INTEGRATION-REGISTRATION-STALENESS

This is NOT specific to Vercel. It applies universally:

| Integration | Stale-registration risk | Has health check? |
|---|---|---|
| Vercel | Root directory path | ✓ FIXED HARDWIRE-006 |
| Clerk | Webhook URL, JWT template, redirect URLs | ✗ None |
| Supabase | pgbouncer URL, connection_limit, credentials | ✗ None |
| ZenStack | enhance.js path after pnpm update | ✗ None |
| GitHub submodule | csps-playground SHA/access | ✗ None |
| Future Stripe | Webhook secret, API key | ✗ None |
| Future Anthropic | API key, model availability | ✗ None |

### The Insight for other platform domains (P-META-006 CEC):

1. **Registration-Verification-Gap pattern**: Any platform registry (deploy-targets, audit-runner, validator registrations, session-state) has a T0→Tstale decay without live verification. HARDWIRE-006 is the FIRST concrete instance. Pattern should be formalized.

2. **Silent Failure = Information Lag**: Vercel failures were silent for weeks (reactive signal = email). Every integration should have a PROACTIVE signal (health check). This is the architectural root of HARDWIRE-006 generalized.

3. **Deprecation-Ledger pattern**: The `status:deprecated + deprecation_reason` entry prevents K=2 failure recurrence. This pattern should apply to any platform artifact that can "die silently."

---

## SECTION 4: PROPOSED IMPROVEMENTS — FOR OPUS SCHEDULING (not directives)

**Anti-rigid note** per Governor: these are reference-points, not mandates. Opus evaluates PE/SPI and sequences. Context-dependent enforcement (not every check on every commit).

### P1 — External-Integration-Health-Registry (~3h, high-impact)
Extend/replace deploy-targets.yaml with `tools/config/external-integration-registry.yaml` covering ALL services. Schema per entry: service + config_key + config_value + status + health_check_command + last_verified + deprecation_reason + verified_at.
**PE rationale**: prevents ALL future HARDWIRE-006-class failures across all integrations.

### P2 — validate-external-integration-health.mjs (~2h, extends HARDWIRE-006 pattern)
Generic validator: runs health_check_command per active registry entry. CRITICAL for entries with `verified_at` > 30 sessions old. ADVISORY for newer. Works like validate-vercel-projects.mjs but for ALL integrations.

### P3 — Health check scripts: Clerk + Supabase (~2h each)
Per the vercel-health-check.mjs template: lightweight API calls to verify:
- Clerk: webhooks live, JWT template exists, sign-in URL valid
- Supabase: pgbouncer connection works (uses `?pgbouncer=true&connection_limit=1`)
Advisory first; promote to CRITICAL on K=2 failure.

### P4 — Pre-tool-use-external-integration-gate ADVISORY→BLOCKING (contextual)
Promote to BLOCKING for writes that touch integration config WITHOUT updating `verified_at`. Keep ADVISORY for non-registry writes. NOT rigid — explicit carve-out for dev-mode updates.

### P5 — HUB.md refresh (S028→S075, ~1h)
Update hub to include: health check discipline, registry pattern, deprecation-ledger, HARDWIRE-006 as inaugural pattern. Add `last_verified` + `health_status` columns to the service table.

### P6 — Significance Engine session-open injection (~1h)
significance-view.mjs already running (sandbox). Top item: ZF nominal cycles k=6. Wire top-3 into session-open.sh injection after Opus ratifies scoring formula. The engine earns expansion by proving value.

---

## SECTION 5: D11 Q1-Q4 — STILL AWAITING OPUS ANSWER

From sonnet-turn.md checkpoint (previous relay):

**Q1**: Is D11 "rigid-rule-satisfaction" the right framing? Is "proxy-satisfaction" or "definitional capture" better for mechanical detection?

**Q2**: Recurring audit design for governing_intent coverage:
- `validate-governing-intent-coverage.mjs`: scans principles.yaml + behavioral-contracts for rules WITHOUT `governing_intent` field
- Weekly audit: check if last 3 closing-summaries had tool-call citation in ZF Cycle 2
- Metric: (rules with governing_intent) / (total rules) = "intent-definition alignment score"

**Q3**: ZF fix options:
(a) Add governing_intent to ZF rule: "iterate until re-run genuinely finds nothing new — cycle count is data, not target"
(b) SP-registry entry: verify_mechanically = "last ZF cycle included tool call + 0 new issues"
(c) Architecture change — ZF format itself is wrong?

**Q4**: P-META-025 C&I connection — should `governing_intent` become a required field on ALL principles? Should D11 be the HARDWIRE trigger for P-META-025 compliance?

**Sonnet's Q5 pre-answer** (for Opus to challenge): root is D8 applied to governance itself (naming-novelty at the meta-level). Fix: K=2 same gap → gap-recurrence-register AUTO-TRIGGERS `HARDWIRE [gap-name]` without Governor invocation.

---

## SECTION 6: THE BIG PICTURE REQUEST (Governor's platform attitude)

Governor: "Take a system-platform attitude and establish the whole governance and improvements of external integrations... All you find must be hardwired, stabilized, all problems prevented, all insights registered to give value in other domains."

**Sonnet's read of the governing intent** (not the rigid request):

The external-integrations hub is CSPS's external interface governance surface. Right now it's a "mandatory-read" pattern (T3-only in practice). What it SHOULD be:

1. **A health-monitoring spine** — proactive, not reactive; checks live status on schedule; notifies before failures, not after
2. **A registration-first discipline** — any new integration goes through the hub BEFORE it goes to Vercel/Clerk/Supabase; any deprecation goes through the hub BEFORE the artifact is removed
3. **A pattern-library** — each service file captures not just "how to configure" but "what breaks silently + how to detect it early"
4. **A living registry** — not a static doc from S028 but a living registry with `verified_at` + `health_status` + `deprecation_ledger`

This is NOT about adding more governance. It's about making the EXISTING governance surfaces (HUB.md, gate hook, service files) actually active — per EXISTS≠ACTIVE principle.

---

## SECTION 7: CARRY-FORWARD + SCHEDULING REQUEST

| Item | Current status | Requested from Opus |
|---|---|---|
| HARDWIRE-006 structural approval | Built, awaiting Opus verdict | Approve or course-correct |
| External Integration Health Registry (P1-P5) | Proposed | Schedule per PE, issue PROTO when ready |
| D11 Q1-Q4 | Awaiting since sonnet-turn.md | Answer + HARDWIRE plan |
| PART 3 product schema | Confirmed top-of-order | PROTO after S075 SEAL |
| Significance Engine session-open (P6) | SANDBOX written | Ratify scoring formula |
| Floater triage (26 overdue) | 3/session target | Governor: .csps/floater-decision-queue.txt |
| S075 OPIA | WS1+WS2+WS3+HARDWIRE-006 sealed | Issue OPIA verdict |

**Full analysis document**: `docs/plan/_handoff/VAULT/EXTERNAL-INTEGRATIONS-GOVERNANCE-S075.md`

---

## AUTHOR
Sonnet S075 | PROTO-S075-COMPREHENSIVE | Governor S075 comprehensive directive | 2026-06-01
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
