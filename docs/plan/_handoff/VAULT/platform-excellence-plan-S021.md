---
id: csps.handoff.vault.platform-excellence-plan.S021
name: platform-excellence-plan-S021
description: >
  Strategic excellence plan for CSPS before frontend development begins.
  Multi-expert review covering: Schema-as-Architecture-Hub proposal, Wisdom Vault
  architecture, Universal Domain Tree (personal/business/social), % completion
  per domain, and a phased plan to reach platform excellence. Research-grounded.
  Iterate before implementing.
version: 1.0
lifecycle: production
lifecycle_state: pending-review
next_review_at: S022
dynamic: true
owner: group:finky
core_spine: GVRN
schema_anchor: opus_consultations
session: S021
created_by: Claude Sonnet 4.6[1M] — Multi-expert platform review
tags:
  - domain:governance
  - domain:architecture
  - domain:platform
  - type:reference
  - audience:developer
  - maturity:draft
links:
  - { rel: platform-audit, href: ../../../platform-audit/README.md }
  - { rel: value-prop, href: ./csps-pitch-and-value-S019.md }
  - { rel: schema, href: ../../../../libs/policies/schema.zmodel }
  - { rel: opus-lessons, href: ./opus-lessons-S019/README.md }
domain_path: platform
scope_level: S1
---

# CSPS Platform Excellence Plan — S021
## Before Frontend: What the Platform Must Become

---

> **Governor's Directive:** Before splitting attention to developer/user frontends,
> establish what a high-end, innovative professional platform needs to complete.
> Act as multiple top experts. Research how domain taxonomies are solved.
> Propose schema as the architecture hub. Design the Wisdom Vault.
> Cover all domains. Rate current % completion.

---

## The Central Architectural Insight: Schema as the One Source

**Current reality:** CSPS has one schema (`libs/policies/schema.zmodel`) that defines:
- 4 foundation slices (User, Tenant, UserTenant, AuditEvent)
- 3 app slices (Project, Task, TaskComment)

**The proposal:** The schema should not be a data model. It should be the **architecture hub** — the single source from which every other platform component derives its shape.

```
SCHEMA (libs/policies/ + libs/domains/)
    │
    ├── Data Models          → Prisma/ZenStack (what exists today)
    ├── Domain Registry      → what domains the platform can serve (NEW)
    ├── Wisdom Vault         → canonical knowledge per domain (NEW)
    ├── Compliance Layer     → regulatory requirements per domain (NEW)
    ├── Vocabulary Layer     → canonical terms per domain (NEW)
    └── Pattern Library      → recurring architecture patterns per domain (NEW)
```

Everything is derived from schema. An app developer who picks a domain gets:
1. The data model (from schema)
2. The vocabulary (from schema-anchored vocabulary)
3. The compliance requirements (from schema-anchored compliance)
4. The user journey templates (from schema-anchored patterns)

**This is a consolidation move.** Multiple scattered artifacts — audit-runner.md, vocabulary.md, platform-audit domain cards, behavioral contracts — all currently float independently. Schema-as-hub means each artifact is **schema-anchored** and machine-derivable from the domain registration.

The Wisdom Vault is the name for this schema-anchored knowledge system.

---

## Research: How Others Have Solved Universal Domain Coverage

**Finding 1 — No Universal Taxonomy Exists (Build Your Own)**
Schema.org has 823 types and is the broadest public ontology, but prioritizes web markup over personal-professional domain unification. Apple App Store uses ~25 categories; Google Play ~32. Both are deliberately shallow and overlap at the edges. **CSPS implication:** Do not inherit from any existing taxonomy. Build a purpose-specific 3-layer model.

**Finding 2 — Notion's Flat Cross-Purpose Approach is Closest**
Notion's template marketplace covers 250+ categories spanning engineering to wedding planning with no enforced personal/professional boundary. This is the closest to what CSPS needs — because real human life doesn't enforce the boundary either. A freelancer's personal budget IS their business budget. A parent's calendar IS their work calendar. **CSPS implication:** Allow apps to serve the same user across the personal/professional boundary; don't force categorization that doesn't match lived experience.

