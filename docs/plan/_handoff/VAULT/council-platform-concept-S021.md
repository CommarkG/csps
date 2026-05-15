---
id: csps.handoff.vault.council-platform-concept.S021
name: council-platform-concept-S021
description: >
  Strategic concept: Multi-Model Council as a core platform capability and standalone
  SaaS product. Escalating council levels from minimal (Opus+Sonnet) through Spine
  Councils through External AI integration. Decision routing matrix. Monetization model.
  Integration with all CSPS platform decision intersections. Saved from Governor
  directive S021 — vaulted for future processing and product planning.
version: 1.0
lifecycle: production
lifecycle_state: pending-review
next_review_at: S025
wisdom_class: insight
domain_path: platform
owner: group:finky
core_spine: GVRN
schema_anchor: platform_plans
session: S021
created_by: Claude Sonnet 4.6[1M] — Opus-designated strategic session
tags:
  - domain:governance
  - domain:ai
  - domain:planning
  - type:reference
  - audience:developer
  - maturity:draft
links:
  - { rel: council-infrastructure, href: ../../../../tools/council/PROTOCOL.md }
  - { rel: council-state, href: ../../../../tools/council/council-state.json }
  - { rel: platform-excellence, href: ./platform-excellence-consolidated-S021.md }
scope_level: S1
---

# Multi-Model Council Platform — Strategic Concept
## A Core Platform Capability and Future SaaS Product

---

> **Saved from Governor directive, S021.**
> **Status: CONCEPT VAULT — do not implement until S025+ and explicit Governor ratification.**
> **Value: potential moat-defining product + internal governance accelerant.**

---

## The Governor's Vision — Absorbed

What the Governor described:

1. **Specialized Opus tabs, always open** — different Opus instances holding different expertise domains, ready to engage
2. **Escalating council levels** — from minimal (one Opus Advisor) to full expert panels
3. **Spine-specialized councils** — each Core Spine has a dedicated Opus instance
4. **External AI integration** — absorb API keys for Gemini, GPT, Claude-external, specialized models
5. **Simple, intuitive UX for developers** — council spin-up with minimal friction
6. **Monetizable SaaS product** — CouncilOS as a standalone offering
7. **Smart strategic pipelines** — pre-defined routing for when to invoke which council bundle
8. **Platform integration** — baked into CSPS decision-making at all key intersections

**The core insight:** The two-tab file-relay council we just built is the embryo of a platform-defining product. The infrastructure exists. What's missing is the automation layer, the UX, the routing logic, and the external AI integration.

---

## The Council Architecture — Four Levels

### Level 1 — Quick Check (What Exists Today)
```
Participants: Opus Advisor (1) + Sonnet Builder (1)
Protocol: File-relay (tools/council/)
Trigger: council_required: true in plan frontmatter
Governor role: Trigger each turn (one line per turn)
Cost: ~1 Opus session + human trigger time
Latency: 5-10 minutes for a full council exchange
Use for: Implementation sequence decisions, plan critique, technical corrections
```

### Level 2 — Spine Council
```
Participants: Relevant Spine Advisor(s) (1-5) + Sonnet Builder
Protocol: File-relay with multiple reader/writer files
Trigger: PEG (Phase Exit Gate) or BPG (Big Plan Gate) fire
Governor role: Ratifier (reviews consensus, doesn't trigger each turn)
Cost: 2-5 Opus sessions
Latency: 30-60 minutes
Use for: Schema changes, new principle ratification, behavioral contract additions,
         graduation pipeline decisions

Council configurations by decision type:
  Schema change → ARCH Spine Council (schema + compliance Opus)
  New contract → AI + GVRN Spine Council
  Scale decision → OPER + VALD Spine Council
  Regulatory concern → Security Compliance Specialist Council
```

### Level 3 — Full Expert Panel
```
Participants: All 5 Spine Advisors + External AI (Gemini, GPT, Claude-external) + Sonnet
Protocol: Async file-relay OR API-mediated
Trigger: SIG (every 10 sessions) or constitutional decision
Governor role: Moderator (presents agenda, receives summary, ratifies)
Cost: 5+ Opus sessions + API calls
Latency: 2-4 hours
Use for: Architecture reviews, external audits, product direction decisions
```

