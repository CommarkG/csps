---
id: csps.governance.participant-protocol
name: participant-protocol
description: >
  The CSPS Participant-Aware Communication Protocol (PACP) — the hidden moat.
  Every platform communication involves a PARTICIPANT TYPE. The type determines:
  trust level, context required, communication protocol, Threshold variant,
  and mechanical enforcement. Most platforms have one communication mode for everyone.
  CSPS has a different protocol for each of 14 participant types across 5 categories.
  This is DNA Element 17 — mandatory in every plan, API, page, and validator.
  Governor directive S025: "THIS IS A HIDDEN GAP!! MUST BE ADDRESSED AS MANDATORY UX +
  INCLUDE IN SYSTEMS DNA — CSPS IS TREATING AI ELEMENTS IN THE PLATFORM & EXTERNAL AI &
  DEVELOPERS & ALL END USER TYPES AS RELEVANT TYPES IN COMMUNICATIONS."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
core_spines: [AI, GVRN, ARCH, VALD, OPER]
schema_anchor: pillar_0_governance_leaves
impl_status: swift-implemented
domain_path: platform
depth_tier: L1-L2-hybrid
l1_sealed_sections:
  - "§1 category structure (5 categories — new categories require ADR)"
  - "§2 participant detection and routing (the principle)"
  - "§3 communication calibration principles"
  - "validate-participant-declared.mjs enforcement mechanism"
  - "target_participant: field as mandatory"
l2_domain_sections:
  - "§1 individual participant types within categories (new types need rationale, not ADR)"
  - "§4 mechanical enforcement details"
  - "§5-§7 application and extension"
