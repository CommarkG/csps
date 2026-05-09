---
id: csps.handoff.vault.three-axis-orchestration.S021
name: three-axis-orchestration-S021
description: >
  The CSPS Three-Axis Orchestration Framework: WHO (consumer type) × WHAT (domain subject)
  × HOW (interaction/synergy pattern). Research-grounded (Shopify Maestro, AWS tenant routing,
  two-sided market theory). The CCAT (Context Compass Alignment Tool) using 5 Ws.
  12 user journeys + 30 input traces with gap analysis. Lovable comment prepared.
version: 1.0
lifecycle: production
lifecycle_state: pending-review
next_review_at: S022
dynamic: true
owner: group:finky
core_spine: GVRN
schema_anchor: platform_plans
session: S021
domain_path: platform
wisdom_class: insight
tags:
  - domain:governance
  - domain:architecture
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: lovable-analysis, href: ./lovable-tree-analysis-S021.md }
  - { rel: platform-excellence, href: ./platform-excellence-consolidated-S021.md }
  - { rel: council-protocol, href: ../../../tools/council/PROTOCOL.md }
---

# Three-Axis Orchestration Framework
## WHO × WHAT × HOW — The Synergy Model

---

## §1 — Research Foundation

We are not the first to tackle the builder+user orchestration problem.

**Shopify's Maestro (most concrete public implementation):**
The closest published example of "builder creates, user configures, platform executes."
- Developer composes workflow capabilities (Shopify App → CSPS Sonnet building platform)
- Merchant configures triggers (Shopify Flow → Governor directing work)  
- Orchestrator routes execution (Maestro → CSPS Priority Engine + Context Orchestrator)
- End user experiences results (Shopify storefront → App end-users)
Key technical insight: static usage analysis computes which attributes each step uses,
enabling SELECTIVE data passing — only what's needed reaches each step.
**CSPS implication:** the Context Orchestrator should do the same — compute what context
each task needs, pass only that, not bulk context.

**AWS Tenant Routing Architecture:**
Domain-driven or data-driven routing; rich context stored in low-latency KV stores;
middleware sets tenant context once per request; every downstream component inherits it.
**CSPS implication:** This is exactly ZenStack's `enhance(db, { user })` — context is set
once at the API route level, inherited by all ZenStack queries. The architecture is already
correct. What's missing is the outer layer: routing to the right domain schema based on
`domain_path`.

**Two-Sided Market Orchestration:**
Subsidize the builder side (free/cheap platform tools) to attract the user side.
Governance reduces information asymmetry (verification, reputation, dispute resolution).
**CSPS implication:** The behavioral contracts + validators are the governance layer that
makes the platform trustworthy for both builders and users. The WisdomVault is the reputation
system at platform level.

**Three-Axis Knowledge Classification (MDPI 2024):**
Theme-Stage-Attribute as a 3D coordinate system for knowledge graphs. Any element maps to
a triplet enabling precise retrieval and recommendation. Research-stage but architecturally
validates the WHO/WHAT/HOW approach.

---

## §2 — The Three Axes (Not Alternatives — Dimensions)

The Governor correctly identified that treating these as alternatives to choose from is wrong.
**They are orthogonal dimensions of a coordinate system.**

```
                    HOW (synergy / interaction pattern)
                    ↑
                    │
                    │
                    │
WHO ───────────────┼─────────────────────→  WHAT (subject matter)
(consumer type)    │                         (domain)
                   │
```

Every platform element exists at a specific coordinate in this 3D space:

**WHO axis (Lovable's axis):**
```
builder          — developer building apps on CSPS
user             — end-user of apps built on CSPS
crosscut         — applies to both (cross-domain concerns)
platform-only    — internal CSPS infrastructure only
```

**WHAT axis (CSPS's axis):**
```
business         — professional and organizational
personal         — individual life management
social           — community and connection
knowledge        — learning and accumulated wisdom
platform         — CSPS infrastructure and governance
crosscut         — cross-domain horizontal concerns
```

**HOW axis (NEW — the synergy dimension):**
```
create           — builder creates capability (new schema, new validator, new plan)
consume          — user consumes capability (CRUD operations, dashboards, reports)
collaborate      — multiple actors interact (team features, family sharing, council)
aggregate        — system combines data across domains (WisdomVault cross-domain)
govern           — platform enforces rules (ZenStack policies, validators, contracts)
orchestrate      — platform routes between actors and domains (Context Orchestrator)
```

### The 3D Coordinate for Any Element

Every CSPS artifact and every user action maps to a triplet:
```
(WHO, WHAT, HOW)

Examples:
  Task creation: (user, business.operations, consume)
  ZModel schema: (builder, platform, create)
  WisdomVault query: (user, crosscut, aggregate)
  Council session: (builder, platform.governance, collaborate)
  pnpm verify: (platform-only, platform, govern)
  Family sharing: (user, personal.family, collaborate)
  Cross-domain AI insight: (user, crosscut, aggregate)
```

---

## §3 — CCAT: Context Compass Alignment Tool

The 5 Ws as a mandatory gate before any plan, implementation, or audit.

**Every consequential action must answer all 5:**

```
CCAT GATE (fires before any plan authoring or implementation):

WHO   → Which persona is the primary actor?
        (builder | user | solo_user | business_admin | family_admin | developer | governor)

WHAT  → Which domain does this serve?
        (domain_path value: business.finance | personal.health | etc.)

WHEN  → At what lifecycle stage does this apply?
        (seed | draft | proven | battle-tested | canonical)
        (OR: ratified | implementing | implemented | measured | sealed)

WHERE → In which architecture layer does this live?
        (builder_surface: builder | user | both | platform-only)
        (layer: L0-core | L1-developer | L2-user)

WHY   → What is the user value and wisdom class?
        (user_value: one sentence of external user benefit)
        (wisdom_class: insight | reference | workflow | tool | benchmark | story)
```

**Mechanical enforcement:**

Add to AGENTS.md: "Before authoring any plan, declare CCAT: WHO / WHAT / WHEN / WHERE / WHY. A plan without CCAT is not ready for implementation."

Add to plan frontmatter schema:
```yaml
ccat_who: "builder | user | both | platform-only"
ccat_what: "[domain_path]"
ccat_when: "seed | draft | proven | battle-tested | canonical"
ccat_where: "L0-core | L1-developer | L2-user"
ccat_why: "[one-sentence user value]"
```

Add validator: `validate-ccat-completeness.mjs` — scans plans with `cdp_status: implementing` or higher for CCAT fields. Advisory when missing, blocking when `cdp_status: implemented` and CCAT absent.

**The 5 Ws as questions (not checkboxes):**

The key insight: **questions are better than checkboxes** because they require understanding, not just ticking. A question that cannot be answered reveals the thinking gap. A checkbox can be ticked without understanding.

Mandatory questions before any consequential action:
1. "WHO uses this — and can I name them specifically enough that I could interview them?"
2. "WHAT domain does this serve — and does it have a domain_path I can specify?"
3. "WHEN in the user's lifecycle does this matter — seed/proving/canonical?"
4. "WHERE does this live — is it builder-only, user-facing, or both?"
5. "WHY does this create user value — and can I state it in one sentence?"

If any question cannot be answered: the work is not ready to begin.

---

## §4 — The Bundler/Orchestrator Architecture

**Not rigid separation — optimal combination.**

The Governor's insight: "be careful not to create rigid separations" is precisely correct.
The bundler selects COMBINATIONS of axes, not fixed routes.

**Bundler Logic (given WHO × WHAT × HOW):**

```
Input: (who=user, what=personal.health, how=consume)
Bundler outputs:
  - domain_schema: libs/policies/slices/personal/health.zmodel (activate)
  - compliance_profile: hipaa-adjacent + gdpr (apply)
  - context_bundle: user-health-dashboard template
  - ai_agent: health-domain-agent (WisdomHub queries pre-loaded)
  - council_bundle: level-1-quick-check (if governance decision needed)
  - model_tier: STANDARD_BUILD (Sonnet for implementation)
  - ccat_required: no (routine user action)

Input: (who=builder, what=business.finance, how=create)
Bundler outputs:
  - domain_schema: libs/policies/slices/business/finance.zmodel (template provided)
  - compliance_profile: gdpr + pci-dss-skeleton (apply)
  - context_bundle: builder-finance-domain template
  - ai_agent: governed-ai-collaborator (Persona 1 — Sonnet)
  - council_bundle: level-2-arch-spine (for schema decisions)
  - model_tier: STANDARD_BUILD + opus-review-triggered
  - ccat_required: yes (consequential schema creation)

Input: (who=crosscut, what=crosscut, how=aggregate)
Bundler outputs:
  - domain_schema: WisdomEntry (cross-domain aggregation model)
  - compliance_profile: privacy-budget (aggregate only, N≥100)
  - context_bundle: wisdomhub-query template
  - ai_agent: wisdom-orchestrator-agent (future)
  - council_bundle: level-3-full-panel (for cross-domain architectural decisions)
  - ccat_required: yes (cross-domain aggregation = consequential)
```

**The Bundler is the Context Orchestrator extended.**

Currently: Context Orchestrator detects task_class → recommends bundle.
Future: Bundler resolves (WHO, WHAT, HOW) → selects optimal combination of schemas + compliance + AI + council.

The Bundler's output is a `context_bundle_manifest.yaml` per request:
```yaml
# Generated by Bundler for this request
who: user
what: personal.health
how: consume
activated_schemas: [health.zmodel]
compliance_profiles: [hipaa-adjacent, gdpr]
ai_tier: STANDARD_BUILD
council_config: level-1-quick-check
ccat_required: false
wisdom_queries: [benchmarks_for("personal.health", "solo_user")]
```

---

## §5 — 12 User Journeys: Gap Analysis

### J1 — Developer building first CSPS app
**Coordinate:** (builder, business.operations, create)
**Gaps:** No developer onboarding wizard. No domain schema template for business.operations beyond task-mgmt. No CCAT guidance in developer docs. No domain selection wizard.

### J2 — Developer adding healthcare domain
**Coordinate:** (builder, personal.health, create)
**Gaps:** HIPAA compliance profile doesn't exist. PHI field tagging not implemented. No health domain schema. No `validate-domain-compliance.mjs` to check compliance at schema creation.

### J3 — Family app user managing household
**Coordinate:** (user, personal.family, consume)
**Gaps:** Family domain schema doesn't exist. No child account protocol (COPPA). No family billing tier (who pays for the family account?). No family member invitation flow.

### J4 — HR manager using CSPS-powered HR tool
**Coordinate:** (user, business.hr, consume)
**Gaps:** HR domain schema doesn't exist. No GDPR/CCPA compliance profile for EU HR data. No employee data model. No performance review schema.

### J5 — Freelancer (personal + business hybrid)
**Coordinate:** (user, crosscut, consume) [hybrid: personal.finance + business.finance]
**Gaps:** Hybrid domain concept not implemented. No cross-domain data aggregation for freelancers. No single-user billing model (everything assumes team). No freelancer persona in `persona_target`.

### J6 — Student tracking academic + career
**Coordinate:** (user, personal.academic, consume)
**Gaps:** Academic domain schema doesn't exist. No FERPA compliance profile. No learning progress model. Career domain also missing.

### J7 — Community leader organizing events
**Coordinate:** (user, social.community, consume)
**Gaps:** Social domain schema entirely missing. No community role model. No event model. No community member invitation flow.

### J8 — Adult child managing elderly parent care
**Coordinate:** (user, personal.family.extended.elderly_parent, collaborate)
**Gaps:** Elderly parent sub-domain not implemented. No caregiver coordination model. No medical proxy model. No medication tracking schema.

### J9 — Couple planning family together
**Coordinate:** (user, personal.family.couple, collaborate)
**Gaps:** Multi-actor family account not built (currently: one user = one session). No shared goal tracking. No couple collaboration model.

### J10 — Sales team on CSPS-powered CRM
**Coordinate:** (user, business.sales, collaborate)
**Gaps:** CRM schema doesn't exist. No team-level permission model beyond tenant roles. No deal collaboration model. No shared pipeline view for multiple users simultaneously.

### J11 — Governor + Opus + Sonnet council session
**Coordinate:** (builder, platform.governance, collaborate)
**Gaps:** Council automation not built. sessions_since_opus_review increment is manual. No Opus session role enforcement hook. No automatic backlog update at council close.

### J12 — External AI advisor reviewing CSPS
**Coordinate:** (builder, platform.governance, govern)
**Gaps:** Context package generation not automated. Comprehension check answers not stored in structured form. External AI findings not automatically vaulted to WisdomVault.

**Key Gap Pattern:** Journeys 1-10 all fail at domain schema level — no domain schemas exist beyond task-mgmt. The platform is at ~5% readiness for actual domain serving.

---

## §6 — 30 Input Traces: Gap Analysis

### Developer Inputs (1-6)
| # | Input | Current State | Gap |
|---|---|---|---|
| 1 | New ZModel schema slice | validate-foundation-schema-drift catches model+field | No domain compliance check |
| 2 | New API route without AuditEvent | Nothing catches it | No audit coverage validator |
| 3 | New plan (no CCAT 5-W) | validate-no-implementation-without-plan passes | No CCAT check |
| 4 | New validator without Coverage Levels | Advisory only | No blocking enforcement |
| 5 | AGENTS.md change | validate-token-budget checks line count | No R1-only content check |
| 6 | New council session | File-relay works | Manual trigger, no automation |

### End-User Inputs (7-12)
| # | Input | Current State | Gap |
|---|---|---|---|
| 7 | User signs up | Clerk webhook → User+Tenant+AuditEvent | Works |
| 8 | User joins organization | Clerk webhook → billing trigger if 2nd member | Works |
| 9 | User creates task | POST /api/tasks → ZenStack → AuditEvent | Works |
| 10 | User requests GDPR erasure | NOTHING EXISTS | No erasure path |
| 11 | User requests data export | NOTHING EXISTS | No data portability |
| 12 | User adds health data | NOTHING EXISTS | No health domain |

### System Inputs (13-18)
| # | Input | Current State | Gap |
|---|---|---|---|
| 13 | Stripe webhook | Updates Tenant.subscriptionStatus | Works |
| 14 | pnpm verify runs | 45+ validators, exit_code=0 | Works |
| 15 | Session close | Session-close-gate injects §10 | Works |
| 16 | Opus audit SIG trigger | validate-opus-audit-due tracks countdown | Works |
| 17 | Core seed overdue | validate-core-seeds advisory | Works |
| 18 | Backlog item stale | validate-update-backlog measurement | Works |

### Cross-Domain Inputs (19-24)
| # | Input | Current State | Gap |
|---|---|---|---|
| 19 | Sleep+work correlation | NOTHING EXISTS | No WisdomVault |
| 20 | Family event → business calendar | NOTHING EXISTS | No cross-domain relationship |
| 21 | Health data → insurance estimate | NOTHING EXISTS | No health domain |
| 22 | Business meeting conflicts family | NOTHING EXISTS | No cross-domain calendar |
| 23 | Personal+business finance unified | NOTHING EXISTS | No hybrid domain |
| 24 | Learning progress → career recs | NOTHING EXISTS | No learning domain |

### Governance Inputs (25-27)
| # | Input | Current State | Gap |
|---|---|---|---|
| 25 | New principle ratified | CEC trigger fires | No typed edge auto-creation |
| 26 | VLT resolved | session-state.json updated manually | No automated unblocking |
| 27 | Opus audit trigger | validate-opus-audit-due countdown | Works |

### AI Inputs (28-30)
| # | Input | Current State | Gap |
|---|---|---|---|
| 28 | CONCEPT_LOAD fired | AI declares spine | No quality check on correctness |
| 29 | Satisfaction point detected | post-stop-banned-phrase.sh = STUB | Not working |
| 30 | Harvest trigger | post-stop-learning-loop → JSONL | ORPHANED — no consumer |

### Key Gap Summary (from all 30 inputs):
- **Domain schemas: 0 of 35 needed** — every user-facing journey fails here
- **GDPR erasure: missing** — inputs 10-11 fail with legal liability
- **Cross-domain: 0%** — inputs 19-24 all gap (WisdomVault not built)
- **Satisfaction point detection: STUB** — input 29 not working
- **Learning loop: orphaned** — input 30 collects but nothing processes
- **CCAT check: missing** — input 3 passes when it should be gated

---

*Part of the Lovable taxonomy consensus process. Next: Section 7 — Lovable Comment.*
*See: lovable-tree-analysis-S021.md for full taxonomy comparison.*
*S021 | 2026-05-09 | Dynamic — updates as consensus progresses*