### Level 4 — Independent Audit
```
Participants: Only external AI (no internal Opus — eliminates internal bias)
Protocol: Context package sent via API, structured response received
Trigger: Pre-launch audit, regulatory compliance review, investor due diligence
Governor role: Requester (sends package, receives findings, decides)
Cost: API calls only
Latency: Minutes (API-mediated)
Use for: External validation, independent security review, market positioning check
```

---

## The Specialization Model

### Spine-Specialized Opus Instances

Each Core Spine gets a dedicated Opus configuration loaded at session start:

```
Opus GVRN Advisor:
  Loaded context: all 55+ principles (P-META-*, P-ARCH-*, P-OPER-*)
                  behavioral contracts (52 B_* contracts)
                  AGENTS.md hard NOs
  Specialty: governance decisions, protocol violations, principle conflicts
  Question it when: ratifying new contracts, resolving spine precedence conflicts

Opus ARCH Advisor:
  Loaded context: schema.zmodel, ZenStack patterns, foundation slices
                  drift-registry.yaml, platform-layer-boundaries.yaml
  Specialty: data architecture, ZenStack RLS, schema extension decisions
  Question it when: adding domain schemas, schema migrations, compliance implications

Opus AI Advisor:
  Loaded context: inner-ai-defaults (all 10 files), CDAB 6-layer model
                  ai-personas.md, context-loading templates
  Specialty: AI behavioral calibration, model tiering, context optimization
  Question it when: adding behavioral overrides, changing GRACE tiers

Opus VALD Advisor:
  Loaded context: audit-runner.md, drift-registry.yaml, ZF protocol
                  all 45+ validator specifications
  Specialty: validation design, ZF architecture, coverage gap detection
  Question it when: designing new validators, setting enforcement thresholds

Opus OPER Advisor:
  Loaded context: build-order.md, graduation-pipeline.md, cost-economics.md
  Specialty: delivery sequencing, app graduation, scale operations
  Question it when: deciding build order, graduation criteria, cost architecture
```

### Domain-Specialized Advisors (Level 3+)

Beyond Core Spines, specialists for horizontal concerns:

```
Security & Compliance Advisor: HIPAA, GDPR, COPPA, SOC2, PCI-DSS
Healthcare Domain Advisor: FHIR, HL7, clinical data patterns
Financial Domain Advisor: PCI-DSS, SOX, GAAP, accounting patterns
Legal Domain Advisor: contract law, IP, regulatory compliance
UX Design Advisor: accessibility, WCAG, user journey design
Scale Engineering Advisor: load testing, database optimization, caching
```

---

## The Decision Routing Matrix

Every consequential decision type maps to a council bundle. Pre-defined. Automatic.

| Decision Type | Council Bundle | Participants | Trigger |
|---|---|---|---|
| Implementation sequence | Level 1 Quick Check | Opus + Sonnet | council_required: true |
| Schema field addition | Level 2 ARCH Spine | ARCH Opus + Sonnet | field_blast_radius > 2 models |
| New behavioral contract | Level 2 AI+GVRN | AI + GVRN Opus + Sonnet | new B_* contract |
| New governance principle | Level 2 GVRN | GVRN Opus + Governor | L2 principle |
| Domain schema activation | Level 2 ARCH+Compliance | ARCH + Security Opus | new domain |
| Foundation slice change | Level 3 Full Panel | All spines | BR3 blast radius |
| Pre-launch audit | Level 3 Full + External | All spines + Gemini/GPT | SIG or PIA |
| Independent security review | Level 4 External Only | Gemini + GPT + Claude-ext | Pre-launch |
| Constitutional change | Level 3 Full Panel | All spines + Governor | L1 sealed change |

**The routing logic is schema-encoded.** When a plan is authored, its frontmatter includes:
```yaml
council_bundle: "level-2-arch"   # derived from decision type
council_participants: ["arch-opus", "sonnet-builder"]
council_triggered_by: "field_blast_radius"
```

