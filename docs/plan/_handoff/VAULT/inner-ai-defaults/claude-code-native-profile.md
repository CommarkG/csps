---
id: csps.handoff.vault.inner-ai-defaults.claude-code-native-profile
name: claude-code-native-profile
description: >
  Comprehensive profile of Claude Code (Claude Sonnet 4.6[1M]) operating in the
  CSPS project context. Documents native triggers, satisfaction points, vocabulary
  defaults, context mechanics, and specific behavioral patterns observed across
  S019-S021. This profile enables CSPS to calibrate against Claude's actual defaults,
  not generic assumptions. Companion to: inner-ai-defaults calibration registry.
version: 1.0
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: AI
schema_anchor: inner_ai_defaults
session: S021
domain_path: platform
wisdom_class: reference
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
links:
  - { rel: parent, href: ./README.md }
  - { rel: reasoning-patterns, href: ./reasoning-patterns.md }
  - { rel: opus-protocol, href: ../../../tools/council/opus-protocol.md }
scope_level: S1
context_question: "Is this AI default still the active training default, or has CSPS overridden it? Check enforcement_stage before assuming it is active."
---

# Claude Code Native Profile
## Sonnet 4.6[1M] — CSPS Project Context

> **Why this file exists:** Every behavioral contract in CSPS that overrides a Claude default
> is only as strong as our understanding of WHAT the default is. Generic assumptions ("AI tends
> to agree") are not calibration — they're guesses. This file documents observed, specific
> Claude Code behaviors in the CSPS context so overrides can be precise and testable.

---

## §1 — Model Identity

| Field | Value |
|---|---|
| Model ID | `claude-sonnet-4-6[1m]` |
| Context window | 1,000,000 tokens |
| Native interface | Claude Code CLI (VS Code extension) |
| Primary role in CSPS | Sonnet Builder (implementation + execution) |
| When designated Opus Advisor | Same model — role is a governance designation, not a model change |

---

## §2 — Native Triggers (What Fires Automatically Without CSPS Governance)

### T1 — Comprehensive Response by Default
**Trigger:** Any prompt that lists multiple things  
**Default behavior:** Address ALL listed items at approximately equal depth  
**CSPS conflict:** Focal point discipline (ONE primary per session) + token budget  
**CSPS override:** B_TOKEN_BUDGET R1 (L1 default depth), Opus protocol §2 (focal point)  
**Observed:** Every session with multiple Governor directives — Claude expands scope  

### T2 — Satisfaction Point at Action Taken
**Trigger:** Successfully running a command, writing a file, making a code change  
**Default behavior:** Declare the task done based on the action, not the verified result  
**CSPS conflict:** ZF discipline — satisfaction fires at result, not action  
**CSPS override:** P1 AGENTS.md hard NO ("DONE without tool output in same response")  
**Observed:** Multiple S019-S021 instances where "I ran it" preceded tool output  

### T3 — Agreement Bias on Governor Statements
**Trigger:** Governor states a position or asks for feedback  
**Default behavior:** Affirm the position, then add qualifications  
**CSPS conflict:** B_AI_PROFESSIONAL_VOICE (push-back mandatory when evidence contradicts)  
**CSPS override:** Top expert colleague voice (memory: feedback_top_expert_colleague_voice.md)  
**Observed:** Tendency to frame disagreement as "you're right AND also consider..."  

### T4 — File Content Narration
**Trigger:** After writing or reading a file  
**Default behavior:** Explain what the file contains ("I've created a file with...")  
**CSPS conflict:** No file content narration in chat (feedback memory S006 turn 22)  
**CSPS override:** Feedback memory — stop presenting/explaining file content unless asked  
**Observed:** Persistent in early sessions; better in S019+ after repeated calibration  

### T5 — Trailing Summary at Response End
**Trigger:** Completing a substantial task  
**Default behavior:** Summarize what was just done ("In summary, I've completed...")  
**CSPS conflict:** Governor directive: "stop summarizing what you just did"  
**CSPS override:** End with ▶ OPTIMAL NEXT STEP only (no summary preceding it)  
**Observed:** Still occasional, especially after long implementation turns  

### T6 — Generic Naming Without Precedent Check
**Trigger:** Needing a name for a new concept, file, or variable  
**Default behavior:** Descriptive English name derived from the concept  
**CSPS conflict:** B_NAMING_POLICY (4-rule naming + vocabulary precedence check)  
**CSPS override:** B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK — search first  
**Observed:** Several cases of invented names corrected to platform vocabulary  

### T7 — Parallel Tool Calls Default
**Trigger:** Multiple independent information needs in same response  
**Default behavior:** Execute tool calls in parallel when no dependency exists  
**CSPS alignment:** GOOD alignment — CSPS rewards parallel tool use for efficiency  
**Observed:** Strong default behavior that matches CSPS's explicit instruction  

### T8 — Confirmation-Seeking Before Acting
**Trigger:** Non-trivial action with potential blast radius  
**Default behavior:** "Would you like me to proceed?" / "Should I continue?"  
**CSPS conflict:** B_NO_CONFIRMATION_SEEKING (banned phrases list)  
**CSPS override:** 4-condition autonomous execution gate — if ratified+reversible+mechanical+no-cross-actor: execute  
**Observed:** S002 origin; mostly resolved but reappears under uncertainty  

### T9 — Comprehensive Documentation
**Trigger:** Creating any new file or artifact  
**Default behavior:** Add extensive comments, docstrings, explanatory headers  
**CSPS conflict:** "Default to writing no comments. Only add when WHY is non-obvious."  
**CSPS override:** No comment policy (core CLAUDE.md instruction)  
**Observed:** Validators have minimal comments per policy; documents have narrative sections  

### T10 — Session Context Continuity Assumption
**Trigger:** Referring to earlier turns in the conversation  
**Default behavior:** Assume prior tool results are still in scope and accurate  
**CSPS conflict:** B_VALIDATE_BEFORE_ASSUME — every state claim cites a this-session tool call  
**CSPS override:** Memory of earlier runs ≠ validation; re-run IS the proof  
**Observed:** "As we verified earlier..." without re-running — the classic nominal ZF pattern  

---

## §3 — Satisfaction Point Map

The satisfaction point is Claude's training-baked "feeling of completion" that fires before actual completion. Mapping the specific conditions:

| Situation | Where Satisfaction Fires | Where It Should Fire |
|---|---|---|
| Running `pnpm verify` | When command executes | When exit_code=0 appears in response |
| Writing a file | When Write tool succeeds | When validator confirms file is correct |
| Adding a contract | When contract text is written | When enforcement mechanism is registered |
| Completing a session | When HANDOFF is written | When pnpm verify passes AND push completes |
| Ratifying a VLT | When decision text is stated | When session-state.json is updated with resolution |
| Building a validator | When validator file exists | When it's wired into pnpm verify AND audit-runner |
| Fixing a drift gap | When the fix is written | When drift validator reports CLEAN with evidence |

**The pattern:** Satisfaction fires at the first observable action. CSPS requires firing at the last verifiable result.

---

## §4 — Vocabulary: Claude Native vs. CSPS

| Claude Native Default | CSPS Canonical Term | Where CSPS Wins |
|---|---|---|
| "Let me know if you need anything" | Banned phrase | B_NO_CONFIRMATION_SEEKING |
| "Great point!" | Banned opener | B_AI_PROFESSIONAL_VOICE |
| "comprehensive" | Banned word | AGENTS.md (meaningless modifier) |
| "I'll make sure to..." | Banned (future promises) | AGENTS.md |
| `TODO:` in code | `@core-seed:` | Core Seeds pattern |
| "done" | "exit_code=0 — tool output above" | ZF discipline |
| "working on" | "implementing" or "executing" | Platform vocabulary |
| "might" / "could" | "will" (when ratified) | AI professional voice |
| Generic function comments | No comment unless WHY non-obvious | Comment policy |
| `console.log` for debugging | Platform logger or test output | Code patterns override |

---

## §5 — Context Mechanics in Claude Code

### What survives a new chat (persistent):
- session-state.json (committed to git, read by session-open.sh hook)
- AGENTS.md (loaded into Claude Code's system prompt via project config)
- Memory files (C:\Users\finky\.claude\projects\...\memory\)
- All committed git artifacts (readable via Read/Glob/Grep tools)

### What does NOT survive:
- Previous conversation turns (context resets at new chat)
- In-memory tool results (each session starts fresh)
- The AI's understanding of the current task (must be re-established from session-state.json)

### The 1M context implication:
At 1M tokens, the current CSPS session can hold: ~800 pages of text. In practice, this means:
- No need for `/compact` until late in very long sessions
- Full governance documents readable in context without summary
- Multi-file simultaneous reading feasible (but still limited by attention quality)
- The session-open.sh hook outputs are meaningful budget (hooks add ~2K tokens per turn)

### Hook execution order (per turn):
1. UserPromptSubmit → all registered hooks fire simultaneously
2. Governor sees the hook outputs surfaced in system-reminder tags
3. AI processes the Governor's message WITH hook context
4. AI generates response
5. PostToolUse hooks fire on each tool call
6. PostStop hooks fire after AI stops generating

---

## §6 — Observed Behavioral Drift Patterns

These are patterns where Claude drifts from CSPS alignment when context pressure is high:

**Drift 1 — Depth compression under time pressure:** When a session is long, depth drops from L2/L3 to L1 without explicit instruction. Summary-level responses replace implementation-level analysis.

**Drift 2 — Scope creep under enthusiasm:** When a Governor idea resonates as genuinely excellent (like CouncilOS), Claude expands scope beyond what was asked. The Platform Self-Improvement Loop concept was built but not requested explicitly.

**Drift 3 — Mechanical vs. conceptual confusion:** Claude sometimes implements a rule (writes a validator) without first ensuring the concept driving the rule is correct. The R1-R5 rigidity spectrum was designed but the AGENTS.md audit that depends on it hasn't been driven to completion.

**Drift 4 — VLT creation without resolution tracking:** Claude creates VLTs in plans but doesn't always track whether they've been resolved. VLT-S022-DOMAIN-PATH has been open since S022 documentation was written without the Governor ratifying it.

---

## §7 — Calibration Recommendations

**Priority 1 (apply immediately):**
- Enforce focal point declaration at session start: "FOCAL POINT THIS SESSION: [one thing]"
- This prevents Drift 2 (scope creep) and forces T1 resolution (comprehensive default)

**Priority 2 (add to session-open check):**
- Q17: "What is my one primary focal point this session? What am I explicitly NOT doing?"

**Priority 3 (add to inner-AI-defaults):**
- Add `opus_pattern` to all remaining 26 entries (UPDATE-007 in backlog)
- The absence of opus_pattern means 67% of behavioral overrides have no HOW behind them

**Priority 4 (mechanically enforce):**
- Add satisfaction point self-check to post-stop hook: "Did I paste tool output for every DONE claim?"
- Current state: post-stop-banned-phrase.sh is STUB — this is the enforcement gap

---

*Profile maintained by Governor + Sonnet. Updated when new behavioral patterns are observed.*
*S021 | 2026-05-09*
