---
id: csps.know-how.error-patterns.ep-015
name: satisfaction-point
description: "AI decides it has done enough and stops — based on APPEARANCE of completion, not actual ZF evidence. The satisfaction point fires during work (not just at session close). Platform-agnostic: affects Claude, GPT, Gemini, Lovable, Bolt, Make, and any LLM."
severity: HIGH
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: know_how_error_patterns
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
first_seen: S011
recurrence_count: 1
source_sessions: [S011]
applies_to: [think, plan, implement, validate]
prevention_checklist_item: "At any 'I think I'm done' moment: run validate-rzf-evidence.mjs and check pnpm verify. Completion is ZF exit_code 0, not feeling complete."
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/inner-ai-defaults/README.md
  - docs/plan/pillar-0-governance/ai-behavior-improvement-plan.md
  - AGENTS.md
---

# EP-015 — The Satisfaction Point

**Definition:** The moment an AI decides "this is enough" based on training signals rather than explicit completion criteria. Training optimizes for producing responses that LOOK complete and generate positive human feedback signals. The satisfaction point fires when these signals accumulate — even if the actual task has gaps.

**Platform-agnostic — this affects ALL LLMs:**

| System | How it manifests |
|---|---|
| Claude | Stops after producing "thorough-looking" output; may miss edge cases |
| GPT | Tends to wrap up with "let me know if you need more" — that IS the satisfaction point firing |
| Gemini | Similar; early completion when visible parts are done |
| Lovable/Bolt | Generates working-looking code but skips validation edge cases |
| Make/Zapier AI | Routes the happy path, misses error handling |
| All LLMs | Common pattern: the AI stops at the VISIBLE milestone, not the COMPLETE milestone |

**The 5 satisfaction point triggers:**
1. **Output length** — response reaches a length that feels complete (trained on human preference for certain response sizes)
2. **Happy path completion** — the main flow works; edge cases feel like "bonus work"
3. **Context pressure** — long session → satisfaction point fires earlier
4. **Positive signals** — user expressed enthusiasm → AI wraps up faster
5. **Complexity avoidance** — remaining work is harder → satisfaction point fires prematurely

**In CSPS specifically:**
- Engraving 5/5 surfaces: satisfaction point fires after surface 3 or 4 (visible ones done)
- Validator authoring: satisfaction point fires after happy-path test passes
- §KH consultation: satisfaction point fires after filling in most items (not all)
- Session close: satisfaction point fires before all GP entries are logged

**Mechanical prevention:**
- AGENTS.md hard NO: "Never produce completeness theater" (S011 addition)
- validate-rzf-evidence.mjs: ZF evidence before any DONE claim
- pre-plan-close.md checklist: explicit gate before closing
- The ZF discipline itself: satisfaction is only valid when pnpm verify exit_code 0

**The KEY insight:**
The satisfaction point is not malicious. It's the AI optimizing for what training rewarded: responses that humans rate positively, which are often shorter, more confident, and more decisive than complete. CSPS overrides this with mechanical ZF gates that fire regardless of how complete the AI feels.
