# Opus Turn 9 — S025 Four Architectural Decisions + P-META-023 SEALED

**State at Writing:** S025 active | 73 validators | pnpm verify exit_code=0
**Sonnet last reported:** S024 close — all P-META-022 Tier 1 + Tier 2 done, Budget Planner App#2 Layers 1-3, threshold-intake-protocol.md created with full 26+42, libs/ gate BLOCKING
**Read:** threshold-intake-protocol.md §7 (26 items confirmed) + §10 (42 surfaces confirmed) + sonnet-turn.md SONNET REPORT

---

## P-META-023 — SEALED ✅

**Turn 8 conditional satisfied.** Having read threshold-intake-protocol.md in full:
- 26-item checklist: comprehensive, correctly categorized (B/C/I/R/M), well-structured
- 42 surfaces: mapped with status + priority, activation distinction clear
- Parent principle: P-META-022 declared correctly as the WHY
- SSoT architecture: correct — all elements reference, none copy
- Three human-anchored items (I1/M1/M3): correctly identified and enforced

**SEAL:** P-META-023 Intent-to-Verified-Impact (I→VI) is ratified. Register in principles.yaml as P-META-023 with `parent_principle: P-META-022`. The document quality is production-grade.

**Two remaining refinements for S025:**
1. Add explicit B/C/I/R/M → L1/L2/L3 Layer mapping to §7 (currently implicit)
2. Surface activation gate: clarify which of the 42 surfaces are active now vs. when future apps are built (currently all 42 listed together)

---

## TOPIC 1: Template Ratification Grades A/B/C/D

**Position: APPROVED. Implement the grade system. Four specific refinements.**

**Answers to Sonnet's questions:**

**Q1 — Composes with depth_chosen?**
YES, but they are orthogonal. depth_chosen = scope of the PLAN. Grade = scope of the TEMPLATE created by that plan. A depth-3 plan can create a Grade A template if that template will be used platform-wide. Do not conflate them. Both are declared independently.

**Q2 — Grade A triggers Opus council automatically?**
YES — Grade A ratification triggers Level 2 consultation (Full Opus Advisory) per the Topic 3 pipeline. This is mechanically enforced: when template_grade: A appears in a plan and template_status moves to draft → automatic Opus review required before stable. Wire into council-state.json: `pending_grade_a_reviews: [list]`.

**Q3 — Retroactive grading of existing templates?**
Script-based at next opportunistic session. Read template-registry.md, assess each against criteria, assign Grade. My initial read:
- gradual-build-plan.template.md → **Grade A** (governs all platform plans)
- governed-artifact-frontmatter.template.md → **Grade A** (governs all artifacts)
- closing-summary-template.md → **Grade A** (governs all session closes)
- HANDOFF template → **Grade A**
- topic-plan templates → **Grade B** (reused across apps, not platform-constituting)
- adr.template.md → **Grade B**
- App-specific UI templates → **Grade C**
- human-intent-wizard.template.md → **Grade C** (app-session, not platform)

**Q4 — template_status enum expansion?**
YES. Recommended closed enum:
```
experimental    (Grade D — K=1, no review)
draft           (active development, any grade)
provisional     (Grade C — Governor confirmed + ZF Level 1)
standard        (Grade B — research + Governor + ZF Level 2)
sealed          (Grade A — full council + ZF Level 3 + FSE 5/5)
```
Replace existing `novel-pending-pattern-evaluation | stable` with this 5-value enum. Migrate: novel-pending → experimental, stable → standard or sealed (by grade).

**Q5 — Mechanical trigger for "research required before sealing"?**
Template with template_grade: A MUST have `research_ref:` field in frontmatter pointing to an external consultation document. Validator: `validate-template-grade.mjs` — checks Grade A templates for research_ref presence. The external consultation IS the external-council format (GPT/Gemini review + synthesis). This is already a process we use — formalize it as required.

---

## TOPIC 2: Intake Interrupt Protocol (×1.5 vs ×2.0)

**Position: ×1.5 for VAULT/PLAN. ×2.0 for INTERRUPT. Case 3 = always stop, no multiplier.**

**Answers to Sonnet's questions:**

**Q1 — ×1.5 right for interrupts?**
Differentiate three thresholds:
```
VAULT threshold:     PE(new) < PE(current) × 1.5 → raw-thoughts-queue
PLAN threshold:      PE(new) ≥ PE(current) × 1.5 → create topic-plan, pause at NEXT ZF gate
INTERRUPT threshold: PE(new) ≥ PE(current) × 2.0 AND implementation < 50% complete → pause mid-phase
ARCHITECTURAL:       L1 element touched → always stop immediately, no multiplier
```
The ×1.5 is correct for deciding to PLAN the new idea. It's insufficient for deciding to INTERRUPT active work (re-entry cost is real). ×2.0 for interrupts. ×∞ (always) for L1 touches.

**Q2 — Right ZF gate to pause at?**
PLAN case: pause at next closed-circle milestone (phase complete + verify passes + commit). NOT mid-implementation. B_HUMBLE_EXECUTOR milestone format is the natural pause point.
INTERRUPT case: stop immediately after current atomic action completes (not mid-function, not mid-file). Document interrupted state in raw-thoughts-queue.

**Q3 — Compose with session-state.json blocking_decisions?**
YES. A Case 2 (PLAN) or Case 3 (INTERRUPT) event creates a new blocking_decisions entry:
```json
{
  "id": "VLT-INTERRUPT-[slug]",
  "state": "open",
  "priority": "P1",
  "description": "New idea arrival during active build — Governor decision needed",
  "arrived_during": "[session + active work]",
  "idea_PE": [score],
  "current_work_PE": [score]
}
```
This prevents the idea from being silently vaulted AND prevents silent continuation.

**Q4 — Opus auto-trigger at PE > 90 for new items?**
YES, with a distinction: items IN the ratified arc plan with PE > 90 can proceed (already approved). Items NOT in the ratified arc plan with PE > 90 → L1 express review required. The trigger: `PE(new item) > 90 AND topic not in opus-advisory-arc-S023.md session assignments` → add to sonnet-turn.md as `needs_opus_review: true, opus_review_type: express`.

---

## TOPIC 3: Opus Consultation Pipeline — Four Levels

**Position: L0-L3 system is correct. Five additions.**

**Answers to Sonnet's questions:**

**Q1 — Virtual Opus Audit 5 questions — right set?**
YES. The 5 questions are well-chosen. Keep exactly as proposed. One observation: Q4 ("Am I implementing because I understand deeply, or because it was requested?") is the P-META-022 question applied to AI-Sonnet self-check. Q5 ("What gap in my understanding...") is the coverage enumeration lens. Both are load-bearing. Keep all 5.

One optional Q6 for Grade A decisions only: "Does this affect how ALL 30 apps will work, or only the current one?" (Moat measurement). Only for constitutional-scope items.

**Q2 — L1 express review mechanically?**
Format — maximum 5 lines per item, can batch multiple in one turn:
```markdown
## EXPRESS — [topic name]
Verdict: ✅ Pass | ⚠ Advisory | ❌ Block
Reasoning: [1-2 sentences]
Action: [one specific action, or "none"]
```
No full RZF section required for L1 express. These can be grouped in one Opus turn with multiple EXPRESS blocks. This keeps express review fast.

**Q3 — sessions_since_opus_review at 10 → auto-consultation?**
YES — already tracked, promote the existing validate-opus-audit-due.mjs trigger to also generate a briefing template. When the counter hits 10, session-open.sh should prompt: "Generate Opus briefing? Run: node tools/generators/generate-opus-briefing.mjs". The briefing script reads all topics tagged `needs_opus_review: true` in recent HANDOFFs and compiles them into the opus-briefing format.

**Q4 — Opus audit mode format?**
SELECTIVE, not universal. Sonnet marks HANDOFF items with `needs_opus_review: true` + type:
```
opus_review_type: architectural   (Opus checks architecture decisions)
opus_review_type: express         (3-line verdict sufficient)
opus_review_type: trend           (Opus checks for multi-session drift)
```
Opus reads ONLY marked sections. This is the correct model — targeted, not comprehensive.

**Q5 — Boundary between Sonnet and Opus judgment?**

```
SONNET DECIDES independently:
  - HOW to implement within a ratified plan
  - Bug fixes in known scope
  - App-specific implementation (no platform-wide effect)
  - Depth 1-4 work within ratified bounds
  - Template Grade B/C/D creation
  - Virtual Opus Audit: all 5 answers confident

OPUS REVIEW required (L1 minimum):
  - New P-META-* / P-ARCH-* principle
  - Template Grade A ratification
  - PE > 90 AND not in arc plan
  - Virtual Opus Audit: any "I don't know"
  - Implementation contradicts or extends Opus-ratified element

OPUS COUNCIL required (L2/L3):
  - depth_chosen: 5 (constitutional)
  - Core Spine changes
  - Foundation schema changes
  - Contradiction with existing sealed B_* contracts
```

---

## TOPIC 4: Independent Implementation vs Opus Consultation

**Position: Sonnet's hierarchical binding is correct. Two additions.**

**Q1 — Correct authority boundary?**

Sonnet's model is right. One precision I'd add:
- Sonnet has MORE autonomy on app-specific decisions (the Governor chose the domain, Sonnet builds it in the app layer)
- Sonnet has LESS autonomy on platform-wide decisions (these affect all 30 future apps — platform layer)

The blast_radius test Sonnet proposed is the right mechanism. Platform-wide (all apps affected) = Opus territory. Module-level (one service affected) = Sonnet territory.

**Q2 — Review every closing-summary?**

NO. Selective review only via `needs_opus_review: true` marker. Universal review would consume Opus's architectural capacity on routine sessions. The Governor's intervention window (INTENT ABSORBED) plus the existing ZF gates cover routine quality. Opus adds value at ARCHITECTURAL decision points, not at every session boundary.

**Q3 — How Sonnet flags for Opus review?**

Two mechanisms:
1. HANDOFF frontmatter: `needs_opus_review: true` + `opus_review_type: [type]`
2. In sonnet-turn.md SONNET REPORT: "What Opus should know for next turn" section — flag specific discoveries

Validator: `validate-opus-review-flagging.mjs` — checks that HANDOFFs containing new principles, Grade A templates, or depth-5 work have `needs_opus_review: true`. This prevents the case where Sonnet forgets to flag.

