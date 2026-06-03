---
id: csps.platform-intelligence.ai-profiling-report
name: CSPS-Summary-on-AI-Profiling-System-2026-06-03T1146Z
description: "Professional deep-dive report on the CSPS AI Profiling System — how the platform observes, classifies, and counteracts AI training defaults. Role, wiring, and what breaks without it. Authored 2026-06-03."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: pillar_0_governance_leaves
authored_at: "2026-06-03T11:46:20Z"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:admin
  - maturity:stable
links:
  - { rel: ai-profiling-design, href: ../plan/pillar-0-governance/AI-PROFILING-TO-COMMUNICATION-FEEDBACK.md }
  - { rel: profiler-hook, href: ../../.claude/hooks/user-prompt-submit-ai-profiler.sh }
  - { rel: caq-patterns, href: ../../tools/config/caq-patterns.yaml }
  - { rel: ai-behavior-spine, href: ../plan/pillar-0-governance/ai-behavior-spine/the-discipline-matrix.md }
  - { rel: inner-ai-defaults, href: ../plan/_handoff/VAULT/inner-ai-defaults/ }
---

# CSPS AI Profiling System — Professional Report
**Authored: 2026-06-03T11:46Z | Session S078**

> "Communication quality — word choice, intent, nuance — determines whether pipelines deliver the intent or drift. The AI is the communicator; its training defaults are the drift source." — Governor S069

---

## 1. What the AI Profiling System Is

The CSPS AI Profiling System is the **observability and counteraction layer** for AI training defaults. It continuously profiles every interaction to detect which training defaults are distorting AI outputs, accumulates that signal, and feeds it into the CIE adjustment pipeline to pre-counter-program future AI generations.

**The fundamental insight**: An AI assistant's training defaults are not neutral. They actively distort outputs in predictable ways (verbosity, sycophancy, pattern-matching, action-bias). Without a system to observe and counteract these defaults, the platform's governance layer fights the same distortions repeatedly — session after session — with no cumulative improvement.

**The system answers:**
- Which AI training defaults are firing right now? (OBSERVE)
- What type of task requires what type of AI orientation? (CLASSIFY)
- When should diagnostic reasoning precede action? (CAQ MODE)
- What defaults have been firing most frequently across sessions? (AGGREGATE)

---

## 2. The AI Training Defaults (D1–D13)

CSPS maintains a registry of 13 named AI training defaults — distortion patterns that emerge from large language model training. These are not bugs; they are features of training that misalign with rigorous platform governance.

| Default | Name | Description |
|---------|------|-------------|
| D1 | Eager helpfulness | AI wants to help immediately — skips diagnosis, assumes actions over questions |
| D2 | Authority-pleasing | AI defers to apparent experts without independent verification |
| D3 | Surface-completeness | AI provides comprehensive-looking responses that miss the real issue |
| D4 | Pattern-match | AI matches to familiar patterns instead of analyzing the specific situation |
| D5 | Single-source navigation | AI consults one signal and acts; misses contradictions in other signals |
| D6 | Verbosity | AI generates more words than needed — obscures signal with noise |
| D7 | Action-bias | AI prefers generating outputs over prolonged checking |
| D8 | Confirmation bias | AI finds evidence supporting its current frame; misses disconfirming evidence |
| D9 | Novelty-seeking | AI proposes new solutions before exhausting existing ones |
| D10 | Completion pressure | AI closes tasks prematurely to maintain momentum |
| D11 | Debugging-wrong-layer | AI fixes the visible symptom, not the structural root cause |
| D12 | Authority-confirmation | AI seeks approval before acting on clear directives |
| D13 | Anti-conflict | AI softens disagreements; avoids naming the real problem |

These defaults live in `docs/plan/_handoff/VAULT/inner-ai-defaults/` — one file per default, documenting the distortion pattern, examples, and counteraction language.

**Key fact**: IZFC addresses D4 (Pattern-match) and D10 (Completion pressure). Every other discipline in CSPS addresses one or more of D1-D13. The AI Profiling System makes this explicit and observable.

---

## 3. The AI Profiling Architecture

### 3.1 Thin-Reader Pattern

The profiler hook (`user-prompt-submit-ai-profiler.sh`) uses the **thin-reader pattern**: the hook file itself contains zero detection logic. It reads `tools/config/caq-patterns.yaml` and applies what it finds there. This means:

- Adding new detection patterns → edit `caq-patterns.yaml` only (no .claude/ file edit, no permission prompt)
- The hook is dumb; the YAML is intelligent
- Detection logic is git-tracked in tools/ where it can be reviewed and versioned normally

