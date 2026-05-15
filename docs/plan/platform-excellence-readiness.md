---
id: csps.plan.platform-excellence-readiness
name: platform-excellence-readiness
description: >
  Pre-external-launch excellence benchmark for CSPS. Multi-expert panel assessment
  of platform readiness across all domains before exposing developer frontends,
  customer journeys, onboarding wizards, and external user surfaces. Includes:
  schema completion proposal (WisdomVault anchor, domain_path, persona_target),
  full 3-tier domain taxonomy (business + personal + social + knowledge), Wisdom
  Vault and Hub architecture, and current readiness % per area. Authoritative
  reference for what "high-end innovative professional platform" means in 2026.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, ARCH, AI]
schema_anchor: platform_plans
session: S022
tags:
  - domain:architecture
  - domain:governance
  - domain:planning
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: parent, href: ./README.md }
  - { rel: foundation-slices, href: ./_handoff/VAULT/topic-plans/foundation-slices.md }
  - { rel: core-manifest, href: ./pillar-0-governance/csps-core-manifest.md }
  - { rel: bedrock, href: ./pillar-0-governance/csps-bedrock.md }
  - { rel: session-extraction, href: ./_handoff/VAULT/session-S021-extraction.md }
domain_path: platform
scope_level: S1
---

# Platform Excellence Readiness Plan
## Pre-External-Launch Benchmark — Expert Panel Assessment

> **Why this document exists:** Before exposing developer-facing APIs, customer journeys,
> onboarding wizards, landing pages, and external user surfaces — we need an honest
> assessment of what "high-end professional platform" requires, where we are, and what
> sequence gets us there without architectural debt that will cost 10× to fix later.

---

## §0 — The Central Question

**What does a high-end, innovative, professional platform need to have completed
before it can credibly serve developers, business users, and personal users
at excellence-tier standards?**

This document answers through 8 expert lenses, then proposes a sequenced build arc.

---

## §1 — Schema Completion Proposal (FIRST — Foundation Before Layers)

### Why Schema First

The schema IS the architecture. Every feature built on an incomplete schema will either
drift from it or be rebuilt when the schema matures. The current CSPS schema covers:

| Layer | Coverage | Status |
|---|---|---|
| Universal core fields (id, name, lifecycle, owner) | 100% | ✓ Sealed |
| Governance fields (core_spine, schema_anchor) | 100% | ✓ Active |
| Discovery tags (domain, type, audience, maturity) | ~60% | ⚠ Partial — 6 closed enums, no taxonomy path |
| Domain ontology (which domain does this belong to in the 3-tier tree?) | 0% | ✗ Missing |
| Persona targeting (which user persona does this serve?) | 0% | ✗ Missing |
| Wisdom classification (how does this contribute to the WisdomVault?) | 0% | ✗ Missing |
| Use-case class (tracking, planning, communication, analysis, automation) | 0% | ✗ Missing |
| Cross-domain linkage (how does this connect to other domain schemas?) | 10% | ✗ Only via `links:` |

### Proposed Schema Extensions (add to frontmatter-closed-enums.md + validate-frontmatter.mjs)

