---
id: csps.handoff.vault.platform-excellence-consolidated.S021
name: platform-excellence-consolidated-S021
description: >
  Consolidated platform excellence plan merging S021 Opus review + S022 Sonnet
  expert panel. NOT ready for implementation — requires Governor ratification of
  3 P1 VLTs + one-session maturation before Phase A begins. Applies the Plan
  Maturity Doctrine to itself.
version: 1.0
lifecycle: production
lifecycle_state: pending-review
plan_maturity_reviewed: null
plan_maturity_minimum: S023
next_review_at: S022
dynamic: true
owner: group:finky
core_spine: GVRN
schema_anchor: platform_plans
session: S021
created_by: Multi-plan consolidation — Opus S021 review + Sonnet S022 expert panel
tags:
  - domain:architecture
  - domain:governance
  - domain:planning
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: sonnet-plan, href: ../../platform-excellence-readiness.md }
  - { rel: opus-plan, href: ./platform-excellence-plan-S021.md }
  - { rel: schema, href: ../../../../libs/policies/schema.zmodel }
  - { rel: domain-taxonomy, href: ./csps-pitch-and-value-S019.md }
domain_path: platform
---

# CSPS Platform Excellence — Consolidated Plan
## Governor Review Required Before Any Implementation

---

> **MATURITY NOTICE:** This plan is `pending-review`. It does not become an
> implementation directive until:
> 1. Governor ratifies the 3 P1 VLTs below
> 2. At least one full session passes after ratification (the "deep breath")
> 3. `plan_maturity_reviewed` field is populated with that session number
> 4. `lifecycle_state` is changed from `pending-review` to `active`
>
> Until then: this is architectural thinking, not a mandate.

---

## The Plan Maturity Doctrine

*Why this section exists first, before any content:*

Both plans that were merged here (Sonnet's S022 expert panel + Opus's S021 domain review)
were written in one session and immediately presented as ready for implementation.
That pattern is exactly what the Governor identified as the architectural risk:
**implementation velocity without planning maturity.**

**The Doctrine (to be ratified as P-META-XXX):**

> *A plan absorbs its context before directing implementation.*
> *A plan confirms schema alignment before proposing schema changes.*
> *A plan lives for at least one session cycle before implementation begins.*
> *A VLT opened and resolved in the same session is not a gate — it's a checkbox.*

**Mechanically enforced by:**
- `plan_maturity_reviewed: null` → `validate-no-implementation-without-plan.mjs` blocks
  implementation when this field is null OR equals the current session
- VLTs in this plan cannot be resolved in the same session they were created in
- `plan_maturity_minimum: S023` → implementation cannot begin before session S023

**The three North Stars this plan must answer to:**
1. **Local North Star (S022 mandate):** Ratify 3 P1 VLTs. Don't build anything yet.
2. **Mid-range North Star (S025 target):** enforcement_rate≥25%, drift_coverage≥5/7, first personal domain live, business finance scaffolded
3. **Major North Star (platform vision):** 30 governed SaaS apps, WisdomVault connecting cross-domain intelligence, family-to-business unified lifecycle

*If any proposed action doesn't serve at least the mid-range North Star: don't do it yet.*

---

## §1 — Schema Completion (Foundation Before Everything Else)

*Source: Sonnet S022 expert panel — Schema Architect + Platform Architecture experts*

### Why Schema First

The current schema covers:
- Universal core fields: 100% ✓
- Governance fields (core_spine, schema_anchor): 100% ✓
- Discovery tags (6 closed enums): ~60% ⚠
- **Domain ontology (where in the domain tree?): 0% ✗**
- **Persona targeting (who does this serve?): 0% ✗**
- **Wisdom classification (how does this contribute to knowledge graph?): 0% ✗**

Without fixing the 0% gaps, every artifact built is taxonomy-less. The WisdomHub can't query them. Domain agents have no ontological anchor. Apps have no automatic domain identity.

### Four New Frontmatter Fields (VLT-gated — cannot implement without ratification)

