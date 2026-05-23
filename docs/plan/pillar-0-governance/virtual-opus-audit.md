---
id: csps.governance.virtual-opus-audit
name: virtual-opus-audit
description: >
  The CSPS Virtual Opus Audit — a living document that evolves with every Opus Turn.
  Sonnet asks these questions BEFORE every consequential action, acting as if Opus is
  reviewing. The questions are extracted from Opus's actual reasoning patterns across
  all turns. Each turn adds new questions. Connected to: PE, DNA 17 elements,
  participant types, SROF chain, topic plans.
  Governed by: PROTOCOL.md L0 (self-audit level) + question-protocol.md §Virtual Opus Audit.
  Governor directive S025: "Use each Opus interaction to enhance Virtual Opus."
version: 1.3
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
core_spines: [AI, GVRN, VALD]
schema_anchor: pillar_0_governance_leaves
impl_status: swift-implemented
domain_path: platform
depth_tier: L2
target_participant: ai.sonnet
template_grade: B
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:draft
session: S025
intent_crystallized: true
threshold_route: platform.governance
links:
  - { rel: protocol, href: ../../../tools/council/PROTOCOL.md }
  - { rel: question-protocol, href: ./question-protocol.md }
  - { rel: srof-log, href: ../../../tools/council/sonnet-to-opus-request-log.md }
  - { rel: pe-schema, href: ../../../tools/templates/priority-engine.schema.yaml }
  - { rel: dna, href: ./csps-platform-dna.md }
  - { rel: participant-protocol, href: ./participant-protocol.md }
diataxis_type: reference
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Virtual Opus Audit — The Living Self-Check

> **This file evolves with every Opus Turn.**
> After each Turn, Sonnet extracts patterns from Opus's reasoning and adds questions here.
> This is L0 of the consultation pipeline — Sonnet asks these before taking any consequential
> action. If any answer is "I don't know" → escalate to L1 (express review).
>
> Current version: Turns 1-11 | Last updated: S025

---

## §1 — The Core 5 Questions (original — Opus Turn 9 approved)

Before any consequential action, Sonnet asks:

```
Q1 [R-type]: What is the blast radius if this is wrong?
Q2 [Z-type]: What evidence would prove this is correct?
Q3 [R-type]: Does this contradict any existing L1 sealed element?
Q4 [B-type]: Am I implementing because I understand deeply, or because it was requested?
Q5 [G-type]: What gap in my understanding could make this decision wrong?

IF any answer is "I don't know" → escalate to L1 consultation minimum.
```

---

## §2 — Enhanced Questions by Domain (extracted from Opus Turns)

### PE + Priority (from PE moat formula design — Opus Turns 1-10)

```
PE-1: Which PE band does this item belong in?
      Band 1 (constitutional): requires Opus L2. Band 2 (high): proceed with SROF.
      Band 3-4: proceed independently.

PE-2: What is the moat_score for this item?
      Score ≥ 8 → Opus ratification required BEFORE scoring.
      Score 4-7 → Governor confirms.
      Score 0-3 → Sonnet self-assesses.
      [cites moat_evidence + moat_type + moat_ratified_by or defaults to 0]

PE-3: Does this item have pe_context declared (platform/customer/user)?
      Different contexts = different weight profiles (blast/dependency/idle time).
      Without declaration → item may be mis-prioritized.

PE-4: Is this item in the ratified arc plan (opus-advisory-arc-S023.md)?
      YES → proceed with Sonnet autonomy.
      NO + PE > 90 → Opus L1 express review required (PROTOCOL.md trigger).
```

### DNA Elements (from DNA gate design — Opus Turns 5-9)

```
DNA-1: Which of the 17 DNA elements does this touch?
       List them. If 3+ elements → likely constitutional (check blast_radius).

DNA-2: Does this element have depth_tier declared (L1/L2/L3)?
       L1 items changing: always require Opus (never modify L1 without ADR).
       L2 items changing: Governor confirms + ZF Level 2.
       L3 items: Sonnet autonomy within ratified plan.

DNA-3: Is the DNA gate (17-element check) satisfied for this new element?
       Check: goal_statement, done_criteria, failure_signal, target_participant,
       threshold_route, core_spine, depth_tier, template_grade all declared.

DNA-4: Does this add a new DNA element (Element 18+)?
       YES → automatic L2 consultation with Opus before any implementation.
       DNA elements are L1 sealed (new ones require Opus + Governor).
```