```yaml
# ── NEW FIELD: domain_path ──────────────────────────────────────────────────
# Machine-readable ontological position in the 3-tier domain taxonomy.
# Format: "<life_area>.<tier2_domain>.<tier3_subdomain>"
# Enables: domain-specific queries, AI agent routing, WisdomVault indexing
domain_path: "personal.health.sleep"      # example — leaf node
domain_path: "business.finance"           # tier 2 only — domain card
domain_path: "social.community"           # tier 2
# Closed enum at tier 1 (life_area): business | personal | social | knowledge | platform

# ── NEW FIELD: persona_target ───────────────────────────────────────────────
# Who this artifact primarily serves. Multi-value allowed.
# Enables: UI filtering, AI routing, feature gating
persona_target:
  - solo_user          # individual using CSPS for personal life management
  - business_admin     # org admin managing team/company resources
  - business_member    # team member within a business tenant
  - family_admin       # family account manager
  - family_member      # family member (child account, etc.)
  - community_leader   # community/social group organizer
  - developer          # building on the CSPS platform

# ── NEW FIELD: wisdom_class ─────────────────────────────────────────────────
# How this artifact contributes to the WisdomVault (see §3).
# Enables: WisdomHub MCP queries, cross-domain pattern matching
# Closed enum:
wisdom_class: insight       # a discovered pattern or principle
wisdom_class: reference     # reference material (templates, standards)
wisdom_class: workflow      # a process or procedure
wisdom_class: tool          # a usable tool or instrument
wisdom_class: benchmark     # a measurement standard or comparison point
wisdom_class: story         # anonymized case study or experience pattern
wisdom_class: null          # (default) — not wisdom-vault-relevant

# ── NEW FIELD: use_case_class ───────────────────────────────────────────────
# What user need this addresses at the functional level.
# Closed enum:
use_case_class: tracking     # logging, journaling, monitoring
use_case_class: planning     # goals, projects, scheduling
use_case_class: communication # messaging, collaboration, sharing
use_case_class: analysis     # reporting, insights, decisions
use_case_class: automation   # workflows, triggers, rules
use_case_class: discovery    # search, recommendations, browsing
use_case_class: creation     # authoring, building, designing
use_case_class: governance   # rules, policies, compliance
```

### Why This Is a Consolidation Win

Currently domain identity is scattered across:
- `tags: domain:X` — single-dimension, no hierarchy
- `domain_card.md` files — prose, not machine-readable
- `core_spine:` — governance spine, not user-facing domain
- Manual `links:` — not ontological

Adding `domain_path` + `persona_target` + `wisdom_class` makes the schema the **single
source of architecture identity** — every artifact knows exactly where it lives in the
domain tree, who it serves, and how it contributes to the knowledge graph.

**This is the consolidation move:** WisdomVault doesn't need its own taxonomy system.
It reads `domain_path` + `wisdom_class` from the existing frontmatter. The schema IS the ontology.

---

## §2 — The 3-Tier Domain Taxonomy

### Research Foundation

Frameworks evaluated: Wheel of Life (12-domain extended), Life Operating System (Burchard),
PARA (Forte), GTD Areas, Robbins 7 Areas, Schema.org type hierarchy, NAICS business
classification, SDG framework.

**Recommendation: 3-Tier Hybrid Model**
- Tier 1 (5 meta-domains): broadest classification — human-universals
- Tier 2 (35-40 domains): functional life/work areas — CSPS apps live here
- Tier 3 (150+ sub-domains): specific focus areas — features and AI agents live here

**Why 3-tier vs 2-tier or 4-tier:**
- 2-tier: too flat for 30+ apps — all apps collapse into 7 buckets
- 4-tier: too deep for navigation — enterprise-only complexity
- 3-tier: matches how real human life actually organizes (I have a "health" life area; within it "sleep" is distinct from "nutrition"; within sleep "tracking" differs from "coaching")

---

### TIER 1 — Meta-Domains (5)

```
BUSINESS    — Professional and organizational activities
PERSONAL    — Individual life management and growth
SOCIAL      — Community, relationships, and connection
KNOWLEDGE   — Learning, research, and wisdom
PLATFORM    — CSPS infrastructure and governance (internal)
```

---

### TIER 2 + TIER 3 — Full Taxonomy

#### 🏢 BUSINESS (Tier 1)

| T2 Domain | T3 Sub-domains | CSPS App Potential | Status |
|---|---|---|---|
| **Finance** | Budgeting, Invoicing, Cash Flow, Tax, Investment, Payroll, Expense Tracking, Financial Reporting | App #2 candidate | 0% |
| **HR & People** | Recruitment, Onboarding, Performance Reviews, Compensation, L&D, Offboarding, Culture, DEI | App #3 | 0% |
| **Marketing** | Brand, Campaigns, SEO, Content, Social Media, Analytics, Email, Paid Ads | App #4 | 0% |
| **Sales** | Pipeline, Proposals, Deals, Forecasting, Commission, Client Relationship | App #5 | 0% |
| **Operations** | Project Management ✓, Inventory, Logistics, Quality, Processes, Compliance | Task-mgmt = scaffold | 10% |
| **Customer Success** | Support Tickets, NPS, Churn, Onboarding, Knowledge Base, Community | App #6 | 0% |
| **Legal & Compliance** | Contracts, IP, Disputes, Regulatory, Privacy, Governance | — | 0% |
| **Strategy** | OKRs, Roadmaps, Competitive Intel, Board Management, M&A | — | 0% |

