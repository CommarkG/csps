---
id: SIA.ZERO-FRICTION-INTAKE
name: ZERO-FRICTION-INTAKE
description: "Zero Friction intake system — parallel to the structured Planning Wizard. Starts with one open question, uses AI to progressively extract JTBD signals through depth levels (pillars → domain → core loop → specifics). Outputs the same YAML plan item format as the wizard. Potentially the DEFAULT intake path. Governor-directed S060."
type: architecture
diataxis_type: reference
protection_level: protected
status: ratified
core_spines: [AI, ARCH, OPER]
core_spine: AI
schema_anchor: vault_files
version: "1.0"
session: S060
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Has the user described their intent freely? What Level of the depth model have they reached? What signals have been detected (avatar, domain, JTBD)?"
context_quote: "The best plan item is the one the user didn't know they were filling out."
inherits_from: "R1-04-THRESHOLD.md + AVATAR-SCHEMA.md + VOICE-PROFILE-SYSTEM.md + R3-01-JOURNEY-FRAMEWORK.md §Stage 2 PLAN"
links:
  - { rel: threshold, href: R1-04-THRESHOLD.md }
  - { rel: avatar, href: AVATAR-SCHEMA.md }
  - { rel: voice-profiles, href: VOICE-PROFILE-SYSTEM.md }
  - { rel: planning-wizard, href: ../../apps/csps-playground/src/app/platform/wizard/page.tsx }
  - { rel: journey-framework, href: R3-01-JOURNEY-FRAMEWORK.md }
---

# Zero Friction Intake System

> Parallel path alongside the structured Planning Wizard.
> Starts with ONE open question. Ends with a complete YAML plan item.
> The user never feels like they're filling a form.
> Governor-directed S060 as potential DEFAULT intake path.

---

## Core Principle

The Planning Wizard (structured) works for developers who know what they want.
Zero Friction works for everyone else — including developers at the idea stage.

**Zero Friction rule:** Never ask a question the AI can infer. Only ask when there are genuinely two different paths and the answer changes everything.

---

## The Depth Model (5 Levels)

Each level is a group. Within each group, there may be sub-questions.
The AI decides which sub-questions to ask based on signals already extracted.

### Level 0 — Open Expression
**The only mandatory question:** "What do you want to build or do?"

Free text. No structure. No minimum length. Voice: colleague.
The AI listens for signals in the response:
- Entity types (people, debts, invoices, tasks, recipes)
- Action verbs (collect, manage, remind, organize, track)
- Pain words (annoying, awkward, manual, forget, chase)
- Frequency signals (daily, every month, each client)

**Output:** primary_entity detected, action_intent detected, avatar signals extracted

---

### Level 1 — Pillar Classification (Threshold classifies)

Based on Level 0 signals, Threshold routes to one of 5 pillars:
- **APP** — interactive tool users come back to repeatedly
- **FEATURE** — an addition to an existing product or workflow
- **PROCESS** — a repeatable workflow or automation
- **CONTENT** — something created for others to consume
- **TOOL** — a one-time or occasional utility

**AI only asks if ambiguous.** If the user said "I want to build something that people use every day to track their clients," Threshold classifies as APP without asking.

**Clarifying question (only if needed):** "Is this something people use regularly, or more of a one-time thing?"

---

### Level 2 — Domain + Avatar Detection

From the classified pillar and free text, AI detects:
- **Context:** business | personal | creative | educational | technical
- **User type:** Is the person building it ALSO the user? Or building for others?
- **Avatar archetype:** The Doer? The Founder? The Operator? (from AVATAR-SCHEMA.md)

**Clarifying question (only if needed):**
For business apps: "Is this for managing your own work, or for serving clients?"
For creative apps: "Is this for personal projects, or for sharing with others?"

**Output:** context, avatar_type, voice_profile (auto-selected based on avatar)

---

### Level 3 — Core Loop (JTBD Crystallization)

The AI extracts the primary repeating action:
- What does the user DO every time they use this?
- What happens AFTER they do it?
- What is success in one sentence?

**Clarifying questions (select 1-2 max):**
- "What's the one thing you'd do in this every day?"
- "What would you know was working?"
- "What are you doing now instead of this?"

**Output:** core_loop, desired_outcome, current_workaround

---

### Level 4 — Specifics (Plan Item Completion)