**VLT-S022-DOMAIN-PATH (P1 — Governor must ratify closed enum before Phase A begins)**
```yaml
domain_path: "personal.health.sleep"     # leaf: Tier 1.Tier 2.Tier 3
domain_path: "business.finance"          # branch: Tier 1.Tier 2 only
domain_path: "platform"                  # root: platform-level artifacts

# Proposed Tier 1 closed enum (5 values — needs ratification):
#   business | personal | social | knowledge | platform
```

**VLT-S022-PERSONA-TARGET (P1)**
```yaml
persona_target:
  - solo_user          # individual personal life management
  - business_admin     # org owner / account manager
  - business_member    # team member within business tenant
  - family_admin       # family account manager (pays, manages)
  - family_member      # member of family account (child, partner)
  - community_leader   # social group organizer
  - developer          # building apps on CSPS platform
```

**VLT-S022-WISDOM-CLASS (P1)**
```yaml
wisdom_class: insight       # discovered pattern or principle
wisdom_class: reference     # template, standard, or benchmark
wisdom_class: workflow      # a process or procedure
wisdom_class: tool          # usable instrument or helper
wisdom_class: benchmark     # measurement standard
wisdom_class: story         # anonymized case study
wisdom_class: null          # default — not wisdom-vault-relevant
```

**VLT-S022-USE-CASE-CLASS (P2 — can wait one session after P1 ratification)**
```yaml
use_case_class: tracking     # logging, monitoring, journaling
use_case_class: planning     # goals, projects, scheduling
use_case_class: communication # messaging, collaboration
use_case_class: analysis     # reporting, insights, decisions
use_case_class: automation   # workflows, triggers, rules
use_case_class: discovery    # search, recommendations
use_case_class: creation     # authoring, building
use_case_class: governance   # rules, policies, compliance
```

### Why This Is the Consolidation Move

Currently domain identity is scattered across:
- `tags: domain:X` — single-dimension flat tag
- `core_spine:` — governance spine, not user-facing domain
- `domain_card.md` files — prose, not machine-queryable
- Manual `links:` — not ontological relationships

Adding `domain_path` + `persona_target` + `wisdom_class` makes the schema the **single
source of ontological identity**. Every artifact self-describes its place in the taxonomy.
The WisdomHub MCP reads these fields; it doesn't need a separate taxonomy system.

**This is exactly the "schema as the one architecture source" the Governor described.**

---

## §2 — The 3-Tier Domain Taxonomy

*Source: Sonnet S022 taxonomy + Opus S021 research grounding*

### Research Foundation

Frameworks evaluated: Schema.org (823 types, best for interoperability substrate),
Notion templates (250+ categories, best for personal-professional blend model),
TBM taxonomy (criticality tiers, best for governance overlay), Wheel of Life extended,
NAICS business classification, SDG framework.

**Conclusion: 3-tier hybrid model. Neither 2-tier (too flat) nor 4-tier (too deep).**

### TIER 1 — Meta-Domains (5 values, proposed for closed enum)
```
BUSINESS    — Professional and organizational activities
PERSONAL    — Individual life management and growth
SOCIAL      — Community, relationships, connection
KNOWLEDGE   — Learning, research, and accumulated wisdom
PLATFORM    — CSPS infrastructure and governance
```

### TIER 2 — Functional Domains (35-40)

**BUSINESS**
| Domain | T3 Sub-domains | Compliance | App Potential |
|---|---|---|---|
| Finance | Budgeting, Invoicing, Tax, Payroll, Reporting | PCI-DSS, SOX | App #2 |
| HR & People | Recruitment, Onboarding, Performance, Benefits | GDPR, CCPA | App #3 |
| Marketing | Content, SEO, Email, Analytics, Social | GDPR | App #4 |
| Sales | Pipeline, Proposals, CRM, Forecasting | GDPR | App #5 |
| Operations | Projects✓, Inventory, Quality, Processes | — | Extend task-mgmt |
| Customer Success | Support, NPS, Knowledge Base, Community | GDPR | App #6 |
| Legal | Contracts, IP, Compliance, Privacy | Varies by jurisdiction | — |
| Strategy | OKRs, Roadmaps, Competitive Intel | — | — |