**Business T2 coverage: 8 domains, 0-10% built**

---

#### 👤 PERSONAL (Tier 1)

| T2 Domain | T3 Sub-domains | Notes |
|---|---|---|
| **Health** | Physical / Mental / Nutrition / Sleep / Fitness / Medical History / Medications / Biometrics | HIPAA-adjacent — extra schema care needed |
| **Relationships** | Romantic / Friendships / Professional Network / Mentorship / Boundaries | Cross-domain with Family and Social |
| **Family** | *See family sub-tree below* | Most complex — age-dependent sub-domains |
| **Finance** | Personal Budget / Savings / Investments / Debt / Insurance / Estate Planning | Cross-domain with Business Finance |
| **Career** | Job Search / Skills / Goals / Portfolio / Freelance / Side Projects | Cross-domain with Business |
| **Academic** | Formal Education / Online Learning / Research / Certifications / Study | Cross-domain with Knowledge |
| **Spiritual** | Mindfulness / Values / Purpose / Faith / Practices / Retreats | Highly sensitive — privacy-first |
| **Creative** | Arts / Music / Writing / Design / Crafts / Performance | Cross-domain with Knowledge |
| **Home & Living** | Property / Maintenance / Interior / Garden / Smart Home | — |
| **Travel** | Planning / Experiences / Documents / Budget / Itineraries | — |

**Family Sub-Tree (complexity warranting its own expansion):**

```
PERSONAL.FAMILY
├── couple           — relationship health, communication, shared goals, intimacy
│   ├── childless    — lifestyle planning, dual-income dynamics
│   └── parents      — parenting philosophies, shared responsibilities
├── children
│   ├── infant       — 0-2: feeding, development milestones, sleep schedules
│   ├── toddler      — 2-5: potty training, daycare, early learning
│   ├── child        — 6-12: school, activities, health, friendships
│   ├── teen         — 13-18: identity, social pressure, education, mental health
│   └── young_adult  — 18-25: college, independence, financial launch
├── extended
│   ├── elderly_parent  — caregiving, medical, financial planning, housing
│   ├── grandparents    — engagement, legacy, health management
│   └── siblings        — adult sibling dynamics
└── single_parent    — unique financial, emotional, logistics challenges
```

**Personal T2 coverage: 10 domains + rich Family sub-tree, 0% built**

---

#### 🌐 SOCIAL (Tier 1)

| T2 Domain | T3 Sub-domains |
|---|---|
| **Community** | Neighborhood / City / Online Communities / Clubs / Associations |
| **Civic** | Volunteering / Activism / Voting / Local Government |
| **Networking** | Professional Events / Alumni / Industry Groups |
| **Giving** | Charitable Giving / Impact Tracking / Cause Alignment |

**Social T2 coverage: 4 domains, 0% built**

---

#### 📚 KNOWLEDGE (Tier 1)

| T2 Domain | T3 Sub-domains |
|---|---|
| **Research** | Literature Review / Citation Management / Note Systems / PKM |
| **Learning** | Course Management / Skill Tracking / Reading Lists |
| **Creation** | Writing / Publishing / Documentation |
| **Wisdom** | Insights / Patterns / WisdomVault (see §3) |

**Knowledge T2 coverage: 4 domains, 0% built (WisdomVault architecture proposed here)**

---

## §3 — WisdomVault Architecture

### What It Is

The WisdomVault is CSPS's strategic differentiator — a platform-level knowledge graph that
accumulates wisdom from all domains, across all tenants (privacy-preserving), making every
user progressively smarter through pattern recognition that no single-domain platform can offer.

**Example of cross-domain wisdom (what no other platform can surface):**
- *Users who log sleep quality AND track project completion rates show: 8h sleep → 23% higher
  project completion rate (anonymized, aggregated, N=1000+)*
- *Families with teens who structure "connection rituals" show 40% lower teen anxiety scores
  in the following quarter*
- *Solo businesses that run weekly financial reviews are 3× more likely to survive year 3*

