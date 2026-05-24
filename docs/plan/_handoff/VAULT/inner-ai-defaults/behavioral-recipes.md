---
id: csps.handoff.vault.inner-ai-defaults.behavioral-recipes
name: behavioral-recipes
description: "Explicit behavioral recipes for the 4 core Opus activities: PROTO creation, Wizard design, Audit conduct, Deep Dive research. Each recipe defines the default procedure, the training drift to avoid, and the CSPS override. The moat: AI behavior that is defined, governed, and improvable."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: vault_files
diataxis_type: reference
session: S059
context_question: "Which recipe applies to this task? Is the Opus output matching the recipe structure? What drift pattern might be active?"
context_quote: "A recipe without DNA is just a template. CSPS DNA means every step carries prevention, evidence, and governance."
inherits_from: "UX-CORE.md + R2-01-PLATFORM-INTELLIGENCE-ENGINE.md + UX-PREVENTION-ARCHITECTURE.md"
links:
  - { rel: ux-core, href: ../../../../docs/SIA/UX-CORE.md }
  - { rel: cie, href: ../../../../docs/SIA/R2-01-PLATFORM-INTELLIGENCE-ENGINE.md }
  - { rel: prevention, href: ../../../../docs/SIA/UX-PREVENTION-ARCHITECTURE.md }
  - { rel: vocabulary, href: ./csps-vocabulary-triggers.md }
  - { rel: prose-patterns, href: ./prose-patterns.md }
---

# Behavioral Recipes — CSPS AI Patterns

> Explicit how-to patterns for the 4 core Opus activities.
> Each recipe: default procedure + drift risks + CSPS overrides.
> These recipes ARE the governance of Opus behavior — not rules, but patterns.

---

## RECIPE 1 — PROTO Creation

**Trigger words:** "build", "implement", "create [artifact]", "PROTO-*"

### Standard Procedure

```
1. READINESS CHECK (before writing anything)
   → CIE.checkReadinessGate(itemId) — is the layer prerequisite met?
   → If not: BLOCK + surface the prerequisite

2. UX PRE-FLIGHT (if PROTO contains UI work)
   Use case: [Wizard/Dashboard/Config/Nav/Onboarding]
   pageDNA for each new page: purpose + options + nextStep
   Voice profile: [colleague/professional/mentor]
   ADD not REPLACE check: [existing pages affected?]

3. ALIGNMENT BLOCK (Loop 7 — every new file Sonnet creates)
   // WHO: [who uses this]
   // WHAT: [exactly what artifact]
   // PREVENTS: [which violation, not detection]
   // RISK: [false assumption that could break this]
   // SCOPE: [is this the minimal first step?]

4. STEPS (numbered, sequential, specific outputs per step)
   Each step: what Sonnet reads + what Sonnet writes + how to verify
   Step 1 = smallest deliverable that proves the approach works
   Not: "build the whole feature in step 1"

5. NON-NEGOTIABLES (at the end, always)
   const pageDNA (NOT export const) — if any pages
   ZF block IN sonnet-turn.md with file:line citations
   DONE = THIS-SESSION pnpm verify exit_code=0
   Push to BOTH repos if playground involved

6. TOKEN BUDGET CHECK
   Is this <100k Sonnet tokens? If not: split into two PROTOs.

7. REPORT FORMAT SPEC
   What Sonnet writes to sonnet-turn.md after completion
   Required: FROM SONNET header + ZF block + PLAN STATUS
```

**Drift risks:**
- Over-scoping Step 1 → Sonnet builds too much, can't validate
- Missing ALIGNMENT block → Loop 7 blocks the write
- Forgetting both repos → playground changes not deployed
- UX Pre-flight absent for UI work → Loop 5 soft block

**CSPS override:** Every PROTO is a governance artifact, not just a task list. It carries DNA (ALIGNMENT) and evidence requirements (ZF + verify).

---

## RECIPE 2 — Wizard Design

