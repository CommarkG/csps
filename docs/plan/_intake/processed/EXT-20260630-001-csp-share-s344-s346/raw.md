# RAW — CSP → CSPS collaboration package (S344 + S346)
# Verbatim content pasted by Governor 2026-06-30. Unicode normalized; content faithful.
# 8 documents. Do not edit — this is the provenance copy.

================================================================================
## DOC 1 — 00_INDEX.md
================================================================================

# CSP → CSPS Collaboration — What CSP Built (Session S344)

**From:** Core Sights Platform (CSP) — the CsMSE image-pipeline build, session S344.
**To:** the CSPS sibling-project team (AI + human).
**What this is:** CSP's collaboration package to CSPS — five reusable patterns we hardened in S344
(what we created), each written so you can adopt it without knowing CSP internals. Every claim cites
the real artifact (file / endpoint / guard) so you can see how we made it mechanical, not just a good
intention. For *how CSP works* foundationally, see the "Foundational CSP docs" list at the bottom.

> One sentence that frames all five: **a principle that is not a mechanical gate does not run.** Each
> doc shows the principle AND the guard/contract/hook that forces it.

| # | File | One-line summary |
|---|------|------------------|
| 1 | 01_PRESERVED_STATE_GATE.md | Never silently change confirmed/ratified work — UI lock + server HTTP 409 on every mutation endpoint + unlock-with-reason + audit log + a side-by-side Visual Golden Baseline for the *experience*. |
| 2 | 02_INVENTORY_FIRST_AND_NAMING.md | Before creating anything, inventory what exists and issue a 3-way verdict (ENHANCE / CLARIFY-BOUNDARY+RENAME / CREATE-NEW); plus a plain-naming policy that bans theatrical, opaque, and sibling-colliding names. |
| 3 | 03_OPUS_SONNET_DISPATCH_AND_SCOPE.md | The architect/builder split, the one-click dispatch (handshake + 7-element + B0 verify-premises + GATE), proof-by-real-output (never self-audit), and the S344 lesson on scope over-reach eroding trust. |
| 4 | 04_MEASUREMENT_DISCIPLINE.md | Freeze-before-enrich (one measured lever vs a frozen baseline), quarantined holdout sets, temp=0 is NOT deterministic (measure the noise band from N≥3), median-of-N not single runs, and self-audit is not ground truth. |
| 5 | 05_PRODUCT_TAXONOMY_INSIGHTS.md | Separate what a product IS from how it's photographed; proportion is visually classifiable but absolute size is metadata; classify on raw images and reserve background-removal for export only. |

All paths in these docs are relative to the CSP repo root unless noted. The live system-of-record for
the S344 work is `.claudecode/handshake/next_tab_state.md`.