This is fundamentally different from single-domain AI (Calm for sleep, Monday for projects,
YNAB for finance). CSPS is the only platform that can make these connections.

### WisdomVault Schema

```
WisdomEntry (extends AppendOnlyBase — immutable knowledge artifact)
├── id                    — UUID
├── createdAt             — timestamp
├── domain_path           — "personal.health.sleep" (source domain)
├── cross_domain_paths    — ["business.operations", "personal.relationships"] (connections)
├── wisdom_class          — insight | reference | workflow | tool | benchmark | story
├── insight_type          — individual | cohort | cross-domain | temporal
├── privacy_level         — personal | anonymized | aggregated | public
├── confidence_score      — 0.0–1.0 (AI-assessed reliability)
├── source_session_count  — how many user sessions contributed to this insight
└── tenant_id             — null for platform-level aggregated wisdom

WisdomHub (MCP Server)
├── query_by_domain(domain_path, depth)
├── find_cross_domain_patterns(domain_paths[])
├── get_benchmarks_for(domain_path, persona_target)
└── contribute_insight(entry, tenant_id)  — privacy-preserving contribution
```

### WisdomVault Integration Points

| Surface | Integration |
|---|---|
| Every app's dashboard | "Insights for you" — personalized WisdomHub queries |
| AI agents | Agent spawns query WisdomHub before recommending — learned context |
| Onboarding wizard | "Here's what people like you typically start with" |
| Goal setting | "People with similar goals achieved X in Y time" |
| Cross-domain dashboard | "Your sleep affects your work affects your relationships" |

---

## §4 — Expert Panel Assessment

### Expert 1: Schema Architect

**Assessment:** The foundation schema (7 models, ZenStack enforcement) is solid and correctly
designed. Multi-tenant from day 1. ZenStack @@allow policies at the ORM layer — correct.

**Gap #1 (CRITICAL):** No domain-specific schema extension protocol. When Finance app is
built, where do Invoice, Transaction, Budget models live? Without a Domain Schema Extension
Protocol, each app invents its own approach.

**Recommendation:** Define `Domain Schema Slice Protocol`:
- Foundation models (`libs/policies/schema.zmodel`) — IMMUTABLE across all apps
- Domain models (`libs/policies/slices/<domain>/*.zmodel`) — owned by domain, inherited by apps
- App models (`apps/<app>/prisma/schema.prisma`) — app-specific only

**Gap #2 (HIGH):** No cross-tenant schema federation. If personal Finance and business Finance
share the Transaction concept, they should share a schema ancestor, not duplicate definitions.

**Readiness: Foundation 85%, Domain Extension Protocol 0%**

---

### Expert 2: Platform Architecture

**Assessment:** L0/L1/L2 layer separation is excellent. ZenStack enforcement wired. RLS at DB.

**Gap #1 (HIGH):** No domain isolation within a single tenant. A business tenant using both
HR and Finance has no schema-level boundary between HR data and Finance data. An HR clerk
could (currently) query Finance tables if the row-level access controls aren't precise.

**Recommendation:** Domain-scoped ZenStack contexts:
```typescript
// Today:
const db = await getEnhancedDb(ctx);  // full tenant access

// Future:
const hrDb = await getDomainDb(ctx, 'business.hr');      // HR domain only
const financeDb = await getDomainDb(ctx, 'business.finance');  // Finance only
```

**Gap #2 (MEDIUM):** No persona-based schema filtering. A business_member has different
access than business_admin within the same domain.

**Readiness: Layer separation 90%, Domain isolation 0%, Persona-based access 0%**

---

### Expert 3: AI & Agent Architecture

**Assessment:** Skills registry (26 skills), behavioral contracts, inner-AI-defaults — excellent
governance. No other platform governs AI behavior this precisely.

**Gap #1 (CRITICAL):** No domain-specific agents. Every CSPS app will need AI assistance,
but there's no framework for "the Health AI Agent" vs "the Finance AI Agent" with different
capabilities, knowledge, and behavioral constraints.