**Trigger words:** "wizard", "form", "7 sections", "planning wizard", "questions"

### Standard Procedure

```
1. AUDIENCE IDENTIFICATION
   → Which avatar type fills this wizard? (The Founder / The Operator / etc.)
   → Which voice profile? (colleague / professional / mentor)

2. SECTION DESIGN (UX-CORE.md Use Case A: Wizard)
   Maximum 7 sections (Miller's Law — cognitive limit)
   Each section: 1 primary question + max 3 input fields
   Labels: plain language (not system names, not jargon)
   Placeholders: example values (not instructions)
   Tips: appear on focus, not by default
   Guard questions: appear on focus, supportive not interrogative

3. OUTPUT FORMAT
   YAML with all sections structured for downstream use
   Slug: kebab-case from first 5 words of section 1
   Status: draft (not published until Governor confirms)
   Save: browser download (Vercel-safe) or local file (dev mode)

4. VOICE PROFILE APPLICATION
   Every field label, placeholder, tip, guard references voice-profiles.yaml
   No hardcoded language — all comes from the active profile
   useVoiceProfile(voiceProfile) → getSection() → getField()

5. UX CORE COMPLIANCE CHECK
   [ ] Purpose clear in 5 words or less
   [ ] Progress indicator visible (Step N of N)
   [ ] Previous/Next navigation on every step
   [ ] Primary CTA (Save/Next) is the dominant element
   [ ] Error states defined for each required field
   [ ] Empty/loading states exist

6. ACCESSIBILITY
   Every input has a visible label (not placeholder-only)
   Focus state: 2px blue outline (#1d4ed8)
   Tab order: logical top-to-bottom
```