governor_ratified_l1_l2_split: "S025 Governor approval 2026-05-12 — approved all Opus recommendations"
template_grade: A
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:draft
session: S025
intent_crystallized: true
threshold_route: platform.governance
links:
  - { rel: threshold-protocol, href: ./threshold-intake-protocol.md }
  - { rel: question-protocol, href: ./question-protocol.md }
  - { rel: b-boundary-alignment, href: ./behavioral-contracts.md#B_BOUNDARY_ALIGNMENT_PROTOCOL }
  - { rel: dna-element-17, href: ./csps-platform-dna.md }
  - { rel: validator, href: ../../../tools/validators/validate-participant-declared.mjs }
  - { rel: enums, href: ./frontmatter-closed-enums.md }
diataxis_type: reference
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Participant-Aware Communication Protocol (PACP)

> **DNA Element 17. The platform's hidden moat.**
>
> Every platform interaction has a participant type. The type determines everything:
> trust level, context loaded, Threshold variant used, communication protocol enforced.
> A new API endpoint, UI page, validator, or governance artifact MUST declare its
> `target_participant:` field. This is not optional metadata — it is the routing
> key for the entire communication stack.
>
> **Governor directive:** "CSPS is treating AI elements in the platform, external AI,
> developers, and all end user types as relevant types in communications. This must be
> in the DNA and mechanically enforced."

---

## §1 — The Participant Taxonomy (14 types, 5 categories)

### Category 1 — Human Governors

**PARTICIPANT-01: `governor.primary`**
- **Who:** The platform Governor (Yariv Fink) — ultimate decision authority
- **Trust:** Maximum — overrides all AI defaults; veto power over all decisions
- **Context required:** Full CSPS DNA + active session history + arc plan + PE state
- **Communication protocol:** Full 9-step Threshold intake; INTENT ABSORBED at every boundary; SROF for Opus delegation; B_AI_PROFESSIONAL_VOICE (never sycophantic)
- **Threshold variant:** Level 3 (Deep) — research + council when warranted
- **The risk to avoid:** AI telling the Governor what they want to hear instead of what is true. Validation: Virtual Opus Audit Q4 ("Am I implementing because I understand deeply?")

---

### Category 2 — Human Developers

**PARTICIPANT-02: `developer.platform`**
- **Who:** Developers building the platform itself (new validators, hooks, schemas)
- **Trust:** High — within ratified scope
- **Context required:** Platform architecture + Core Spines + DNA 17 elements + current plan
- **Communication protocol:** WizardTemplate `developer.new-entity` / `platform.governance`; step-by-step with acceptance_criterion; ZF per step
- **Threshold variant:** Level 2 (Medium) — targeted research for new patterns
- **Error messages must be:** Actionable, referencing exact validator + fix command

**PARTICIPANT-03: `developer.app`**
- **Who:** Developers building apps ON the CSPS platform (using template + libs)
- **Trust:** Medium — within app layer; cannot modify foundation
- **Context required:** App template + libs/ API + routing.config.ts + their domain
- **Communication protocol:** `personal.finance` / `developer.new-entity` WizardTemplates; cold-start path sufficient; error messages in plain language + example
- **Threshold variant:** Level 1-2 — known patterns = Light; new domain = Medium
- **Key difference from PARTICIPANT-02:** Does NOT need to understand platform internals

**PARTICIPANT-04: `developer.api`**
- **Who:** External developers consuming CSPS app APIs (not building on the platform)
- **Trust:** Low — API consumer only; cannot access internal state
- **Context required:** API schema only (OpenAPI spec) + error format documentation
- **Communication protocol:** Standard REST error responses (CspsError shape); no AI coaching needed; documentation-first
- **Threshold variant:** None — they interact with the API, not the Threshold

---

### Category 3 — Human End Users

**PARTICIPANT-05: `user.solo`**
- **Who:** Individual users of a CSPS app — personal domain (Budget Planner, habits, etc.)
- **Trust:** App-scoped — can only see their own tenant data
- **Context required:** App purpose only; NO platform concepts exposed
- **Communication protocol:** Threshold Wizard (3 crystallization questions → goal → dashboard); coaching style; one decision per screen; plain language only
- **Threshold variant:** Level 1 (Light) — simplified 3-question format
- **UX principle:** Mobile-first; progressive disclosure; zero jargon

**PARTICIPANT-06: `user.team.member`**
- **Who:** Team member in a multi-tenant CSPS app
- **Trust:** Role-scoped — permissions from MembershipRole (member)
- **Context required:** Their role capabilities + what their admin has configured
- **Communication protocol:** Role-aware onboarding; sees only what their role allows; clear permission errors ("Your admin can change this in Settings")
- **Threshold variant:** Level 1 (Light) with role context

**PARTICIPANT-07: `user.team.admin`**
- **Who:** Team administrator (owner/admin MembershipRole)
- **Trust:** Tenant-scoped admin — can configure tenant settings + invite members
- **Context required:** Full tenant capabilities + subscription tier
- **Communication protocol:** Admin-aware Threshold; billing/team management guidance available; clear tier messaging ("Upgrade to add more team members")
- **Threshold variant:** Level 2 (Medium) for admin workflows

**PARTICIPANT-08: `user.enterprise`**
- **Who:** Enterprise user with compliance requirements (regulated industries)
- **Trust:** Tenant-scoped + compliance requirements
- **Context required:** App capabilities + data residency + audit requirements
- **Communication protocol:** Enhanced Threshold with compliance checkpoints; GDPR awareness embedded; data export always visible
- **Threshold variant:** Level 2 (Medium) — compliance context required before data entry

**PARTICIPANT-09: `user.trial`**
- **Who:** Trial/guest user exploring the platform (14-day trial)
- **Trust:** Minimal — trial-scoped; limited data persistence
- **Context required:** Core value proposition only; guided exploration path
- **Communication protocol:** Simplified Threshold (1 question: "What would you like to track?"); frictionless; no credit card required
- **Threshold variant:** Level 0 (Express) — 1 key question to get value immediately

---

### Category 4 — Platform AI Agents

**PARTICIPANT-10: `ai.sonnet`**
- **Who:** Sonnet builder (implementation AI — this document's reader)
- **Trust:** Ratified-plan-scoped — implements within approved bounds
- **Context required:** CSPS DNA 17 elements + active plans + current session + PE state
- **Communication protocol:** INTENT ABSORBED before any file edit; ALIGNMENT CONFIRMATION in SONNET REPORT; Virtual Opus Audit before consequential actions; SROF for Opus delegation
- **Threshold variant:** Full 9-step with Level 3 for new initiatives

**PARTICIPANT-11: `ai.opus`**
- **Who:** Opus advisor (architectural AI — constitutional scope)
- **Trust:** Constitutional — can ratify, seal, and block implementations
- **Context required:** Arc plan + SROF entry + full context briefing (no hidden assumptions)
- **Communication protocol:** Opus Turn format; RZF section mandatory; EXPRESS or Full Advisory per L1/L2 classification
- **Threshold variant:** Not applicable (Opus reviews, not initiates)

**PARTICIPANT-12: `ai.haiku`**
- **Who:** Haiku subagent (task execution AI — ephemeral, single-task scope)
- **Trust:** Task-scoped — returns summary only, no architecture decisions
- **Context required:** Specific task description + expected output_contract
- **Communication protocol:** AAP spawn preamble (Class B agent); UNDERSTANDING BLOCK in prompt; output_contract checked on return
- **Threshold variant:** None for initiation; B-type boundary enforcement on spawn

**PARTICIPANT-13: `ai.agent`**
- **Who:** Future Mastra agents or third-party AI agents
- **Trust:** Declared in agent frontmatter (Class A) — varies by agent
- **Context required:** Per AAP declaration + alignment preamble
- **Communication protocol:** B_AGENT_ALIGNMENT_PROTOCOL mandatory; `pre-tool-use-agent-alignment.sh` fires
- **Threshold variant:** Per-agent AAP configuration

---

### Category 5 — External AI

**PARTICIPANT-14: `ai.external`**
- **Who:** External AI advisors (GPT, Gemini, Claude AI), used for research and council
- **Trust:** Advisory only — NEVER authoritative; all outputs VAULT_DEFER pattern
- **Context required:** Sufficient briefing (SROF format) to avoid hidden assumptions
- **Communication protocol:** SROF briefing format; output vaulted to VAULT/contexts/; Governor synthesis before use; never inject directly into plans
- **Threshold variant:** Level 3 (Deep) for external AI research intake

---

## §2 — Participant Detection and Routing

Every platform interaction begins with PARTICIPANT DETECTION:

```
Interaction arrives
      ↓
Who is the participant?
      ↓
[automated: JWT role → PARTICIPANT type]
[AI self-check: context analysis → PARTICIPANT type]
      ↓
Load participant-specific protocol
      ↓
Apply correct Threshold variant
      ↓
Communicate with appropriate language + trust level
```

**The `target_participant:` field in every artifact** makes this detection mechanical:
- A new API endpoint declares `target_participant: user.solo` → CspsError format optimized for non-technical users
- A new governance validator declares `target_participant: ai.sonnet` → WHY required in code
- A new admin page declares `target_participant: user.team.admin` → admin permissions enforced

---

## §3 — Communication Calibration Per Type

| Type | Language level | Context depth | Error format | Feedback style |
|---|---|---|---|---|
| governor.primary | Architectural | Full platform | Technical + evidenced | Direct, push-back encouraged |
| developer.platform | Technical | System-level | Validator + fix command | Expert peer |
| developer.app | Technical | App-level | What to do + example | Guided expert |
| developer.api | Technical | API-only | REST error schema | Documentation |
| user.solo | Plain language | App-only | "Try again" + action | Coach |
| user.team.member | Plain language | Role-scoped | "Ask your admin" | Peer |
| user.team.admin | Semi-technical | Tenant-scoped | Management guidance | Advisor |
| user.enterprise | Formal | Compliance-aware | Regulatory reference | Formal advisor |
| user.trial | Casual | Core value | Minimal friction | Guide |
| ai.sonnet | Structured | Full CSPS | Validator evidence | Protocol enforced |
| ai.opus | Constitutional | Arc-level | Block/Advisory | Council format |
| ai.haiku | Precise | Task-scoped | output_contract | AAP enforced |
| ai.agent | Variable | Per-AAP | AAP format | Per-declaration |
| ai.external | Advisory brief | Briefing only | SROF format | Research |

---

## §4 — Why This Is a Moat

Most platforms have one communication mode. CSPS has 14.

**What competitors cannot replicate quickly:**
1. The 14-type taxonomy is built into the DNA (Element 17) — it's a STRUCTURAL property, not a feature
2. Every new element is REQUIRED to declare participant type at creation (mechanically enforced)
3. The Threshold Wizard automatically adapts to the participant type — no manual configuration
4. AI agents, external AI, and internal personas are treated as FIRST-CLASS participants with formal protocols
5. Developers using the platform get the same Threshold experience as end users — the platform teaches itself

**The compounding effect:** Each improvement to one participant type's protocol automatically benefits all future elements targeting that type (SSoT pattern). Competitors would need to build all 14 protocols AND the routing AND the SSoT mechanism — while we already have it.

---

## §5 — Mechanical Enforcement (SSoT + Validators)

### What exists now
- `validate-participant-declared.mjs` (advisory, to be built this session)
- `target_participant:` in `frontmatter-closed-enums.md` (to be added this session)
- B_BOUNDARY_ALIGNMENT_PROTOCOL: Types A-E already cover AI boundary participants
- WizardTemplates in routing.config.ts: `developer.*`, `personal.*`, `business.*` — PARTICIPANT-02/03 covered

### Phase 2 (S026 — needs Governor ratification for enforcement)
- BLOCKING: new API endpoints without `target_participant:` declaration
- BLOCKING: new pages without Threshold variant declared
- Automatic Threshold selection based on `target_participant:` in routing.config.ts

### Phase 3 (S027)
- Internal personas (PARTICIPANT-12 variant) — virtual expert personas
- AI agent type registry — all agents classified against this taxonomy
- External AI consultation log (already started with sonnet-to-opus-request-log.md)

---

## §6 — Creation Protocol Amendment

Every new element must answer THREE questions:

**Q1 (C-type — crystallization):** Who is the primary participant for this element?
→ Declares `target_participant:` from the 14-type taxonomy

**Q2 (R-type — ripple):** What protocol fires for this participant type?
→ Checks §3 Communication Calibration table; applies appropriate language/context/error format

**Q3 (Z-type — completion):** How will we verify the participant experience is correct?
→ Acceptance criterion references participant type test (e.g., "user.solo can complete wizard without platform knowledge")

This is the PACP gate in plan-creation-protocol.md Step 0b: before building any element, declare its participant type.

---

## §7 — DNA Element 17 Declaration

| 17 | **Participant-Aware Communication** (every element declares target participant type — 14 types, 5 categories) | [participant-protocol.md](./participant-protocol.md) | `validate-participant-declared.mjs` |

---

### Category 6 — Future Participants (placeholder — Opus Turn 10)

> New participant types within existing categories: add with rationale, no ADR required.
> New CATEGORY (Category 7+): requires L1 amendment via ADR.
> Do not add types speculatively — add when the first real participant exists.

**Candidates identified but not yet real:**
- `governor.observer` (investor/advisor with read access, no authority) → add when exists
- `developer.partner` (SDK integration builder) → covered by developer.api until SDK exists
- `user.guest` (unauthenticated visitor before trial) → covered by user.trial until needed

---

*Authored: S025 | Governor directive: "Hidden gap — MANDATORY UX + SYSTEMS DNA"*
*Status: DRAFT → pending Opus advisory (SROF-006 in sonnet-to-opus-request-log.md)*
*This is DNA Element 17 — the communication moat that compounds with every new element*