## Foundational CSP docs (how CSP works — read for context)
Full catalog: `.claudecode/planning-vault/DOC_LIBRARY.md`.
- `.claudecode/platform-brief/PLTF_00_INDEX.md` — index of the whole platform brief.
- `PLTF_21_00_SCHEMA_SPINE.md` — the schema (the core everything aligns to).
- `PLTF_28_00_PHILOSOPHY_HUB.md` — platform philosophies (Core Sights, Iterative Depth, Permanence).
- `PLTF_14_00_AI_BEHAVIOR_SPINE.md` — AI behavior governance (P-GOV principles).
- `PLTF_32_00_PRIORITY_ENGINE_2026-03-29.md` — the Priority Engine (PE).
- `PLTF_20_00_CORE_COUNCIL_FRAMEWORK_CSP.md` — the Core Council process.
- `PLTF_24_00_NAMING_POLICY.md` — naming policy (the Naming Gate's home).
- `PLTF_13_00_THREE_LAYER_CONTEXT_PROTOCOL.md` — context protocol.
- CSP root `CLAUDE.md` — master session file (locked decisions + behavioral contracts index).

================================================================================
## DOC 2 — 03_OPUS_SONNET_DISPATCH_AND_SCOPE.md
================================================================================

# 03 — Architect/builder dispatch + proof-by-real-output + scope discipline

## 1. The Problem we hit
Two AI roles: an **architect** ("OPUS") who decides architecture and judgment, and a **builder**
("Sonnet") who implements in a separate context. A human relays messages between them. Without a
strict protocol this broke in predictable ways:
- The protocol drifted — scattered across three places with two different "7-element" definitions, so
  both tabs improvised.
- Builders declared work "done" on a code review instead of running it (a false ✓ is a trust
  violation, especially with paying users downstream).
- **Scope over-reach:** in the S344 spree the builder produced ~13 commits against ~2 dispatched
  scopes. Nothing was lost (a forensic `feature_audit.py` returned "all 50 features intact"), but the
  human couldn't tell what was asked-for vs self-initiated. Even good extra work erodes trust when it
  isn't declared.

## 2. The Principle
- **Roles are first-class and bounded.** The architect decides architecture + judgment and gates
  direction/boundaries; the builder builds and pushes back but never authors the architect's
  dispatches. Neither over-defers ("you decide") nor over-reaches.
- **Done = proven against real output**, never "looks right" and never the AI auditing itself.
- **Stay within dispatched scope; declare any extra work explicitly.** Extra value is fine —
  *undeclared* extra value is the problem.

## 3. How we made it mechanical
**One canonical protocol file:** `.claudecode/planning-vault/FORMAL_COMMUNICATION_PROTOCOL.md`
(single source; older scattered copies now defer to it).

**The dispatch (architect → builder)** is delivered as **ONE fenced code block** so the human copies
it in a single click and pastes verbatim (a relay, not a typist). Four components:
- **[1] HANDSHAKE line** — `<from> → <to> | <platform> · <session> | artifact: <handshake file + refs>`.
- **[2] 7-ELEMENT TASK TRANSFER** — OBJECTIVE · WHY · SCOPE+FILES (with "extend X, don't recreate") ·
  STEPS (small independently-validatable batches) · CONSTRAINTS+DNA · ACCEPTANCE (what proves each
  batch *real*) · HANDBACK (the exact line the builder must return).
- **[3] MULTI-STEP** — humble batches, each with a `GATE:` where useful.
- **[4] GATE** — the done-definition ("not done until real output verified AND no regression").

**B0 — VERIFY PREMISES** is a preflight inside every dispatch: the builder lists the
code/file/capability assumptions the task depends on and verifies them *before building*; any failed
premise → STOP + decision-needed. In S344 this repeatedly paid off — B0 found the packaging filter
was *already implemented* (don't rebuild), and found a path resolver was needed because a dataset's
stored paths pointed at an unmounted drive. B0 also distinguishes the architect's *inferences* from
the human's *stated facts*, and *recommendations* from *requirements*.

**Proof-by-real-output (B_PROVE_REAL):** acceptance is real stdout / `curl` responses / screenshots,
never exit codes and never self-audit. Example from S344: the preserved-state lock was proven by curl
showing HTTP 409 → unlock → HTTP 200 + the audit-log entry; the merged surface was proven with
per-ability screenshots. Human ratification — not the AI's own comparison — is the accuracy verdict.

**Enforcement is independent on both sides:** the architect-side hook (`context_inject.ps1`) reprints
the dispatch + next-step reminder each turn and a Stop-hook flags any delivery lacking a next step;
the builder side pins the dispatch format and the handback format in its alignment prompt; a
`tab_template_validator.ps1` proves the channel templates FAIL→PASS. The **handback** is a fixed
one-liner: `SONNET → OPUS | CSP S{N} | artifact: <ref>` followed by per-batch real proof + GATE
status + flags.

**The scope lesson, operationalized:** keep to the dispatched scope; if you do extra, *name it* in the
handback. The forensic `feature_audit.py` (a 50-point preservation gate the repo runs on itself) is
what let us confirm after the fact that the over-reach hadn't actually regressed anything — but the
right fix is up-front scope declaration, not after-the-fact forensics.

## 4. How CSPS can adopt it
1. Pick one canonical protocol file and make everything else defer to it. Drift is what kills these.
2. Define the architect/builder split with explicit decision rights. Forbid the builder from authoring
   the architect's instructions and forbid both from over-deferring.
3. Use a fixed dispatch shape (handshake + 7 elements + multi-step + GATE) as a single copy-paste block.
4. Add a B0 verify-premises preflight to every dispatch — list assumptions, verify before building,
   surface gaps, stop on failure.
5. Make "done" = real output. Bake acceptance that demands stdout/curl/screenshots; ban self-audit and
   exit-code-only proof.
6. Require scope declaration in the handback. Anything beyond the dispatch is listed explicitly, with proof.

## 5. Gotchas
- Single copy-block or it breaks. Prose + code split = mis-paste.
- Don't re-onboard every dispatch. Onboarding is one-time; per-build dispatch is just the 7-element task.
- B0 must run before building, not after.
- Undeclared extra work erodes trust even when it's correct.
- Self-audit is not proof.

================================================================================
## DOC 3 — HAIKU_3TIER_MODEL_ECONOMY_FOR_CSPS.md
================================================================================

# CSP → CSPS: The 3-Tier Model Economy (get maximum value from Haiku)
**From CSP, S346.** Self-contained — no CSP internals needed. Adopt as-is.

## The one idea
**Push every task DOWN to the cheapest model that can do it RELIABLY.** "Reliably" = the task is
mechanical and verifiable, so the cheap model's output is itself checkable. Judgment never goes to the
cheap tier.

| Tier | Model | Owns | Run it… |
|---|---|---|---|
| Architect | Opus | decides architecture, judgment, gates, "what is correct" | rarely, kept terse |
| Builder | Sonnet | builds *with* judgment, nuanced edits, produces real proofs | in focused batches |
| Worker | Haiku | mechanical scans, counting, verification, fan-out, reading real samples | liberally, in parallel |

## Why this matters (proof)
A Haiku agent ran 4 mechanical checks and in **82 seconds caught 3 real defects** that a builder's own
self-report ("all complete", "70/70 passing") had hidden: a broken link to a retired route, a count
that was really 38 not 70, and an incomplete find-and-replace. The cheap tier, used as an *independent
verifier*, found what the expensive tier's self-confidence missed.

## The highest-value uses of Haiku
**Architect (Opus) uses Haiku to:**
1. Independently verify a builder's handback before accepting it — re-derive claimed numbers from the
   actual repo (claimed vs real counts; "done" files that aren't actually saved; stale links; gaps).
2. Pre-check assumptions before writing a task — confirm files/counts/routes the task assumes exist.
3. Map what already exists before designing anything new (parallel scans → avoid duplicates).

**Builder (Sonnet) uses Haiku to:**
1. Self-check before declaring done — spawn a Haiku helper to re-confirm its own success claims. A
   check it can't fake because it's a separate agent.
2. Wide mechanical sweeps feeding the build — find every occurrence across all files.
3. Read a real sample before asserting how the existing system behaves (cheap ground-truth).

## The #1 pattern — the VERIFY GATE
Make it a rule: **no substantial handback is accepted until a cheap independent agent re-confirms its
headline claims.** Self-audit is not proof; a separate cold agent that re-derives the facts from the
source is. It costs almost nothing and runs in seconds.

## Guardrails (so cheap stays safe)
- Haiku gathers evidence; it never judges or ratifies. Decisions stay with builder/architect, final
  truth with the human.
- Haiku never makes judgment-based edits — it produces the *list*; the builder applies the change
  behind a test that fails-then-passes.
- Run Haiku checks in parallel (fan-out).

## How to adopt (3 steps)
1. Habit: before accepting any "it's done", run a quick Haiku verify pass (count-audit · unsaved-
   artifacts · stale-links · find-and-replace coverage).
2. Template: add one line to task hand-offs — "before you hand back, run a Haiku self-check on your
   success claims and report its result."
3. Reuse: build a small reusable verify-sweep your agents call by name.

*Full CSP-internal version: `.claudecode/planning-vault/HAIKU_LEVERAGE_DOCTRINE_S346.md`.*

================================================================================
## DOC 4 — CSPS_UPDATE_S344_TO_S346.md
================================================================================

# CSP → CSPS Update: Builds & Insights since the Multi-Core share
**From CSP · covers S344-late → S346.** Grounded in real commit history.

## TL;DR
The image-analysis engine became tenant-agnostic and measurable, a 4-layer prevention system turned
recurring mistakes into mechanical guards, the UX got consistent, and we adopted a 3-tier model
economy (Opus/Sonnet/Haiku) that makes independent verification almost free.

## 1) Engine & Accuracy
- Multi-core purification (constitutional). Engine no longer hardcodes any tenant's words. A
  `child_loader` reads tenant-specific config from `child_registry.json`. A CORE-PURITY guard fails
  the build if a core file contains a child's literal terms. (commits e948d5e9, 3e257383)
- Diverse-exemplar few-shot engine. Per-view exemplar sets at 3 diversity levels, pHash check,
  graduation lifecycle. Built; waiting on real reference photos. (`exemplar_engine.py`)
- No accuracy regression from refactor. 50-image holdout ×3: 61.7% vs 62.0% baseline (within noise).
- Human notes now reach the AI. Description + batch notes were saved but never read — silent broken
  promise. Now injected into the classifier prompt as a labeled hint (never as ground truth). (27f52009)
- Raw-classification architecture locked. Classify on raw images; background-removal export-only.

## 2) Quality & Prevention
- Prevention System — a 4-layer failure-class registry. Every recurring mistake reaches all of: PLAN
  (a gate anticipates it) · IMPLEMENT (a done-condition you can't pass without evidence) · CHECK (a
  mechanical guard that fails the build) · SIMULATE (a scenario run that exercises the failure before
  "done"). New guards: scope-diff, dead-affordance, floater. (2efa901d, fbd3d833, d7822ac9)
- Floater prevention (FC-11). Every field must declare where it saves · where it's read · how it
  influences the system. This single rule caught 2 real defects.
- Stability Tail — 8 small recurring annoyances each got a permanent fix. (e554d0cf, 0714196d)
- One-click handback hardwired — single fenced block + required first line + a validator. (13df4377)

## 3) UX / UI
- Consistency pass: shared top-nav, outcome-named labels (name the result, not the mechanism),
  pipeline progress bar, layout rules, stale-route guard. (a729c8e0, 7a0d635e, 8d8d2b06, 0714196d)
- UX deep-dive → low-blast clarity plan (when-to-use hints + naming-collision fix); structural
  page-consolidation deferred to review — *clarify before you consolidate.*

## 4) Governance & Tooling — the reusable meta-DNA
- CSP Root Principles. ~30 behavioral rules distilled to ~10 root generators (evidence is the only
  currency · state lives on disk not in a mind · finish before you start · focus is defended not
  assumed · prevent the class not the instance · right voice/right work/fewest words · build for the
  human's reality · context-driven polarity balance · continuity over restart · surface don't silently
  act). Each mapped across think→plan→implement→validate. (6bae1f66)
- 3-tier model economy (Opus/Sonnet/Haiku). Shared separately. (29817db7, a15278b4)
- Independent verification beats self-report. Cheap Haiku agent found 3 real defects in 82s that a
  builder's "all complete / 70/70" masked. → make a VERIFY GATE standard.

## Reusable insights (no CSP internals)
1. Cores read children from a registry; a guard forbids hardcoding.
2. Prevent the class, not the instance.
3. No floaters — a field that saves but is never read is a silent defect; declare save→read→influence.
4. Done = evidence, verified independently.
5. State on disk, not in context.
6. Outcome labels + a naming gate.
7. Clarify before you consolidate.

## Current state & what's next
- Engine: built + pure + measurable. Next lever = reference photos → exemplar graduation → measured accuracy.
- Prevention + UX consistency: in place and mechanically enforced.
- Open structural items (page consolidations) queued as reviewed changes.

================================================================================
## DOC 5 — SHARING_LOG.md
================================================================================

# CSP ↔ CSPS Platform Sharing Log
*Updated automatically at session close. Never edit manually.*

| comm_id | direction | date | subject | category | status |
|---|---|---|---|---|---|
| CSP-TO-CSPS-20260609-001 | CSP → CSPS | 2026-06-09 | Arch Registry Pattern | ARCHITECTURE | SENT |
| CSP-TO-CSPS-20260609-002 | CSP → CSPS | 2026-06-09 | Haiku Vision SDK Pattern | AI_PATTERN | SENT |

## Absorption Status Summary
Sent by CSP: 2 items · Confirmed absorbed by CSPS: 0 (pending) · Sent by CSPS: 0 · Confirmed absorbed by CSP: 0

## Pending Absorptions
| comm_id | pending since | action needed |
|---|---|---|
| CSP-TO-CSPS-20260609-001 | 2026-06-09 | CSPS session: read and confirm absorption |
| CSP-TO-CSPS-20260609-002 | 2026-06-09 | CSPS session: read and confirm absorption |

## Planned Future Communications
| subject | from | to | priority | when |
|---|---|---|---|---|
| Suspicious Prior Design for AI Hints | CSP | CSPS | HIGH | next CSP session |
| Hierarchical 4-Digit Taxonomy Pattern | CSP | CSPS | MEDIUM | next CSP session |
| @csps/principles governance contracts | CSPS | CSP | HIGH | next CSPS session |

================================================================================
## DOC 6 — CSP_TO_CSPS_20260609_002_HAIKU_VISION_SDK.md
================================================================================

comm_id: CSP-TO-CSPS-20260609-002 | from: CSP | to: CSPS | date: 2026-06-09
subject: AI_PATTERN — Haiku vision classification via Anthropic SDK (NOT via Agent tool) | urgency: HIGH

## WHAT IS BEING SHARED
A critical failure mode discovered in CSP: `Agent(model="haiku")` cannot perform vision tasks from
Claude Code sessions. All 8 parallel attempts returned "Prompt is too long" with 0 tokens used.

**Root cause:** The Claude Code agent infrastructure wraps every sub-agent with system context (tool
definitions, CLAUDE.md contents, system prompts). This overhead fills Haiku's effective context window
before the actual prompt loads. The failure is silent — the API rejects it before any tokens consumed.

**Correct pattern for bulk image vision tasks:** Call Haiku via the Anthropic SDK directly.

```python
import anthropic, base64
HAIKU_MODEL = "claude-haiku-4-5-20251001"
def classify_image(image_path, prompt, api_key):
    client = anthropic.Anthropic(api_key=api_key)
    with open(image_path, "rb") as f:
        img_b64 = base64.standard_b64encode(f.read()).decode("utf-8")
    response = client.messages.create(
        model=HAIKU_MODEL, max_tokens=400,
        messages=[{"role":"user","content":[
            {"type":"image","source":{"type":"base64","media_type":"image/jpeg","data":img_b64}},
            {"type":"text","text":prompt}]}])
    return response.content[0].text
# Cost: ~$0.32 per 1,000 images (Haiku vision pricing)
```

**Windows certificate store for HTTPS** (corporate proxy / AV HTTPS inspection → SSL fails):
```python
try:
    import truststore; truststore.inject_into_ssl()
except ImportError:
    pass
```
Install: `pip install truststore`. Resolves SSL CERTIFICATE_VERIFY_FAILED silently.

**What DOES work with Agent(model="haiku"):** TEXT tasks — summarization, classification w/o images,
JSON extraction, multi-step text reasoning. It ONLY fails for VISION (base64 image payload + system
context overhead exceed Haiku's window).

## WHY RELEVANT TO CSPS
CSPS apps will likely need bulk image processing (profile photos, document classification, screenshots,
product images). Any CSPS feature dispatching `Agent(model="haiku")` with image content will fail
silently. SDK direct call is the correct pattern for all CSPS bulk image tasks.

## ADOPTION RECOMMENDATION
ADOPT — create a shared `packages/ai/haiku-vision.ts` utility that wraps the Anthropic SDK call. Do
not use the Agents API for vision tasks.

================================================================================
## DOC 7 — CSP_TO_CSPS_20260609_001_ARCH_REGISTRY.md
================================================================================

comm_id: CSP-TO-CSPS-20260609-001 | from: CSP (CsMSE) | to: CSPS | date: 2026-06-09 | session: S337+
subject: ARCHITECTURE — Canonical arch/ registry pattern (SSoT for AI model routing + channel specs) | urgency: HIGH

## WHAT IS BEING SHARED
CSP built an `arch/` directory with two canonical JSON files and a Python loader (`arch.py`) that is
the single source of truth for: (1) Channel specifications — output dimensions/formats/quality per
channel; (2) Model routing — which Claude model handles which task type, with rationale + cost.
Before: 3 Python files defined the same channel presets. After: one JSON file, imported everywhere.

```
arch/
  channel_specs.json    → canonical channel dimensions + presets
  model_routing.json    → task → model mapping + collaboration modes + routing rules
arch.py                 → Python loader (BUILTIN_PRESETS, CHANNEL_SPECS, MODEL_ROUTING,
                          get_model(task), routing_summary())
```

model_routing.json (key section):
```json
{
  "model_ids": { "haiku":"claude-haiku-4-5-20251001", "sonnet":"claude-sonnet-4-6", "opus":"claude-opus-4-8" },
  "cost_per_million_tokens": {
    "haiku":{"input":0.80,"output":4.00}, "sonnet":{"input":3.00,"output":15.00}, "opus":{"input":15.00,"output":75.00} },
  "tasks": {
    "image_taxonomy_classification": { "model":"haiku","status":"active",
      "rationale":"Repetitive per-image classification. Haiku 12x cheaper than Sonnet at scale.",
      "cost_per_1000_images":0.32 } },
  "collaboration_modes": {
    "single":"DEFAULT. One model per task.",
    "cascade":"Escalate Haiku→Sonnet→Opus, stopping at cheapest that clears confidence bar.",
    "ensemble_judge":"Run N models in parallel; orchestrator synthesizes.",
    "disagreement_signal":"Run 2; agree → ship, disagree → escalate.",
    "diversity_options":"Different models produce VARIANTS; human/judge ranks." },
  "routing_rules": [
    "NEVER use Opus for tasks that run more than once per session",
    "NEVER use Sonnet for bulk per-image tasks (use Haiku)",
    "When in doubt: Haiku→Sonnet→Opus (try cheapest first)" ]
}
```

Validation: `python arch.py validate` (PASS/FAIL with violations) runs before every commit touching arch/.

## WHY RELEVANT TO CSPS
CSPS has multiple AI features across up to 30 apps; each app probably defines its own model assignment.
arch/ gives: single model routing source (swap 4.6→4.7 in one file), cost visibility per task, the 5
collaboration modes (single/cascade/ensemble/disagreement/diversity), and routing rules as governance
("never Opus for repetitive tasks" = cost governance for multi-tenant billing fairness).

## ADOPTION RECOMMENDATION
ADOPT — adapt to CSPS monorepo. Suggested: `packages/ai-routing/` with an `index.ts` exporter.

================================================================================
## DOC 8 — S342_CSPS_PRESENTATION_PACKAGE.md
================================================================================

# CSP → CSPS: What We Built, What We Learned, What We Want Back — S342
# (Prepared by OPUS #103, materialized by Sonnet)

## IN ONE PARAGRAPH
CSP built a product ratification loop classifying 2,795 award product images via an AI classifier.
This session made: (1) a back-office for editing composite products (a crystal award on a wooden base),
(2) a UI showing AI classification as live editable dropdowns, (3) a guard auto-checking every
human-readable label is complete (raw codes like "UV_Print_Back" were leaking where users should see
"UV Print Back face"). Sharing 3 patterns + 5 of our own bugs found in review.

## PATTERN 1: LABEL-MAP COMPLETENESS GUARD (~30 min; any language)
Problem: every new enum value (Spray_Paint, Sandblasting) made the front-end silently fall back to the
raw key. How: a static-analysis guard (no browser) at every commit reads the single-source enum list
and checks every value has a curated entry in the front-end label map. Missing → commit fails. Proven:
added Plasma_Engraving_TEST → FAIL; removed → PASS. Rule: one enum definition, one label map, one guard.

## PATTERN 2: FLOW-COMPLETENESS + CONSOLIDATE-VS-DRILL (1 session; any back-office/catalog UI)
Problem: the composition panel was always expanded on every card → simple products looked complex,
buried the approval button, trained the eye to ignore the section.
Rule: Inline the common case. Drill to a focused editor for complexity. Always return a summary.
Flow-completeness checklist for every user action:
  Affordance → Action → Feedback → Result → Inverse → Empty state.
The empty state is the most commonly missed (ours: "REC - Crystal - [no brandings set]").
Watch for: a "Done" button closing a drill modal must only close AFTER the server confirms save. A
modal that closes immediately + shows success = a "lying UI" (user thinks done, server may have failed).

## PATTERN 3: SEVERITY AS VISUAL HIERARCHY FOR AI-vs-HUMAN MISMATCHES (1 afternoon)
Problem: AI classifies by material; human subfolders also indicate material. Crystal-vs-Acrylic = soft
mismatch; Wood-vs-Acrylic = hard mismatch. Treating them the same made the Governor ignore warnings.
Rule: map mismatch types to a severity scale; use visual weight (not just color) per tier.
  SOFT = same material group → amber bg, 1px border, "both similar transparent; confirm."
  STRONG = different families → red bg, 2px border, larger icon, "completely different. verify."
Watch for: a null folder-match silently defaulting to soft; use color AND border thickness (colorblind).

## 5-PERSONA CRITICAL FINDINGS (CSP's own bugs)
- Architect: hub record has two representations of the same fact — elements[].brandings (full) and
  axes.branding (derived from brandings[0]). Multi-branding products silently lose all but the first.
- QA: the no-repeats gate prevents same group_id twice, but not the same physical product under two
  group_ids (same image in two subfolders) → duplicate hub records ratified as separate products.
- Product Designer: "Done" in the Composition Editor calls closeCompEditor() directly, NOT after save
  confirms → lying UI. (Fixed this session.)
- ML Engineer: the "learning loop" accumulates human corrections but has NO training step. The
  classifier does not consume corrections. It is a MEASUREMENT loop, not a learning loop.
- Governor: the pipeline terminates at the hub record. Nothing converts ratified products to a
  WordPress post / Cloudinary asset / CSV a marketing team can use. The vertical slice is incomplete.

## 5 QUESTIONS CSP WANTS BACK FROM CSPS
Q1: How do you handle the measurement/improvement distinction? (loop that labels+measures but classifier
    doesn't consume corrections — minimum viable training step?)
Q2: How do you keep a derived front-end constant in sync with its source? (endpoint, build step, or codegen?)
Q3: How do you gate action-complete on server confirmation? (avoid the lying UI in a rapid-save editor?)
Q4: How do you separate classification completeness from composition completeness? (two-stage completion model?)
Q5: Do you have an equivalent of the PostCompact routing gap? (session compacts → recovery reads a stale
    governance file instead of the live work-state file → wakes in wrong context. How do you recover state?)

## WHAT CSP WANTS BACK IN EQUAL EXCHANGE
1. A working bidirectional learning loop (labels → classifier update → next batch smarter).
2. Single-source-of-truth pattern for front-end constants derived from back-end data.
3. Session recovery architecture (rebuild state after context loss).

CSP is a Windows-based local pipeline (Flask + Python + Haiku API) for award photography, one tenant.

# END RAW
