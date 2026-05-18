---
id: csps.governance.core-scopes
name: core-scopes
description: "Core Scopes — the CSPS three-scope prevention framework. Every finding processed through all three scopes. Mandatory in plans, implementation, audits, validation, evolution, and session close."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
session: S040
impl_status: swift-implemented
links:
  - { rel: enforces, href: ./behavioral-contracts.md }
  - { rel: companion, href: ../../tools/council/PROTOCOL.md }
  - { rel: companion, href: ../../tools/council/communication-protocol-shared.md }
consolidation_cross_refs:
  - B_STRUCTURAL_PREVENTION_DISCIPLINE
  - B_PRACE
  - P-META-019
---

# Core Scopes — Three-Scope Prevention Framework

> Governor directive S040: "Prevention is declared by me to be a main issue in CSPS."
> These three scopes are the operational expression of that declaration.
> Every finding goes through all three. No finding closes at Scope 1 alone.

---

## The Three Core Scopes

### SCOPE-1: Immediate Resolution
**What:** Fix the specific finding directly, locally, in the session where it's discovered.
**When:** Same response or same session as the finding.
**Output:** Commit with fix OR OPEN-NNN registered if not immediately fixable.
**Done when:** The specific symptom is addressed. Tool-verified.
**Example:** A hook is a stub → upgrade it to advisory minimum in this session.

### SCOPE-2: Ripple Response
**What:** Check what's connected to the finding. Update those elements too. Map the dependency tree.
**When:** Before the session closes, after Scope-1 fix.
**Output:** Connected elements updated, cross-references aligned, drift between related artifacts eliminated.
**Done when:** All artifacts connected to the original finding are consistent with the fix.
**Example:** Upgrading a hook → also update session-open.sh T3 injection + audit-runner.md slug + AGENTS.md.

### SCOPE-3: Permanent Prevention
**What:** Deep dive into the root cause. Find the AI behavior default that allowed this finding. Install mechanical prevention (T1+T2+T3) so this CLASS of problem cannot recur.
**When:** Same session (if small) OR registered as OPEN-NNN with PRACE analysis for next session.
**Output:** New enforcement mechanism OR explicit OPEN item with PRACE template filled.
**Done when:** The failure mode that created the finding can no longer occur mechanically — not just "we won't do it again."
**Example:** Hook was a stub → add validate-hook-production-status.mjs T2 that blocks stubs from being declared as CRITICAL in verify-hooks-functional.sh.

---

## PRACE Template for Scope-3

Every Scope-3 finding requires these four fields:
```
SCOPE-3 ANALYSIS:
  Training default: [what Claude/AI does by training that caused this]
  Satisfaction point: [what incorrect "done" feeling was hit]
  Class of problem: [the category — not the specific instance]
  Permanent fix: [T1 hook | T2 validator | T3 injection] that prevents the class
```

---

## 6 Mandatory Locations for Core Scopes

Every one of these locations must apply the Core Scopes framework:

### 1. Plans (HOW WE PLAN)
Every plan document must include a **Prevention Analysis** section:
```
## Prevention Analysis
Scope-1 risks: [what could go wrong in this specific plan]
Scope-2 ripples: [what other elements does this plan affect]
Scope-3 prevention: [what training default is this plan most at risk from]
```
**Where:** `tools/templates/gradual-build-plan.template.md` + `docs/plan/pillar-0-governance/plan-creation-protocol.md`

### 2. Implementation (HOW WE IMPLEMENT)
Every implementation commit must pass a Scope-2 ripple check before pushing:
```
Pre-commit: Did you check all files connected to your change?
  □ Slices (behavioral-contracts/, audit-runner/) synced?
  □ DNA registry updated if new component?
  □ AGENTS.md updated if new hard NO?
  □ session-open.sh updated if new T3 injection?
```
**Where:** Pre-commit hook checklist + communication-protocol-shared.md Rule 12

### 3. Audits
Every audit output is structured as three-scope findings:
```
AUDIT FINDINGS:
  Scope-1 (immediate): [list findings requiring same-session fix]
  Scope-2 (ripple): [list connected elements needing update]
  Scope-3 (prevention): [list PRACE analyses for structural prevention]
```
**Where:** `docs/plan/pillar-0-governance/audit-runner.md` + closing-summary-template.md §10.0

### 4. Validation
pnpm verify structured to surface scope-level findings:
- BLOCKING = Scope-1 (must fix before commit)
- ADVISORY = Scope-2 (ripple check needed)
- DEFERRED = Scope-3 candidate (has declared but unbuilt prevention)
**Where:** `tools/verify.mjs` status labels + validate-audit-health.mjs

### 5. Evolve (Ongoing)
OPEN items categorized by scope:
- `[S1]` = immediate fix, can close quickly
- `[S2]` = needs ripple check before closing
- `[S3]` = requires PRACE analysis, new enforcement mechanism
**Where:** `tools/council/opus-open-items.md` + multi-session plan

### 6. Session Close (Harvesting Pipeline)
Every session close produces a three-scope harvest:
```
SESSION HARVEST:
  S1 fixes completed: [list commits that addressed Scope-1 findings]
  S2 ripples updated: [list connected elements updated]
  S3 prevention installed: [list new T1/T2/T3 mechanisms | OR pending OPEN items]
  S3 still pending: [list OPEN-NNN items with PRACE template]
```
**Where:** HANDOFF Zone A + closing-summary §10.0j enhancement-proposals

---

## The Harvesting Pipeline (Post-Session)

After every session, mandatory processing:

```
HARVEST TRIGGER: session close initiated
  ↓
HARVEST STEP 1 (Scope-1): Review all findings from this session
  Did each finding get a same-session fix OR an OPEN-NNN? YES/NO
  If NO: session cannot close.

HARVEST STEP 2 (Scope-2): For every Scope-1 fix this session
  Were connected elements updated? YES/NO
  If NO: ripple is pending — add to next session opening items.

HARVEST STEP 3 (Scope-3): For every recurring pattern found this session
  Was the training default named? YES/NO
  Was T1 or T2 installed? YES/NO
  If NO: register OPEN-NNN with PRACE template before closing.

HARVEST COMPLETE: all three steps = YES → HANDOFF can be written
```

---

## Prevention-First Implementation Discipline

Governor: "Prevention is a main issue in CSPS."

The current anti-pattern: we discover the same gap in session N, session N+2, and session N+5. Each time we fix it at Scope-1 but never reach Scope-3.

The CSPS correction:
- No session closes without at least attempting Scope-3 for each finding
- Scope-3 that requires more than 30 min gets an OPEN-NNN with full PRACE template
- OPEN items tagged [S3] are the highest-priority items in the next session's PE scoring

**Training default to override:** "I fixed the problem, I can move on." (DEFAULT-ME-1 applied to prevention)
**Satisfaction point:** "The immediate symptom is gone."
**CSPS override:** "Fixing the symptom = Scope-1. Scope-3 = installed prevention so the symptom cannot recur."

---

*Core Scopes v1.0 | Ratified S040 | Governor directive: "Prevention is a main issue in CSPS"*