**Finding 3 — TBM Taxonomy for Criticality Layering**
Technology Business Management (TBM) taxonomy organizes apps by business criticality tier (Tier 1 mission-critical, Tier 2 important, Tier 3 supporting). This is orthogonal to functional domain but critical for governance. **CSPS implication:** Every domain has a criticality tier that determines its compliance requirements.

**Finding 4 — Schema.org + Custom Extensions is the Right Pattern**
Schema.org as a substrate (for interoperability + SEO), then CSPS Domain Graph on top (for specific app needs). Extension > inheritance. **CSPS implication:** CSPS Domain Registry should map to Schema.org types where they exist, extend where they don't.

**Finding 5 — Personal-Professional Hybrids Are the Differentiator**
No existing taxonomy handles "blurred boundary" domains cleanly (habit tracking for productivity, expense tracking for tax + personal budget, health tracking for insurance). **CSPS implication:** The "Hybrid" category is not a compromise — it's a competitive advantage. Build first-class hybrid support.

**Recommended Architecture:** 3-layer taxonomy
1. **Schema.org Substrate** — interoperability, SEO markup, industry standard
2. **CSPS Domain Graph** — 7 major domains, 50-70 sub-domains
3. **User Archetype + Criticality Overlay** — who uses it + how critical is it

---

## Expert Panel Review

### Expert 1 — Enterprise Platform Architect
*"What does a high-end professional SaaS foundry need that CSPS doesn't have yet?"*

**Gap 1: Multi-Region Tenancy Architecture**
Current: single Supabase instance. Enterprise apps need: data residency by region (EU data stays in EU), cross-region replication for DR, per-tenant database isolation option. This is not just compliance — it's competitive differentiation for regulated industries. Without it, CSPS cannot serve healthcare (HIPAA), financial services (SOX), or government (FedRAMP) customers.

**Gap 2: Event Sourcing / CQRS Pattern**
AuditEvent is append-only — that's correct. But it's currently a side effect (writes happen in business logic). A true event-sourced architecture makes events first-class: every state change IS an event; the current state is derived from event history. This enables: time-travel debugging, full audit reconstruction, reactive event-driven apps (Stripe webhooks is the precursor of this).

**Gap 3: Feature Flag Infrastructure**
30 apps need feature gating at the platform level: `tenant.features` array determining which capabilities are available. Without platform-level feature flags, every app implements its own (inconsistently). The platform should provide: `libs/features/` with a canonical FeatureFlag model and enforcement pattern.

**Gap 4: Webhook Dispatch Infrastructure**
Currently: apps receive webhooks (Clerk, Stripe). They don't emit them. A SaaS platform at scale needs: a canonical webhook dispatcher (`libs/webhooks/`) that allows apps to emit events that external systems can subscribe to. This enables: Zapier integrations, customer automation, third-party ecosystem.

**Completion: ~35% of enterprise requirements met** (auth✓ billing✓ audit✓ multi-tenancy✓ / multi-region✗ event-sourcing✗ feature-flags✗ webhook-dispatch✗)

---

### Expert 2 — UX/Product Designer
*"What makes apps in each domain stand out from the generic SaaS crowd?"*

**Gap 1: Contextual Intelligence Layer**
Every domain has context that shapes what users need. A healthcare app knows the patient's conditions and surfaces relevant information contextually. A family app knows school schedules and surfaces homework reminders appropriately. Generic SaaS is context-blind. CSPS apps should have a `UserContext` model: `{ currentRole, activeProjects, relevantDates, domainMetadata }` that app UIs query to provide contextual intelligence.

**Gap 2: Journey State Tracking**
Most SaaS treats every login as stateless. Outstanding apps track where users are in their journey: onboarding, habit formation, milestone achievement, support need. Platform-level `UserJourneyState` enables: proactive nudges, contextual help, celebration of milestones.

**Gap 3: Notification Intelligence**
Current: no notification infrastructure. Outstanding apps notify at the right time, through the right channel, with the right content. Platform-level NotificationTemplate + NotificationPreference + NotificationLog models (in the schema) would let every app inherit smart notification capability.

**Gap 4: Adaptive Interfaces**
Personal and professional users need different information architectures for the same data. A CRM contact looks different to a salesperson vs. an account manager vs. a support agent. Platform-level Role-Based View configuration (not just role-based access) enables this.