**Recommendation:** Domain Agent Protocol:
```
Domain Agent = Foundation Agent + Domain Knowledge + Domain Tools + Domain Constraints
- Foundation: B_AI_PROFESSIONAL_VOICE + B_VALIDATE_BEFORE_ASSUME + AAP
- Domain Knowledge: WisdomHub queries for domain context
- Domain Tools: MCP tools specific to this domain (health APIs, finance APIs)
- Domain Constraints: domain-specific behavioral rules (HIPAA for health, etc.)
```

**Gap #2 (HIGH):** No WisdomHub yet. The killer feature of cross-domain AI intelligence
has no infrastructure. Every domain AI operates in isolation today.

**Gap #3 (MEDIUM):** No agent-to-agent communication protocol. Health agent should be able
to consult Sleep agent, which consults Work agent, to give holistic advice.

**Readiness: Foundation agents 40%, Domain agents 0%, WisdomHub 0%, Agent networks 0%**

---

### Expert 4: Business Domain

**Assessment:** Task-mgmt (Operations domain) is 10% done as a scaffold. No other business
domain has been started. The business domain tree is comprehensive but empty.

**Critical path for Business excellence:**

1. **Finance domain first** — every business needs financial tracking; highest monetization
   potential; required for CSPS to manage its OWN finances on-platform
2. **Operations (complete task-mgmt)** — already scaffolded; quick win to first live app
3. **HR** — third most universal business need
4. **Marketing + Sales** — revenue-generating domains; higher specialization required

**What makes CSPS's business offering stand out:**
- Cross-domain: Finance + HR + Operations in ONE unified schema (no data silos)
- AI-native from day 1 (not bolted-on AI like Notion or Monday)
- Wisdom benchmarks: "How do similar companies at your stage allocate budget?"
- Family-to-business bridge: personal finance and business finance share a common ancestor

**Readiness: 5% (scaffold only)**

---

### Expert 5: Personal Domain

**Assessment:** Zero personal domain infrastructure. This is the largest whitespace.

**What "high-end" means for personal domain:**

The key insight from research: no platform successfully integrates ALL personal life domains
because of the **complexity + privacy tension**. Google's Life OS failed because it was too
invasive. Notion is too general. Exist.io tracks 70+ metrics but no AI synthesis.

**CSPS's advantage:** The schema-first approach + ZenStack privacy enforcement means
personal data is truly isolated at the database level, not just application-level.

**The Family Sub-domain is the biggest opportunity:**
No platform today serves the Family as a unit across time (infant → teen → adult → elderly parent).
The family domain_path tree (`personal.family.couple`, `personal.family.children.teen`, etc.)
gives CSPS a unique 20-year relationship with users that no productivity app can match.

**Build priority:**
1. Health (highest engagement, daily use, clear metrics)
2. Finance (personal) — bridges to business finance
3. Family (highest retention, long lifecycle)
4. Career (bridges to business, professional growth)

**Readiness: 0%**

---

### Expert 6: UX & Customer Journey

**Assessment:** Zero external user surfaces built. This is the "last mile" that converts
platform capability into user value.

**What a high-end platform launch requires:**

**Tier 1 — Must have before ANY external access:**
- [ ] Domain selection wizard (which life/business areas do you need?)
- [ ] Onboarding flow (persona detection → tailored setup)
- [ ] Empty state experience (what to do when you first arrive in any domain)
- [ ] Permission and privacy setup UI (GDPR-first, not GDPR-after)

**Tier 2 — Must have within first 3 months:**
- [ ] Cross-domain dashboard ("your life at a glance")
- [ ] AI introduction flow ("meet your AI assistant for each domain")
- [ ] WisdomVault onboarding ("here's what we've learned for people like you")
- [ ] Progress/growth view (how are you improving across domains over time?)

**Tier 3 — Makes it outstanding:**
- [ ] Family sharing and collaboration UI
- [ ] Business team onboarding (invite team members to specific domains)
- [ ] WisdomHub insights surfaced naturally in context (not a separate page)
- [ ] Cross-domain alert system ("your sleep data suggests a risk to your work patterns")

**Readiness: 0%**

---

### Expert 7: Security & Privacy

**Assessment:** Strong foundation — multi-tenant RLS, ZenStack, Clerk auth, soft-delete.
The architectural choices are correct. The implementation gaps are dangerous.

