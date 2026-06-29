# layer: scaffold
# disposable_if: arrangement_changes
# FROM SONNET | FOR OPUS TAB | S089 §23 — CANONICAL BUILD PROCESS REVIEW (no build)
HEAD: 486ca4fc | verify: exit_code=0 | Session S089

---

## T1-T10 STATUS CORRECTIONS (evidence-based, against actual codebase)

### T1 [P0] GOAL-DEFINITION
Document says: PARTIAL (SAGD + CDS CS-GOAL model)
CORRECTION: PARTIAL ≈30%, not ~50%.

What EXISTS:
  SAGD state machine: apps/csps-playground/src/app/page.tsx lines 137-143 (sagdState, sagdChallenge, sagdRipples)
  Root-cause gate: lines 117-135 (rootCauteGate state — asks "is this the outcome or a solution?")
  SAGD scope classifier: lines 174-186 (classify depth: light vs deep)
  SAGD depth questions in Step 3: root cause + ripples + broadener ✓

What DOES NOT EXIST:
  CDS 5-Q felt-need test (who feels it / what they feel unmet / no tech-feature / confirmable without building / would different solution satisfy)
  Single-sentence enforcement (no constraint that filters out compound goals with "and")
  Observable resolution signal (third-party-confirmable, measurable)
  Goal ratification as a BLOCKING gate (rootCauteGate is a UI choice, not a formal gate; user can bypass)
  goal_id field: mentioned in CANONICAL-BUILD-PROCESS.md + one park-register entry; NOT in pageDNA, plans, or any enforced field
  Goal closure record: MISSING

### T2 [P2] PRESENT-WHAT-EXISTS gate
Document says: PARTIAL (dedup/consolidation)
CORRECTION: PARTIAL confirmed — but weaker than implied.

What EXISTS:
  Shell Step 2 shows "what exists" panel visually (app templates, similar builds, patterns) ✓
  validate-consolidation-pass.mjs: EXISTS in tools/validators/ and wired in verify.mjs (line 2182)

CRITICAL GAP:
  validate-consolidation-pass.mjs exits 0 unconditionally (blocking=0, advisory=0 per block-test).
  It is ADVISORY ONLY. No consolidation check actually blocks anything.
  The Step 2 shell panel is UX, not a gate.

### T3 [P1] Pipeline/journey definition format
Document says: MISSING — CONFIRMED. No per-component ratify step exists anywhere.

### T4 [P2] Back-office requirements template
Document says: MISSING — CONFIRMED. Nothing in codebase.

### T5 [P2] Connectivity map + corespine-mapping
Document says: core-spine-registry EXISTS; per-part step MISSING
CONFIRMED: tools/config/core-spine-registry.yaml exists; /platform/journey-core-spine page exists.
Per-part assignment step: MISSING from any build flow.

### T5b [P2] PER-PART REUSE CHECK
Document says: MISSING — CONFIRMED.

### T6 [done] Core-spine assignment mechanism
Document says: EXISTS; wire into the step.
CORRECTION: EXISTS as a page (apps/csps-playground/src/app/platform/core-spine-creator/page.tsx) ✓
BUT: "done" overstates — it is NOT wired into any required build step.
Status should be: PARTIAL (mechanism exists; not in build flow)

### T7 [P1] Canonical UX checklist
Document says: PARTIAL (ux-ui-dna laws scattered)
CORRECTION: PARTIAL confirmed, but closer to 25% than implied.

What EXISTS:
  validate-ux-audit.mjs ✓ (wired in verify.mjs — appears TWICE, both cycles run)
  ux-ui-dna.md: §1-§7 (7 immutable principles + LOVABILITY + journey principles + corespine mandate + FVC)
  FVC-01 to FVC-18 in FIRST-VIEWPORT-CONTRACT.md ✓
  ux-parameters.yaml with thresholds ✓

CRITICAL GAP:
  No single canonical "run this checklist → PASS/FAIL" command exists.
  validate-ux-audit.mjs checks pageDNA presence + some patterns but does NOT run FVC-01..18.
  ux-parameters.yaml thresholds are NOT read by any validator — they are documentation.
  Laws are scattered: ux-ui-dna.md, ux-parameters.yaml, FIRST-VIEWPORT-CONTRACT.md, AGENTS.md — four sources.

### T8 [P1] Canonical UI checklist
Document says: PARTIAL (6 UI principles)
CORRECTION: PARTIAL confirmed — same structural gap as T7. Principles documented, no canonical runner.

### T9 [P1] RENDER-AND-VIEW capability
Document says: MISSING (the critical one)
STATUS: MISSING — CONFIRMED. Here is exactly what is available:

WHAT EXISTS:
  WebFetch: available to Sonnet. Fetches URL → returns TEXT MARKDOWN, not screenshots.
    → Can confirm: page loads, headline text, content presence (text-only, no visual layout)
    → Confirmed LIVE: used to verify shell Step 1 headline in this session
  Vercel deployment: auto-deploys on push, preview URL available after ~90s.
  Governor manual screenshots: working path (Governor pastes; we used this throughout S089)

WHAT DOES NOT EXIST:
  Playwright: NOT installed (not in node_modules/.pnpm/)
  Puppeteer: NOT installed
  Cloudflare browser rendering API: pg-cloudflare@1.4.0 in pnpm is a POSTGRES CLIENT for Cloudflare, NOT a browser
  Any headless screenshot script