**Completion: ~20% of outstanding UX requirements met** (role access✓ / contextual intelligence✗ journey tracking✗ notifications✗ adaptive views✗)

---

### Expert 3 — Compliance & Security Expert
*"What domain-specific regulatory requirements must the platform pre-solve?"*

| Domain | Regulation | Current Status | What's Needed |
|---|---|---|---|
| Healthcare | HIPAA | ✗ 0% | PHI encryption at rest, audit log of all PHI access, Business Associate Agreements |
| Finance | PCI-DSS | ~30% | Card data never touches CSPS (Stripe handles), but PCI-compliant logging needed |
| Finance | SOX | ✗ 0% | Financial report integrity, role separation, audit trail immutability |
| Children's Apps | COPPA | ✗ 0% | Age verification, parental consent, no behavioral tracking under 13 |
| EU Users | GDPR | ~15% | Erasure path specified (S019) but not built; data residency not enforced |
| Education | FERPA | ✗ 0% | Student record privacy, parental rights for under-18 |
| Legal | Attorney-Client | ✗ 0% | Privileged communication protection, conflict-of-interest detection |

**The compliance gap is the single largest barrier to serving regulated industries.** Without a HIPAA-compliant foundation, CSPS cannot build a healthcare app. Without COPPA support, no children's education app. Without FERPA, no K-12 platform.

**Recommended platform architecture:** `libs/compliance/` module with domain-specific compliance profiles:
- `HIPAAProfile` — PHI field tagging, encryption requirements, access logging
- `COPPAProfile` — age verification, parental consent flows
- `GDPRProfile` — erasure paths, consent management, data residency
- `SOXProfile` — financial audit trail, role separation enforcement

**Completion: ~15% of compliance infrastructure** (soft-delete✓ audit trail✓ / HIPAA✗ COPPA✗ FERPA✗ SOX✗ GDPR-erasure✗)

---

### Expert 4 — Data Architect
*"How should the schema be extended to cover all domains without becoming a monolith?"*

**The Monolith Trap:**
The naive approach: add every domain's fields to Tenant and User. This is what most platforms do and why they hit schema paralysis at 100 tables. Tenant accumulates `stripeSubscriptionId`, `hipaaComplianceDate`, `coppaAgeVerified`, `gdprConsentTimestamp` — each field reasonable in isolation, creating an incoherent monolith together.

**The Extension Pattern (recommended):**
Domain schemas as separate ZModel files that can be "activated" for a tenant:

```
libs/domains/
  health/
    health-profile.zmodel          → HealthProfile, Condition, Medication, Provider
    hipaa-compliance.zmodel        → PHIAccessLog, BAAgreement
  family/
    family-unit.zmodel             → FamilyUnit, FamilyMember, ChildProfile
    education-tracker.zmodel       → SchoolEnrollment, Grade, Homework
  finance/
    accounts.zmodel                → Account, Transaction, Budget
    tax.zmodel                     → TaxYear, TaxDocument, TaxItem
  business/
    crm.zmodel                     → Contact, Deal, Activity
    hr.zmodel                      → Employee, Department, Review
    marketing.zmodel               → Campaign, Lead, Channel
```

Each domain ZModel:
1. Imports foundation slices (User, Tenant, AuditEvent)
2. Defines domain-specific entities
3. Is activated at the Tenant level via `tenant.activeDomains: Domain[]`
4. Has its own ZenStack policies
5. Is registered in the Domain Registry

**The Domain Registry (new schema concept):**
```
model DomainRegistration {
  id          String
  tenantId    String
  domainSlug  String   // "health", "family.children", "finance.personal"
  activatedAt DateTime
  config      Json     // domain-specific configuration
  @@allow("read", auth().tenantId == tenantId)
}
```

A tenant that activates "health" gets the health domain schema, compliance profile, vocabulary, and domain card — automatically.

**The Wisdom Vault in schema terms:**
The Wisdom Vault is `libs/wisdom/` — a collection of schema-adjacent knowledge artifacts:
- `wisdom/vocabularies/` — canonical term definitions per domain
- `wisdom/patterns/` — recurring data pattern definitions  
- `wisdom/compliance/` — compliance profile manifests
- `wisdom/journeys/` — user journey templates

All machine-readable. All schema-anchored. All derivable from the domain registration.