**PERSONAL**
| Domain | T3 Sub-domains | Compliance | Priority |
|---|---|---|---|
| Health | Physical/Mental/Nutrition/Sleep/Fitness/Biometrics | HIPAA-adjacent | High |
| Relationships | Romantic/Friendships/Network/Mentorship | GDPR | Medium |
| **Family** | *see family sub-tree below* | COPPA (children), GDPR | High |
| Finance | Budget/Savings/Debt/Insurance/Estate | GDPR | High |
| Career | Search/Skills/Portfolio/Freelance | GDPR | Medium |
| Academic | Formal/Online/Research/Certifications | FERPA | Low |
| Spiritual | Mindfulness/Values/Faith/Practices | GDPR (sensitive) | Low |
| Home | Property/Maintenance/Smart Home/Garden | — | Low |
| Travel | Planning/Documents/Budget/Experiences | — | Low |

**FAMILY SUB-TREE (unique depth — competitive differentiator)**
```
personal.family
├── couple           — relationship health, shared goals, intimacy tracking
│   ├── childless    — lifestyle, dual-income dynamics, long-term planning
│   └── parents      — co-parenting, role distribution, stress management
├── children
│   ├── infant       — 0-2: milestones, feeding logs, sleep schedules
│   ├── toddler      — 2-5: development, daycare, early learning
│   ├── child        — 6-12: school, activities, health, friendships
│   ├── teen         — 13-18: identity, mental health, education, independence
│   └── young_adult  — 18-25: college, financial launch, independence coaching
├── extended
│   ├── elderly_parent  — caregiving, medical management, housing, estate
│   ├── grandparents    — engagement, legacy, health tracking
│   └── siblings        — adult dynamics, shared family responsibilities
└── single_parent    — unique financial, logistics, emotional support needs
```

**The Family tree is a 20-year user relationship: couple → parents → children through life stages → elderly parent care.
No other platform models this lifecycle. This is the deepest competitive moat.**

**SOCIAL**
- Community: Neighborhood / Online / Clubs / Associations
- Civic: Volunteering / Activism / Local Government
- Networking: Professional Events / Alumni / Industry
- Giving: Charitable / Impact / Causes

**KNOWLEDGE**
- Research: PKM / Citations / Literature Review
- Learning: Courses / Skills / Reading
- Creation: Writing / Publishing / Documentation
- Wisdom: The WisdomVault itself (see §3)

### Criticality Overlay (from TBM taxonomy)

| Tier | Definition | Examples | Compliance Required |
|---|---|---|---|
| 1 — Mission Critical | Loss = compliance violation or legal liability | Health records, financial transactions, legal documents, child data | HIPAA/COPPA/SOX/GDPR |
| 2 — Business Critical | Loss = operational disruption | HR records, customer data, project delivery | GDPR, SOC2 |
| 3 — Productivity | Loss = inconvenience | Task lists, content drafts, scheduling | Minimal |

Every domain_path maps to a criticality tier. The tier determines backup frequency,
encryption requirements, audit trail depth, and SLA requirements.

---

## §3 — WisdomVault Architecture

*Source: Sonnet S022 — most concrete on this topic*

### The Differentiator No Other Platform Has

> "Your sleep data over the past 3 months correlates with a 23% reduction in your project
> completion rate. Other users with similar work patterns who improved their sleep duration
> to 7.5h saw this reverse within 6 weeks." — WisdomHub query, cross-domain.

No single-domain platform (Calm for sleep, Monday for projects, YNAB for finance) can make this connection. CSPS can, because:
1. The user controls all domains in one schema
2. ZenStack @@allow enforces privacy at the database layer
3. The WisdomVault aggregates patterns across tenants (opt-in, privacy-preserving)
4. The WisdomHub MCP makes these patterns queryable by domain agents

### Schema