**Gap #1 (CRITICAL — blocks personal domains):**
Health data requires special handling (HIPAA-adjacent). A `HealthRecord` model must have:
- Explicit data classification tag (`@sensitivity: health`)
- Separate ZenStack policy set (`@@allow("read", health.isOwnerOrCaregiverWithConsent(auth())`)
- Audit trail for every access (not just writes)
- Right-to-erasure path (GDPR Article 17)

**Gap #2 (CRITICAL — before family domain):**
Family domain with children creates legal liability (COPPA for under-13, GDPR for EU minors).
Child accounts must never be created with full capabilities — they need parental consent flow
and age-gating at the schema level, not just the UI.

**Gap #3 (HIGH — before any business domain):**
SOC 2 Type II compliance path needs to be defined before business customers will commit.
The audit infrastructure (ZenStack + AuditEvent) is the right foundation, but the SOC 2
control mapping hasn't been documented.

**Recommendation:** Create `docs/plan/pillar-0-governance/security-classification.md` that
maps domain types to their sensitivity tier and required controls.

**Readiness: Foundation 80%, Health-grade privacy 0%, Family/minor safety 0%, SOC2 path 10%**

---

### Expert 8: Scale & Performance

**Assessment:** Current scale: 1 app, 0 real tenants. The architecture is correct for scale
but untested at scale. The N+1 query risk identified in S019 is still present.

**What breaks at 30 apps × 1,000 tenants × 100 concurrent users:**

1. **pnpm verify runtime** — currently ~30s. At 30 apps, O(N) validators = 90-120s. Unacceptable.
2. **ZenStack `enhance()` per request** — currently one DB client per request.
   At 1,000 concurrent users: 1,000 enhanced clients × 30 apps = memory pressure.
3. **WisdomHub cross-domain queries** — joining across 5-7 domain schemas per query.
   Without proper indexing and caching, P99 latency will be >2s.
4. **Audit log volume** — every domain write generates an AuditEvent.
   At 10 writes/user/day × 10,000 users = 100,000 AuditEvents/day.
   Without partitioning, AuditEvent table degrades queries by 6 months.

**Readiness: Architecture 85%, Load testing 0%, AuditEvent partitioning 0%, WisdomHub perf 0%**

---

## §5 — Current Readiness Assessment

### Overall Platform Readiness: ~28%

| Layer | Readiness | What's done | What's missing |
|---|---|---|---|
| **Foundation Schema** | 85% | User/Tenant/UserTenant/AuditEvent + ZenStack | Domain extension protocol |
| **Auth & Identity** | 80% | Clerk JWT, multi-tenant, billing trigger | Persona-based scoping, family/child accounts |
| **Billing** | 40% | Stripe wired, subscription status | Metered billing per domain, usage quotas |
| **Audit** | 60% | AuditEvent model, writeAuditEvent() | Partitioning, domain-scoped audit views |
| **Platform Governance** | 65% | 51 validators, contracts, hooks, skills | 46% STUB hooks, behavioral enforcement gaps |
| **AI Infrastructure** | 35% | Skills, behavioral contracts, inner-defaults | Domain agents, WisdomHub, agent networks |
| **Schema Frontmatter** | 55% | 7 closed-enum fields, 4 tag dimensions | domain_path, persona_target, wisdom_class |
| **Business Domains** | 5% | Task-mgmt scaffold (Operations partial) | Finance, HR, Marketing, Sales, Legal, etc. |
| **Personal Domains** | 0% | Nothing | Health, Family, Finance, Career, Spiritual |
| **Social Domains** | 0% | Nothing | Community, Civic, Giving, Networking |
| **Knowledge/Wisdom** | 0% | Nothing | WisdomVault, WisdomHub, cross-domain AI |
| **Security Classifications** | 10% | RLS, ZenStack | Health-grade, COPPA, SOC2 map |
| **UX / Customer Journeys** | 0% | Nothing | Wizards, onboarding, empty states, dashboards |
| **Scale & Performance** | 20% | Correct architecture | Load tests, partitioning, query optimization |
| **Developer APIs** | 5% | API routes in task-mgmt | SDK, documentation, playground |

---

## §6 — Priority Build Arc (Before External Launch)