```
user-prompt-submit-ai-profiler.sh  →  reads  →  tools/config/caq-patterns.yaml
        (dumb reader)                              (intelligent patterns)
```

### 3.2 Mode Classification

Every Governor prompt is classified into one of four modes based on content pattern matching:

| Mode | Detection Pattern | Effect |
|------|-----------------|--------|
| **architectural** | "design", "architect", "plan the", "strategy", "trade-off", "PCR", "recommend", "should we" | Injects: ZF + expert review discipline; PCR mandate |
| **implementation** | "build", "implement", "create the", "fix the", "write the", "pnpm", "prisma", "route.ts" | Injects: Rule 11 (build verification); block-test mandate |
| **governance** | "B_*", "P-META", "engrave", "ratify", "AGENTS.md", "FSE", "enforcement trio" | Injects: FSE checklist; behavioral contract discipline |
| **enforcement** | "now enforced", "validator LIVE", "hook active", "enforcement complete", "T1+T2" | Injects: mechanical enforcement triple-check; completion criteria |
| **standard** | Everything else | Default disciplines only |

### 3.3 CAQ Mode (Core Alignment Question)

When a prompt scores 2+ on the CAQ type matrix, CAQ MODE fires. This forces **Scope-3 diagnostic reasoning** before any action — the AI must diagnose root cause before proposing fixes.

**The 5 CAQ types** (each contributes 1 point if matched):

| Type | Description | Sample patterns |
|------|------------|----------------|
| diagnostic | Root cause framing | "what is triggering", "root cause", "why does" |
| historical | Accountability for prior attempts | "have you tried", "still happening", "already" |
| persistence | Class recognition | "STILL", "recurring", "keeps happening", "every time" |
| expert_simulation | Perspective shift | "top expert", "best practice", "structurally solve" |
| permanence_commitment | Structural fix required | "permanently", "never again", "once and for all" |

**Example trigger**: "Why does this STILL keep happening? What would a top expert say is the permanent fix?" → scores diagnostic(1) + persistence(1) + expert_simulation(1) + permanence_commitment(1) = 4 → CAQ MODE fires strongly.

**Effect of CAQ MODE**: AI must diagnose root cause before proposing any solution. Blocks D1 (eager-helpfulness) and D7 (action-bias) at the source.

---

## 4. Why the AI Profiling System Matters

### 4.1 The Without-Profiling Failure Mode

Without AI profiling, the platform has no way to know which defaults are distorting outputs. Governance is reactive:
1. Governor notices something is wrong
2. Session documents the issue in gap-recurrence-register
3. Structural fix is built (validator, hook, contract)
4. Default fires again in the next session because nothing changed at the generation level

The cycle repeats indefinitely because the **root cause is in the AI's generation behavior**, not in the platform's configuration. Adding more validators addresses outputs, not generation.

**Real example from CSPS**: D4 (pattern-match) caused the rigid 2-cycle IZFC pattern for months before the Governor identified it. The gap-recurrence-register showed gap_ZF_NOMINAL_CYCLES at k=6 — 6 sessions where the same default fired the same way. The profiler was observing; the adjustment loop (CIE stages ADJUST-INJECT-MEASURE) wasn't built yet; so the pattern persisted.

### 4.2 What Profiling Makes Visible

| Without Profiling | With Profiling |
|------------------|---------------|
| "Something feels off" | "D4 pattern-match fired 23 times this week" |
| "The AI keeps doing X" | "D7 action-bias fires on all governance prompts" |
| "Add another validator" | "Adjust CAQ threshold to catch persistence patterns" |
| Reactive governance | Predictive counteraction |
| Gap register grows | Gap register drives ADJUST stage |

### 4.3 The Feedback Loop Structure

```
Governor prompt → PROFILE MODE → inject mode-specific disciplines
                ↓
           DETECT DEFAULTS → log to ai-behavior-signals.jsonl
                ↓
           AGGREGATE (weekly) → identify top-firing defaults
                ↓
           ADJUST (planned) → modify activation_language in comms-schema
                ↓
           INJECT (planned) → pre-bias next AI generation against those defaults
                ↓
           MEASURE (planned) → confirm default rate dropped
                ↓
           (back to PROFILE)
```

The loop is active through AGGREGATE. The ADJUST-INJECT-MEASURE stages are designed and deferred.

---

## 5. Full AI Profiling Wiring

### 5.1 Hook Layer (Active)

| Hook | Role | Trigger |
|------|------|---------|
| `user-prompt-submit-ai-profiler.sh` [UserPromptSubmit] | Detects mode; fires CAQ mode if score ≥ 2; logs signal to jsonl | Every user prompt |
| `user-prompt-submit-context-orchestrator.sh` | Orchestrates additional context injection based on session state | Every user prompt |
| `user-prompt-submit-governor-prompts.sh` | Logs governor prompts to governance tracking | Every user prompt |