```
WisdomEntry (extends AppendOnlyBase — immutable knowledge artifact)
├── id                    — UUID
├── createdAt             — timestamp
├── domain_path           — "personal.health.sleep" (primary source domain)
├── cross_domain_paths    — ["business.operations", "personal.relationships"]
├── wisdom_class          — insight | reference | workflow | tool | benchmark | story
├── insight_type          — individual | cohort | cross-domain | temporal
├── privacy_level         — personal | anonymized | aggregated | public
├── confidence_score      — 0.0–1.0 (AI-assessed reliability)
├── source_session_count  — how many user sessions contributed
└── tenant_id             — null for platform-level aggregated wisdom

WisdomHub (MCP Server — extends principles-mcp when Phase 5 runs)
├── query_by_domain(domain_path, depth, wisdom_class?)
├── find_cross_domain_patterns(domain_paths[])
├── get_benchmarks_for(domain_path, persona_target)
├── get_governance_wisdom(domain_path)  — returns contracts + principles for domain
└── contribute_insight(entry, tenant_id)  — privacy-preserving, opt-in only
```

**Note:** `WisdomEntry` extends `AppendOnlyBase` — the model specced in S019 L5 (opus-lessons).
This IS the right base. AppendOnlyBase must be built before WisdomVault Phase C begins.

### Privacy Model
- Individual wisdom: stays within tenant, tenant_id set
- Anonymized: single tenant anonymized, tenant_id null
- Aggregated: N≥100 tenants, privacy budget applied before sharing
- Public: explicitly opted-in by tenant, fully anonymized

### Integration Points

| Surface | WisdomHub Query |
|---|---|
| App dashboard | `get_benchmarks_for(user.domain_path, user.persona_target)` |
| Domain AI Agent | `query_by_domain(domain)` before any recommendation |
| Onboarding wizard | `find_cross_domain_patterns([domains_user_selected])` |
| Goal setting | `get_benchmarks_for(goal.domain_path, "similar_users")` |
| Governance (AI) | `get_governance_wisdom(task.domain_path)` |

---

## §4 — Compliance Layer

*Source: Opus S021 — Sonnet S022 identifies gaps but not specifics*

### Domain-to-Compliance Mapping

| Domain | Primary Compliance | Secondary | Blocking for |
|---|---|---|---|
| `personal.health.*` | HIPAA-adjacent (PHI tagging + access log) | GDPR | Any health app EU or US |
| `personal.family.children.*` | COPPA (age verification + parental consent) | GDPR-minors | Family app with under-13 |
| `personal.finance.*` | GDPR (financial data = sensitive) | — | EU market |
| `business.finance.*` | PCI-DSS (no card data) + SOX (if enterprise) | — | Enterprise finance |
| `business.hr.*` | GDPR, CCPA | — | EU or California users |
| `personal.spiritual.*` | GDPR (religious data = special category) | — | EU market |
| All EU users | GDPR Article 17 (erasure) | Data residency | EU market |

### The Compliance Architecture (what must be built, in order)

**Phase B priority:**
1. Security classification framework (`docs/plan/pillar-0-governance/security-classification.md`)
   - Maps domain_path Tier 1 + 2 to compliance tier (1/2/3)
   - Defines what each compliance tier requires at schema level
2. GDPR erasure service (`libs/gdpr.ts`) — already specced S019, not built
3. Health data annotations (PHI tagging in ZModel)
4. Child account schema constraints (age field + parental_consent_at + age_verified_at)
5. SOC2 control mapping (connects AuditEvent to SOC2 control requirements)

**Critical sequence:** GDPR erasure → Health annotations → COPPA → domain builds

---

## §5 — Platform Readiness Assessment

*Combined from both plans — more granular than either alone*

### Overall: ~28% Ready