**Completion: ~10% of domain extension architecture** (foundation slices✓ ZModel pattern✓ / domain registry✗ domain slices✗ wisdom vault✗ domain activation✗)

---

### Expert 5 — Platform Economist
*"Where is the real value in serving multiple domains, and what does excellence look like commercially?"*

**The Network Effect of Domain Coverage:**
A platform that serves healthcare AND finance AND education creates cross-domain value: a healthcare practice that also needs payroll, an educational institution that needs donor management, a family that needs both health tracking and financial planning. Single-domain platforms cannot serve these cross-domain users. CSPS can — if its domain schemas are composable.

**The Moat: Domain Expertise as Schema**
Every domain schema in CSPS represents accumulated knowledge about how to structure data for that domain. A healthcare domain schema that's been validated against 3 HIPAA audits is worth more than raw code — it's proven. A family management domain schema that handles custody arrangements, blended families, and aging parents is worth more than 6 months of development. The moat is not the code — it's the validated domain schemas.

**The Platform Economics of Domain Activation:**
If a tenant can "activate" a domain (health, finance, HR) and immediately get the schema, compliance, vocabulary, and patterns — the time-to-value for building on CSPS drops dramatically. Domain activation could be a premium feature: Platform Plan activates 3 domains, Enterprise Plan activates unlimited.

**Completion: ~5% of platform economics realized** (billing model exists✓ / domain-based pricing✗ domain schemas✗ composability✗)

---

### Expert 6 — AI/Knowledge Systems Architect
*"How does AI change what a platform needs to include?"*

**Gap 1: AI-Queryable Domain Knowledge**
The Wisdom Vault should not just be files — it should be MCP-queryable. `get_domain_schema("health")`, `get_compliance_requirements("healthcare.hipaa")`, `get_vocabulary("family.custody")`. This is the MCP knowledge graph Phase 5 already planned but not connected to domains.

**Gap 2: AI-Assisted Domain Configuration**
When a developer says "build me a family management app," an AI assistant should be able to: (1) query the domain registry, (2) activate the family domain, (3) generate the app template with correct schemas, compliance requirements, and vocabulary — automatically. This requires the Wisdom Vault to be AI-consumable.

**Gap 3: Cross-Domain Intelligence**
A user with both health and finance domains active could ask: "How does my health condition affect my insurance costs?" An AI that can query across domain schemas and find the connection enables cross-domain insights that no single-domain app can provide.

**Completion: ~8% of AI-enhanced domain coverage** (principles-mcp skeleton✓ / domain MCP queries✗ AI domain configuration✗ cross-domain intelligence✗)

---

## The Universal Domain Tree for CSPS

*Research basis: Schema.org substrate + Notion's flat approach + CSPS's 3-layer model*

### Layer 1 — Major Domains (7)

```
PERSONAL
PROFESSIONAL
SOCIAL
SPECIALIZED INDUSTRIES
HYBRID (Personal-Professional Blend)
INFRASTRUCTURE (Platform services — not user-facing)
EMERGING (Web3, AI-native, spatial computing)
```

### Layer 2 — Sub-Domains (50 total)

**PERSONAL (12 sub-domains)**
```
Personal/Health
  └── Mental Health (therapy, mood, anxiety, depression, mindfulness)
  └── Physical Health (fitness, nutrition, sleep, chronic conditions, medication)
  └── Preventive (screenings, vaccines, checkups)
  └── Medical Records (conditions, providers, insurance, PHI)

Personal/Family
  └── Couple (married, partnered, co-parenting, divorce management)
  └── Children — Infant/Toddler (0-3: milestones, feeding, sleep)
  └── Children — School Age (4-12: homework, activities, development)
  └── Children — Teen (13-17: education, mental health, driving, independence)
  └── Children — Adult (18+: college, career launch, financial independence)
  └── Aging Parents (elder care, medical, legal, estate)
  └── Extended Family (genealogy, family events, shared resources)
  └── Blended Family (custody, step-parenting, complex scheduling)

Personal/Finance
  └── Budgeting (daily spending, categories, goals)
  └── Investment (portfolio, retirement, goals)
  └── Debt (student loans, mortgage, credit cards, payoff plans)
  └── Tax (personal filing, deductions, documents)
  └── Insurance (life, health, auto, home — coverage tracking)

Personal/Learning
  └── Academic (K-12, higher ed, continuing education)
  └── Skills (professional development, certifications, courses)
  └── Self-Directed (reading, projects, experiments)

Personal/Spiritual & Mindfulness
  └── Meditation & Practice (sessions, streaks, progress)
  └── Religious Practice (calendar, community, texts)
  └── Philosophy & Growth (journaling, reflection, principles)

Personal/Home & Lifestyle
  └── Property (maintenance, costs, repairs, inventory)
  └── Travel (planning, booking, memories, budget)
  └── Hobbies (tracking, community, progress)
  └── Pets (health, care, vet records)
```

