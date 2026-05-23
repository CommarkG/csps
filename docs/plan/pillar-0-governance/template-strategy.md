---
id: csps.governance.template-strategy
name: template-strategy
description: "How enterprise platforms use templates — canonical pattern research applied to CSPS. Three-tier template model: structural, page pattern, component."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: governance_section
diataxis_type: explanation
session: S040
scope_level: S1
impl_status: swift-implemented
links:
  - { rel: parent, href: ../pillar-4-developer-experience/ }
  - { rel: related, href: ../../_handoff/VAULT/multi-session-plan-S040-playground-inheritance.md }
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# CSPS Template Strategy
## How canonical templates work — enterprise research + CSPS application

---

## §1 — Enterprise Template Patterns (Research)

### Figma (Design Systems)
**Pattern:** Shared components library → instances declare `@master-component`. When master
updates, Figma prompts: "2 instances of this component have changes. Update all?"
**Key insight:** The instance KNOWS its parent. The update is explicit, not invisible.
**What CSPS takes from this:** `inherits_from` field + inheritance-propagator audit report.

### Stripe Design System
**Pattern:** Canonical design tokens (colors, spacing, typography) defined once in a
`tokens.json` file. All components reference tokens, never hardcode values. When a token
changes, all components that use it automatically reflect the change.
**Key insight:** The canonical source is version-controlled. Consumers inherit by reference,
not by copy.
**What CSPS takes from this:** Canonical template vault → instances reference the vault file,
not a copy of it. `inherits_from: platform/templates/vault/[type]-clean.html`.

### Salesforce Lightning Design System (SLDS)
**Pattern:** Three-tier hierarchy — Tokens (primitive values) → Components (use tokens) →
Patterns (compose components). Nothing at a higher tier imports from a lower tier.
**Key insight:** The direction of inheritance is one-way and explicit. Lower tiers don't know
about higher tiers.
**What CSPS takes from this:** The three-tier template model (see §2).

### Backstage (Spotify's developer platform)
**Pattern:** Software Templates define a scaffold. When a new service is created from a
template, Backstage records `template: [template-name]` in the `catalog-info.yaml`. The
catalog can then query "all services created from template X."
**Key insight:** The inheritance lineage is machine-readable and queryable.
**What CSPS takes from this:** `inheritance-registry.yaml` — every artifact registered with
its template source, queryable by the propagator.

### Docker
**Pattern:** `FROM baseImage` at the top of every Dockerfile. Every change to the base image
creates a new image version. Child images that want the update must explicitly rebuild `FROM
baseImage:new-version`. Old children remain on old base until explicitly updated.
**Key insight:** Updates are NEVER automatic. Explicit rebuild required. This prevents
surprise breakage.
**What CSPS takes from this:** inheritance-propagator generates an audit report and requires
human confirmation. Never auto-applies changes.

---

## §2 — CSPS Three-Tier Template Model

Applied from the Salesforce SLDS pattern, adapted for CSPS.

### T1 — Structural Templates (Sealed · Changes require ADR)
**What:** The structural skeleton all apps share — layout, middleware, auth, configuration.
**Examples:**
- `apps/template/src/app/layout.tsx` (ClerkProvider wrapper)
- `apps/template/src/middleware.ts` (auth + rate limiting)
- `apps/template/next.config.js` (security headers, transpilePackages)
**Inheritance rule:** Apps fork T1 structural templates at creation (via `create-app.sh`).
Changes to T1 require Sacred Parts protection (OPEN-037) + Governor ratification.
**Change frequency:** Rare. Breaking changes require coordinated update across all apps.

### T2 — Page Pattern Templates (Versioned · Changes require propagator audit)
**What:** The recurring page layouts — dashboard, settings, account-setup, auth pages.
**Examples (playground):**
- `platform/templates/vault/hero-clean.html` (v1.0)
- `platform/templates/vault/content-clean.html` (v1.0)
- `platform/templates/vault/tabbed-clean.html` (v1.0)
- `platform/templates/vault/living-reference-clean.html` (v1.1)
**Inheritance rule:** New pages copy from vault, declare `inherits_from` + `template_version`.
When mother template version bumps, `inheritance-propagator.mjs` generates audit report.
Human confirmation required per instance before applying update.
**Change frequency:** Moderate. Additive changes (new features) are low-risk.

### T3 — Component Templates (Versioned · Changes propagate with notification)
**What:** Individual UI shells and utility components.
**Examples:**
- `libs/components/DashboardShell` (React component)
- `libs/components/DataTable<T>` (typed table)
- `libs/components/OnboardingWizard` (3-step wizard)
**Inheritance rule:** Components are imported as packages (`@csps/components`). Version bump
in `libs/components/package.json` triggers notification to all consuming apps.
**Change frequency:** Moderate to frequent (UX improvements, new features).

---

## §3 — How This Applies to CSPS

### The Canonical Template → Instance Chain

```
T1: apps/template/ (structural)
  └── apps/habit-tracker/ (inherits_from: apps/template/)
  └── apps/task-mgmt/     (inherits_from: apps/template/)
  └── apps/[future-app]/  (inherits_from: apps/template/)

T2: platform/templates/vault/[type]-clean.html (page pattern)
  └── platform/ai-personas/index.html        (template: living-reference, v1.1)
  └── platform/completion/index.html         (template: content, v1.0)
  └── ux-ui/color-themes/index.html          (template: tabbed, v1.0)

T3: libs/components/ (component library)
  └── apps/habit-tracker → uses DashboardShell, DataTable
  └── apps/template → uses OnboardingWizard
```

### The Inheritance Registry (tools/config/inheritance-registry.yaml)
Every artifact in the chain is registered with:
- `id` — artifact identifier
- `inherits_from` — parent artifact path
- `template_version` — version of parent at last alignment
- `last_aligned` — ISO date of last inheritance alignment
- `completion_status` — stub/draft/complete

### The Propagator Workflow
1. Parent template bumps version (e.g. living-reference v1.1 → v1.2)
2. `inheritance-propagator.mjs` scans registry for all artifacts with `template: living-reference`
3. For each: generates audit report (what changed, impact, recommendation)
4. Governor reviews report, confirms/rejects per artifact
5. Only confirmed artifacts are updated

### The DNA Block (in every file)
The DNA block is the machine-readable inheritance declaration. It is:
- The FIRST content in every file (not a comment — a governance artifact)
- Used by `validate-dna-block.mjs` (T2) to verify inheritance is declared
- Read by `inheritance-propagator.mjs` to find outdated instances
- Visible to human developers as documentation of lineage

---

## §4 — Why This Is the Moat

Other platforms iterate endlessly because inheritance breaks silently. A template changes;
instances diverge; no one knows until production breaks. The CSPS moat:

1. **No silent divergence** — every instance knows its parent version
2. **No automatic updates** — human always confirms before applying parent changes
3. **No orphan artifacts** — every file declares what it inherits from
4. **No accidental breakage** — the propagator shows impact before applying

The biological analogy holds: in organisms, DNA replication errors are caught by repair
mechanisms before they propagate. The inheritance-propagator + audit gate is that repair
mechanism for CSPS.

---

*Created: 2026-05-18 | Session: S040 | PROTO-019 Step 3*
*Research sources: Figma Component Properties, Stripe Design System docs,*
*Salesforce SLDS Architecture, Spotify Backstage Template docs, Docker FROM semantics.*