| Layer | Readiness | Done | Missing |
|---|---|---|---|
| Foundation Schema | 85% | User/Tenant/UserTenant/AuditEvent + ZenStack | Domain extension protocol |
| Auth & Identity | 80% | Clerk JWT, multi-tenant | Persona scoping, family/child accounts |
| Billing | 40% | Stripe wired, subscription status | Domain-based pricing, usage quotas |
| Audit | 60% | AuditEvent + writeAuditEvent() | Partitioning, domain-scoped views |
| Platform Governance | 65% | 51 validators, contracts, hooks | 46% STUB hooks, enforcement gaps |
| AI Infrastructure | 35% | Skills, inner-defaults, GRACE | Domain agents, WisdomHub, agent networks |
| Schema Frontmatter | 55% | 7 closed-enum fields | domain_path, persona_target, wisdom_class |
| Domain Extension Protocol | 0% | Nothing | libs/policies/slices/ structure |
| Business Domains | 5% | task-mgmt scaffold only | Finance, HR, Marketing, etc. |
| Personal Domains | 0% | Nothing | Health, Family, Finance, etc. |
| WisdomVault | 0% | Nothing | WisdomEntry model, WisdomHub MCP |
| Compliance Layer | 15% | RLS, ZenStack, soft-delete | HIPAA, COPPA, GDPR-erasure, SOC2 |
| Security Classifications | 10% | Partial audit | Sensitivity tiers per domain |
| UX / Customer Journeys | 0% | Nothing | Wizards, onboarding, dashboards |
| Scale & Performance | 20% | Correct architecture | Load tests, AuditEvent partitioning |
| Developer APIs | 5% | task-mgmt API routes only | SDK, documentation, playground |

---

## §6 — Phase Build Sequence

*Source: Sonnet S022 Phase A-H — correct sequencing, adopting it with additions*

### Phase A — Schema Completion (2 sessions, ONLY AFTER VLT RATIFICATION)

**Prerequisites:** VLT-S022-DOMAIN-PATH, VLT-S022-WISDOM-CLASS, VLT-S022-PERSONA-TARGET ratified

1. Add 4 new fields to `frontmatter-closed-enums.md`
2. Extend `validate-frontmatter.mjs` with new field validators
3. Create `docs/plan/pillar-0-governance/domain-taxonomy.md` (this taxonomy as canonical reference)
4. Batch-stamp all 282+ existing artifacts with `domain_path: "platform"` (all existing governance artifacts)
5. Create `libs/policies/slices/` directory structure
6. Define Domain Schema Slice Protocol document

**Unlocks:** Every future artifact is taxonomy-aware. WisdomHub can query them.

---

### Phase B — Security Classifications (1 session)

1. `docs/plan/pillar-0-governance/security-classification.md` — sensitivity tier map
2. Health data PHI annotations in ZModel
3. Child/minor account schema additions (age, parental_consent_at, age_verified_at)
4. SOC2 control mapping skeleton
5. `libs/gdpr.ts` pseudonymization service (specced S019, still not built)

**Unlocks:** Health and Family domains can be built legally.

---

### Phase C — WisdomVault Foundation (2 sessions)

1. `AppendOnlyBase` model in `libs/policies/schema.zmodel` (specced S019 L5 — build now)
2. `WisdomEntry` model (schema above)
3. `WisdomHub` MCP server (basic query interface — extends principles-mcp)
4. Privacy-preserving aggregation pattern
5. Opt-in consent model for wisdom contribution

**Unlocks:** Every domain built after this automatically feeds cross-domain intelligence.

---

### Phase D — Task Management Live (1 session)

1. Governor runs `pnpm db:push` to live Supabase
2. Dev server validation (UI, auth, CRUD)
3. Empty state experience
4. First real user feedback

**Unlocks:** Real feedback loop. Platform exits 0-user state.

---

### Phase E — Domain Agent Framework (2 sessions)

1. Base `DomainAgent` extending `BaseAgent`
2. WisdomHub integration pattern for domain agents
3. Domain tool registry
4. Domain-specific behavioral constraints in agent spawn

**Unlocks:** Any domain can have an intelligent AI assistant.

---

### Phase F — Personal Health Domain (2 sessions)

1. `libs/policies/slices/personal/health.zmodel`
2. Health-grade privacy controls (PHI tagging)
3. Basic tracking UI (sleep, exercise, nutrition)
4. Health AI Agent (queries WisdomHub)