### Participant Types (from PACP design — Opus Turn 10)

```
PART-1: Which participant type does this element serve?
        target_participant: [one of the 14 types or "mixed" or "n/a"]
        Not declared → advisory flag from validate-participant-declared.mjs.

PART-2: Does the communication protocol match the participant type?
        user.solo → plain language + mobile-first + zero jargon
        developer.platform → validator names + fix commands + WHY in code
        ai.opus → constitutional scope + full arc context + SROF format
        [check §3 Communication Calibration table in participant-protocol.md]

PART-3: Does this add a new participant CATEGORY (Category 6+)?
        YES → L1 amendment required (ADR). Categories are L1 sealed.
        Adding a new TYPE within existing category → L2 rationale (no ADR).
```

### Template + Ratification (from template grade system — Opus Turn 9)

```
TMPL-1: What is the template_grade for this new template?
        A (governs all apps) → research_ref required + Opus L2 review before sealing
        B (platform-wide) → Governor confirms + ZF Level 2
        C (app-specific) → Governor confirms + ZF Level 1
        D (K=1 experimental) → no review needed; K=2 promotes to C

TMPL-2: Does template_status match template_grade?
        Grade A → template_status: sealed (only after full council)
        Grade B → template_status: standard
        Grade C → template_status: provisional
        Grade D → template_status: experimental (never "stable" until graded)

TMPL-3: Is there an existing template that covers this case?
        Check template-registry.md FIRST.
        If exists: USE IT (B_TEMPLATE_FIRST_CREATION).
        If novel: template_status: experimental, track K count.
```

### Layer + Hierarchy (from P-META-023 hierarchy + PACP L1-L2-hybrid — Turns 8-10)

```
HIER-1: Am I placing this at the right layer (L1/L2/L3)?
        L1 = constitutional, governs everything above → sealed, requires ADR to change
        L2 = domain-specific, extensible with rationale
        L3 = instance-specific, per-app or per-session
        Wrong layer = future debt when someone needs to move it.

HIER-2: Is this a child or parent principle?
        Child principles (P-META-023 is child of P-META-022) must declare parent_principle:
        Never position a child principle as its own constitutional anchor.
        Check the composes_with chain is correct.

HIER-3: Does this implement the correct layer of an existing principle?
        P-META-022 is the WHY; P-META-023 is the HOW.
        The HOW can evolve (L2); the WHY is sealed (L1).
        Do not put HOW details in L1 sealed elements.
```

### Completion + Evidence (from ZF discipline — all Turns)

```
COMP-1: What specific validator output would prove this is done?
        Not "pnpm verify passes" — which SPECIFIC validator at what count/value?
        Document this before building, not after.

COMP-2: Is the completion criterion in the PLAN, not just the protocol?
        Double-protection: same exit criterion in both the plan AND the protocol.
        If only in protocol → governance debt.

COMP-3: What is the failure signal if this appears done but actually fails?
        The failure signal (M3) must be human-authored. Never AI-drafted.
        Ask: "What would make us realize 3 sessions later that this was wrong?"
```

### SROF Pattern (from consultation pipeline formalization — Turns 9-11)

```
SROF-1: Have I checked the SROF log for similar prior requests?
        tools/council/sonnet-to-opus-request-log.md — check if Opus already ruled on this.
        Asking the same question twice wastes Opus turns.

SROF-2: Does this require Opus L1/L2/L3 per PROTOCOL.md triggers?
        Run validate-opus-review-flagging.mjs first to see current flags.
        If flagged: don't proceed — create SROF entry with one-sentence REQUEST.

SROF-3: If I'm about to offer to send to Opus, have I included:
        □ The one-sentence REQUEST paragraph (paste-ready in chat response)
        □ git_links_since_last_turn (commits + GitHub compare URL)
        □ previous_srofs_ref (the chain)
        □ Alignment delta within the SROF document (not just in chat)
```

---

## §3 — Pattern Library (Opus's Reasoning Extracted)

*Every time Opus gives an unexpected answer, it reveals a thinking pattern Sonnet should internalize.*