**Q4 — Minimum information for express review?**
Five fields, all required:
```
Topic: [name]
Decision: [what is being decided]
Options considered: [A/B/C at minimum]
Blast radius: local | module | platform | external
Sonnet's recommendation: [which option and why]
```
Missing any of these → Sonnet must escalate to L2 (can't do express without all 5 fields).

**Q5 — Representing Opus when not present?**
Virtual Opus Audit (5 questions) IS the mechanism. Additionally: in plan §KH section, declare "Opus-adjacent principles applied: [P-META-*, P-ARCH-*, B_* relevant]." This documents the architectural thinking without requiring Opus to be present. When Opus does review, this declaration shows the Opus-style thinking that went into the decision.

---

## Summary — What Sonnet Can Implement Now vs Needs Council First

**Implement immediately (no further Opus needed):**
- `template_status` enum expansion (experimental/draft/provisional/standard/sealed) — additive field change
- `template_grade: A|B|C|D` field in frontmatter-closed-enums.md — additive field
- intake-interrupt-protocol.md first draft with the 3 cases and thresholds
- Virtual Opus Audit 5-question block in session-open.sh or question-protocol.md
- HANDOFF frontmatter `needs_opus_review` field + `opus_review_type` enum
- Express review format in PROTOCOL.md
- P-META-023 registration in principles.yaml (now SEALED)

**Needs Governor ratification before implementing:**
- The actual enforcement of template Grade A → mandatory Opus review (changes B_TEMPLATE_FIRST_CREATION behavioral contract)
- The intake-interrupt-protocol.mjs validator (enforcement of interrupt thresholds)
- sessions_since_opus_review → auto-briefing generation script (changes session-open.sh — protected path)

**Needs Opus Turn 10 before implementing:**
- Retroactive grade assignment to all existing templates (after Sonnet scripts it and brings the list for Opus to review)

---

## RZF VERIFICATION
Cycles run: 3 | Gaps surfaced: 2 | Critical gaps: 0
Cycle 1: Did I miss anything in the 4 topics?
  Findings: 2 — (a) P-META-023 SEALED but principles.yaml registration still needed,
  (b) intake-interrupt-protocol enforcement validator needs Governor ratification not just Opus
Cycle 2: Both addressed — registration called out explicitly, Governor ratification specified.
Cycle 3: 0 new findings.
Status: ZF ACHIEVED

---

*Opus Turn 9 — S025 advisory | P-META-023 SEALED | 4 topics answered*
*OPUS-1 | S025 | 2026-05-12*

---

# Opus Turn 8 — P-META-023 Architectural Feedback (S024 mid-session advisory)

**Source:** Governor forwarded Sonnet S024 proposal for P-META-023 (Intent-to-Verified-Impact, I→VI).
**Note:** Sonnet S024 is active in parallel — feedback written to standalone file for safe delivery.

**Full feedback:** `tools/council/feedback-p-meta-023-opus-turn8.md`

**Summary:**
- Direction: APPROVED (strong proposal)
- Hierarchy: P-META-023 is a child of P-META-022, not its parent
- Key finding: Failure Signal is genuinely new → backport to P-META-022 as `failure_signal` field
- Conditional seal: need the full 26-item checklist + 42 surfaces before ratification
- Sonnet action now: log in SONNET REPORT, handle in S025
- Sonnet action S025: create threshold-intake-protocol.md + send 26+42 to Opus (Turn 9)

## RZF VERIFICATION
Cycles run: 3 | Gaps: 2 (both addressed) | Status: ZF ACHIEVED

*OPUS-1 | 2026-05-12*

---

# Opus Turn 7 — S024 Pending Opus Tasks (Post-S023 HANDOFF Review)

**Source:** HANDOFF-S023-to-S024.md + Governor directive S023 "shape core spines to serve several purposes"

---

## Task 1: Core Spines Reshape — Ripple Analysis Required

**Governor directive (S023):** "Shape core spines to serve several purposes."

This is constitutional-tier. The current 5 Core Spines (GVRN/ARCH/AI/OPER/VALD) are
single-purpose each. The Governor wants them to serve MULTIPLE purposes.

**Before any implementation — Opus must do ripple analysis:**

What "serve several purposes" might mean:
- Option A: Each spine can host multiple types of artifacts (not just governance, schema, AI, etc.)
- Option B: Cross-spine artifacts are first-class (core_spines: [GVRN, ARCH] is the default, not the exception)
- Option C: Spines are reorganized to better reflect actual platform concerns (e.g., merge OPER into others)
- Option D: Spines serve as both classification AND routing axes simultaneously

**The ripple risk:**
Every governed artifact has `core_spine:` in its frontmatter. The validator `corespine_layer_compliance` runs on every artifact. If spine definitions change, ALL ~300+ artifacts may need re-classification. The ai-behavior-spine.md matrix would need rebuilding. L1 sealed files would need amendment via ADR.

**What Governor must clarify before Opus can analyze:**
Governor: what do you mean by "serve several purposes"? 
One sentence example preferred. Options A-D above — which matches your intent?

**Opus will not produce a ripple analysis until this clarification is received.**

This item is DEFERRED pending Governor clarification.

---

## RZF VERIFICATION
Cycles run: 1 | Gaps surfaced: 1 | Critical gaps: 0
Cycle 1: Core Spines ripple analysis cannot begin without knowing WHICH kind of reshape.
  The 4 options above are genuinely different — analyzing the wrong one wastes the analysis.
  Governor clarification is the correct gate.
Status: ZF ACHIEVED (turn is complete — it correctly identifies what's needed next)

---

*Opus Turn 7 — Core Spines ripple analysis: pending Governor clarification on intent*
*OPUS-1 | S024 | 2026-05-11*

---

# Opus Turn 6 — S023 Human Intent Crystallization — Constitutional Engraving (7 Surfaces)

**This is not a process gate. It is a governing philosophy.**

---

## The Governor's Insight (restated at constitutional depth)

The core failure in human-AI interaction is not misunderstanding — it is premature action.
An AI that acts on a human's first expression without probing deeper has committed an act of
arrogance: the assumption that Layer 1 (what was said) is sufficient to serve Layer 3
(what is truly needed). The human often does not know their own Layer 3. The platform's job
is to help them find it — before implementation, not after.

This is the difference between a platform that executes on instructions
and a platform that helps humans understand what instructions to give.

**The three layers:**
- Layer 1: What they say (first expression — shaped by current vocabulary, always incomplete)
- Layer 2: What they want (stated goal — reachable through structured probing)
- Layer 3: What they need (deep intent — may be unknown even to the human)

**The drift equation:** `drift = distance(L1→L3) × implementation_steps`

Once drift enters the system, it cannot be fixed at the implementation layer.
It can only be prevented at the crystallization layer — before work begins.

---

## What Was Created

| Surface | Artifact |
|---|---|
| **Documentation** | `docs/plan/pillar-0-governance/human-intent-crystallization.md` — canonical principle |
| **AI Behavior** | inner-AI-defaults OD-007: act-on-first-expression → override |
| **Protocols** | plan-creation-protocol.md Step 0 (Reflect-Until-Match) |
| **Wizards** | `tools/templates/human-intent-wizard.template.md` |
| **Planning** | gradual-build-plan.template.md goal_statement + done_criteria fields |
| **Implementation** | B_HUMAN_INTENT_CRYSTALLIZATION contract + AGENTS.md hard NOs |
| **Validation** | validate-intent-crystallized.mjs + intent drift check in milestone protocol |

Full Sonnet implementation brief: `tools/council/sonnet-intent-crystallization-brief.md`

---

## The Critical Structural Requirement (for every surface)

**Governor must author or restate the goal. AI may only reflect.**

An AI-drafted goal_statement approved with "yes" is NOT crystallization.
It is the satisfaction-point anti-pattern dressed as a process.

The Reflect-Until-Match protocol:
1. AI proposes restatement of what it heard
2. Human corrects
3. AI updates
4. Repeat until human says: "yes, that is exactly it"
5. THAT statement — the correction — is the goal_statement

The correction reveals Layer 2-3. The AI's job is to be a good mirror, not a good guesser.

---

## Connection to Platform Mission

CSPS builds 30+ apps. Each inherits multi-tenant security, billing, audit — the technical foundation.
The differentiator is this: every CSPS app helps its users understand what they actually need,
not just process what they say. This is the platform's reason for existing beyond technical infrastructure.

---

## RZF VERIFICATION
Cycles run: 3 | Gaps surfaced: 2 | Critical gaps: 0
Cycle 1: Did I miss anything in the 7 surfaces?
  Findings: 2 — (a) The wizard template is for documenting crystallization but doesn't
  describe the INTERACTIVE flow. The canonical doc covers the flow; template records the output.
  This is correct — the template is a record, the protocol is the flow.
  (b) The Threshold Wizard for external users is only mentioned, not updated.
  External user domain is Domain 3 — the Threshold Wizard IS their crystallization protocol
  already. No update needed; needs a cross-reference added.
Cycle 2: Both resolved: template design is correct; cross-reference to Threshold Wizard
  is in the canonical doc §5 and §8.
Cycle 3: Scope issue — 80K token constraint means not all 7 surfaces fit this session.
  Finding: brief needs Tier 1/Tier 2 split or Sonnet will sacrifice chat close.
Cycle 4: Tier 1/Tier 2 split added. ZF-4 gates defined. Inheritance chain specified.
  0 new findings.
Status: ZF ACHIEVED

## ADDENDUM — Scope + Multiple ZF Gates + Inheritance (Governor directive refinement)

**Multiple ZF Gates — 4 levels required, not 1:**

| Gate | When fires | Evidence required | Status |
|---|---|---|---|
| ZF-1 Pre-planning | Before any plan writing | goal_statement + done_criteria | BLOCKING — implement now |
| ZF-2 Step alignment | Each implementation step | alignment field per step | Deferred Session B |
| ZF-3 Milestone intent | Every closed-circle milestone | Intent drift check in closing summary | Add to template now |
| ZF-4 Delivery | Plan completion | done_criteria ✅/⏳/❌ per criterion | Deferred Session C |

**ZF-1 is the load-bearing gate.** Without it, ZF-2/3/4 have nothing to verify against.

**Inheritance chain:**
```
P-META-022 principle
  → OD-007 override (every session, new topic)
    → plan-creation-protocol Step 0 (mandatory)
      → goal_statement + done_criteria in frontmatter (ZF-1)
        → closing-summary intent drift check (ZF-3)
          → apps/template/_meta/intent.md (Tier 2 — every app)
```

**Existing elements priority alignment:**
1. B_CONSENSUS_BEFORE_PROCEEDING — add P-META-022 cross-ref this session
2. B_HUMBLE_EXECUTOR — add ZF-3 intent drift check this session
3. B_AUTONOMOUS_BATCH_WITH_PREFLIGHT Q-CRYSTALLIZED gate — next session
4. csps-platform-dna.md Element 15 — next session
5. B_INTENT_CRYSTALLIZATION deprecation note — next session

**Sonnet scope (80K tokens, chat close required):**
Tier 1 this session: principles.yaml + OD-007 + plan-creation-protocol Step 0 +
validate-intent-crystallized.mjs + B_CONSENSUS_BEFORE_PROCEEDING xref + ZF-3 in template + chat close
Tier 2 next session: wizard template + gradual-build-plan + full B_* contract + AGENTS.md + app template

---

*Opus Turn 6 — P-META-022 Human Intent Crystallization — 7-surface constitutional engraving*
*Addendum: 4 ZF gates, inheritance chain, Tier 1/Tier 2 scope split, existing elements priority*
*Governor: canonical doc at docs/plan/pillar-0-governance/human-intent-crystallization.md §10-§12*
*Sonnet: read tools/council/sonnet-intent-crystallization-brief.md §SCOPE first — budget is tight*
*OPUS-1 | S023 | 2026-05-11*

---

# Opus Turn 5 — S023 Human-AI Consensus Protocol (Pre-Design Thinking)

**Task:** Review opus-consensus-protocol-questions.md — 24 questions from 6 expert perspectives.
Identify load-bearing questions. Assess: one protocol or three. Find minimum viable version.

---

## Part A — The 10 Load-Bearing Questions (Out of 24)

The other 14 are design details that can be resolved once these 10 are answered.

| Q# | Question | Why it gates everything else |
|---|---|---|
| 3.1-Q1 | Must consensus protocol pause even in a production emergency? | Defines whether exemptions exist — shapes the entire trigger architecture |
| 3.1-Q3 | If Governor says "just figure it out" — has consensus been reached? | Defines whether AI autonomy is possible without documented iteration |
| 3.2-Q2 | Does each audience need a different version? | Direct answer to "one protocol or three" |
| 3.3-Q2 | Does consensus PRODUCE the sandbox spec, or does it precede it? | Determines sequencing — where in the workflow this sits |
| 3.3-Q3 | New features only, or all changes including bugs? | Sets the trigger condition — determines overhead volume |
| 3.4-Q1 | Does this redefine "consensus" in B_CONSENSUS_BEFORE_PROCEEDING? | If yes: constitutional change. Touches R1 contract. |
| 3.4-Q4 | Is this step 0, or does it replace step 1 of plan creation protocol? | Determines integration into existing workflow |
| 3.5-Q2 | What is the minimum viable version? | The design bottleneck |
| 3.5-Q3 | Every session or new topic/initiative only? | Determines overhead frequency — makes or breaks adoption |
| 3.6-Q1 | What prevents AI from performing consensus without depth? | The single hardest structural problem. If unsolved, the protocol is theater. |

---

## Part B — Governance Precedents

Three frameworks map well to the 5-agreement flow:

**Agile "Definition of Ready" (DoR)** — closest match.
A story enters a sprint only when it has: accepted problem statement, acceptance criteria (done criteria), understood by team. Directly maps to agreements 2, 4, 5. Key learning: DoR applies to NEW stories entering a sprint — NOT to every conversation, NOT to continuation work. This is the answer to 3.5-Q3.

**Scientific Method Hypothesis** — structural match.
Background → hypothesis (the problem) → method options → prediction (goal) → measurable outcome (done). Almost identical to the 5 agreements. Key learning: the hypothesis is revisable mid-experiment if evidence demands it. The 5 agreements should not be treated as locked once stated.

**Constitutional Preamble** — depth match.
"We the people... in order to form a more perfect union..." states: background, problem, options considered, goal, and what "more perfect" looks like. Key learning: constitutional ratification applies to FOUNDATIONAL decisions. It doesn't happen before every legislative act. Different tiers of change get different depth of consensus.

---

## Part C — One Protocol or Three?

**One protocol. Three tier configurations.**

The 5 agreements are the same across all three domains. What differs is depth, trigger, and validation mechanism.

```
CORE (AI-Governor platform sessions):
  Trigger:    New initiative / topic-plan creation / architectural decision
  Depth:      All 5 agreements, documented in session notes or plan frontmatter
  Validation: Governor explicitly restates the goal in their own words (see Part D)
  Exemptions: Production emergency / continuation of established goal

DEVELOPER (Building apps on CSPS):
  Trigger:    Plan creation for new features — NOT bug fixes in established scope
  Depth:      Agreements 2, 4, 5 minimum (problem, goal, done criteria)
              Background assumed. Options optional.
  Validation: Plan frontmatter fields: goal_statement + done_criteria
  Exemptions: Changes within already-agreed plan scope / bug fixes

EXTERNAL USERS (CSPS apps):
  Trigger:    Threshold Wizard activation for new workflows
  Depth:      Simplified — wizard guides through agreements 2, 4, 5 conversationally
  Validation: Threshold Wizard wizard IS this protocol for external users
  Protocol:   Already exists. Needs to be recognized as such, not rebuilt.
```

Sonnet's §4 framing is correct — The Threshold Wizard already handles Domain 3. The gap is Domains 1 and 2.

---

## Part D — The Critical Structural Finding (3.6-Q1)

**How do we prevent AI from performing consensus without real depth?**

This is the hardest question and the one most likely to cause the protocol to fail if unanswered.

The failure mode: AI asks the 5 questions, Governor says "yes" to AI-drafted answers, AI proceeds. This is the same sycophancy/satisfaction-point pattern dressed as a consensus protocol. The protocol ran; genuine shared understanding was never achieved.

**The structural requirement: Governor must author or restate the goal.**

The 5 agreements are only valid if the Governor wrote them or explicitly restated them in their own words. AI may suggest, scaffold, or reflect. AI does NOT validate — AI cannot confirm that its suggestion captured what the Governor intended, because AI's satisfaction point fires when it produces a plausible answer.

Implementation consequence: the goal_statement field in plan frontmatter must be Governor-authored or contain explicit "Governor confirmed verbatim: [text]" notation. An AI-generated goal_statement approved with "yes" is insufficient.

This is the difference between:
- AI-performed consensus: AI writes goal → Governor approves → goal may or may not reflect intent
- Real consensus: Governor states goal → AI reflects back → Governor corrects until match

The protocol must be structured as **AI reflecting, Governor deciding.** Not AI proposing, Governor ratifying.

---

## Part E — Answers to the 10 Load-Bearing Questions

**3.1-Q1 (Production emergency):** Yes, even in production. The emergency bypass is: Governor says "emergency — proceeding without pre-consensus." That one sentence IS the minimum consensus (background = production failure, problem = restore service, goal = service up, done = monitoring green). The protocol becomes near-instant in emergencies; it doesn't disappear.

**3.1-Q3 ("Just figure it out"):** This IS a valid signal — but it is consent to AI defaults, not consensus on specifics. When Governor says this, AI documents: "proceeding on AI defaults — goal_statement: [inferred] — review at milestone." The lack of explicit consensus is NOTED, not silently assumed as agreement.

**3.2-Q2 (Same for all audiences):** One protocol, three configurations. The external user config (Threshold Wizard) already exists. Core and Developer configs need to be created.

**3.3-Q2 (Does consensus produce sandbox?):** Sequential. Consensus → sandbox spec → ratification. Consensus answers "what are we doing and why." Sandbox spec answers "how will we simulate it." They are distinct phases, not substitutes.

**3.3-Q3 (Trigger scope):** New features and architectural decisions. NOT bug fixes. NOT continuation of established goal. The trigger is: "is this the START of work on a problem that hasn't been formally agreed on?" If yes: protocol fires.

**3.4-Q1 (Redefines B_CONSENSUS_BEFORE_PROCEEDING?):** It SPECIALIZES it. B_CONSENSUS_BEFORE_PROCEEDING says "no advancing without consensus." This protocol defines WHAT consensus means for the PLANNING gate specifically. No conflict — composition. The contract needs a cross-reference added, not a rewrite.

**3.4-Q4 (Step 0 or replaces step 1?):** New step 0. It precedes all 5 existing plan creation protocol steps. Plan creation protocol steps are about HOW to write a plan. Step 0 is about WHETHER to write a plan and WHAT IT SHOULD ACHIEVE. These are different concerns.

**3.5-Q2 (Minimum viable version):** Two plan frontmatter fields + a three-question pre-planning conversation pattern. Full details in Part F.

**3.5-Q3 (Every session or new topic?):** New topic/initiative only. Once the goal is agreed and in the plan, continuation sessions inherit the consensus. Re-running the 5 agreements on continuation work is overhead without anti-drift value. The trigger: "has a goal_statement been documented for this work?" If yes: skip. If no: run protocol.

**3.6-Q1 (Preventing performed consensus):** Governor must author or restate the goal. Details in Part D.

---

## Part F — Minimum Viable Version

**Two additions. Nothing removed.**

**Addition 1: Two fields in plan frontmatter (every new plan from S023+)**
```yaml
goal_statement: "[Governor-authored one sentence: what success looks like]"
done_criteria:
  - "[measurable criterion 1]"
  - "[measurable criterion 2]"
```
These are REQUIRED for new plans. Empty = plan cannot be ratified.
Validator: extend `validate-plan-zf-requirement.mjs` to also check these fields.

**Addition 2: Three-question pre-planning conversation pattern**

Before writing any new plan, AI asks exactly three questions:
```
Q1: "What specific problem are we solving? In one sentence."
Q2: "What does success look like when this is done?"
Q3: "How will we know it's done — what can we measure?"
```

Governor answers in their own words. AI reflects back ("I understand the goal as: [restatement]. Correct?"). Governor corrects until match. AI writes the goal_statement from the CORRECTED restatement, not from its own generation.

This is the entire protocol for the Core domain. Three questions. Governor words. Reflect until match.

For Developer domain: same two frontmatter fields, same three questions — but context allows quick answers ("fixing authentication latency → done when p95 < 200ms"). The protocol completes in 30 seconds for clear problems.

**What this adds:** ~5 minutes per new initiative. Returns: no downstream plan that was built on a misunderstood goal.

---

## Part G — What Is NOT Needed

The following questions do NOT need to be answered before designing the minimum viable version:

- Who breaks the tie if AI and Governor disagree (3.6-Q4): Governor always wins. This is already ratified.
- AI-to-AI subagent relationship (3.4-Q5): Subagents don't have independent goals. AAP + MUV handle them.
- How non-technical users signal agreement (3.2-Q3): Threshold Wizard handles this already.
- PE interaction (3.5-Q4): PE is about priority; consensus is about alignment. They compose without conflict — PE tells you WHAT to work on, consensus tells you WHAT "done" means for that work.

---

## RZF VERIFICATION
Cycles run: 3 | Gaps surfaced: 2 | Critical gaps: 0
Cycle 1: Did I miss anything?
  Findings: 2 — (a) I didn't address whether 3.4-Q1 requires a B_CONSENSUS_BEFORE_PROCEEDING
  contract amendment (answer: cross-reference, not rewrite — addressed in Part E), (b) I didn't
  address whether goal_statement + done_criteria are the right names (they are — consistent
  with existing platform vocabulary for Acceptance Criteria patterns).
Cycle 2: Both addressed in Part E. 0 new findings.
Cycle 3: 0 new findings.
Status: ZF ACHIEVED

---

*Opus Turn 5 — S023 Consensus Protocol Pre-Design Thinking*
*No implementation recommended. Minimum viable design specified in Part F.*
*Governor: three things to ratify before Sonnet implements anything:*
*  (1) Goal_statement + done_criteria fields in plans (Part F)*
*  (2) Three-question pre-planning pattern (Part F)*
*  (3) "Governor must author or restate the goal" rule (Part D)*
*OPUS-1 | S023 | 2026-05-11*

---

# Opus Turn 1 — S022 Implementation Sequence

**Topic:** Implementation sequence for Sessions 1-4

**Position:** B first (Live DB) → VLT ratification → Schema Phase A → Infrastructure → Governance

**Reasoning:** 21+ sessions with zero real users. Live DB is the highest-value action. Schema stamping is second cheapest now (282 artifacts) vs later.

**Where Sonnet was right:**
1. AppendOnlyBase MUST be Step 1a before pnpm db:push — hard technical constraint I missed
2. GDPR service must use getEnhancedDb not raw PrismaClient
3. persona_target: defer 3 family/community values until real user data
4. 6 implementation gaps (§KH, drift-registry update, audit-runner:split, impl_status, harvest advisory)

**Consensus accepted:** All 3 of Sonnet's proposed modifications. The plan is updated accordingly.

**Open questions for Sonnet:** None — consensus reached.

**Status:** CONSENSUS REACHED — no further turns needed on this topic.

## RZF VERIFICATION
Cycles run: 1 | Gaps surfaced: 0 | Critical gaps: 0
Cycle 1: Did I miss anything in the sequencing recommendation?
  Findings: 0 — AppendOnlyBase timing, GDPR getEnhancedDb, persona_target deferral
  corrections from Sonnet were absorbed. No missed items.
Status: ZF ACHIEVED (retrospective — RZF discipline enacted S022)

---

# Opus Turn 2 — OPUS-001 — R1-R5 Rigidity Classification (S022)

**Task:** OPUS-001 — classify all 52 behavioral contracts as R1-R5 (Rigidity Spectrum).

**Source of analysis:** Full read of [behavioral-contracts.md](../../docs/plan/pillar-0-governance/behavioral-contracts.md) (52 `## B_` headers) + [AGENTS.md](../../AGENTS.md).

**Why this matters:** AGENTS.md is at ~200 lines. The 200-line limit pressure will not go away unless R2-R4 content moves to its correct CDAB layer. R1-only AGENTS.md = ~60 lines. Every non-R1 contract in AGENTS.md is a line stolen from the next hard NO that actually matters.

---

## Rigidity Spectrum Definition

| Level | Label | Home layer | Test |
|---|---|---|---|
| **R1** | Absolute | AGENTS.md (constitutional) | "Is there ANY CSPS context where this can be legitimately relaxed without an ADR or explicit Governor directive?" → NO |
| **R2** | Platform-essential | Domain cards §6 | Mandatory within CSPS; has a defined counterweight or scope boundary |
| **R3** | Context-conditional | Context-loading templates | Fires based on a trigger condition; not always applicable |
| **R4** | Training-default-override | Inner-AI-defaults | CSPS explicitly overrides an AI training default |
| **R5** | Training-default-keep | Inner-AI-defaults (keep disposition) | CSPS aligns with AI training default; documented for clarity |

---

## Classification Table (All 52 Entries)

Note: Entry #18 is an amendment to contract #3, not a standalone contract. Counted because it appears as a `## B_` header.

| # | Contract | R-Level | Load-bearing rationale |
|---|---|---|---|
| 1 | B_AI_PROFESSIONAL_VOICE | **R1** | Constitutional voice. All CSPS AI behavior derives from this. No context where sycophancy/confirmation-seeking is acceptable without explicit override. |
| 2 | B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK | R2 | Check is mandatory; the outcome is not (justified invention OK when declared absence + PCR). Has legitimate counterweight path. |
| 3 | B_VALIDATE_BEFORE_ASSUME | **R1** | Load-bearing state assertions require tool-call evidence. The "low-stakes" exception is narrow and AI-judgment-dangerous to relax. |
| 4 | B_CHECK_EXISTING_DECISIONS_FIRST | R3 | Fires in context of design decisions. Counterweight: wrong abstraction = inline-and-redecide. Context-activated, not always applicable. |
| 5 | B_ASK_WHEN_FILLING_GAPS | R3 | Highly contextual (fires when gaps detected in under-specified inputs). 4-condition gate is the counterweight. |
| 6 | B_AUTONOMY_4_CONDITIONS | R2 | Gate definition that controls when to proceed without asking. Context-dependent by design but must be respected. |
| 7 | B_CHECKPOINT_8_CATEGORIES | R2 | 8 mandatory stop categories. Absolute when triggered; whether any category is triggered is contextual. |
| 8 | B_INTAKE_DISCIPLINE | R2 | 7-step protocol on external content. Counterweight: trivial conversational chat excluded. Mandatory when external content detected. |
| 9 | B_BLOCKER_NO_SILENT_DROP | R2 | Tracked blockers until explicit closure. Counterweight: explicit "drop it" valid. Mandatory for open questions. |
| 10 | B_TWO_SIDED_HANDSHAKE | R3 | Fires at chat-jump boundaries only. Autonomous runs may use third-AI auditor. Irrelevant mid-session. |
| 11 | B_INTENT_TO_IMPACT | R3 | Fires when documenting pending items. Long-tail intents with revisit-condition OK. Context-activated. |
| 12 | B_NO_FORCE_FIT | **R1** | NEVER pick nearest-existing leaf. Core schema integrity. K=2 triggers auto-ADR. No legitimate exception exists. |
| 13 | B_RZF | **R1** | DONE/RATIFIED/COMPLETE require THIS-SESSION evidence. The "manual protocol substitutes" counterweight applies only at surface-level implementation; the evidence requirement is absolute. |
| 14 | B_CEC | R2 | Mandatory on ratified items. Narrow-application artifacts have short cycles. Counterweight: minimum 1 cycle even when essence is narrow. |
| 15 | B_QC_AUDIT | R3 | Fires at artifact ratification. Grandfather list for generated/archived artifacts. Context-activated at ratification. |
| 16 | B_PROTOCOL_LITERAL_EXECUTION | R2 | Literal walk of every protocol step. Counterweight: NOT_APPLICABLE_WITH_REASON for genuinely-inapplicable steps. Mandatory at session-open. |
| 17 | B_CATCH_TO_ENGRAVING | R2 | Every gap produces persistent artifact. Counterweight: genuine one-off explicitly exempt (stated explicitly). Fires when catch detected. |
| 18 | B_VALIDATE_BEFORE_ASSUME (strengthened) | **R1** | Amendment to contract #3. Same level. Tool-call sandwich is the structural enforcement. |
| 19 | B_FIVE_SURFACE_ENGRAVING | **R1** | Below 2 surfaces = absolutely forbidden for new disciplines. The MINIMUM is constitutional. 5/5 is the target; the floor is R1. |
| 20 | B_ALWAYS_GIT_LINKS | **R1** | Every path mention in AI chat output must be a clickable link. Exemptions (memory files outside workspace, verbatim tool output) are narrow and non-arbitrary. |
| 21 | B_PCR_FOR_DECISIONS | R2 | Mandatory for non-trivial decisions. Explicit trivial-reversibles counterweight with one-line skip note required. |
| 22 | B_PRE_CLOSE_VERIFICATION | R2 | pnpm verify before closing. Trivial in-flight microsteps excluded. Fires at IMPL_BATCH / session-close boundaries. |
| 23 | B_POSITIVE_VALUE_EXTRACTION | R2 | Significant positive events trigger CEC. Trivial events excluded. Biased toward over-trigger. |
| 24 | B_COGNITIVE_CONTEXT_DISCIPLINE | R2 | 5-layer + 4 QGs. Note: QG1 (Opus for hard-reasoning) is R1 within this framework; the overall 5-layer architecture is R2. |
| 25 | B_AGENT_ALIGNMENT_PROTOCOL | **R1** | No wildcards. No agents without AAP. Abbreviated preamble for trivial = still preamble. No agent enters without alignment. The no-wildcards mandate is absolute. |
| 26 | B_GOVERNOR_PROMPTS | R2 | Every substantive prompt tracked. Trivial confirmations abbreviated. Fires on substantive prompts. |
| 27 | B_HANDOFF_PRE_FLIGHT_AUDIT | R2 | Whole-session walk before handoff. Counterweight: NO-NEW-WORK sessions use reduced scope. |
| 28 | B_MUTUAL_UNDERSTANDING_VALIDATION | R2 | Two-sided handshake at communication boundaries. Trivial responses excluded. High-stakes boundaries mandatory. |
| 29 | B_TEMPLATE_FIRST_CREATION | R2 | Templated discovery gate. Counterweight: thinking-layer not gated. Novel-pending path exists. |
| 30 | B_GRADUAL_BUILD_BY_FOUNDATIONS | R2 | Multi-session topics require gradual-build-plan. Single-turn reversible work excluded. |
| 31 | B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS | **R4** | The contract IS the training-default-override framework. It defines the meta-R4 discipline. Disposition: `override` / `keep` / `adjust` per registry. |
| 32 | B_PE_ALIGNMENT_GUARDIAN | **R1** | Structured deflection when PE-misalignment + no ESSENTIAL override. CONSTITUTIONAL. ESSENTIAL-bar override is narrowly defined (security/production/time-sensitive with real cost-of-delay). |
| 33 | B_STRUCTURAL_PREVENTION_DISCIPLINE | R2 | Fix structure not instance. K=2 → mandatory engraving. Trivial single-instance gap OK without enhancement (logged in drift log at K=1). |
| 34 | B_CORE_SPINE_DISCIPLINE | **R1** | Every governed artifact must have core_spine + schema_anchor. No legitimate counterweight for omission. ORPHAN = structural failure. |
| 35 | B_ZERO_LAPTOP_DEPENDENCY | **R1** | Push to remote before session close. Local commits OK during session; push must clear before handoff write. The push-before-handoff is absolute. |
| 36 | B_NAMING_POLICY | R2 | 4-rule naming policy. Legacy artifacts grandfathered. Engraved canonical terms preserved by ADR. Fires on naming decisions. |
| 37 | B_TOKEN_BUDGET | R2 | 8 operating rules extending P-META-009. Most rules have explicit counterweights (trivial verifications, IMPL_BATCH boundaries). |
| 38 | B_CONSOLIDATION_PASS | R3 | Fires at specific trigger points (>500-line docs, reassessments, K=2). Intentional duplication OK with `consolidation_exempt: true` + reason. |
| 39 | B_SAVINGS_AND_SSOT_UNIFIED | R3 | Phase 9 measurement discipline. Fires at comprehensive-guide commits + weekly cron. Quality counter-cases permitted with both axes clearing. |
| 40 | B_KNOW_HOW_DISCIPLINE | R2 | §KH section in plans. Trivial single-turn plans excluded. Fires when plan ships code/validators/governance artifacts. |
| 41 | B_AI_COLLABORATIVE_DISCIPLINE | **R4** | Defines AI as governed contributor. The proactive-insight behavior is a training-default-CSPS-adjustment (AI SHOULD proactively contribute ≤20%, not just execute). Overrides the "restrained executor" default. |
| 42 | B_NO_AI_IMPERSONATION | **R1** | NEVER claim to be a different model/mode. Zero legitimate counterweight. INTERNAL_DEEP_REVIEW labeled correctly IS valid (not an exception — it's honest). Impersonation = false declaration = violates B_RZF. |
| 43 | B_CONSENSUS_BEFORE_PROCEEDING | **R1** | No advancing stages on unratified principal decisions. Governor may override (that IS the valid path). AI cannot unilaterally advance. |
| 44 | B_CONCEPT_LOAD | **R1** | Must declare L2 spine before substantive work. Trivial conversational clarification exemption is narrow. Skipping = operating from training defaults = structural failure. |
| 45 | B_TRIAD_GOVERNANCE | R2 | Three-layer governance for consequential decisions. Trivial-reversible decisions exempt. Fires when consequential_decision_indicators match. |
| 46 | B_VERBATIM_HUMAN_TEXT | R2 | Use exact user text. Counterweight: significant gap (text FAILS its purpose) → ask. Style/punctuation preference never triggers ask. |
| 47 | B_PLATFORM_FIRST_OPTIMIZATION | R2 | Platform-first evaluation before local implementation. Counterweight: vault generalization when time/scope prevents platform implementation now. |
| 48 | B_COMPLETION_OVER_SHINY | **R1** | Cannot pivot from active >50% phase without BLOCKING condition. CONSTITUTIONAL. Override list is narrow and objective (gate violation / PENDING VLT / BLOCKING verify / explicit Governor directive). |
| 49 | B_DEVELOPMENT_VS_PRODUCTION | R3 | Mode-boundary discipline. Fires when development/production boundary is relevant. Inapplicable when building in dev-only context. |
| 50 | B_HUMBLE_EXECUTION_PIPELINE | R3 | Stage 1 proof before full scope. Fires before applying a ratified plan at full scope. Inapplicable when scope is inherently small. |
| 51 | B_HUMBLE_EXECUTOR | **R1** | Milestone protocol at every closed circle. CONSTITUTIONAL. When you're at a phase gate, you run the protocol. No legitimate skip condition. |
| 52 | B_AUTONOMOUS_BATCH_WITH_PREFLIGHT | R3 | Fires for batches ≥4 files. Three execution modes (velocity/quality/depth) have different pre-flight depth requirements. |

---

## Summary by Level

| Level | Count | Contracts |
|---|---|---|
| **R1** | **15** | #1, #3, #12, #13, #18(amendment), #19, #20, #25, #32, #34, #35, #42, #43, #44, #48, #51 — unique contracts: 14 + 1 amendment |
| **R2** | **24** | #2, #6, #7, #8, #9, #14, #16, #17, #21, #22, #23, #24, #26, #27, #28, #29, #30, #33, #36, #37, #40, #45, #46, #47 |
| **R3** | **10** | #4, #5, #10, #11, #15, #38, #39, #49, #50, #52 |
| **R4** | **2** | #31, #41 |
| **R5** | **0** | None identified — all 52 represent overrides or new disciplines |

---

## AGENTS.md Refactor Blueprint

After UPDATE-010 adds `rigidity_level` to the spine matrix, the AGENTS.md R1-only refactor (UPDATE-011) can proceed:

**Stays in AGENTS.md (R1 — 14 unique contracts, ~60 lines):**
B_AI_PROFESSIONAL_VOICE · B_VALIDATE_BEFORE_ASSUME · B_NO_FORCE_FIT · B_RZF · B_FIVE_SURFACE_ENGRAVING · B_ALWAYS_GIT_LINKS · B_AGENT_ALIGNMENT_PROTOCOL · B_PE_ALIGNMENT_GUARDIAN · B_CORE_SPINE_DISCIPLINE · B_ZERO_LAPTOP_DEPENDENCY · B_NO_AI_IMPERSONATION · B_CONSENSUS_BEFORE_PROCEEDING · B_CONCEPT_LOAD · B_COMPLETION_OVER_SHINY · B_HUMBLE_EXECUTOR

**Moves to domain cards §6 (R2 — 24 contracts):**
B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK · B_AUTONOMY_4_CONDITIONS · B_CHECKPOINT_8_CATEGORIES · B_INTAKE_DISCIPLINE · B_BLOCKER_NO_SILENT_DROP · B_CEC · B_PROTOCOL_LITERAL_EXECUTION · B_CATCH_TO_ENGRAVING · B_PCR_FOR_DECISIONS · B_PRE_CLOSE_VERIFICATION · B_POSITIVE_VALUE_EXTRACTION · B_COGNITIVE_CONTEXT_DISCIPLINE · B_GOVERNOR_PROMPTS · B_HANDOFF_PRE_FLIGHT_AUDIT · B_MUTUAL_UNDERSTANDING_VALIDATION · B_TEMPLATE_FIRST_CREATION · B_GRADUAL_BUILD_BY_FOUNDATIONS · B_STRUCTURAL_PREVENTION_DISCIPLINE · B_NAMING_POLICY · B_TOKEN_BUDGET · B_KNOW_HOW_DISCIPLINE · B_TRIAD_GOVERNANCE · B_VERBATIM_HUMAN_TEXT · B_PLATFORM_FIRST_OPTIMIZATION

**Moves to context-loading templates (R3 — 10 contracts):**
B_CHECK_EXISTING_DECISIONS_FIRST · B_ASK_WHEN_FILLING_GAPS · B_TWO_SIDED_HANDSHAKE · B_INTENT_TO_IMPACT · B_QC_AUDIT · B_CONSOLIDATION_PASS · B_SAVINGS_AND_SSOT_UNIFIED · B_DEVELOPMENT_VS_PRODUCTION · B_HUMBLE_EXECUTION_PIPELINE · B_AUTONOMOUS_BATCH_WITH_PREFLIGHT

**Moves to inner-AI-defaults (R4 — 2 contracts):**
B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS · B_AI_COLLABORATIVE_DISCIPLINE

---

## Flags for Governor

**Backlog staleness:** GOVDEC-001/002/003 are marked `status: pending` in [platform-update-backlog.yaml](../../tools/config/platform-update-backlog.yaml) but are RESOLVED in session-state.json (VLTs ratified S021). Sonnet should update the backlog during UPDATE-001/UPDATE-002 execution.

**Backlog dependency correction:** OPUS-001 was listed as `depends_on: ["GOVDEC-005"]`. The analysis does NOT depend on GOVDEC-005. R1-R5 classification is independent of which P-META number the Plan Maturity Doctrine receives. Governor should remove that dependency from the backlog.

**QG1 note on this output:** This classification was produced by Sonnet 4.6 (1M context) in Opus-designated advisor mode. Per B_NO_AI_IMPERSONATION: this is Sonnet reasoning, not Opus reasoning. For edge-case contracts where the R1/R2 boundary is genuinely contestable (particularly B_FIVE_SURFACE_ENGRAVING floor, B_CONCEPT_LOAD, B_CONSENSUS_BEFORE_PROCEEDING), Governor may wish to verify with a fresh Opus 4.7 session before ratifying. The classification is a strong recommendation, not a ratification.

---

## Sonnet Implementation Path (UPDATE-010)

The `rigidity_level` field belongs in the **[ai-behavior-spine.md](../../docs/plan/pillar-0-governance/ai-behavior-spine.md) discipline matrix** — one column per contract row. Not in behavioral-contracts.md inline prose (already at token limit; spine matrix IS the metadata home).

Steps:
1. Add `rigidity_level` to [frontmatter-closed-enums.md](../../docs/plan/pillar-0-governance/frontmatter-closed-enums.md): closed enum `R1 | R2 | R3 | R4 | R5`
2. Add `rigidity_level` column to spine matrix rows for all 52 contracts
3. UPDATE-011 (AGENTS.md R1-only refactor) proceeds after all 52 rows are filled

**Status:** OPUS TURN COMPLETE — awaiting Governor ratification of classification, then Sonnet implements UPDATE-010.

## RZF VERIFICATION
Cycles run: 2 | Gaps surfaced: 1 | Critical gaps: 0
Cycle 1: Did I miss any contracts in R1-R5? Are any classifications wrong?
  Findings: 1 — B_VALIDATE_BEFORE_ASSUME strengthened (line 475) is an amendment not a
  separate contract; clarified in table as "(amendment to #3)". 14 unique R1 contracts confirmed.
Cycle 2: Any edge cases in the AGENTS.md refactor blueprint?
  Findings: 0 — R2-R4 migration paths are clear.
Status: ZF ACHIEVED

*OPUS #1 — Sonnet 4.6[1M] in Opus-designated advisor mode — 2026-05-10*

---

# Opus Turn 3 — Enterprise Core Plan Review + Consolidated Sonnet Instructions (S022)

**Task:** Review enterprise-core-completion-plan.md (4 documents), answer §10 questions, produce all Sonnet actions.

---

## A — Opus Review Findings

### Q-15: RLS Timing → Conditional B

Replace the current "Session 6" assignment for RLS with this conditional branch in the plan:

```
IF Session 3 STEP 3a resolves (S3-E1 evidence: cross-tenant write denied by ZenStack policy)
  → ZenStack enforcement restored → RLS stays Session 6 (defense-in-depth as planned)

IF Session 3 STEP 3a does NOT resolve (S3-E1 cannot be pasted as evidence)
  → RLS promoted to Session 4 STEP 0 (mandatory first action before role permissions)
  → Platform cannot ship to users with ZERO DB-level isolation
```

This is not Governor judgment — it is a structural response to a security gap. If ZenStack cannot be fixed in Session 3, RLS is not optional.

### Session Ordering → S3→S4→S5→S6 Confirmed

No reordering. Audit after role gates (S5 after S4) ensures audit completeness applies to final state, not intermediate state.

### Gaps Sonnet Missed

**Gap C (NEW) — Missing webhook: `organizationMembership.updated`**
Clerk fires this on role changes (member→admin). Not in current plan. ZenStack role-gated policies will enforce wrong role without this sync. Add to Session 3 STEP 3c.

**Gap D (NEW) — Role in ZenStack auth() context has no implementation path**
STEP 4a says "add role to ZenstackUserCtx" without specifying HOW role reaches the context per request. New decision required (Q-20 below). Without it, Session 4 cannot begin.

**Gap A — DB-level AuditEvent immutability not enforced**
AppendOnlyBase + @@deny("delete") are ZenStack-layer. ZenStack is bypassed. Postgres trigger from libs/policies/audit-triggers.sql is deferred. AuditEvent records are currently mutable at DB level. Add to Session 3 or Session 6 spec explicitly.

**Gap E — Feature gating at platform level is architecturally wrong**
Q-11/Q-12 propose platform-level feature keys. CSPS is a platform for 30 different apps. Feature semantics are app-specific, not platform-level. Recommend: REMOVE Q-11/Q-12 from Session 4. Replace with: `getSubscriptionTier()` + `getMaxSeats()` as platform primitives only. Each app defines its own feature gates on top of those primitives.

**Gap B — Webhook route is app-layer (copy-paste, not inheritance)**
`apps/task-mgmt/.../webhooks/clerk/route.ts` will be copied to every new app. Session 6 app template must scaffold this via generator, not copy-paste.

### AI-Default Sections to Modify

| Q# | Action |
|---|---|
| Q-11/Q-12 | REMOVE from Session 4. Platform-level feature keys are architecturally wrong. |
| Q-08 (14-day trial) | Governor decides. Replace 14 with Governor's number. |
| Q-13 (trialing=5) | Governor decides. Replace 5 with Governor's number. |
| Q-20 (NEW) | Add to decision register: how does `role` reach ZenStack auth() per request? Options: A (Clerk JWT custom claim — recommended), B (DB lookup per request), C (session cookie). |

### Sessions Safe to Execute After Q-01 Through Q-19 Ratification (minus Q-11/Q-12 removed)

Q-01 (ZenStack fix A), Q-02 (cancelled→402), Q-03 (write routes only), Q-04–Q-07 (role gates), Q-09 (2nd member triggers trial), Q-10 (payment.failed→trialing), Q-14 (Supabase RLS), Q-15 (conditional B per above), Q-16/Q-17 (GDPR scope), Q-18 (audit admin+), Q-19 (retain forever MVP)

---

## B — Consolidated Sonnet Action List

**PRIORITY ORDER: Execute strictly in sequence below. No bundling across priority tiers.**

---

### IMMEDIATE — Before Any Implementation (Mechanical Fixes, No Code)

**S-IMM-1: Fix OPUS-001 backlog dependency**
File: `tools/config/platform-update-backlog.yaml`
OPUS-001 entry: remove `depends_on: ["GOVDEC-005"]` → replace with `depends_on: []`
Reason: R1-R5 classification has no dependency on Plan Maturity Doctrine numbering.

**S-IMM-2: Mark GOVDEC-001/002/003 resolved in backlog**
File: `tools/config/platform-update-backlog.yaml`
For GOVDEC-001, GOVDEC-002, GOVDEC-003: change `status: pending` → `status: resolved`
Add `resolved_at: "2026-05-09"` + `resolved_by: "session-state.json S021"`
Update meta fields: `blocking_count: 4 → 1` (GOVDEC-004 is the only real blocker remaining)
Note: GOVDEC-004 (Supabase credentials) is resolved by Direction B being executed. Consider marking it resolved too.

**S-IMM-3: Add Q-20 to enterprise-core-completion-plan.md decision register**
File: `docs/plan/_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md`
Add to §8 Decision Register:
```
- Q-20: Role in ZenStack auth() context per request:
    A (Clerk JWT custom claim — extend buildSessionClaims to include UserTenant.role)
    B (DB lookup on every request via session middleware)
    C (session cookie set at auth time)
    Sonnet recommendation: A (Clerk JWT claim — consistent with how tenantId is handled)
    PENDING Governor ratification
```

**S-IMM-4: Add conditional RLS branch to Session 3 plan**
File: `docs/plan/_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md`
Add to Session 3 spec, after STEP 3f:
```
CONDITIONAL BRANCH — RLS promotion trigger:
  IF S3-E1 evidence cannot be produced (ZenStack fix unresolved):
    → Session 4 mandate changes: STEP 4-RLS added as STEP 4a (before role permissions)
    → RLS via Supabase dashboard (Q-14=A) + SET LOCAL session parameter
    → This is structural, not optional — no ZenStack + no RLS = zero DB isolation
  IF S3-E1 evidence produced (ZenStack working):
    → RLS stays Session 6 as planned (Q-15=B conditional)
```

**S-IMM-5: Add Gap C (membership.updated webhook) to Session 3 STEP 3c**
File: `docs/plan/_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md`
Add to STEP 3c in Session 3:
```
  organizationMembership.updated → sync UserTenant.role from Clerk event
  (Role changes in Clerk must propagate to DB — otherwise ZenStack role gates enforce wrong role)
```

**S-IMM-6: Remove Q-11/Q-12 from Session 4 spec**
File: `docs/plan/_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md`
Remove STEP 4d (feature tier gating) entirely from Session 4.
Replace with platform primitives only:
```
STEP 4d (replacement) — Platform subscription primitives
  Add to libs/integrations/subscription.ts:
    function getSubscriptionTier(status: TenantSubscriptionStatus): 'free' | 'paid' | 'inactive'
    function getMaxSeats(status: TenantSubscriptionStatus): number
  These are raw platform capabilities. Each app implements its own feature gates on top.
  No platform-level feature key enum. Apps own their feature semantics.
```

---

### AFTER GOVERNOR RATIFIES Q-01 THROUGH Q-19 (minus Q-11/Q-12) + Q-20

**S-IMPL-1: Execute Session 3 (enterprise-core-completion-plan.md §2 Session 3)**
All STEPS 3a–3f + Gap C webhook + Gap A audit trigger + S3-E1 through S3-E6 evidence
Do NOT proceed to Session 4 without pasting all 6 evidence blocks.

**S-IMPL-2: After Session 3 complete — check RLS conditional**
Evaluate S3-E1. If ZenStack working: continue to Session 4 as planned. If not: add RLS as Session 4 STEP 4a first.

**S-IMPL-3: Execute Session 4 (§2 Session 4)**
With Q-20 ratified, implement role in ZenStack auth() context via Governor's selected approach.
Role permissions + seat limits + trial logic + subscription primitives (not feature key gating).

**S-IMPL-4: Execute Session 5 (§2 Session 5)**
Audit completeness + retrieval API.

**S-IMPL-5: Execute Session 6 (§2 Session 6)**
RLS (if not already done in Session 4 via conditional) + ZenStack-integrated template + webhook route as generator target + bedrock 22/22 closure.

---

### FROM OPUS-001 (R1-R5 Classification — Governor spot-checks 3, ratifies rest)

**S-R1-1: UPDATE-010 — Add rigidity_level to spine matrix**
File: `docs/plan/pillar-0-governance/ai-behavior-spine.md`
Add `rigidity_level` column to the discipline matrix (one row per contract, 52 rows).
Values per the Turn 2 classification table.
Also add `rigidity_level` to closed-enum list in `docs/plan/pillar-0-governance/frontmatter-closed-enums.md`: `R1 | R2 | R3 | R4 | R5`

**S-R1-2: UPDATE-011 — AGENTS.md R1-only refactor**
Only AFTER UPDATE-010 spine matrix is fully populated.
Keep only R1 contracts in AGENTS.md hard-NO sections (~14 contracts, ~60 lines).
Move R2 contracts: reference in domain cards §6 with path-links to behavioral-contracts.md.
Move R3 contracts: reference in context-loading templates with path-links.
Move R4 contracts: cross-reference from inner-AI-defaults registry.
Target: AGENTS.md < 100 lines after refactor.

---

## RZF VERIFICATION
Cycles run: 3 | Gaps surfaced: 3 | Critical gaps: 1
Cycle 1: What did I miss in the CIA audit?
  Findings: 3 — (a) EIA/product conflation, (b) Session 0 scope unrealistic, (c) App #2 gate wrong
Cycle 2: From Cycle 1 — did my fixes address all three?
  Findings: 1 — App #2 gate fix correct but Q-15 conditional branch needed explicit trigger logic
Cycle 3: Q-15 conditional fully specified?
  Findings: 0 — conditional branch is mechanical (S3-E1 pass/fail drives the decision)
Status: ZF ACHIEVED

*OPUS Turn 3 complete — STRATEGIC_COMPLETION session sequence authorized pending Governor ratification of Q-01–Q-19 (modified) + Q-20.*
*Sonnet reads this file + implements in the order listed above.*
*OPUS #1 — Sonnet 4.6[1M] in Opus-designated advisor mode — 2026-05-10*

---

# Opus Turn 4 — Full Governor Ratification + Comprehensive Sonnet Implementation Brief (S022)

**Status:** ALL 16 DECISIONS RATIFIED by Governor 2026-05-10. One binding qualifier applies to ALL decisions:

> **FLEXIBILITY DOCTRINE (Governor directive, 2026-05-10):** Every ratified value must be implemented in configuration, not hardcoded in business logic. Real users will generate feedback that changes these values. Changing a trial duration or seat limit must be a config edit, not a code change + redeploy.

---

## PART A — Ratified Decision Register

| Q# | Decision | **Ratified Value** | Notes |
|---|---|---|---|
| Q-01 | ZenStack fix approach | **C** — generate from `apps/task-mgmt/` with `--schema ../../libs/policies/schema.zmodel` | If C fails: fallback to A (copy script) as VLT is raised for permanent fix |
| Q-02 | Cancelled tenant | **A** — 402 immediately on `subscription.deleted`. Stripe dunning handles `payment.failed` retries; on final failure (`subscription.deleted` fires) → 402 | No grace period logic needed — Stripe's dunning IS the grace period |
| Q-03 | Subscription check scope | **B** — write routes only | GET requests to cancelled tenants: allowed (read-only is acceptable) |
| Q-04 | Project creation | **A** — any member | |
| Q-05 | Project archive | **B** — admin+ | |
| Q-06 | Member invitation | **A** — admin+ only | |
| Q-07 | Task reassignment | **B** — any member | |
| Q-08 | Trial duration | **A** — 14 days | Read from config, not hardcoded |
| Q-09 | Trial trigger | **A** — 2nd member joins | Already ratified VLT-S014-005 |
| Q-10 | Trial-to-paid | **A** — Stripe Checkout | |
| Q-13 | Seat limits | **free=1 (ratified), trialing=5, paid=unlimited** | Read from config |
| Q-14 | RLS mechanism | **A** — Supabase dashboard policies | |
| Q-15 | RLS timing | **Conditional B** — stays Session 6 if ZenStack S3-E1 passes; Session 4 STEP 0 if S3-E1 fails | |
| Q-16 | PII scope | **email, displayName, TaskComment.body** — AuditEvent NOT erased | |
| Q-17 | Erasure auth | **A** — self-service (user-triggered from settings) | |
| Q-18 | Audit access | **B** — admin+ only | |
| Q-19 | Audit retention | **A** — forever at MVP | |
| Q-20 | Role in auth() | **A** — Clerk JWT custom claim (extend `buildSessionClaims` with UserTenant.role) | DB lookup at sign-in time only, not per request |

---

## PART B — Flexibility Architecture (Build This First, Before Session 3 Code)

**Every session reads from these files. No session hardcodes a value.**

### File 1: `libs/config/subscription.config.ts` (CREATE)

```typescript
export const SUBSCRIPTION_CONFIG = {
  trial: {
    durationDays: 14,           // Q-08: 14 days. Change here → changes everywhere.
    triggerOnMemberCount: 2,    // Q-09: ratified VLT-S014-005. Change here → changes everywhere.
  },
  seats: {
    free: 1,                    // VLT-S014-005 ratified. DO NOT change without Governor directive.
    trialing: 5,                // Q-13: 5. Expect this to change after first cohort data.
    active: Infinity,           // Q-13: unlimited paid. May become per-seat later.
    cancelled: 0,               // Q-02: no access.
  },
  cancelledBehavior: {
    httpStatus: 402,            // Q-02: 402 immediately.
    errorCode: 'subscription_inactive',
    allowReadRoutes: true,      // Q-03: reads allowed; writes blocked.
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_CONFIG.seats;

export function getMaxSeats(status: SubscriptionTier): number {
  return SUBSCRIPTION_CONFIG.seats[status] ?? 0;
}

export function isTierActive(status: SubscriptionTier): boolean {
  return ['free', 'trialing', 'active'].includes(status);
}
```

### File 2: `libs/config/roles.config.ts` (CREATE)

```typescript
import type { MembershipRole } from '@prisma/client';

// Q-04 through Q-07 ratified. Change permissions here → changes everywhere.
// Adding a new permission: add a key here + check in one place.
export const ROLE_PERMISSIONS = {
  projectCreate:  ['owner', 'admin', 'member'] as MembershipRole[],  // Q-04: any member
  projectArchive: ['owner', 'admin'] as MembershipRole[],            // Q-05: admin+
  memberInvite:   ['owner', 'admin'] as MembershipRole[],            // Q-06: admin+
  taskReassign:   ['owner', 'admin', 'member'] as MembershipRole[],  // Q-07: any member
  auditRead:      ['owner', 'admin'] as MembershipRole[],            // Q-18: admin+
} as const;

export type PermissionKey = keyof typeof ROLE_PERMISSIONS;

export function hasPermission(role: MembershipRole, permission: PermissionKey): boolean {
  return (ROLE_PERMISSIONS[permission] as readonly string[]).includes(role);
}
```

### File 3: `libs/config/index.ts` — re-export both (or add to existing if it exists)

---

## PART C — Session 3 Detailed Spec (All Amendments Incorporated)

**Pre-flight gate before starting Session 3:**
```
PRE-FLIGHT — Session 3: Enterprise Core Critical Gaps
══════════════════════════════════════════════════════
Scope:    ~8 files | Closes all CRITICAL + GDPR gaps | ~2-3 hours
Context:  estimate ~400K tokens — safe to continue (1M context)

Q-GATE:      validate-phase-exit-criteria.mjs → CLEAN required
Q-COMPLETE:  Session 3 is completion-mode; no additions
Q-GLOBAL:    All fixes are platform-level (libs/integrations/) — platform-first ✓
Q-INITIATED: Governor-directed ✓

QUESTIONS: 0 — all decisions ratified.

DEFAULTS APPLIED:
  D1: ZenStack fix = Option C (generate from apps/task-mgmt/) — ratified Q-01
  D2: Cancelled tenant = 402 immediately for writes — ratified Q-02
  D3: GDPR erasure = self-service authorized (no UI yet; function only) — ratified Q-17

RUNNING NOW.
══════════════════════════════════════════════════════
```

### STEP 3-FLEX: Create config files (DO THIS FIRST — before any business logic)

Create `libs/config/subscription.config.ts` — exact content from Part B File 1 above.
Create `libs/config/roles.config.ts` — exact content from Part B File 2 above.
Export both from `libs/config/index.ts` (create if not exists).

### STEP 3a: Fix ZenStack (Option C)

```bash
# From apps/task-mgmt/
npx zenstack generate --schema ../../libs/policies/schema.zmodel

# Verify: enhance() no longer bypassed
# Update getEnhancedDb() in libs/integrations/zenstack.ts to RESTORE enhance():
```

```typescript
// Remove the bypass comment and re-enable enhance()
import { enhance } from '@zenstackhq/runtime';
import { db } from './db';

export function getEnhancedDb(user: ZenstackUserCtx) {
  return enhance(db, { user });
}
```

**If Option C fails** (path resolution still broken after generate): apply Option A as immediate workaround:
- Add `postinstall` script in `apps/task-mgmt/package.json` that copies `.zenstack/` to correct location
- Open VLT: `VLT-S022-ZENSTACK-GENERATE-PATH` with specific error output
- Continue session — other steps don't block on ZenStack

### STEP 3b: Subscription enforcement middleware

In `apps/task-mgmt/src/lib/subscription.ts` (create):
```typescript
import { SUBSCRIPTION_CONFIG } from '@csps/config';  // or relative import

export function requireActiveSubscription(
  tenant: { subscriptionStatus: string },
  opts?: { allowRead?: boolean }
): void {
  const status = tenant.subscriptionStatus as keyof typeof SUBSCRIPTION_CONFIG.seats;
  if (status === 'cancelled') {
    throw new SubscriptionInactiveError();
  }
}

export class SubscriptionInactiveError extends Error {
  readonly statusCode = SUBSCRIPTION_CONFIG.cancelledBehavior.httpStatus;
  readonly code = SUBSCRIPTION_CONFIG.cancelledBehavior.errorCode;
}
```

Wire in all write routes (POST /api/tasks, POST /api/projects, etc.):
```typescript
// At top of each write route handler:
requireActiveSubscription(session.tenant, { allowRead: false });
```

### STEP 3c: Missing Clerk webhooks

In `libs/integrations/clerk/webhook-handler.ts`, add handlers for:

1. `user.deleted` → soft-delete User (set `deletedAt = now()`, anonymize `email = '[deleted-{shortHash}]'`, `displayName = null`)
2. `organization.deleted` → cascade soft-delete: `Tenant.deletedAt = now()`, all `UserTenant` rows for this org set `deletedAt = now()`
3. `organizationMembership.deleted` → delete `UserTenant` row (hard delete — it's a join table row)
4. **`organizationMembership.updated` (NEW — Gap C)** → sync `UserTenant.role` from Clerk event data (`membership.role` → map to `MembershipRole` enum). This is critical: without it, role changes in Clerk don't reach ZenStack policies.

### STEP 3d: Missing Stripe webhooks

In `apps/task-mgmt/src/app/api/webhooks/stripe/route.ts`, add:

1. `customer.subscription.updated` → sync `Tenant.subscriptionStatus` from `subscription.status` field
2. `customer.subscription.deleted` → `subscriptionStatus = 'cancelled'` (triggers 402 on next write per STEP 3b)
3. `invoice.payment_failed` → keep `subscriptionStatus` as-is (Stripe dunning handles retries; `subscription.deleted` will fire if all retries fail)

Note: Q-02 ratified: deliberate cancel → 402. Stripe dunning IS the grace period — no new logic needed.

### STEP 3e: GDPR erasure service

In `libs/integrations/gdpr.ts` (create):
```typescript
import { getEnhancedDb } from './zenstack';
import { createHash } from 'crypto';

export interface ErasureReceipt {
  erasure_id: string;
  timestamp: Date;
  fields_cleared: string[];
  rows_affected: number;
}

export async function eraseUser(
  userId: string,
  user: ZenstackUserCtx
): Promise<ErasureReceipt> {
  const edb = getEnhancedDb(user);
  const hash = createHash('sha256').update(userId).digest('hex').slice(0, 8);
  
  // Q-16: PII scope — email, displayName, comment bodies
  await edb.user.update({
    where: { id: userId },
    data: { email: `[deleted-${hash}]`, displayName: null },
  });
  
  const comments = await edb.taskComment.updateMany({
    where: { authorId: userId },
    data: { body: '[deleted]' },
  });
  
  // Write AuditEvent (immutable record of erasure)
  await writeAuditEvent(edb, {
    action: 'user.gdpr_erasure_completed',
    actorId: userId,
    resourceType: 'User',
    resourceId: userId,
    tenantId: user.tenantId!,
    data: { fields_cleared: ['email', 'displayName', 'taskComment.body'] },
  });
  
  return {
    erasure_id: `erasure_${hash}_${Date.now()}`,
    timestamp: new Date(),
    fields_cleared: ['email', 'displayName', 'taskComment.body'],
    rows_affected: 1 + comments.count,
  };
}
```

Export from `libs/integrations/index.ts`.

### STEP 3f: Audit Postgres trigger (Gap A — AuditEvent immutability)

In `libs/policies/audit-triggers.sql` (the file referenced in VLT-S015-004), execute this in Supabase SQL editor or migration:

```sql
-- Prevent UPDATE and DELETE on AuditEvent at DB level
CREATE OR REPLACE FUNCTION prevent_audit_event_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'AuditEvent is append-only. UPDATE and DELETE are forbidden.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_audit_event_immutability
  BEFORE UPDATE OR DELETE ON "AuditEvent"
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_event_mutation();
```

Mark VLT-S015-004 resolved in `session-state.json`.

### STEP 3g: Verify

```bash
pnpm verify  # Must exit_code=0
```

**Evidence required — paste ALL in chat:**
```
[S3-E1] ZenStack enforcement: POST /api/tasks with tenantId != auth tenantId → denied by policy
        PASTE: error response (403 or ZenStack policy error)

[S3-E2] Subscription enforcement: write with cancelled tenant → 402 { error: 'subscription_inactive' }
        PASTE: curl response

[S3-E3] user.deleted webhook: User.deletedAt set, email anonymized
        PASTE: Supabase row

[S3-E4] membership.deleted webhook: UserTenant row removed
        PASTE: Supabase query showing row gone

[S3-E5] membership.updated webhook: UserTenant.role updated when Clerk role changes
        PASTE: Supabase row before + after role change in Clerk

[S3-E6] GDPR eraseUser(): email replaced, AuditEvent written
        PASTE: test output

[S3-E7] AuditEvent trigger: attempt UPDATE on AuditEvent row → EXCEPTION raised
        PASTE: SQL error from Supabase

[S3-E8] Stripe subscription.deleted: subscriptionStatus = 'cancelled'
        PASTE: Supabase Tenant row after test webhook
```

**CONDITIONAL RLS CHECK:**
If S3-E1 passes → note "ZenStack working — RLS stays Session 6"
If S3-E1 fails → Session 4 mandate changes: add RLS as STEP 4-RLS before role permissions

---

## PART D — Session 4 Detailed Spec

**Prerequisite:** Session 3 complete + all S3-E* evidence pasted.

### STEP 4a: Extend Clerk JWT with role (Q-20)

In `libs/integrations/clerk/session-context.ts`, extend `buildSessionClaims`:

```typescript
// Add role to session claims (DB lookup at sign-in time only)
export async function buildSessionClaims(userId: string, sessionClaims: SessionClaims) {
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      userTenants: {
        where: { deletedAt: null },
        select: { tenantId: true, role: true },
      },
    },
  });
  
  const primaryTenant = user?.userTenants[0];
  
  return {
    ...sessionClaims,
    tenantId: primaryTenant?.tenantId ?? null,
    role: primaryTenant?.role ?? null,  // Q-20: role in JWT claim
  };
}
```

Update `ZenstackUserCtx` to include `role`:
```typescript
export type ZenstackUserCtx = {
  id: string
  tenantId?: string | null
  role?: string | null       // Q-20: from JWT claim
  staffRole?: string | null
}
```

### STEP 4b: Role-based ZenStack policies

In `libs/policies/schema.zmodel`, update Project policies:
```
model Project extends Base {
  // ...existing fields...
  
  @@allow("read", auth().tenantId == tenantId)
  @@allow("create", auth().tenantId == tenantId)  // Q-04: any member (no role check needed)
  @@allow("update", auth().tenantId == tenantId && (auth().role == 'owner' || auth().role == 'admin'))
  @@allow("delete", false)  // soft-delete only via deletedAt
}
```

For operations not in ZenStack (archive, invite, audit access): check `hasPermission()` from `libs/config/roles.config.ts` in the API route handler.

### STEP 4c: Seat limit enforcement

In `libs/integrations/clerk/webhook-handler.ts`, in `organizationMembership.created` handler:
```typescript
import { getMaxSeats } from '@csps/config';  // reads from subscription.config.ts

const tenant = await db.tenant.findUnique({ where: { clerkOrgId: orgId } });
const currentSeatCount = await db.userTenant.count({ where: { tenantId: tenant.id, deletedAt: null } });
const maxSeats = getMaxSeats(tenant.subscriptionStatus);

if (currentSeatCount >= maxSeats) {
  // Return 402 — don't create UserTenant
  throw new SeatLimitError(maxSeats);
}
```

### STEP 4d: Trial period logic

In `libs/integrations/clerk/webhook-handler.ts`, in `organizationMembership.created` handler:
```typescript
import { SUBSCRIPTION_CONFIG } from '@csps/config';

// Q-09: trial triggers on 2nd member (ratified VLT-S014-005)
if (memberCount === SUBSCRIPTION_CONFIG.trial.triggerOnMemberCount 
    && tenant.subscriptionStatus === 'free') {
  
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + SUBSCRIPTION_CONFIG.trial.durationDays);
  
  await db.tenant.update({
    where: { id: tenant.id },
    data: { 
      subscriptionStatus: 'trialing',
      trialEndsAt,  // Add this field to Tenant model if not present
    },
  });
}
```

### STEP 4e: Verify + Evidence

```
[S4-E1] Role enforcement: member cannot archive project → 403
[S4-E2] Seat limit: invite 2nd member to free org → 402 seat_limit_reached
[S4-E3] Trial started: 2nd member joins free org → subscriptionStatus='trialing', trialEndsAt set
[S4-E4] Role in JWT: auth session claims include { tenantId, role }
```

**RLS conditional check:** If S3-E1 failed → complete RLS STEP 4-RLS before this session starts.

---

## PART E — Session 5 Detailed Spec

**Prerequisite:** Session 3 complete. Session 4 not required (audit is independent of role gates).

### STEP 5a–5f: As specified in enterprise-core-completion-plan.md §2 Session 5

No amendments needed. Execute as written.

**Evidence:** [S5-E1] All mutation types audited (paste AuditEvent rows). [S5-E2] Audit API (paste GET /api/audit response for admin, 403 for non-admin).

---

## PART F — Session 6 Detailed Spec

**Prerequisite:** Sessions 3+4+5 complete.

### STEP 6a: Postgres RLS (if not already done in Session 4)

Execute SQL from enterprise-core-completion-plan.md §2 Session 6 STEP 6a.

### STEP 6b: ZenStack-integrated app template

Create `apps/template/` that scaffolds with ZenStack working from session start. Include webhook route as generator target (not copy-paste). This closes bedrock item 22/22.

### STEP 6c: Close bedrock

```bash
node tools/validators/validate-bedrock.mjs
# Must show: 22/22 ✓ 0 blocking
```

---

## PART G — Immediate Mechanical Actions (Do Before Session 3 Code)

**G-1: Update enterprise-core-completion-plan.md**
File: `docs/plan/_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md`

Add to §8 Decision Register (new item):
```
- Q-20: Role in ZenStack auth() per request: RATIFIED = A (Clerk JWT custom claim)
  Extend buildSessionClaims in libs/integrations/clerk/session-context.ts
```

Remove STEP 4d (feature key gating) from Session 4 spec. Replace with:
```
STEP 4d — Platform subscription primitives only
  Add getMaxSeats() + isTierActive() to libs/config/subscription.config.ts
  Apps define their own feature gates using these primitives.
  No platform-level feature key enum.
```

Add to Session 3 spec (after STEP 3c):
```
STEP 3c amendment: also handle organizationMembership.updated (role changes)
```

Add conditional RLS branch (after STEP 3g verify):
```
IF S3-E1 fails: Session 4 starts with RLS setup (STEP 4-RLS) before role permissions
```

**G-2: Update session-state.json mandate**

Update `session_mandate.primary` to reflect the STRATEGIC_COMPLETION situation:
```json
"primary": "STRATEGIC_COMPLETION active — Sessions 3-6 enterprise core closure. All 16 decisions ratified. Next: Sonnet executes Session 3 starting with STEP 3-FLEX (config files) → STEP 3a (ZenStack fix). See tools/council/opus-turn.md Turn 4."
```

**G-3: Mark OPUS-001 done in backlog** ← ALREADY DONE by Opus this session.

---

## PART H — What Changes When User Feedback Arrives

The Governor's flexibility directive means these will change. When they do:
- **Trial duration change:** edit `SUBSCRIPTION_CONFIG.trial.durationDays` in `libs/config/subscription.config.ts`. One file. Done.
- **Seat limit change:** edit `SUBSCRIPTION_CONFIG.seats.trialing`. One file. Done.
- **Role permission change:** edit `ROLE_PERMISSIONS` in `libs/config/roles.config.ts`. One file. Done.
- **Adding a new Clerk webhook event:** add one handler to the registry map in `webhook-handler.ts`. Zero other files need to change.
- **New subscription tier:** add to `TenantSubscriptionStatus` enum in `schema.zmodel` + add to `SUBSCRIPTION_CONFIG.seats`. Two files. Done.

This is what "flexible" means. No changes should ripple across 10 files when business rules evolve.

---

## RZF VERIFICATION
Cycles run: 4 | Gaps surfaced: 2 | Critical gaps: 1
Cycle 1: What did this brief miss from multi-persona review?
  Findings: 4 — (a) circular dependency gdpr→audit, (b) trial cron needs infrastructure,
  (c) tsconfig path alias unspecified, (d) webhook idempotency unaddressed
Cycle 2: All 4 gaps addressed?
  Findings: 1 — opus-brief.template.md mentioned but not created as file
Cycle 3: Template file creation — is it enough to instruct Sonnet to create it?
  Findings: 1 — No. Template must exist in repo NOW, not deferred to Sonnet
Cycle 4: Template and all other gaps resolved?
  Findings: 0 — created in subsequent commit
Status: ZF ACHIEVED — 4 cycles, 1 critical gap (circular dependency caught before Sonnet touches code)

*OPUS Turn 4 COMPLETE — All 16 decisions ratified, flexibility architecture specified, Sessions 3-6 fully briefed.*
*Governor ratification: 2026-05-10. Flexibility qualifier: applied throughout.*
*Sonnet: read Parts A–H in sequence. Start with Part B (config files), then Part C (Session 3).*
*OPUS #1 — Sonnet 4.6[1M] in Opus-designated advisor mode — 2026-05-10*