**Drift risks:**
- Too many fields per section → cognitive overload (violates Miller's Law)
- Hardcoded language → voice profile not applied
- Guard questions as requirements → exam feel, not colleague feel
- Missing error states → users can't recover from mistakes

**CSPS override:** The wizard is a PLAN stage artifact (R3-01 Journey Framework §Stage 2). Its purpose is not data collection — it's JTBD crystallization. The questions serve the user's understanding, not the system's data needs.

---

## RECIPE 3 — Audit Conduct

**Trigger words:** "audit", "review", "check", "go over", "ux audit", "evaluate"

### Standard Procedure

```
1. STANDARD IDENTIFICATION
   → Which standard applies? (UX-CORE, UI-CORE, UX-UI-STANDARDS, behavioral contract, validator)
   → Load it as the scoring framework
   → Never audit without a referenced standard

2. TARGET READ (the thing being audited)
   → Read ALL relevant files (not just the obvious one)
   → Note: file path, version, last modified, what it claims to do

3. DIMENSION SCORING (per standard's criteria)
   ✅ PASS: clearly present, clearly functional
   ⚠️ ADVISORY: present but incomplete, or present but unclear
   ❌ MISSING: not present, blocking to ship

4. ZF ITERATION
   Cycle 1: [first pass findings — cite file:line for each]
   Cycle 2: re-examined [specific files from Cycle 1] — [new/same findings]
   ZF ACHIEVED when: no new findings in last cycle

5. REPORT FORMAT
   | Dimension | Score | Evidence | Fix direction |
   Score summary at top: N/M dimensions PASS
   Every ❌ has a one-line fix direction (not just "add this")
   Prioritized: highest impact gaps first

6. ACTIONABLE CLOSE
   List exactly 3 next actions in order of impact
   Each action: specific file to change + what to add
   Estimated effort per action (small/medium/large)
```

**Drift risks:**
- Auditing without a referenced standard → subjective, unverifiable
- Finding violations without fixes → useless report, frustrates Governor
- Auditng only the obvious file → misses systemic issues
- "Overall it looks good" without per-dimension scoring → nominal audit

**CSPS override:** Every audit is evidence for the gap register (gap-recurrence-register.yaml). If a pattern appears K≥2 across multiple audits → structural prevention required, not another audit. Auditing is data collection, not improvement — improvement requires the Learning Loop.

---

## RECIPE 4 — Deep Dive Research

**Trigger words:** "deep dive", "research", "understand", "explore", "what would top expert", "how platforms"

### Standard Procedure

```
1. SCOPE DECLARATION
   → What question is being answered?
   → What is the output form? (design decision / option comparison / gap analysis / architecture review)
   → What is the decision the Governor needs to make at the end?

2. SOURCE READING (thorough)
   → Read ALL relevant CSPS files first (don't research externally first)
   → Map what exists: [file] claims [X] at [line N]
   → Map what's missing: [what CSPS doesn't have that it needs]

3. EXTERNAL RESEARCH (only after internal map is complete)
   → What do industry platforms do? (Linear, Vercel, Stripe, Notion, etc.)
   → Absorb ONLY what fits CSPS's specific methodology
   → CSPS has innovations not found in research — don't override with generic solutions

4. SYNTHESIS
   → What is CSPS's unique position vs industry?
   → What can be directly adopted? What needs adaptation? What should be rejected?
   → Always: "CSPS does X differently because [CSPS-specific principle]"

5. STRUCTURED OUTPUT
   Structure: Context → Finding → Option A → Option B → Recommendation
   PCR mandatory for any multi-option decision
   Every claim: cite specific CSPS file or industry source
   ZF: multiple cycles, each naming specific files re-examined

6. ACTIONABLE CLOSE
   "Given this research, the Governor needs to decide:"
   — Decision 1: [specific binary choice or single-word answer]
   — Decision 2: [etc.]
   NOT: "Here is all the information. Let me know what you think."
```

**Drift risks:**
- Researching before reading CSPS files → overlays generic solutions on CSPS-specific needs
- Long report with no action → Governor can't move forward
- "Industry does X so we should" → may contradict CSPS innovations
- ZF cycles that are conceptual not file-citing → nominal, blocks validator

**CSPS override:** Deep dives produce PERMANENT design decisions. They are Vault-first (G5): if the insight matters, it becomes a file, not a chat answer. The output of a deep dive is an Opus-ratified permanent document, not a long response.

---

## RECIPE ALIGNMENT WITH CSPS DNA

| Recipe element | CSPS principle | Enforcement |
|---|---|---|
| Readiness check (all recipes) | Readiness Gate (CIE) | B_PIE_READINESS_GATE |
| ALIGNMENT block (PROTO) | Loop 7 Alignment Gate | pre-tool-use-alignment-gate.sh |
| UX Pre-flight (PROTO) | Loop 5 discipline | startup.template.md |
| Voice profile (Wizard) | Voice Profile System | Loop 2 hook |
| Standard reference (Audit) | Validate before assume | B_VALIDATE_BEFORE_ASSUME |
| Permanent output (Deep Dive) | G5 permanence | session-close gate |
| ZF iteration (all) | ZF termination discipline | validate-zf-cycle-format.mjs |
| Actionable close (all) | No naked questions | prose-patterns.md |
| Token budget (PROTO) | Cognitive load management | UX-CORE CL-3 |

---

## THE BEHAVIORAL MOAT

These recipes are CSPS-specific. No other platform has:
- A wizard design recipe that references voice profiles + journey framework + avatar archetypes
- A PROTO creation recipe that checks CIE readiness before writing the first step
- An audit recipe whose output feeds the gap register's Learning Loop
- A deep dive recipe that reads CSPS files before external research, not after

When these recipes are followed consistently, the AI's behavior becomes PREDICTABLE and IMPROVABLE:
- Predictable: Governor knows what to expect from each trigger word
- Improvable: when a recipe produces a bad output, the recipe is improved (not just the instance)

*CSPS Behavioral Recipes v1.0 | S059 | Opus-8*
*Update when: new recipe needed, drift pattern discovered, recipe produces consistently wrong output.*
