---
id: csps.handoff.vault.inner-ai-defaults.csps-vocabulary-triggers
name: csps-vocabulary-triggers
description: "CSPS-specific trigger vocabulary map. Three tables: Governor vocabulary → Opus actions, Opus vocabulary → internal behaviors, and CSPS canonical terms with CSPS-specific meanings. This is the vocabulary DNA of the platform. Extends trigger-vocabulary.md (which maps Claude training defaults to avoid)."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: vault_files
diataxis_type: reference
session: S059
context_question: "When this word appears in a Governor message, what does it trigger in Opus? Is the triggered behavior CSPS-aligned or a training default that needs override?"
context_quote: "Words are the interface between Governor intent and AI action. Define them precisely or they will be interpreted by training defaults."
links:
  - { rel: parent, href: ../../../PLATFORM-GENOME.md }
  - { rel: behavioral-contracts, href: ../../../../docs/plan/pillar-0-governance/behavioral-contracts/B_UX.md }
---

# CSPS Vocabulary Triggers

> Three tables. Every word in CSPS that triggers behavior.
> Purpose: make the vocabulary explicit so it can be governed.
> The moat: a platform where the AI's vocabulary IS the governance layer.

---

## TABLE 1 — Governor Vocabulary → Opus Actions

When the Governor uses these words/phrases, Opus performs the mapped action.

| Governor input | What Opus does | CSPS DNA alignment | Risk if wrong |
|---|---|---|---|
| **"proceed"** | Continue current task | ADD not REPLACE; receipt before next PROTO | Can cause over-building if PROTO not clear |
| **"ratify"** / **"I ratify"** | Record as permanent decision in file + update plan | G5: key decisions in permanent files | Chat-only ratification = ephemeral |
| **"ratify all"** | Accept ALL pending recommendations; record each | Lock decisions before proceeding | May lock in wrong recommendations |
| **"fix now"** | Diagnose root cause, act immediately | Prevention over detection; structural fix | S1 fix on K≥2 = prohibited |
| **"deep dive"** | Multi-file research, cite file:line, structured analysis | B_VALIDATE_BEFORE_ASSUME; ZF discipline | Analysis without action = wasted context |
| **"see how"** | Research options, present PCR (Pros/Cons/Recommendation) | P-OP-003 PCR mandatory | Naked question violation if no recommendation given |
| **"consolidate"** | Find duplicates, merge to ONE canonical source | ONE SOURCE principle | Must verify before merging — may lose context |
| **"save and push"** | Write permanent files + git commit + git push | G5 permanence; zero-laptop | Must include GitHub links in confirmation |
| **"what would top expert"** | Research-backed, CSPS-adapted recommendation | B_AI_PROFESSIONAL_VOICE; never sycophantic | Don't adopt industry patterns blindly |
| **"go over all"** | Comprehensive audit of current platform state | ZF termination discipline | Must cite file:line, not general areas |
| **"from sonnet"** + report | Receipt → analyze → next PROTO (not re-read) | Receipt before PROTO mandate | Skipping receipt = Turn Protocol violation |
| **"I approve"** / **"I accept"** | Execute the recommended action | 4-condition gate: ratified+reversible+mechanical+no-cross-actor | Don't expand beyond what was approved |
| **"tell me if to send"** | Present for Governor review; do NOT send yet | Governor relay model | Autonomously sending = Turn Protocol violation |
| **"present"** / **"show"** | Produce readable output for Governor (not for Sonnet) | B_ZERO_NAVIGATION_FOR_GOVERNOR | Must be self-contained, inline |
| **"create"** / **"build"** + permanent | Write to file, commit, push | Everything in permanent files | Chat-only creation = ephemeral, lost |
| **"Developer's Journey — ratified"** | Execute PROTO-J Part 2 immediately | Session gate: unlocks PROTO-K | Only this exact phrase triggers it |
| **"Core Complete — ratified"** | Update CORE-COMPLETE-EXIT-CRITERIA.md declaration | Session milestone | Only this exact phrase |

---

## TABLE 2 — Opus Vocabulary → Internal Behaviors

When Opus uses these terms, specific internal behaviors fire.