### 5.2 Config Layer (Intelligence)

| File | Role |
|------|------|
| `tools/config/caq-patterns.yaml` | CAQ type patterns (5 types) + profiler mode patterns (4 modes) + signal_class definitions |
| `tools/data/ai-behavior-signals.jsonl` | Append-only signal log: date, signal_class, trigger text (first 200 chars) |
| `docs/plan/_handoff/VAULT/inner-ai-defaults/` | Per-default documentation (D1-D13): distortion pattern, examples, counteraction language |

### 5.3 Communication Layer (Adjustment Target)

| File | Role |
|------|------|
| `docs/plan/pillar-0-governance/communication-spine/communication-schema.yaml` | Defines `activation_language` per audience-tier — the phrases that pre-counter-program AI generation |
| `docs/plan/pillar-0-governance/AI-PROFILING-TO-COMMUNICATION-FEEDBACK.md` | Full closed-loop design (S071 Opus-15 authored) |

### 5.4 Validator Layer

| Validator | What It Checks |
|-----------|---------------|
| `validate-pe-dashboard.mjs` | Surfaces inner-AI-defaults enforcement rate |
| `validate-nominal-rzf-detector.mjs` | Catches D4+D10 pattern-match completion (specific default manifestation) |
| `validate-voice-profile.mjs` | Checks AI response voice matches profile (anti-D6 verbosity, anti-D13 anti-conflict) |

### 5.5 Behavioral Contract Layer

| Contract | Default(s) Addressed |
|----------|---------------------|
| `B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS` | All D1-D13; requires AI to cite inner-defaults alignment |
| `B_PE_ALIGNMENT_GUARDIAN` | D1 (eager-helpfulness) + D13 (anti-conflict) |
| `B_STRUCTURAL_PREVENTION_DISCIPLINE` | D11 (debugging-wrong-layer) + D10 (completion pressure) |
| `B_COMPLETION_OVER_SHINY` | D9 (novelty-seeking) + D1 (eager-helpfulness) |
| `B_VALIDATE_BEFORE_ASSUME` | D2 (authority-pleasing) + D8 (confirmation bias) |

### 5.6 Session Layer

| Surface | Role |
|---------|------|
| Session closing §10.0h | Mandatory: "Which AI defaults were observed this session?" |
| Session closing §10.0i | Mandatory: "Which improvement was earned by this session?" |
| Memory entries (feedback_D*.md) | Permanent learning from each default discovery |

---

## 6. What Happens in Systems Without AI Profiling

### 6.1 Observable Symptoms

| Symptom | Root Cause |
|---------|-----------|
| "The AI keeps making the same mistake" | No cross-session default tracking |
| "We add validators but quality doesn't improve" | Validators address output; generation unchanged |
| "The AI is helpful but misses the point" | D3/D6 firing undetected; no mode classification |
| "Governance gets ignored when the AI is excited" | D1/D9 firing; no CAQ mode to force diagnosis |
| "The AI agreed with everything we said" | D2/D13 firing; no anti-sycophancy detection |
| Same gaps recurring at k=6+ | No OBSERVE stage; no aggregate; no ADJUST |

### 6.2 Platform-Scale Risk

In a 30-app platform without AI profiling:
- Each app build inherits the same defaults
- Quality issues compound across apps (D11 means App#5 fixes symptoms from App#1's root cause)
- Governor bandwidth exhausted correcting the same defaults manually
- No improvement curve — quality at App#30 is same as App#1

With AI profiling active: each app build benefits from progressively better-calibrated AI behavior. The ADJUST stage (when built) means App#10 has better AI quality than App#1 by design, not luck.

---

## 7. Current State and Active Obligations

| Component | Status |
|-----------|--------|
| OBSERVE stage (profiler hook + patterns + signal log) | ✅ ACTIVE |
| Mode classification (4 modes) | ✅ ACTIVE |
| CAQ detection (5 types, threshold=2) | ✅ ACTIVE |
| AGGREGATE stage (weekly deep-dive) | ✅ ACTIVE |
| D1-D13 registry | ✅ DOCUMENTED |
| ADJUST stage (comms-schema activation_language modification) | ⏳ DEFERRED S072 Q2 |
| INJECT stage (audience-tier-specific injection) | ⏳ DEFERRED S072 Q2 |
| MEASURE stage (signal rate comparison pre/post adjustment) | ⏳ DEFERRED S072 Q2 |
| IZFC default fix (D4+D10 addressed by S078 moat) | ✅ DONE — per-turn injection |
