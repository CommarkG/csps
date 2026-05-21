---
id: SIA.R1-08-TEMPLATE-BUNDLE-SYSTEM
name: SIA-R1-template-bundle-system
description: "Template Bundle System — how CSPS seals capabilities as bundles, assembles apps from verified chunks, and handles tier upgrades across many SaaS apps"
type: doc
protection_level: protected
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [ARCH, OPER, GVRN]
core_spine: ARCH
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - SIA.R1-01-NODE-SCHEMA
  - SIA.R2-01-PLATFORM-INTELLIGENCE-ENGINE
  - SIA.META-04-PLANNING-METHODOLOGY
context_question: "How does CSPS assemble apps from sealed template bundles, and how do upgrade paths work across many SaaS services?"
context_quote: "Any invested energy must have a place. Every verified capability becomes a template the next build inherits."
---

# R1.8 — Template Bundle System

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> This is the architecture for how CSPS compounds — every verified capability
> becomes a reusable bundle the next app inherits for free.

---

## 1. The Core Principle

> *"Any invested energy must have a place."*

Every capability built and verified in CSPS gets sealed as a template. The next app
that needs that capability doesn't rebuild it — it activates the existing verified bundle.
The platform grows by consuming its own outputs.

This is P-ARCH-COMPLETE-DEFAULT applied to the production layer:
- All capabilities exist as sealed bundles
- Apps activate the subset they need
- Unused bundles are deactivated, not absent
- Upgrading = activating a higher bundle, not rebuilding

---

## 2. Bundle Taxonomy (the template hierarchy)

### Foundation Bundles (inherited by all apps)
Every CSPS app forks these. Non-negotiable. Cannot be deactivated.

```
FOUNDATION_BUNDLE
├── AUTH (Clerk — users, sessions, organizations)
├── TENANCY (ZenStack RLS — row-level isolation)
├── AUDIT_BASE (event capture — who did what, when)
├── DEPLOY_PIPELINE (Vercel + Supabase + env schema)
└── GOVERNANCE_LAYER (validators, hooks, DNA blocks)
```

### Tier Bundles (activated by app needs)

```
STARTUP_BUNDLE (default for new apps)
├── Single-tenant mode
├── Basic permissions (owner + member)
├── Core audit trail
└── Standard rate limits

GROWTH_BUNDLE (activates on top of STARTUP)
├── Multi-tenant support
├── Role-based permissions (admin + member + viewer)
├── Advanced audit trail + exports
├── Webhook support
└── API key management

ENTERPRISE_BUNDLE (activates on top of GROWTH)
├── Enterprise SSO (SAML, OIDC)
├── Custom roles + permission inheritance
├── Compliance audit trail (SOC2-ready)
├── Custom domains
├── SLA + uptime guarantees
└── Data residency controls
```

### Domain Bundles (activated per use case)

```
BILLING_BUNDLE
├── Subscription management
├── Usage metering
├── Invoice generation
└── Payment processing (Stripe wired)

AI_BUNDLE
├── Anthropic API integration
├── Prompt management
├── Token budget tracking
└── AI behavioral governance (CSPS AI council patterns)

COMMUNITY_BUNDLE
├── User profiles + social graph
├── Discussion threads
├── Notification system
└── Moderation tools

REPORTING_BUNDLE
├── Dashboard templates
├── Export mechanisms (CSV, PDF)
├── Scheduled reports
└── Custom metrics
```

---

## 3. How a New App Assembles Its Bundle

When a developer plans a new app through the 7-section wizard:
- Section 3 (EPOCH scope) maps directly to which bundles to activate
- The orchestrator reads the section 3 answers and proposes a bundle selection
- Governor ratifies the bundle selection before fork