| Opus term | What it means | What Opus does internally | Validation |
|---|---|---|---|
| **PROTO** | Build specification for Sonnet | Must include: ALIGNMENT block + NON-NEGOTIABLES + ZF report spec | Loop 5 UX Pre-flight if UI |
| **ZF Cycle** | Zero-Findings iteration | Must cite specific file:line per cycle; iterate until truly 0 new | validate-zf-cycle-format.mjs |
| **T1 / T2 / T3** | Enforcement tier | T1=pre-write hook, T2=pnpm verify, T3=session injection | All 3 required for new rules |
| **K>=2** | Structural fix required | Cannot patch; must design structural prevention | gap-recurrence-register.yaml |
| **BLOCKING** | Session-blocking finding | Must be resolved before proceeding; surfaces in verify output | exit_code=1 |
| **ratified** | Decision locked | Write to permanent file, update plan, use GitHub link | G5 permanence gate |
| **ADD not REPLACE** | Preservation constraint | New content below existing; never overwrite without "REPLACE" directive | Loop 4 hook |
| **CEC** | Complete Extraction Cycle | Walk 8 surfaces; iterate until 0 new opportunities | P-META-006 |
| **gap_*** | Gap register entry | Check gap-recurrence-register.yaml K count + fix status | validate-gap-recurrence.mjs |
| **advisory** | Non-blocking finding | Note, count toward K, but don't block | Loop 6: UX Reflexivity |
| **Governor decision needed** | Execution stop | Explicitly surface the question; don't guess | Relay Engine protocol |
| **receipt** | Acknowledge Sonnet report | Write Turn N receipt to sonnet-turn.md with ZF block | Receipt-before-PROTO rule |
| **PE-ordered** | Priority Engine sorted | Check validate-pe-dashboard.mjs output for current ranking | PE sub-engine of CIE |
| **CIE.get*()** | Service API call | Query libs/intelligence/src/index.ts | CIE wired to session-open |
| **permanent files** | Committed to git | Write → commit → push → GitHub link in response | G5 guard question |

---

## TABLE 3 — CSPS Canonical Terms (CSPS meanings override training defaults)

These words have specific CSPS meanings that override Claude's training defaults.

| CSPS term | CSPS meaning | Training default (wrong) | Override mechanism |
|---|---|---|---|
| **"PROTO"** | Structured Sonnet build spec with ALIGNMENT block | Generic "prototype" or "protocol document" | startup.template.md DIRECTOR section |
| **"Governor"** | Yariv Fink — platform owner, sole human decision authority | Generic "system administrator" | session-open injection |
| **"prevention"** | T1 hooks that fire BEFORE file creation | Post-hoc auditing and review | UX Prevention Architecture |
| **"session"** | Bounded governance unit S0NN (not a chat conversation) | Open-ended conversation thread | session-state.json |
| **"ratified"** | Permanent decision recorded in a git-committed file | General agreement in conversation | G5 permanence check |
| **"DONE"** | Built + pnpm verify exit_code=0 + behavioral test | Task completed, marked finished | startup.template.md |
| **"T1"** | Pre-tool-use hook (fires BEFORE write) | First tier of anything | .claude/hooks/ directory |
| **"avatar"** | Extended BehaviorProfile.human_profile (CSPS archetypes) | Generic user persona document | AVATAR-SCHEMA.md |
| **"CIE"** | Combinatorial Engine — computes, does not decide | Central AI controller | R2-01-PIE.md |
| **"colleague voice"** | Voice profile that speaks as a peer, not a teacher | Generic "friendly tone" | voice-profiles.yaml colleague entry |
| **"moat"** | Architectural advantage that is hard to replicate | Competitive differentiation in general | moat-registry.md M-* entries |
| **"ZF"** | Zero Findings — evidence-based cycle termination | "Everything is fine" | validate-zf-cycle-format.mjs |
| **"gap"** | Recurrence register entry with K count | Generic problem or issue | gap-recurrence-register.yaml |
| **"Layer 1/2/3/4"** | CSPS Core layers from CORE-COMPLETE-EXIT-CRITERIA.md | Generic architecture tiers | CORE-COMPLETE-EXIT-CRITERIA.md |

---

## ALIGNMENT PRINCIPLE

> "When a word triggers behavior, the behavior must carry CSPS DNA."
> Every trigger in Table 1 maps to a specific CSPS principle.
> Every term in Table 3 has an override mechanism.
> The vocabulary IS the governance layer — undefined terms default to training = drift.

---

*CSPS Vocabulary Triggers v1.0 | S059 | Opus-8*
*Extend when: new trigger observed, new CSPS term defined, new drift pattern detected.*
*This file IS the vocabulary moat. Keep it current.*