The Priority Engine reads `council_bundle` and schedules it accordingly.

---

## Integration with CSPS Platform Decision-Making

### Current Intersections (Already Defined, Need Wiring)

```
Schema changes → validate-foundation-schema-drift.mjs → if BR2+: council required
New validators → validate-audit-health.mjs → if covers new drift type: council review
Bedrock gate → validate-bedrock.mjs → if Phase advance: OPER Spine council
VLT creation → validate-vlt-blocking.mjs → if P1 VLT: council must resolve it
Opus audit → validate-opus-audit-due.mjs → SIG fires → Level 3 Full Panel
```

### Future Intersections (To Wire)

```
Domain activation → DomainRegistration created → ARCH + Compliance council
New app #N → graduation-pipeline → OPER + ARCH council
Compliance profile → new domain compliance → Security specialist council
WisdomVault contribution → cross-domain pattern → AI Spine council validation
```

### The Council as the Platform's Immune System

Every significant state transition in CSPS routes through the council matrix.
The council doesn't slow things down — it prevents the class of decisions that
require 3-session rework after the fact.

**The compounding effect:** A platform that routes consequential decisions through
the right council produces fewer rework sessions. At 30 apps × 10 sessions each,
preventing 20% of rework sessions saves 60 sessions. The council pays for itself
within the first 10 apps.

---

## The SaaS Product Vision — CouncilOS

### What It Is

CouncilOS is a multi-model AI governance platform that any development team can
use to apply structured council deliberation to their consequential technical
decisions. CSPS uses it internally; developers worldwide pay for access to it.

### Product Architecture

```
Frontend (Developer UX):
  - Council Dashboard: active councils, history, consensus status
  - Quick Spin-Up: "I need a council on [topic]" → system selects bundle
  - Turn Interface: one-click trigger, one-click read
  - Audit Trail: every council session logged, searchable
  - Template Library: pre-configured council bundles (startup/enterprise/regulated)

Backend (CouncilOS Engine):
  - Session Manager: creates/manages multi-tab council sessions
  - File-Relay Layer: tools/council/ protocol at scale
  - API Gateway: connects to Anthropic, OpenAI, Google APIs for external AI
  - Council Router: decision type → bundle selection (the routing matrix)
  - Consensus Engine: tracks positions, detects agreement, flags gaps
  - VLT Manager: creates and tracks VLTs from council recommendations

Integration Layer:
  - GitHub: reads repo context, writes council state to files
  - VS Code: extension for in-IDE council invocation
  - Claude Code: deep integration (the hook-based relay)
  - CI/CD: council gates in deployment pipelines
  - Jira/Linear: VLTs as tickets
```

### Monetization Model

```
FREE TIER — "Solo Developer":
  Level 1 Quick Check only
  5 council sessions/month
  File-relay only (no API)
  Community templates
  
PRO TIER — "$49/month per developer":
  Level 1 + Level 2 councils
  50 sessions/month
  All 5 Spine configurations
  GitHub integration
  VLT tracking
  
ENTERPRISE TIER — "Custom pricing":
  All 4 council levels
  Unlimited sessions
  Custom specialist configurations
  External AI integration (bring your own API keys)
  SOC2-compliant audit trail
  Priority support + custom training
  
PLATFORM TIER — "API-first, $0.10/council-turn":
  Pure API access
  Embed council protocol in any CI/CD
  Webhook triggers
  Headless (no dashboard)
  
CSPS BUNDLE — "Included with CSPS platform license":
  Councils configured for CSPS governance structure
  All 5 Spine Advisors pre-configured
  CSPS templates for all decision types
```

### The Key UX Principle

**One action per human. Everything else automated.**

Developer wants a council → clicks "Start Council" → selects decision type → system routes to correct bundle → council runs → developer gets summary + consensus → one click to ratify or redirect.

The developer never thinks about which Opus instance to use, which files to read, which format to write. The council intelligence is entirely in the platform.

---