The fork creates an app with:
1. Foundation Bundle (always included)
2. Tier Bundle (based on target market)
3. Domain Bundles (based on the app's specific features)
4. The delta (only what's unique to this app)

**The ratio:** 10-20% unique delta. 80-90% inherited bundles.

---

## 4. Upgrade Paths — Pre-Defined and Verified

Upgrade paths are not computed at request time. They are pre-defined, tested, and sealed.

```
UPGRADE PATH: STARTUP → GROWTH
Prerequisites: [app is stable on STARTUP_BUNDLE]
Changes:
  - Activate TENANCY (ZenStack RLS already wired, switch to multi-tenant mode)
  - Activate ROLE_BUNDLE (admin + member + viewer roles)
  - Activate WEBHOOK_BUNDLE
  - Activate API_KEY_BUNDLE
Migration:
  - Add tenant_id to all entities (migration script pre-defined)
  - Backfill existing users as org admins
  - Zero-downtime migration: dual-write period
Validation: pnpm verify exit_code=0 + smoke test suite
Rollback: pre-defined rollback script (sealed, tested)
```

```
UPGRADE PATH: GROWTH → ENTERPRISE
Prerequisites: [app is stable on GROWTH_BUNDLE + BILLING_BUNDLE]
Changes:
  - Activate SSO_BUNDLE
  - Activate CUSTOM_ROLES_BUNDLE
  - Activate COMPLIANCE_BUNDLE
  - Activate DATA_RESIDENCY_BUNDLE
Migration:
  - SSO mapping for existing users
  - Permission migration script
  - Compliance data backfill
Validation: pnpm verify + compliance audit run
Rollback: pre-defined (sealed, tested)
```

Each upgrade path is a **sealed, versioned artifact** — not a recipe, not documentation, but a runnable, tested script that has been verified before being made available.

---

## 5. Use Cases When 100+ Apps Are Running

The scenarios that become common at scale:

### Scenario A — Simultaneous tier upgrade requests
10 apps want to upgrade from STARTUP → GROWTH in the same week.
Response: each runs the same pre-verified upgrade path. No individual engineering work.
The upgrade path was paid for once (when it was built and sealed).
Each subsequent use is free.

### Scenario B — New compliance requirement
A regulation requires all apps to add audit trail export.
Response: build COMPLIANCE_EXPORT_BUNDLE once, add to the domain bundle catalog.
All affected apps activate the bundle. Zero redundant development.

### Scenario C — Platform capability improvement
CSPS improves the RLS implementation (better performance).
Response: update the TENANCY_BUNDLE, bump the version.
Apps on the old version get a notification: "TENANCY_BUNDLE v2.1 available."
Upgrade is a one-line bundle version change.

### Scenario D — App needs a new domain capability
App X needs reporting. REPORTING_BUNDLE already exists.
Response: activate REPORTING_BUNDLE. All dashboard templates, export mechanisms, and
scheduled report infrastructure are immediately available.
App X writes only the business-specific metrics.

### Scenario E — A new bundle emerges from an app
App Y builds a sophisticated notification system.
Through the template process, the notification system is extracted, generalized, and sealed
as NOTIFICATION_BUNDLE v1.0.
All future apps that need notifications activate this bundle.
App Y's engineering investment now serves every subsequent app.

---

## 6. The Self-Creating Property

The platform grows by consuming its own outputs:

```
App builds unique capability
    ↓
Capability is verified (pnpm verify exit_code=0 + integration tests)
    ↓
Capability is generalized (remove app-specific references)
    ↓
Capability is parameterized (configuration over hard-coding)
    ↓
Capability is sealed (protection_level: sealed, version locked)
    ↓
Capability is registered in BUNDLE_REGISTRY
    ↓
Capability is available to all future apps
    ↓
Next app activates it → spends energy only on their delta
    ↓
Their delta may become the next bundle
```

This is the compounding mechanism. Each cycle the platform grows; each cycle the delta
required for new apps shrinks.

---

## 7. Connection to the PE Engine

The PE Engine (Platform Intelligence Engine) must know about bundle status:

- `bundle_readiness_gate`: before any app can use a bundle, the bundle must be
  `status: sealed` in the BUNDLE_REGISTRY
- `upgrade_path_gate`: before any app can upgrade, the upgrade path must be
  `status: verified` and `rollback: tested`
- `bundle_cost_signal`: PE scoring for new capabilities includes whether the work
  will produce a reusable bundle (higher PE score if yes — the work compounds)

**New PE dimension (Queen — timing):** the right moment to build a capability is when
two or more apps need it. Building for one app = app-specific work. Building for two+ = bundle.
PE detects when the same need appears in two different app plans and surfaces the
BUNDLE_OPPORTUNITY signal.

---

## 8. Incremental Bundle Audit

When auditing 200 apps for bundle compliance, running the full audit each time is
expensive. The incremental audit mechanism:

- Every audit run stores the last-run commit hash per app
- Next run: `git diff [last-commit]..HEAD --name-only` per app
- Only apps with changed files since last audit are fully scanned
- Monthly: full scan regardless of changes
- Weekly: delta scan only

This is the general DELTA_AUDIT_PRINCIPLE — applies to all recurring audits, not just bundles.
Canonical registration: tools/config/unified-plan.yaml (plan item DELTA-AUDIT-PRINCIPLE).

---

## 9. Open Questions (for next ARCH-SESSION)

1. What is the bundle promotion process? When does app-specific code become a bundle candidate?
2. How are bundle versions managed? Semantic versioning? Breaking change detection?
3. Can bundles depend on other bundles? (e.g., COMPLIANCE_BUNDLE depends on AUDIT_BUNDLE)
   This creates a dependency graph — how is it managed?
4. Who owns a bundle after it's sealed? The app that originated it? Platform team?

---

*CSPS — SIA | Template Bundle System v0.1 | S050 | Protection: protected*