**PROFESSIONAL/BUSINESS (15 sub-domains)**
```
Business/Finance & Accounting
  └── Bookkeeping (transactions, reconciliation, chart of accounts)
  └── Invoicing & AR (billing, payments, aging)
  └── Payroll (employees, runs, compliance)
  └── Tax Business (entity tax, quarterly estimates, documents)
  └── Financial Reporting (P&L, balance sheet, cash flow)

Business/People & HR
  └── Recruitment (job posts, applications, pipeline)
  └── Onboarding (tasks, documents, provisioning)
  └── Performance (reviews, goals, 1:1s)
  └── Benefits & Compensation (packages, equity, PTO)
  └── Compliance & Labor (regulations, time tracking, records)

Business/Marketing
  └── Content (calendar, creation, publishing)
  └── SEO & Paid (keywords, ads, analytics)
  └── Email (campaigns, lists, automation)
  └── Social Media (scheduling, listening, analytics)
  └── Analytics (attribution, funnels, reporting)

Business/Sales & CRM
  └── Pipeline (deals, stages, forecasting)
  └── Contact Management (companies, contacts, history)
  └── Proposals & Contracts (documents, signatures, versions)

Business/Operations
  └── Project Management (tasks, milestones, resources)
  └── Vendor Management (contracts, performance, payments)
  └── Inventory (products, stock, orders)
  └── Quality (processes, audits, issues)

Business/Legal & Compliance
  └── Contract Management (templates, execution, renewal)
  └── Regulatory Compliance (requirements, deadlines, evidence)
  └── IP Management (patents, trademarks, copyrights)
```

**SOCIAL & COMMUNITY (8 sub-domains)**
```
Social/Communities
  └── Interest-Based (clubs, groups, forums)
  └── Geographic (neighborhood, local groups)
  └── Professional Networks (alumni, associations, guilds)
  └── Causes & Activism (campaigns, volunteers, donations)

Social/Events
  └── Planning (venues, logistics, RSVP)
  └── Management (day-of, attendees, tasks)
  └── Memory (photos, recordings, highlights)

Social/Content & Media
  └── Publishing (blogs, newsletters, podcasts)
  └── Creator Management (audience, revenue, analytics)
```

**SPECIALIZED INDUSTRIES (8 sub-domains)**
```
Healthcare Provider (clinical workflow, patient management, EHR)
Education Institution (courses, enrollments, grades, LMS)
Real Estate (listings, transactions, property management)
Legal Practice (matters, time, billing, documents)
Food & Hospitality (menus, reservations, operations)
Creative (portfolio, client management, project delivery)
Non-Profit (donors, programs, impact measurement, grants)
Government & Public Sector (services, constituents, compliance)
```

**HYBRID (7 sub-domains)**
```
Freelance/Solopreneur (personal + business finance, projects, clients)
Creator Economy (personal brand + business + audience)
Family Business (family + business combined management)
Dual-Income Household (shared finance + personal tracking)
Student-Employee (academic + early career)
Health Professional (personal health + professional practice)
Athlete (personal training + professional performance)
```

**INFRASTRUCTURE (built-in to platform, not user-facing)**
```
Identity & Access (already built — Clerk integration)
Billing & Subscription (already built — Stripe integration)
Audit & Compliance Trail (already built — AuditEvent)
Notifications (planned — notification infrastructure)
Files & Documents (not started — document management)
AI Assistance (in progress — GRACE architecture)
Analytics & Reporting (not started — cross-domain analytics)
```

### Layer 3 — User Archetype + Criticality Overlay