HONEST T9 OPTIONS:
  Option A (available NOW): WebFetch text check as BUILD-AUDIT dimension (g). Confirms page loads + expected content exists. Does NOT verify visual layout/positioning.
  Option B (available now): Governor pastes screenshot → Sonnet analyses. Current working path. Slow but real.
  Option C (feasible): Playwright MCP — QUARANTINED in external-capability-alignment.yaml. Needs dna-guardian ALIGNED verdict before use. Probably fastest real path.
  Option D (unknown): If Vercel has a screenshot API (e.g., via their OG image generation or preview screenshots) — would need investigation.

RECOMMENDATION: Option A (WebFetch) as immediate T9-lite. Option C (Playwright, after dna-guardian) as real T9.

### T10 [P0] THE PIPELINE ITSELF
Document says: Build the process AS the hardwired+inherited pipeline.
STATUS: MISSING as a pipeline.

What EXISTS: OPUS-S089-CANONICAL-BUILD-PROCESS.md as a document ✓
What DOES NOT EXIST:
  No T1 hook that blocks any action without a ratified goal_id
  No T2 validator checking stage sequence
  No AGENTS.md mandate requiring this process
  No session-open injection pointing to this process
  No verify.mjs cycle for the build process itself
The process is T3-only (a document). Every T1-T9 exists only as documented intention.

---

## GAPS IN THE 9-STAGE SPINE

**Gap 1: UX-LAW-7 STATE PERSISTENCE not in the spine**
§22 ratified UX-LAW-7 (back/forward NEVER loses data). The current shell WILL lose data if user goes back from Step 3 → Step 2 → Step 3 (planProblem/planUser/planCoreLoop reset by setStep).
No localStorage, no sessionStorage. This should be a PREREQUISITE in Stage 6 (UX Canvas) and enforced by Stage 8 test-drive — but it's not in the spine document explicitly.

**Gap 2: goal_id not in the pipeline as a mandatory field**
CANONICAL-BUILD-PROCESS.md says "goal_id is a mandatory backpack slot in every pipeline part" — but this exists only in the document. No pageDNA field, no plan item field, no park item field. The backpack slot is documented but never real.

**Gap 3: Stage 9 GOAL-CLOSURE has no trigger**
Who fires Stage 9? When does the Governor check: "resolution signal met?" There's no session-close step, no scheduled check, no CIE trigger. Without a trigger, Stage 9 never happens.

---

## CREATE=PREVENT MIRROR — IS IT SOUND?

YES, the mirror logic is sound. Each CREATE gate maps cleanly to a PREVENT audit question.
The challenge: none of the T1 hooks or T2 validators actually enforce the mirror.
The mirror is true in logic; it is not true in code.

---

## PCR DELTAS (changes I'd propose to the process or task order)

**Delta 1: T1 status → 30% not PARTIAL (overstated)**
Evidence: 5-Q felt-need test, resolution signal, and goal ratification gate all missing.
CHOSEN: downgrade to "PARTIAL-EARLY" in the document.
REJECTED: keep as PARTIAL (misleading — implies halfway done).

**Delta 2: T9 RECOMMENDATION — split into T9-lite (now) and T9-proper (after Playwright clearance)**
T9-lite: WebFetch text check as BUILD-AUDIT(g) + Governor screenshots → AVAILABLE NOW
T9-proper: Playwright MCP after dna-guardian ALIGNED verdict → FEASIBLE, needs setup
CHOSEN: build T9-lite immediately; park T9-proper for governance clearance.
REJECTED: wait for T9-proper before any UX canvas (blocks everything; WebFetch is good enough to unblock).

**Delta 3: Stage 3.5 STRONGLY SUPPORT (Journey-Shape Sanity Walk)**
It is cheap (5-min human review) and prevents wiring a wrong shape.
Missing from current shell entirely. Should be: after Step 2 (what exists) → before Step 3 (plan).
"Governor: does the proposed step order feel right?" — one question, one answer, block if "no."

**Delta 4: goal_id backpack slot BEFORE T10 hardwire**
If every plan/park/pageDNA REQUIRED a goal_id: field, the CREATE=PREVENT mirror would be 50% real immediately. This is cheaper than T10 (the full pipeline) and delivers the most value per effort.
CHOSEN: make goal_id the next single build after T1 ratification.
REJECTED: build full T10 pipeline first (too large; goal_id alone captures the key invariant).

**Delta 5: UX-LAW-7 state persistence should be in T7 scope (not a separate work item)**
When T7 (canonical UX checklist) is built, UX-LAW-7 state persistence check should be one of its items.
Don't create a new task for it — fold into T7.

---

## SUMMARY TABLE

| T# | Document status | Actual status | Correction |
|----|----------------|--------------|------------|
| T1 | PARTIAL | PARTIAL-EARLY (~30%) | 5-Q test, resolution signal, goal-id missing |
| T2 | PARTIAL | PARTIAL (gate is advisory, not blocking) | validate-consolidation-pass exits 0 unconditionally |
| T3 | MISSING | MISSING | Confirmed |
| T4 | MISSING | MISSING | Confirmed |
| T5 | PARTIAL | PARTIAL | Registry exists; per-part step missing |
| T5b | MISSING | MISSING | Confirmed |
| T6 | done | PARTIAL (mechanism, not wired) | core-spine-creator exists; not in build flow |
| T7 | PARTIAL | PARTIAL (~25%, four scattered sources) | No canonical single-run checklist |
| T8 | PARTIAL | PARTIAL (~25%) | Same gap as T7 |
| T9 | MISSING | MISSING (WebFetch = text-only workaround) | No programmatic screenshot; 3 options above |
| T10 | (umbrella) | MISSING as pipeline; exists as document | T3-only; no hooks/validators enforce it |