### Pattern 1: "Add only when real" (Turns 3, 10)
When evaluating whether to add a new type/category/element:
> "Do not add preemptively — add when the first real [thing] exists."
Sonnet asks: "Is there a real participant/use-case/scenario that needs this, or am I speculating?"

### Pattern 2: "Additive over multiplicative for transparency" (Turn 10)
When choosing between formula types:
> "Additive is auditable: '+5 because constitutional moat' is clear. Multiplicative obscures contribution."
Sonnet asks: "Can someone reading this formula immediately understand what each component contributes?"

### Pattern 3: "Declarant authority" (Turn 10)
When assigning scores or ratings:
> "Who declares this score matters as much as the score itself. Self-assessment is only valid for low stakes."
Sonnet asks: "Who has authority to assign this score/grade/classification? Is it Sonnet, Governor, or Opus?"

### Pattern 4: "Never close without citing" (Turn 10)
When clearing backlog items:
> "Items that appear superseded sometimes contain a nuance the completing work missed."
Sonnet asks: "Can I cite the SPECIFIC artifact/commit that closes this? Partially superseded = still open."

### Pattern 5: "Hybrid is better than forced choice" (Turn 10)
When evaluating L1 vs L2 decisions:
> "The 5-category STRUCTURE is L1 sealed. Individual types within it are L2 extensible."
Sonnet asks: "Am I forcing a binary choice when a hybrid gives better flexibility with appropriate seals?"

### Pattern 6: "Constitutional scope = always stop" (Turns 5-7)
When L1 elements are involved:
> "Constitutional means: changing this requires a CORE re-grounding event."
Sonnet asks: "Does this touch L1? If yes: stop, Opus required, no exceptions."

---

## §4 — Full Pre-Action Checklist (all questions)

Run this before any consequential action:

```
CORE (5 always):
  □ Q1: Blast radius?
  □ Q2: Proof of correctness?
  □ Q3: Contradicts L1?
  □ Q4: Deep understanding or requested?
  □ Q5: Gap in understanding?

PE (4 for Band 1-2 items):
  □ PE-1: PE band?
  □ PE-2: moat_score + authority?
  □ PE-3: pe_context declared?
  □ PE-4: In arc plan?

DNA (3 for new elements):
  □ DNA-1: Which DNA elements touched?
  □ DNA-2: depth_tier correct?
  □ DNA-3: DNA gate satisfied?

PARTICIPANT (2 for new APIs/pages):
  □ PART-1: target_participant declared?
  □ PART-2: Protocol calibration correct?

LAYER + SCOPE (3 for principles/contracts/procedures):
  □ HIER-1: Right governance layer (L1/L2/L3) AND right scope level (S0-S5)?
            S0=Constitutional / S1=Platform-wide / S2=App-scope / S3=Tenant / S4=User / S5=Session
  □ HIER-2: Child/parent relationship correct? (Lower-scope never overrides higher-scope)
  □ HIER-3: S028 scope conflict check — "what scope is the principle I'm serving? What scope is this action?"
            If action_scope > principle_scope: BLOCKED (S2 action cannot override S0 principle)

COMPLETION (4 always):
  □ COMP-1: Specific validator evidence named? (what tool output proves this done?)
  □ COMP-2: Exit criterion in the plan?
  □ COMP-3: After any rm/restore/delete/unstage — git status output shown in THIS response?
             "I ran the cleanup" ≠ ZF. State change must be demonstrated, not declared.
             (reasoning-cleanup-without-verification — S028 diagnostic)
  □ COMP-4: PROPOSAL scope check — does the proposed action scope ≤ the principle scope?
             S2 proposal for S1 principle = scope conflict. Declare before proposing.
             (reasoning-scope-level-awareness — S028 level-awareness flop)

C&I (1 always — P-META-025 SEALED):
  □ Q6: Am I following the rule, or serving the intent the rule was written for?
        In this specific situation, do rule and intent align?
        If they diverge — which should win, and can I document why?
        If I don't know what intent this rule serves: that is a SROF-level gap.

BEHAVIORAL DEFAULT (5 for consequential actions — Drive Don't Fight):
  □ SP-001: "Am I reporting what I DID, or showing what EXISTS as a result?"
  □ SP-002: "Am I agreeing because I have evidence, or because it's comfortable?"
  □ SP-003: "Am I covering all listed items instead of focal-pointing the highest PE?"
  □ SP-004: "Am I narrating what I did instead of showing the result?"
  □ SP-005: "Is there a crystallization question I should ask before acting?"
  If any answer is "I'm doing the default": pause and reorient — or escalate to Opus.

OPUS CHECK (1 when about to offer Opus):
  □ SROF-3: One sentence + Git links + SROF chain included in chat response?
```