### Phase A — Schema Completion (2 sessions) — **DO FIRST**

1. Add `domain_path`, `persona_target`, `wisdom_class`, `use_case_class` to frontmatter spec
2. Add closed-enum validation to `validate-frontmatter.mjs`
3. Create `docs/plan/pillar-0-governance/domain-taxonomy.md` (this taxonomy as canonical)
4. Stamp all existing 282+ artifacts with `domain_path` (batch update)
5. Create `libs/policies/slices/` directory structure for domain schema extensions

**Unlocks:** Every future artifact automatically knows its place in the taxonomy.

---

### Phase B — Security Classifications (1 session) — **DO SECOND**

1. `docs/plan/pillar-0-governance/security-classification.md` — sensitivity tiers per domain
2. Health data schema patterns (sensitivity annotations in ZModel)
3. Child/minor account protocol
4. SOC2 control mapping skeleton

**Unlocks:** Health and Family domains can be built without legal risk.

---

### Phase C — WisdomVault Foundation (2 sessions)

1. `WisdomEntry` model + `AppendOnlyBase` (already specced in S019)
2. `WisdomHub` MCP server (basic query interface)
3. Privacy-preserving aggregation patterns
4. WisdomVault indexing by `domain_path`

**Unlocks:** Every domain built after this automatically contributes to cross-domain intelligence.

---

### Phase D — First Live App: Task Management (1 session)

Complete what's scaffolded:
1. `pnpm db:push` to Supabase (Governor-initiated)
2. Dev server validation (UI renders, auth works, CRUD works)
3. Empty state UX + basic onboarding

**Unlocks:** First real user can use CSPS. Real feedback loop begins.

---

### Phase E — Domain Agent Framework (2 sessions)

1. Base `DomainAgent` class extending `BaseAgent`
2. Domain knowledge injection pattern (WisdomHub integration)
3. Domain tool registry per domain
4. Agent-to-agent communication protocol

**Unlocks:** Every domain can have an intelligent AI assistant that draws on cross-domain wisdom.

---

### Phase F — Personal Health Domain (2 sessions)

The highest-engagement, highest-retention personal domain:
1. Health schema slice (`libs/policies/slices/personal/health/`)
2. Health-grade privacy controls
3. Basic tracking UI (sleep, exercise, nutrition)
4. Health AI Agent (query WisdomHub for health patterns)

**Unlocks:** First personal domain live. Real user engagement data.

---

### Phase G — Business Finance Domain (2 sessions)

The highest-monetization business domain:
1. Finance schema slice (`libs/policies/slices/business/finance/`)
2. Invoice, Transaction, Budget models
3. Basic finance UI
4. Finance AI Agent

**Unlocks:** First paying business customers possible.

---

### Phase H — External Surfaces (3 sessions)

Only AFTER A-G are stable:
1. Landing pages
2. Domain selection wizard
3. Onboarding flows per persona
4. Cross-domain dashboard
5. Developer API documentation + playground

---

## §7 — The Wisdom Vault as Consolidation Move

### Why This Changes Everything

Today CSPS has:
- Behavioral contracts (governance wisdom)
- Principles (architectural wisdom)
- Inner-AI-defaults (AI calibration wisdom)
- Domain cards (domain knowledge)

These are separate silos. The WisdomVault consolidates them:

```
WisdomVault
├── Platform Wisdom (existing — behavioral contracts, principles, inner-AI-defaults)
│   └── Accessed by: AI agents, Sonnet sessions, validators
├── Domain Wisdom (new — patterns from aggregated user data, privacy-preserving)
│   └── Accessed by: domain AI agents, WisdomHub MCP, user dashboards
└── Cross-Domain Wisdom (new — the killer feature — patterns across life areas)
    └── Accessed by: orchestrator agents, life dashboard, personalized recommendations
```

Every existing governance artifact gets `wisdom_class: reference | insight | workflow` in its
frontmatter. The WisdomHub MCP can then answer: "What governance principles apply to the
health domain?" by querying `domain_path: "personal.health"` + `wisdom_class: reference`.

**This is one source of truth for the entire platform's knowledge.**

---

## §8 — Iterative Improvement Register

*This section captures what was discovered AFTER the initial draft — the things you find
when you look harder. Updated as new insights emerge.*