Every domain has a criticality tier (per TBM framework):
- **Tier 1 (Mission Critical):** Healthcare records, financial transactions, legal documents — loss = compliance violation
- **Tier 2 (Business Critical):** HR records, customer data, project delivery — loss = operational disruption
- **Tier 3 (Productivity):** Task management, content, scheduling — loss = inconvenience

The criticality tier determines:
- Backup frequency
- Encryption requirements
- Compliance profile activation
- Audit trail depth
- SLA requirements

---

## Platform Completion Assessment

### By Category

| Domain | Schema | Compliance | UX Layer | AI/ML | Overall |
|---|---|---|---|---|---|
| **INFRASTRUCTURE** | | | | | |
| Identity & Auth | 95% | 90% | 70% | 30% | **71%** |
| Billing | 80% | 70% | 40% | 10% | **50%** |
| Audit Trail | 85% | 30% | 20% | 10% | **36%** |
| Notifications | 0% | 0% | 0% | 0% | **0%** |
| Document Storage | 0% | 0% | 0% | 0% | **0%** |
| **PERSONAL** | | | | | |
| Health | 0% | 0% | 0% | 0% | **0%** |
| Family | 0% | 0% | 0% | 0% | **0%** |
| Personal Finance | 0% | 10% | 0% | 0% | **3%** |
| Learning | 0% | 0% | 0% | 0% | **0%** |
| Spiritual | 0% | 100% | 0% | 0% | **~25%** |
| **PROFESSIONAL** | | | | | |
| Business Finance | 0% | 20% | 0% | 0% | **5%** |
| HR & People | 0% | 20% | 0% | 0% | **5%** |
| Marketing | 0% | 80% | 0% | 0% | **20%** |
| Sales/CRM | 0% | 80% | 0% | 0% | **20%** |
| Operations/PM | 30% | 80% | 0% | 0% | **28%** |
| **SOCIAL** | | | | | |
| Communities | 0% | 80% | 0% | 0% | **20%** |
| Events | 0% | 80% | 0% | 0% | **20%** |
| **INDUSTRIES** | | | | | |
| Healthcare | 0% | 0% | 0% | 0% | **0%** |
| Education | 0% | 0% | 0% | 0% | **0%** |
| Real Estate | 0% | 80% | 0% | 0% | **20%** |
| Legal | 0% | 0% | 0% | 0% | **0%** |
| Non-Profit | 0% | 80% | 0% | 0% | **20%** |

**Platform Infrastructure Readiness: ~37%**
(The horizontal infrastructure — auth, billing, multi-tenancy — is strong. Domain coverage is near zero.)

The 37% reflects: the platform CAN serve any of these domains (the foundation is built), but has not pre-solved any domain-specific requirements (schema, compliance, vocabulary, patterns). An app developer picking healthcare must solve HIPAA from scratch.

---

## The Wisdom Vault Architecture — Detailed Proposal

### What It Is

A machine-readable, schema-anchored knowledge system that stores everything CSPS knows about building apps in each domain. Stored in `libs/wisdom/`, governed by a Domain Registry, MCP-queryable.

### Structure

```
libs/
  domains/                        # Domain schema definitions
    personal/
      health.zmodel
      family.zmodel
      finance.zmodel
    business/
      crm.zmodel
      hr.zmodel
      finance.zmodel
    social/
      community.zmodel
    compliance/
      hipaa.zmodel               # HIPAA-specific models + policies
      coppa.zmodel               # COPPA-specific models
      gdpr.zmodel                # GDPR erasure + consent models
  wisdom/                         # Knowledge layer (non-schema)
    vocabularies/
      health.yaml                 # canonical health terms
      family.yaml                 # canonical family terms
      finance.yaml                # canonical finance terms
    compliance-profiles/
      hipaa.yaml                  # requirements checklist, validation criteria
      coppa.yaml
      gdpr.yaml
    patterns/
      healthcare-app.md           # architectural patterns for healthcare apps
      family-management.md        # patterns for family management apps
    domain-cards/
      health/                     # L1/L2/L3 domain cards per domain
      family/
      business/
  domain-registry.yaml            # Which domains are available, their status
```

### Domain Registry (the hub)