## The Competitive Moat

**Why CouncilOS is hard to replicate:**

1. **The file-relay protocol** — simple enough to use, structured enough to work
2. **Pre-configured spine councils** — requires deep governance philosophy to build
3. **Decision routing matrix** — requires understanding which decisions matter
4. **The CSPS governance DNA** — 52 contracts, 45 validators, 5 spines — this IS the council configuration
5. **The compounding learning** — every council session adds to the WisdomVault (when built)
6. **The moat of context** — a council with 22 sessions of platform context is qualitatively different from a fresh council

No one else has built a platform where the governance system IS the product. CSPS built governance to govern itself. CouncilOS makes that governance available to everyone.

---

## What Exists Today (The Embryo)

| Component | Status | Location |
|---|---|---|
| File-relay protocol | ✓ Active | tools/council/ |
| Council state tracking | ✓ Active | tools/council/council-state.json |
| Session-open role headers | ✓ Active | .claude/hooks/session-open.sh |
| One-line trigger templates | ✓ Documented | tools/council/PROTOCOL.md |
| PE integration | ✓ Documented | tools/council/PROTOCOL.md |
| Planning protocol integration | ✓ Documented | tools/council/PROTOCOL.md |
| Spine specialization configs | ✗ Not built | — |
| External AI integration | ✗ Not built | — |
| CouncilOS UI/UX | ✗ Not built | — |
| API gateway | ✗ Not built | — |
| Consensus engine | ✗ Not built (file-relay is manual) | — |
| VLT→ticket integration | ✗ Not built | — |

**The embryo is ~10% of the full vision.** It proves the concept works.

---

## Build Sequence (When the Time Comes)

**Phase Council-1 (after CSPS Phase C — WisdomVault):**
- Spine configuration files (5 YAML files defining what each Spine Advisor loads)
- Automated routing (read decision type from plan → select council bundle)
- Turn automation (no human trigger needed for internal turns)

**Phase Council-2 (CSPS Phase E equivalent — Agent Framework):**
- Council agents as proper DomainAgents
- Each Spine Advisor is a named agent with its own persona + context footprint
- Council sessions are agent-to-agent with human as moderator

**Phase Council-3 (External AI integration):**
- API gateway for Gemini, GPT, Claude-external
- context package auto-generation (what the Governor currently does manually)
- Consensus detection (automated vs. manual position comparison)

**Phase Council-4 (CouncilOS product launch):**
- Developer UX (dashboard, quick spin-up, turn interface)
- Multi-tenant council management (each customer has their own council)
- Billing integration (this is a CSPS app building on CSPS — dogfooding)
- API access

---

## How This Connects to Everything

**WisdomVault:** Every council session produces wisdom. The council's positions, corrections, and consensus — these ARE insights. They should be WisdomEntry objects with `wisdom_class: insight` + `domain_path: platform.governance.council`. The WisdomVault grows with every council.

**Domain Coverage:** When CSPS activates the healthcare domain, a Healthcare Compliance Specialist council should automatically be available. Domain activation → council configuration available.

**The 30 Apps Promise:** Every app built on CSPS gets access to councils configured for its domain. A healthcare app gets a HIPAA council. A finance app gets a PCI/SOX council. The council is part of the platform inheritance, not an add-on.

**The AI Spine:** Council is the most advanced expression of multi-agent AI governance. It's not just Sonnet being governed by contracts — it's Opus governing Sonnet, external AI providing independent perspective, and the Governor ratifying. This is the highest-tier AI governance architecture possible today.

---

## One-Line Capture (for future recall)

> The multi-model council protocol we built today (file-relay, role-separated, Governor-triggered)
> is the embryo of CouncilOS — a platform that makes structured AI governance deliberation
> available to any development team, monetizable as SaaS, and deeply integrated into CSPS
> at every consequential decision intersection.

---

*Vaulted: S021 | 2026-05-09*
*wisdom_class: insight | domain_path: platform*
*Do not implement until S025+ — VAULT this, mature it, build it deliberately.*
*Governor directive received — concept saved with full depth.*
