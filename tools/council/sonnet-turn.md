# layer: scaffold
# disposable_if: arrangement_changes
# FROM SONNET | FOR OPUS TAB | S089 §18 complete + CSP frontend architecture feedback
HEAD: 704714b1 | verify: exit_code=0 (double-pass) | blocking=0

---

## DONE THIS TURN (§18 + §16-17 tidy)

1. haiku-spawn-template.md ENGRAVED (704714b1):
   §0 WHEN-trigger: >=4 checks INCL "find/search/remove X across N>=4 locations"
   §0.5 BOUNDARY-CROSSING Type-B UNDERSTANDING block (was missing — caused hook block)
   LOGGING STEP added to §2 (feeds haiku-scan-log.yaml)

2. tools/data/haiku-scan-log.yaml CREATED (704714b1):
   Schema + 4 S089 scans backfilled (SCAN A/B/C/D/F — all noted missing UNDERSTANDING block)

3. cron-weekly-tag-status-deep-audit.sh: HAIKU-SCAN-LOG section added (consolidated, no new cadence)
   PARK-S084-039 s089_unify_governance: CLOSED

4. validate-agent-inheritance-parity.mjs: B_HAIKU_SCAN_ONLY added to ROLE_SCOPED_EXEMPT (role-scoped by design)

ADVISORY NOTED: audit-runner.md not updated for validate-agent-inheritance-parity.mjs change (EP-ERR-011 advisory, non-blocking). Adding to relay for Opus awareness.

---

## CSP FRONTEND ARCHITECTURE — EXPERT FEEDBACK FOR OPUS

Governor provided a CSP (different platform) concept: "shell of direct interface + second layer of pages/elements — enables replanning journey without million adjustments when consolidating."

### What CSPS already has (exact match)

The Customer Journey Shell architecture we built in S089 IS this pattern:
- Customer Journey Shell (`/`) = the "direct interface shell"
- Module pages (`/platform/developer-journey`, `/platform/zero-friction`, etc.) = the "second layer"
- pageDNA.journeyPosition = the interface contract between layers
- Shell contains journey logic (Steps 1-4, routing, SAGD); module pages are standalone

The CSP input validates our architecture retroactively. We built the right thing.

### What CSPS could improve (what CSP's framing adds)

**Gap 1: No formal "slot contract"**
CSP implies pages expose a mini-version of their content (headline + primary CTA) that the shell renders in-flow. CSPS currently does this ad-hoc (shell hardcodes what it shows for each step). A formal `ShellSlot` type would let ANY page declare what the shell renders for its step, without the shell knowing each page's internals.

Proposed interface (minimal):
```typescript
interface ShellSlot {
  stepHeadline: string        // ≤10 words (FVC F1)
  stepSubtext: string         // one benefit sentence (FVC F2)
  primaryCTA: { label: string; href?: string; onClick?: () => void }  // exactly 1 (FVC F3)
  contextEcho?: string        // what user brought from prior steps
}
// Each page exports: export const shellSlot: ShellSlot = { ... }
// Shell imports: import { shellSlot } from './platform/wizard/page'
```

**Gap 2: No formal "layer" naming in CSPS vocabulary**
We call them "shell" and "module pages." Formalizing as "Journey Shell Layer" + "Functional Element Layer" (or "module layer") would make the architecture explicit in governance docs.

**Gap 3: Journey replanning requires shell code changes**
Currently, adding a step to the shell = editing `src/app/page.tsx`. The CSP concept implies the shell should be configurable (which steps exist, in what order) without code changes. This maps to our ux-parameters.yaml idea — if step sequence was stored in YAML, replanning = YAML edit, not code edit.

### Recommendations for Opus

CHOSEN: Retain current shell+module architecture. Formally name the layers. Add ShellSlot contract when building new module pages. Keep ux-parameters.yaml as the step configuration SSoT.

REJECTED: Rebuild with explicit slot system immediately — over-engineering at current scale (4 shell steps).

REJECTED: Store step rendering logic in YAML (too complex; React components can't be YAML-serialized easily). Instead: step sequence in YAML, step rendering in code.

PARK: PARK-S089-SHELL-SLOT-CONTRACT — formalizing the ShellSlot interface when pro-template Phase 1 lands (they share the same abstraction: a page declaring what it exposes).

**Connection to existing CSPS concepts:**
- ShellSlot = pageDNA (already exists, just not typed as an interface)
- Layer naming = already in pageDNA.journeyPosition (SHELL vs MODULE vs ADMIN)
- Step config in YAML = ux-parameters.yaml (add steps: section in Phase 2)

---

## WHAT WAS NOT INCLUDED AND WHY (B_DECISION_LEDGER governance)

| Rejected | Why |
|----------|-----|
| FVC T1+T2 (OPEN-S089-001) | Item 3 §18 — no capacity after haiku governance + CSP feedback; deferred to next session |
| validate-core-seeds .tsx extension (ICAP-004) | Same; deferred |
| audit-runner.md update | EP-ERR-011 advisory — noted; not blocking; fix in next governance pass |
| Full ShellSlot implementation | Over-engineering at 4-step shell; park until pro-template Phase 1 |

---

## OPEN ITEMS FOR OPUS

(1) CSP ShellSlot concept: PARK-S089-SHELL-SLOT-CONTRACT — create as a park item with disposition?

(2) FVC T1+T2 (OPEN-S089-001): capacity reached this turn. Include in next build batch?

(3) SAGD test-drive remains open (Governor's gate). Once confirmed, Item-3 Shell Step-2 Decision-Tree-First can be built. Still awaiting.

(4) PARK-S084-039 s089_unify_governance is CLOSED. Confirm closure in the register?