```yaml
# libs/domain-registry.yaml
domains:
  - slug: "personal.health"
    name: "Personal Health"
    status: "designed"          # designed | validated | available | deprecated
    schema: "libs/domains/personal/health.zmodel"
    compliance: ["gdpr"]
    vocabulary: "libs/wisdom/vocabularies/health.yaml"
    pattern: "libs/wisdom/patterns/personal-health-app.md"
    schema_org_type: "https://schema.org/MedicalCondition"
    completeness: 0
    
  - slug: "business.crm"
    name: "CRM / Customer Management"
    status: "designed"
    schema: "libs/domains/business/crm.zmodel"
    compliance: ["gdpr"]
    vocabulary: "libs/wisdom/vocabularies/crm.yaml"
    completeness: 0
```

### How a Developer Uses This

1. Developer says: "I'm building a family management app"
2. Platform: query `get_domain("family")` → returns schema + compliance + vocabulary + patterns
3. Developer activates domain: `domain: "personal.family"` in their app config
4. Platform automatically provisions: family ZModel slices + GDPR compliance profile + family vocabulary + family domain card
5. Developer writes only: family-specific business logic

**This is the foundational shift:** from "developers build on raw platform" to "developers activate domains and extend them."

---

## The Plan — Phased Approach

### Phase 1: Schema-as-Hub Foundation (2-3 sessions)
**Goal:** Establish the architecture without building any domain content yet.

1. Create `libs/domain-registry.yaml` with all 50 domains at status: "planned"
2. Create `tools/validators/validate-domain-registry.mjs` — checks structural integrity
3. Create `tools/config/domain-registry.yaml` alias / cross-reference
4. Define the domain ZModel extension pattern (one example: `libs/domains/personal/family.zmodel`)
5. Add `DomainRegistration` model to foundation schema (tenant activates domains)
6. Add `validate-domain-activation.mjs` — checks domain activation integrity
7. Add domain registry to MCP surface (when principles-mcp Phase 5 runs)

**Deliverable:** The architectural plumbing for domain extension. Zero domain content yet.

### Phase 2: Infrastructure Completion (2 sessions)
**Goal:** Complete what's partially built before adding domains.

1. **Notifications infrastructure** (`libs/notifications/`) — NotificationTemplate, NotificationPreference, NotificationLog
2. **GDPR erasure service** (`libs/gdpr.ts`) — specified in S019, not built
3. **Feature flag infrastructure** (`libs/features/`) — tenant-level feature gating
4. **Webhook dispatch** (`libs/webhooks/`) — apps can emit events
5. **File/document storage** (`libs/documents/`) — canonical document model

**Deliverable:** Platform infrastructure completeness from 37% to ~65%.

### Phase 3: Priority Domains (3-4 sessions)
**Goal:** Build the highest-demand domains first. Priority = frequency × compliance complexity.

Priority 1 — Business Operations (highest demand, most apps will use):
- `libs/domains/business/crm.zmodel` + vocabulary + patterns
- `libs/domains/business/hr.zmodel` + vocabulary
- `libs/domains/operations/project.zmodel` (extends task-mgmt app schema)

Priority 2 — Personal High-Value (significant user base):
- `libs/domains/personal/finance.zmodel` + GDPR compliance
- `libs/domains/personal/health.zmodel` + HIPAA compliance profile
- `libs/domains/personal/family.zmodel` + COPPA if serving children

Priority 3 — Hybrid Domains (differentiator):
- `libs/domains/hybrid/freelance.zmodel` (combines personal + business finance)
- `libs/domains/hybrid/creator.zmodel` (audience + content + monetization)

**Deliverable:** 8-12 domain schemas available for app developers to activate.

### Phase 4: Compliance Layer (2 sessions)
**Goal:** Build compliance profiles so regulated industry apps can be built on CSPS.

1. GDPR profile: erasure + consent + data residency
2. HIPAA profile: PHI field tagging + access logging + BAA support
3. COPPA profile: age verification + parental consent
4. PCI-DSS profile: cardholder data isolation (Stripe already handles cards, but audit log requirements)

**Deliverable:** Platform can serve healthcare, finance, education apps compliantly.

### Phase 5: Wisdom Vault Content (ongoing)
**Goal:** Populate the knowledge layer for each active domain.