AI completes the remaining JTBD fields with a mix of inference and targeted questions:
- **Who needs this:** "Can you name 3 people who have this problem right now?"
- **Market position:** "What do they use today? Why doesn't that work?"
- **Willingness to pay:** "Would they pay for this if it existed?" (yes/no sufficient)
- **Phase 1 scope:** AI proposes based on core_loop; user confirms or adjusts

**Output:** complete plan item YAML (same schema as Planning Wizard)

---

## Template System

After ANY completed intake (Zero Friction OR structured wizard):

```
✅ Your plan item is ready.

[Save as template] — so you can reuse this pattern for similar apps
[Download YAML] — standard browser download
[View in wizard] — open in structured view for editing
```

### Template storage
`tools/data/intake-templates/` — YAML files per template
Each template: category + avatar_type + voice_profile + filled sections
Browsable at `/platform/templates`

### Template categories (v1.0)
- Business tools (invoicing, tracking, management)
- Personal productivity (habits, goals, organization)
- Social/community (connection, sharing, collaboration)
- Knowledge management (notes, resources, learning)
- Service/client work (proposals, projects, delivery)

---

## The Dedicated Page

**Route:** `/platform/zero-friction`

**Structure (applying UX-CORE + UI-CORE):**
- Title: "Tell Us What You Want to Build"
- Purpose: "Just describe your idea. We'll ask the right questions."
- Large text input (takes full width, no form)
- Submit: "Start →" button (primary, accent color)

Progressive conversation UI:
- Each level shows as a new message from the AI (chat-like, not form-like)
- User responses shown as their own messages
- Progress indicator: showing which depth level has been reached
- "Switch to structured wizard →" link available at any point

The experience reads like a smart colleague asking questions, not a form demanding answers.

---

## Output Format (same as Planning Wizard)

Zero Friction produces identical YAML to the structured wizard:
```yaml
id: wizard-draft-[slug]
slug: [slug]
status: draft
created_by: zero-friction-intake
voice_profile: [detected]
avatar_type: [detected]
intake_level_reached: 4  # how deep the conversation went
sections:
  problem_statement: ...
  user_persona: ...
  market_position: ...
  core_loop: ...
  ai_behavior_analysis: ...
  success_metrics: ...
  phase_plan: ...
```

The `created_by: zero-friction-intake` field distinguishes it from wizard-created items.

---

## Connection to Existing Architecture

| Existing system | Zero Friction connection |
|---|---|
| Threshold (R1-04) | Classifies Level 0 free text → routes to Level 1 |
| Avatar Schema | Detected from free text signals → drives voice profile selection |
| Voice Profile System | Auto-selected based on detected avatar → shapes how Level 2-4 questions are phrased |
| CIE Learning Loop | Patterns from Zero Friction sessions → improve detection over time |
| Planning Wizard | Zero Friction outputs to same YAML schema |
| BehaviorHub | Session signals stored in BehaviorProfile for future personalization |

---

## Why This Might Become the Default

The structured wizard assumes the user knows enough to answer 7 specific sections.
Zero Friction assumes nothing — it meets the user exactly where they are.

For external users (app end-users planning their own projects): Zero Friction is the only viable path.
For developers who "just have an idea": Zero Friction is faster than the structured path.
For power developers who want full control: the wizard remains the better choice.

The system defaults to Zero Friction and offers "Use structured wizard →" as an alternative.

---

## Build Sequence (Governor-directed, Governor guides)

**Phase 1 (next PROTO):** Stub page at `/platform/zero-friction` with Level 0 input
**Phase 2:** Level 1-2 (Threshold classification + Avatar detection)
**Phase 3:** Level 3-4 (Core loop + specifics completion)
**Phase 4:** Template system (save, browse, reuse)
**Phase 5:** Integration as default intake in debt-collection app

**Governor guides each phase.** No phase starts without Governor direction.
The system will ask at every relevant PROTO: "Where are we on Zero Friction?"

---

## Open Questions for Governor (to guide Phase 1)

Q1: Should Level 0 be a single text input or a voice input option?
Q2: Should the AI show its reasoning ("I detected: business tool, The Doer avatar") or stay invisible?
Q3: Should templates be shared across Governor/developers, or private per user?
Q4: At which Level does Threshold route to a specific processing pipeline?
Q5: Should the Zero Friction page be on the playground (/platform/zero-friction) or directly in the debt-collection app as the primary onboarding?

---

*Zero Friction Intake v1.0 | RATIFIED S060 | Governor-directed | Opus-8*
*Governor guides every phase. Proactively ask: "Where are we on Zero Friction?" after every PROTO.*