**Unlocks:** First personal domain live. Most engaging domain.

---

### Phase G — Business Finance Domain (2 sessions)

1. `libs/policies/slices/business/finance.zmodel`
2. Invoice, Transaction, Budget, Category models
3. Basic finance UI
4. Finance AI Agent

**Unlocks:** First paying business customers possible.

---

### Phase H — External Surfaces (3 sessions, ONLY AFTER C-G stable)

1. Landing pages (domain-specific value propositions)
2. Domain selection wizard
3. Persona-based onboarding
4. Cross-domain dashboard ("your life at a glance")
5. Developer API documentation

---

## §7 — Open VLTs (Requires Governor Decisions)

*Source: Sonnet S022 §10, 10 VLTs — adopting + 2 additions*

### P1 — Must Ratify Before Phase A

| VLT | Decision Required | What Blocks Without It |
|---|---|---|
| VLT-S022-DOMAIN-PATH | Ratify Tier 1 closed enum: business \| personal \| social \| knowledge \| platform | Schema stamping, WisdomHub queries, domain_path taxonomy |
| VLT-S022-WISDOM-CLASS | Ratify wisdom_class closed enum (6 values above) | WisdomVault queries, cross-domain AI |
| VLT-S022-PERSONA-TARGET | Ratify persona_target closed enum (7 values above) | UI filtering, AI personalization, access control |
| VLT-S022-DOMAIN-SLICE-PROTOCOL | Ratify `libs/policies/slices/<Tier1>/<Tier2>/` structure | Any domain schema built without knowing where to put it |

### P2 — Must Resolve Before Domain Builds Begin

| VLT | Decision Required |
|---|---|
| VLT-S022-COPPA-SCHEMA | Child account schema constraints — what fields are mandatory? |
| VLT-S022-AUDIT-PARTITIONING | AuditEvent partitioning strategy — monthly? by tenant? |
| VLT-S022-AGENT-TRUST | Agent-to-agent communication trust model |
| VLT-S022-FAMILY-BILLING | Family account billing tier — who pays, what limits apply? |

### P3 — Can Wait Until After Phase D

| VLT | Decision Required |
|---|---|
| VLT-S022-GRADUATION-PROTOCOL | When can a domain slice be extracted as standalone SaaS? |
| VLT-S022-WISDOM-CONTRIBUTION | Opt-in model for WisdomVault — what value does contributor get? |
| VLT-S021-PLAN-MATURITY | Ratify Plan Maturity Doctrine as P-META-XXX |

---

## §8 — Iteration Register

*Things found after first-pass drafts — both plans' self-audits combined*

1. **Vertical vs. Horizontal SaaS distinction** — CSPS must explicitly support both. Health app = vertical (deep in one domain). Project management = horizontal (useful across all domains). Domain Agent Framework must handle both.

2. **Accessibility as a domain-level requirement** — WCAG, ADA, Section 508. Every domain's UI must meet accessibility standards. This is not an app-level concern — it's platform-level. Add to security-classification.md.

3. **Localization infrastructure** — Domain vocabularies differ by culture. Family structures differ by country. Tax systems differ by jurisdiction. `domain_path` + locale extensions needed. Example: `personal.family.children.teen.us` vs `personal.family.children.teen.eu` have different legal contexts.

4. **Domain lifecycle management** — When HIPAA requirements change, health domain schema must update. Domain Registry needs `schema_version` + migration path mechanism.

5. **Cross-domain relationship modeling** — A user with health AND finance domains active has a `HealthProfile` that connects to a `FinanceProfile` (insurance costs). Privacy boundary between domains is not automatic — requires explicit consent modeling. This must be in the Domain Agent trust framework (VLT-S022-AGENT-TRUST).

6. **AuditEvent partitioning** — 100,000 AuditEvents/day at scale. Without table partitioning, query performance degrades at month 6. Must be planned in Phase B, not retrofitted.

7. **The wisdom contribution incentive** — Why would users opt in? The value exchange must be explicit: "You receive more personalized insights if you contribute anonymized patterns." This is product design, not just technical.

