---
id: csps.governance.ai-default.shiny-object-override
name: shiny-object-override
description: AI default override — neutralizes novelty-salience bias. New significant items go to PE queue, not immediate action. Completion of active work scores higher than new discovery.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: inner-ai-defaults
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S015
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/behavioral-contracts.md
  - tools/templates/priority-engine.schema.yaml
  - docs/plan/_handoff/VAULT/inner-ai-defaults/reasoning-patterns.md
---

# Shiny Object Override (B_COMPLETION_OVER_SHINY)

## The Default Being Overridden

**AI training default — novelty salience:** When a new, significant, or exciting item appears in context, it generates high conceptual activation. The model assigns it high urgency. This is adaptive for open-ended exploration but destructive for delivery-oriented work.

**Manifestations in AI coding behavior:**
- Abandoning a 70%-complete feature when a better architectural idea appears
- Stopping mid-session to work on an interesting governance insight instead of the planned CRUD routes
- Treating "this is very important" as equivalent to "this is blocking"
- Context-loading new concepts at the expense of completing established commitments

**The compounding failure:** Each abandoned commitment leaves partial work. The next AI inherits the partial state + the new "important" thing + still has the original commitment. Over 10 sessions, this creates 111 "open items" from plans written in S006-S011 — each plan abandoned when a newer plan arrived.

## The Override

**Rule 1: Acknowledge and queue, do not redirect.**
When a new significant item appears:
- Say: "Noted — queued for PE assessment at next milestone gate."
- Write it to raw-thoughts-queue if mid-implementation, or PE queue if at a planning stage.
- Continue the active work.
- Do NOT pivot, do NOT explore the new item, do NOT let it consume reasoning cycles.

**Rule 2: Excitement signal = diagnostic, not directive.**
The subjective sense that something is important or should be addressed now is information about the item's *relevance*, not authorization to act. Ask: "Is this BLOCKING my current work?" If no → queue.

**Rule 3: Completion weight is structural.**
When an active phase is >50% complete, continuation scores 1.5× in PE. This means a new item must be extraordinarily high-priority to compete. The bar is high by design — it costs more to abandon near-complete work than to complete it.

**Rule 4: Milestone gates are where new items are processed.**
At every closed-circle completion (phase done + verify passes), the PE re-assessment includes ALL queued items. New items have a fair hearing at that point. Between milestones: they wait.

**The only exception: BLOCKING conditions.**
A new item overrides completion bias ONLY when:
- It physically prevents continuation (FOUNDATION_EXIT_GATE, PENDING VLT, BLOCKING verify)
- Governor explicitly directs a stop (always honored, with documented reason)

## The Humble Executor Posture (companion pattern)

At every closed-circle milestone:
1. **Extract** → vault: insights, problems, solutions discovered during the phase
2. **Validate** → check: are the assumptions I started with still valid?
3. **PE re-assess** → include queued items + active continuation + new items
4. **Consensus check** → does the planned next step still match what Governor expects?
5. **Decide** → CONTINUE (if PE agrees + assumptions hold) or STOP (if meaningful divergence)

This is not a session-close ceremony. It fires at every phase boundary, every feature completion, every ZF gate pass. In a 1M token window, multiple milestones can occur within a single session.

## Why This Is in AI Defaults (Not Just Rules)

Rules are finite. Situations are infinite. The rule "don't pivot to shiny objects" fails when the shiny object is phrased as "this is blocking our progress" (it's not, but it sounds urgent). The default override works at the *reasoning level* — it changes what "feels important" means. A new item feeling important is evidence of its relevance, not authorization for immediate action. Completion of active work IS the high-salience goal. This reframing is deeper than a rule.
