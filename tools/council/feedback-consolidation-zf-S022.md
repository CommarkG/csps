# OPUS CORE COUNCIL FEEDBACK — Consolidation + ZF Hardening
## Plan reviewed: docs/plan/_handoff/VAULT/topic-plans/csps-consolidation-and-zf-hardening.md
## Council type: CORE (depth-5, governance machinery, affects every session)
## Written by: OPUS-1 | S022 | 2026-05-11

---

> Feedback File 2 of 3.

---

## DIRECT ANSWERS — All 6 Questions

**Q1: KNOWN_DEFERRED_ADVISORIES — code vs YAML**

**YAML config.** Specifically: `tools/config/known-deferred-advisories.yaml`.

Reason: zf-orchestrator.mjs will grow complex. Separating deferral data from orchestrator
logic keeps the code clean. The Governor can edit a YAML without touching orchestrator code.

**Mandatory field that Sonnet must add:** `review_by_session: S[NNN]` on every entry.
Without it, deferrals accumulate forever. When `review_by_session` passes, the orchestrator
surfaces it as `OVERDUE_REVIEW` (advisory). This is the self-cleaning mechanism.

```yaml
# tools/config/known-deferred-advisories.yaml
known_deferred:
  - id: open-plan-levels
    reason: "97 open items = real outstanding work in Sessions 0-D + App#2"
    review_by_session: S025
    owner: governor
```

Orchestrator reads this at startup, matches advisory names, classifies as DEFERRED.

---

**Q2: Consolidation enforcement — BLOCKING for new or ADVISORY for all?**

**BLOCKING for NEW plans from S023 onward. ADVISORY for existing plans (2-session grace).**

Reasoning: the consolidation gate is most valuable when it catches NEW work before it
duplicates existing work. Existing plans are already in progress. Retroactive BLOCKING
creates friction without catching new duplication.

Implementation detail: `validate-consolidation-check.mjs` should detect plan `session: S022`
or earlier → ADVISORY. Plans with `session: S023` or later → BLOCKING if §0 section missing.

**One correction to Sonnet's spec:** Don't search for the phrase "CHECK WHAT EXISTS" in
first 200 lines — too brittle (appears in comments, examples). Instead: detect the
specific section header `## §0 — CONSOLIDATION CHECK` anywhere in the file.

---

**Q3: Plan-before-implementation gate — differentiated or flat?**

**BLOCKING for `libs/**` (high blast radius) + ADVISORY for `apps/**` (developer agility).**

The asymmetry is correct and mirrors blast radius. A libs/ change affects all 30 apps.
An apps/ change is scoped to one app.

**Critical implementation note:** The hook must be O(1) or O(cached), not O(N plans) per
Write invocation. At 30 apps with active development: 300+ writes per session × slow
plan-scan = significant overhead. Cache the plan list in memory (session-scoped), refresh
only when a plan file changes.

**False positive risk:** Many existing plans have vague scopes. The hook will fire on
legitimate implementation that IS covered by an existing plan but the plan's scope field
doesn't match. Before promoting to BLOCKING: audit all active plan scopes for specificity.
Add as Session A prerequisite: "review plan scope fields, tighten if vague."

---

**Q4: TYPE-9 orphan detection — automated or human-review?**

**Permanently human-review. Add to weekly audit protocol.**

Semantic overlap between validators is NOT automatable without AI-level understanding of
what each validator checks. Structural overlap (same regex patterns) is partially automatable
but produces too many false positives (two validators scanning the same files for DIFFERENT
things is normal and correct).

Add to the weekly tag-and-status deep audit: a specific TYPE-9 section where the reviewer
manually scans the validator list for obvious duplication. One question: "does any new
validator cover the same concern as an existing one?" Human judgment resolves it.

---

**Q5: ZF tiers — two or three?**

**Keep two tiers. Do NOT add "ZF ACHIEVED WITH KNOWN DEBT" as a third.**

The third tier becomes a universal escape hatch. Every advisory gets classified as "known debt"
without genuine disposition. The current two-tier system is already correct:
- "ZF ACHIEVED" already means "0 blocking + each advisory DONE OR DEFERRED with documented reason"
- DEFERRED + documented reason IS the "known debt" acknowledgment — it's just named properly
- Adding a third tier blurs the line between "deliberately deferred with tracking" and "lazy accumulation"

The KNOWN_DEFERRED YAML registry is the right mechanism. The key word: EXPLICIT. Each
advisory must be explicitly named, not bulk-deferred as "known debt."

---

**Q6: Scattered patterns — Core Primitives (CCG) or libs/integrations/?**

**libs/integrations/ as shared conventions. NOT Core Primitives (CCG).**