---

## §9 — Competitive Differentiation Summary

| What Others Have | What CSPS Adds | Why It Matters |
|---|---|---|
| Single-domain apps (Calm, YNAB, Monday) | Cross-domain intelligence via WisdomVault | Sleep → work → relationships connections |
| Business-only platforms (Salesforce, HubSpot) | Personal + business unified schema | Freelancer = same person's business and personal |
| App-level AI (Notion AI, Monday AI) | Governed domain AI agents with behavioral contracts | Auditable, consistent, privacy-compliant AI |
| Generic family apps | 20-year lifecycle: couple → parents → elderly parent care | Longest user relationship in SaaS |
| Privacy as UI concern | Privacy at database layer (ZenStack @@allow) | Breach-resistant, not just breach-notification |
| Per-app governance | Platform governance across 30+ apps | One principles.yaml governs everything |
| Static data | WisdomHub: cross-tenant aggregated patterns | Compounding intelligence moat |

---

## §10 — The Plan Maturity Doctrine (New — To Be Ratified)

*Born from the Governor's S021 insight*

**The problem the doctrine solves:**

Both plans merged here were written and presented for implementation in the same session.
That's the pattern the Governor identified: implementation before planning maturity.
The governance mechanisms that exist (`validate-no-implementation-without-plan.mjs`) check
presence, not maturity. A one-line stub plan passes. A plan written at 9am and implemented
at 10am passes.

**The doctrine:**

```
P-META-XXX — Plan Maturity Minimum

Every plan that directs implementation must demonstrate:

CONTEXT_ABSORBED:
  - Existing related plans checked (consolidation-expert scan)
  - Blast radius mapped (what changes when this executes)
  - Related VLTs checked (no orphaned dependencies)

SCHEMA_ALIGNED:
  - Every new entity in the plan has a proposed schema_anchor
  - No new vocabulary invented without precedent check (B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK)
  - domain_path assigned to every planned artifact

TIMING_RESPECTED:
  - plan_maturity_minimum: S<NNN> set to current session + 1
  - VLTs opened in this plan cannot be resolved in this session
  - plan_maturity_reviewed: null until Governor explicitly reviews and stamps

NORTH_STAR_ALIGNED:
  - Local North Star: plan serves the current session mandate
  - Mid-range North Star: plan advances a platform target within 5 sessions
  - Major North Star: plan fits the 30-app domain-coverage vision
```

**Mechanical enforcement proposal:**
1. Add `plan_maturity_reviewed` and `plan_maturity_minimum` to plan frontmatter schema
2. Extend `validate-no-implementation-without-plan.mjs` to check these fields
3. Block implementation when `plan_maturity_reviewed` is null or matches current session
4. VLT resolve gate: any VLT opened in session S<N> cannot be resolved before S<N+1>

---

## Recommendation to Governor

**Do nothing with this plan in S022 except ratify the 3 P1 VLTs.**

The plan will be more correct after one session of sitting, being read, being questioned.
The 3 VLT ratifications are the only actions that have no dependencies and unlock everything downstream.

After ratification: S023 begins Phase A. That's the earliest responsible start.

**The sequence:**
```
S022: Ratify VLT-S022-DOMAIN-PATH + WISDOM-CLASS + PERSONA-TARGET (30 minutes)
      Optionally ratify VLT-S022-DOMAIN-SLICE-PROTOCOL (15 minutes)
      Mark this plan: plan_maturity_reviewed: S022

S023: Phase A execution (schema stamping + frontmatter extension + taxonomy doc)

S024: Phase B (security classifications + GDPR service + COPPA schema)

S025: Phase C (WisdomVault foundation: AppendOnlyBase + WisdomEntry + WisdomHub)

S026: Phase D (task-mgmt live + first real user)
```

---

*This document is PENDING REVIEW. It becomes a mandate only after:*
*plan_maturity_reviewed is populated AND plan_maturity_minimum session has passed.*
*Claude Sonnet 4.6[1M] | Multi-plan consolidation S021 | 2026-05-09*