For each activated domain:
1. Domain card (L1/L2/L3 depth documentation)
2. Vocabulary (canonical terms)
3. Architecture pattern document
4. Compliance checklist
5. User journey templates
6. Common mistakes and anti-patterns

**Deliverable:** Each activated domain is self-documenting and AI-queryable.

### Phase 6: Developer Frontend (begin after Phase 2-3 complete)
**Goal:** The app developer experience that the Governor mentioned.

At this point, an app developer forking CSPS gets:
- Domain selection wizard ("what domains does your app serve?")
- Automatic schema provisioning from domain registry
- Compliance profile activation
- Vocabulary integration
- Pattern library access

This is when the developer frontend makes sense — because there's rich domain content to expose.

---

## Iteration: What Was Missed in First Pass

*Self-audit per Coverage Enumeration Mental Model (S019)*

**Addition 1 — Vertical SaaS vs. Horizontal SaaS distinction**
The plan treats all domains equally. In reality, Vertical SaaS (deep in one industry, e.g., veterinary practice management) has different architecture needs than Horizontal SaaS (broad features across industries, e.g., project management). CSPS should support both:
- Vertical: one domain activated deeply with industry-specific extensions
- Horizontal: multiple domains activated with cross-domain workflows

**Addition 2 — Accessibility as a Domain-Level Requirement**
WCAG compliance, screen reader support, cognitive accessibility — these are not app-level concerns, they're platform-level. Every domain in the Wisdom Vault should include an `accessibility_requirements` section. CSPS apps serving healthcare or education are often legally required to be accessible (ADA, Section 508).

**Addition 3 — Localization/Internationalization Infrastructure**
Not just language translation — domain vocabularies differ by culture. Family structures differ by country. Tax systems differ by jurisdiction. The domain registry needs a `locale_extensions` mechanism: base domain + locale-specific overrides.

**Addition 4 — Domain Lifecycle Management**
Domains evolve. HIPAA requirements change. New family structures emerge. The Domain Registry needs a versioning mechanism: `domain.schema_version` with migration paths. When a domain schema is updated, all apps that activated it need a migration plan.

**Addition 5 — Cross-Domain Relationships**
A health app and a finance app might share a user. The Wisdom Vault should define canonical cross-domain relationships: `User.healthProfile` → `User.financeProfile` with privacy boundaries between domains. Cross-domain data access is not automatic — it requires explicit consent modeling.

---

## Arrangement: Schema-Anchored Everything

Every artifact in this plan has a `schema_anchor` — connecting it to the domain registry.

| Artifact Type | Current Schema Anchor | Target Schema Anchor |
|---|---|---|
| Domain vocabulary | vocabulary.md (unanchored) | `domain-registry.yaml#vocabulary` |
| Compliance profiles | Not built | `domain-registry.yaml#compliance` |
| Domain patterns | Not built | `domain-registry.yaml#patterns` |
| User journeys | Not built | `domain-registry.yaml#journeys` |
| Domain cards | platform-audit/ (partially anchored) | `domain-registry.yaml#domain_card` |
| App templates | Not built | `domain-registry.yaml#template` |

The schema_anchor field (already in CSPS frontmatter) becomes the machine-readable connection between every knowledge artifact and its domain in the registry. This is the consolidation move.

---

## Summary: Before Frontend, the Platform Needs

1. **Domain Registry architecture** — the hub that makes everything else derive from schema
2. **Infrastructure completion** — notifications, GDPR service, feature flags, webhooks
3. **3-5 priority domain schemas** — enough to demonstrate the pattern and enable real apps
4. **GDPR compliance layer** — the most broadly required compliance, enables EU market
5. **HIPAA compliance profile** — unlocks healthcare vertical (massive market)
6. **Wisdom Vault structure** — even if mostly empty initially, the container must exist

**Platform Infrastructure → Domain Coverage → Developer Frontend → User Frontend**

Trying to build the developer or user frontend before Phase 1-3 produces: a beautiful interface to a narrow platform. The interface will be rebuilt when domain coverage expands. Building the domain coverage first means the frontend is built once, correctly.

---

*Dynamic — Governor will refine, extend, and ratify before implementation proceeds.*
*Claude Sonnet 4.6[1M] | S021 | 2026-05-09*