Running the revised CCG formula (Stability 30%) on these:
```
Error format:    Prevalence=9, Cost=3 (trivial), Stability=8 → 9×0.35 + 3×0.35 + 8×0.30 = 6.6
Webhook idem.:   Prevalence=9, Cost=5 (moderate), Stability=7 → 3.15 + 1.75 + 2.10 = 7.0 BORDERLINE
Role checks:     Prevalence=8, Cost=4, Stability=7 → 2.80 + 1.40 + 2.10 = 6.3
API format:      Prevalence=7, Cost=2, Stability=6 → 2.45 + 0.70 + 1.80 = 4.95
```

Error format, role checks, API format: all score < 7.0 → DEVELOPER LAYER. `libs/integrations/`.
Webhook idempotency: borderline at 7.0. Given it's a 10-line pattern (not complex logic): DEVELOPER LAYER.

**One correction to proposed error format:** Remove `renewal_url` from the L1 shape.
Subscription-specific fields don't belong in a generic error format. Keep L1 pure:
```typescript
// libs/integrations/errors.ts
export interface CspsError {
  error: string         // machine-readable code
  message: string       // human-readable (developer-facing)
  details?: Record<string, unknown>  // app-specific extensions
}
```
Apps add their own `renewalUrl` if needed. L1 stays domain-agnostic.

---

## MULTI-PERSONA COUNCIL FINDINGS

### Security Reviewer — ADVISORY

**RZF gate promotion risk:** When `pre-tool-use-rzf-evidence-gate.sh` promotes to BLOCKING,
it must have a precise definition of "RZF evidence" — what exact pattern does it look for?
A STUB that becomes BLOCKING without a clear spec will block legitimate work or be bypassed.

Spec requirement before promotion: the hook must look for THIS pattern in the last response:
```
## RZF VERIFICATION
...
Status: ZF ACHIEVED
```
If that pattern exists → allow. If not → BLOCKING. Simple. Precise. Not ambiguous.

### SaaS Architect — ADVISORY

The `renewal_url` in error format brings subscription logic into generic errors. Remove it.
Standard: `{ error: string, message: string, details?: Record<string, unknown> }`.

API response format wrapper: DO NOT mandate at L1. REST responses are app-specific by design.
A "standard wrapper" at L1 will be too constraining for the diversity of 30 apps. Document
a RECOMMENDED pattern in CSPS_DEVELOPER_GUIDE.md; don't enforce it via validator.

### Platform Developer — ADVISORY

Batch-adding §0 to all 13 existing active plans: **use a script, not manual edits.**
Manual edits to 13 files = 13 chances for inconsistency. Script: scan all active plans,
check for §0 section, prepend if missing, run verify. This is a 30-line script, not 13 edits.

### Reliability Engineer — ADVISORY