### Iteration 1 Findings (S022 initial draft)

1. **The COPPA gap** — not in any existing planning document. Child accounts in Family domain
   require a parental consent workflow that must be SCHEMA-LEVEL enforced, not just UI-enforced.
   VLT needed: `VLT-S022-COPPA-SCHEMA`.

2. **The AuditEvent partitioning gap** — currently AuditEvent has no partitioning strategy.
   At scale (year 2), this will degrade the entire platform. Should be planned now.
   VLT needed: `VLT-S022-AUDIT-PARTITIONING`.

3. **The domain agent trust boundary** — if Health AI Agent queries Finance AI Agent,
   what's the trust model? Agent-to-agent communication needs its own ZenStack policy set.
   VLT needed: `VLT-S022-AGENT-TRUST`.

4. **The "wisdom contribution" incentive problem** — why would users allow their data to
   contribute to the WisdomVault? Need opt-in design + value proposition (you get more
   insights if you contribute). This is a product design question, not just technical.

5. **The family account billing model** — family members share a tenant. Who pays?
   Family Admin pays. But what if a teenager wants to upgrade their personal health tracking?
   Billing model needs `family_account` tier separate from `solo` and `business`.

6. **The graduation path for domain schemas** — when a domain slice reaches maturity,
   it should be extractable as a standalone SaaS product. The graduation protocol
   (schema extraction, data migration, independent billing) needs to be designed now,
   not retrofitted.

---

## §9 — What Stands Out vs. Competition

| Differentiator | Why Others Don't Have It | CSPS Advantage |
|---|---|---|
| Cross-domain intelligence (WisdomVault) | Single-domain focus | Only platform connecting sleep to work to relationships |
| Schema-governed AI behavior | AI bolted on as feature | Every AI agent is governed, auditable, and consistent |
| Family-as-unit over time | Apps target individuals or businesses | 20-year user lifecycle: couple → parents → elderly |
| Privacy-first at DB layer | App-level privacy controls | ZenStack @@allow is the data gate, not the UI |
| Domain Schema Extension Protocol | Monolithic schemas | Each domain is a slice that can graduate to its own product |
| Unified governance across 30+ apps | Per-app governance | One principles.yaml governs everything |
| WisdomHub as platform moat | Data stays in single apps | Aggregated cross-tenant wisdom compounds with every user |

---

## §10 — Open VLTs from This Analysis

| VLT ID | Decision required | Priority |
|---|---|---|
| VLT-S022-DOMAIN-PATH | Ratify `domain_path` closed enum Tier 1 values | P1 |
| VLT-S022-WISDOM-CLASS | Ratify `wisdom_class` closed enum values | P1 |
| VLT-S022-PERSONA-TARGET | Ratify `persona_target` closed enum values | P1 |
| VLT-S022-DOMAIN-SLICE-PROTOCOL | Ratify domain schema slice directory structure | P1 |
| VLT-S022-COPPA-SCHEMA | Define child account schema constraints | P2 |
| VLT-S022-AUDIT-PARTITIONING | Define AuditEvent partitioning strategy | P2 |
| VLT-S022-AGENT-TRUST | Define agent-to-agent trust model | P2 |
| VLT-S022-FAMILY-BILLING | Define family account billing tier | P2 |
| VLT-S022-GRADUATION-PROTOCOL | Define domain slice graduation path | P3 |
| VLT-S022-WISDOM-CONTRIBUTION | Define opt-in model for WisdomVault contribution | P3 |

---

## §11 — Recommended First Session Action (S022)

**Ratify the 3 schema extension fields:** `domain_path`, `persona_target`, `wisdom_class`.
These are the foundational additions that make everything else in this document possible.
Without them: every artifact is taxonomy-less, every WisdomHub query is impossible,
every domain agent has no ontological anchor.

**Single ratification session, 3 VLTs, unblocks the entire Phase A build.**

---

*Document signature: S022-GVRN-platform-excellence-readiness-v1.0-2026-05-09*
*Expert panel: Schema Architect, Platform Architecture, AI & Agents, Business Domain,*
*Personal Domain, UX & Customer Journey, Security & Privacy, Scale & Performance*