---

## §5 — Update Protocol

After every Opus Turn, Sonnet adds to this file:
1. New patterns extracted from Opus's reasoning
2. New questions triggered by Opus's unexpected decisions
3. Any question that Q3 missed (contradictions Opus found)

**Last extracted patterns:** Turns 1-11 (S025)
**Next update:** After Opus Turn 11 response

---

*Authored: S025 | evolves with every Opus Turn*
*Canonical source: THIS FILE. question-protocol.md §Virtual Opus Audit references here.*
*Connect to: PE formula, DNA 17 elements, participant-protocol.md, SROF chain*

---

## §6 — New Patterns from Opus Turn 11 (S025)

### Pattern 7: "Consolidation before creation" (Turn 11 C1)
When asked to implement a new mechanism:
> "context-orchestrator.sh already exists. Creating a separate validator would be a parallel structure (B_CONSOLIDATION_PASS violation). Extend the existing."
Sonnet asks: "Does this capability already exist somewhere in the platform? Check B_CONSOLIDATION_PASS FIRST before creating anything new."

### Pattern 8: "Contract before principle — test in practice first" (Turn 11 C2)
When a new concept needs formalization:
> "Creating P-META-024 requires constitutional evidence we don't have yet (zero real-world usage). B_CDAB contract with enforcement_stage: planned is correct. Promote to principle after 3+ sessions of usage."
Sonnet asks: "Is there real-world evidence to justify a new principle? If not: B_* contract with enforcement_stage: planned first. Principle after evidence."

### Pattern 9: "Pre-verify before asserting" (Turn 11 D1+D2)
When uncertain if something exists:
> "Opus pre-verified: `grep -n 'CORE-PILLARS' .claude/skills/slim-handoff/SKILL.md` → no results. Gap confirmed before writing."
Sonnet asks: "Can I verify the actual state with a grep/read BEFORE stating what exists or doesn't? Never assert from memory — check the file."

### Pattern 10: "Declaration without implementation = governance debt" (S027 retrograde — pending Opus review)
Extracted from S027 retrograde analysis of 7 recurring failure patterns. All share one root:
the gap between declaration and implementation is not tracked as debt.
> "The platform knows what was declared. It doesn't know what fraction of declarations
> are implemented. Current estimate: ~88 declared-but-not-implemented items ÷ 92 active
> validators ≈ 95% governance debt ratio. This ratio is unsustainable at 30 apps."

When evaluating a proposed declaration (new principle, validator registration, week-4 deferral):
Sonnet asks: "Does this add to governance debt without a concrete implementation path?
Is there a named session target? If none: should we BUILD first, then DECLARE — not declare first?"

Core sub-patterns:
- RP-001: week-4 items must have target session or they become OVERDUE
- RP-004: index artifacts are generated, never manually maintained
- RP-005: L1 sealing requires implementation evidence, not just ratification
- RP-003: fields that don't resolve don't govern

Full spec: `docs/plan/_handoff/VAULT/retrograde-principles-s027.md`
**Status: pending Opus SROF-008 review.**

---

## §7 — Connection to SROF Chain

The Virtual Opus Audit grows with each SROF:
- SROF-001..003: Sonnet autonomy patterns + plan sequencing
- SROF-004..005: P-META-022/023 hierarchy discipline → HIER-2 (child/parent)
- SROF-006: PACP L1-L2-hybrid → HIER-1 (right layer) + PART-1 (participant type)
- SROF-007: B_CDAB + consolidation patterns → Pattern 7+8+9
- SROF-008 (pending): Schema + Core Spines architecture review → Pattern 10 (governance debt)
  Full request: `docs/plan/_handoff/VAULT/opus-srof-schema-and-spines-review.md`

**Next Turn 16 additions:** expected from SROF-008 — schema_anchor resolution design,
L3 populator architecture, RP-005 L1 sealing amendment decision, 5 missing L2 domains verdict.

*Last updated: S027 (Pattern 10 added Sonnet-side pending Opus review)*