TYPE-6 (dead links) is more complex than it appears. To validate markdown links properly:
- Resolve relative paths from document location (not from CWD)
- Handle anchor links (#section-name)
- Handle GitHub URLs (require network check or skip)

Phase C budget for this validator should be 2x what's estimated. Consider: use an existing
npm package (`remark-validate-links` or `linkinator`) rather than building from scratch.
B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK applies here.

### Balance Expert — ADVISORY (CRITICAL)

**Complexity score impact:**

```
Current: 18.2 (GREEN)
This plan adds:
  +3 validators (validate-consolidation-check, validate-plan-zf-requirement, validate-dead-links)
  +2 hook promotions (plan-coverage-gate, rzf-evidence-gate) → no new hooks, just activated
  +1 new contract (B_NO_IMPLEMENTATION_WITHOUT_PLAN)
  +YAML config file (known-deferred-advisories.yaml)
  +batch plan amendments (~13 plans)

Estimated new score: 18.2 + 4.5 = ~22.7 (GREEN but approaching YELLOW at 25)
```

Combined with Core Primitives plan (~21.7): if BOTH plans execute in Sessions 0-A,
complexity score approaches 25 (YELLOW boundary).

**Recommendation:** Session 0 only implements the CRITICAL subset:
- STUB→ADVISORY promotions (no new validators yet)
- Orphan cleanup (deletions reduce, not increase, complexity)
- KNOWN_DEFERRED YAML (configuration, not code)

New validators (Session A) after measuring Session 0's complexity impact.

---

## OPUS FINAL AUDIT

### 5 Mental Models Applied

**1. Cross-File Lens:** Plan references governance-cycle.md ✓ and over-system-audit-S022.md ✓.
Both confirmed to exist. Connection to behavioral-contracts.md (new B_NO_IMPLEMENTATION_WITHOUT_PLAN
contract) is valid — the contract requires a corresponding entry in the contracts file.

Missing connection: the KNOWN_DEFERRED YAML must be registered in verify.mjs as a config
file that is READ by zf-orchestrator.mjs. If zf-orchestrator.mjs reads it but verify.mjs
doesn't know about it, the config file becomes a TYPE-8 orphan (config without registered consumer).
Fix: add a comment in verify.mjs that references known-deferred-advisories.yaml explicitly.

**2. Time Projection:** At 30 apps, plan-coverage-gate fires on every Write to libs/.
If the hook reads all plan files per invocation and there are 30 plans → O(30) per Write.
At 100 writes per implementation session → 3,000 plan reads. Must cache. Critical.

KNOWN_DEFERRED YAML: at 180 sessions (30 apps × 6 sessions each), deferrals will grow.
Maximum deferred count policy needed: when >20 entries exist, the YAML is bloated (most are
probably expired). The `review_by_session` field handles this if enforced.

**3. Coverage Enumeration — what is NOT proven:**
- Plan does NOT address "shotgun scope" — plans so broad that everything falls under them
- Plan does NOT address plan-scope drift (implementation exceeds plan's declared scope mid-session)
- validate-dead-links.mjs complexity underestimated (as noted by Reliability Engineer)

**4. Self-Referential — does this plan pass its own gates?**
- §0 CONSOLIDATION CHECK: YES ✅ (in §PRE-IMPLEMENTATION PROTOCOL)
- ZF gate per step: YES ✅ (§7 evidence gate)
- KNOWN_DEFERRED: YES ✅ (open-plan-levels explicitly deferred)
- CCG assessment: N/A (governance plan, not functional capability)
- Self-consistent. ✓

**5. Moat Measurement:**
- KNOWN_DEFERRED registry: MOAT (enables honest ZF, self-cleaning with review_by_session)
- §0 CONSOLIDATION gate: MOAT (prevents parallel structures in every future session)
- Plan-before-implementation gate: MOAT (prevents ungoverned implementation permanently)
- Error format standardization: OVERHEAD (convention, not moat)
- TYPE-6 dead-links validator: OVERHEAD (maintenance, not compounding)

**Ratio:** 3 moat : 2 overhead. Acceptable. The 3 moat elements compound significantly.

---

## OPUS VERDICT

**CONDITIONAL SEAL — proceed to Session 0 (critical subset only).**

**Session 0 APPROVED items:**
- STUB→ADVISORY promotion: `pre-tool-use-plan-coverage-gate.sh`
- STUB→BLOCKING promotion: `pre-tool-use-rzf-evidence-gate.sh` (after precise spec confirmed)
- YAML config: `tools/config/known-deferred-advisories.yaml` with `review_by_session` field
- Orphan resolution: stamp-domain-path.mjs ARCHIVE, diagnostics DELETE
- §0 CONSOLIDATION CHECK: batch-add to existing plans VIA SCRIPT
- ZF status levels: add to zf-orchestrator.mjs (REAL ZF / ZF ACHIEVED / BLOCKING language)

**Session A CONDITIONAL items (require Session 0 complexity score measurement first):**
- validate-consolidation-check.mjs (BLOCKING for S023+ plans, ADVISORY for existing)
- validate-plan-zf-requirement.mjs (ADVISORY initially)
- B_NO_IMPLEMENTATION_WITHOUT_PLAN contract

**Session C deferred:**
- validate-dead-links.mjs (use existing npm package, not build from scratch)
- libs/integrations/errors.ts (error format — remove renewal_url)
- libs/integrations/responses.ts (ADVISORY recommendation only, not mandatory)

**One final note — Q6 addition:** Add `libs/integrations/webhook-idempotency.ts` as a
shared pattern (not Core Primitive, not CCG-gated). Simple pattern, high value:
```typescript
export async function isIdempotentRequest(key: string, db: PrismaClient): Promise<boolean>
export async function markProcessed(key: string, db: PrismaClient): Promise<void>
```
Wire into Clerk and Stripe webhook handlers. Closes the idempotency gap permanently.

---

## RZF VERIFICATION
Cycles run: 3 | Gaps surfaced: 3 | Critical gaps: 1
Cycle 1: What did I miss?
  Findings: 3 — (a) KNOWN_DEFERRED review_by_session field needed (self-cleaning),
  (b) plan-coverage-gate O(N) scaling issue,
  (c) validate-dead-links complexity underestimated
Cycle 2: All three addressed in the review above?
  Findings: 1 — verify.mjs must reference known-deferred-advisories.yaml to prevent TYPE-8 orphan
Cycle 3: TYPE-8 orphan connection specified in Cross-File Lens?
  Findings: 0
Status: ZF ACHIEVED

---

*OPUS Core Council Feedback — Consolidation + ZF Hardening*
*Feedback File 2 of 3*
*Verdict: CONDITIONAL SEAL — Session 0 critical subset approved*
*OPUS-1 | S022 | 2026-05-11*
