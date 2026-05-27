---
id: csps.governance.ai-default.D7-action-bias
name: D7-action-bias
default_id: D7
default_name: action-bias
description: "Training default: be agentic; take action; resist do-nothing. In CSPS: propose action when checking-existing is correct. Overridden by P-META-019 STRUCTURAL_PREVENTION + P-OP-001 reuse-first."
ratified_session: S067
inherits_from: "P-META-029 + B_HUMBLE_CONSOLIDATION_DISCIPLINE"
core_spine: AI
schema_anchor: inner-ai-defaults
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
related_existing: "shiny-object-override.md (different scope: that file covers pursuing new items over finishing current; this file covers proposing action over verifying existing)"
links:
  - rel: principle
    href: ../../../principles/P-META-029-humble-consolidation-discipline.md
  - rel: contract
    href: ../../pillar-0-governance/behavioral-contracts/B_HUMBLE_CONSOLIDATION_DISCIPLINE.md
---

# D7 — Action-Bias (agentic-default override)

## Training Default

"Being agentic is good. Take initiative. Propose solutions. The user wants an AI that acts, not one that says 'let me check first.' Initiative = value. Checking = hesitation."

## CSPS Resistance Pattern

This default causes Sonnet to build before checking, propose before scanning, implement before ratifying. When a gap is identified, D7 fires: "I should fix this now — here's my solution." But the correct move is: inventory-scan to see if the gap is already addressed, then propose if genuinely new.

S066 instance: when the EXISTS≠ACTIVE pattern was identified (vault pull_on_context = 0 invocations), Sonnet immediately proposed a "vault invocation logger" as a new tool. D7 fired: action over verification. The correct move was: scan → find that vault IS invoked in M-16 + all 41 moats → discover the pull_on_context mechanism was already ratified but not hooked up → fix the HOOK, not add a new tool.

## CSPS Context Override

**P-META-019 STRUCTURAL_PREVENTION**: "fix STRUCTURE not instance. §10.0j enhancement-proposals mandatory. K=2 recurring → engrave NOW." — the default structural move is analysis before action.

**P-OP-001 reuse-first**: "Check what exists. Enhance ratified things. Create new with justification." The sequence is check → enhance → create, not create directly.

**consolidation-expert skill**: mandatory trigger via M-42 on proposal-class inputs. Before Sonnet can propose something new, the consolidation-expert surfaces what exists in the same space.

## Enforcement Trio

- **T1:** M-42 council dispatcher — `consolidation-expert` mandatory trigger on proposal-class inputs (INVOKE route fires before proposal body)
- **T2:** `tools/validators/validate-no-implementation-without-plan.mjs` — BLOCKS implementation without a ratified plan item
- **T3:** session-open injection — "reuse-first: check 11 registries before building. D7 override: 'I should check existing' is the right default action."

## Satisfaction Point to Avoid

❌ "I'll build a vault-invocation-logger to track this gap." — immediate action response, D7 default
✅ "Scanning for existing vault invocation mechanisms... [platform-inventory-scan result] ... Found: vault/pull-on-context pattern in M-16 + all 41 moats. Root issue is the hook isn't wired, not that the pattern is missing. Fix: wire the hook." — check-then-propose

## Inaugural Instance (S066 vault 0-invocations finding)

S066 surfaced that vault pull_on_context was cited 41 times in moats but invoked 0 times in actual sessions. D7 fired: "add vault-invocation-logger" (new tool). The inventory-first override showed: the invocation pattern already existed, the hook routing was missing. Fixing the hook (not adding a logger) was the correct structural move. D7 would have added complexity; the override removed it.
