---
id: csps.governance.user-role-schema
name: USER-ROLE-SCHEMA
description: "Formal definition of all user roles across CSPS layers. Three layers: Platform (Governor/AI), CSPS Developer (builds apps), App User (end users of apps). Each role has defined access scope, permissions, and UX persona."
type: governance
protection_level: protected
status: ratified
core_spine: GVRN
schema_anchor: vault_files
version: "1.0"
session: S059
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Which role is the current user? Does the page they're viewing serve their access level and cognitive needs?"
context_quote: "Three different people see the same platform — and each needs the platform to speak directly to them."
inherits_from: "Platform Genome §1 Behavioral Contracts + UX-CORE.md"
---

# User Role Schema — CSPS Platform

> Formal role definitions. Three layers. Every page, component, and UX pattern
> must declare which role(s) it serves. Building for everyone = serving no one.
> Ratified: Opus-8 | Governor: Yariv Fink | S059

---

## LAYER 1 — Platform Level (CSPS infrastructure)

| Role | Industry Name | Access | UX Persona |
|---|---|---|---|
| **Governor** | Platform Owner | Full access to everything | Expert, impatient, action-oriented. Needs status at a glance. No hand-holding. |
| **AI Director** | Platform Architect (AI) | Design + ratification only, no code execution | — |
| **AI Builder** | Platform Builder (AI) | Build from ratified specs, validate, report | — |

---

## LAYER 2 — CSPS Developer (builds apps on CSPS)

People who use CSPS to build SaaS products.

| Role | Industry Name | Access | UX Persona |
|---|---|---|---|
| **Core Developer** | Senior Developer / Platform Developer | All platform pages, all CLI tools, all configuration, can create apps | Technical, self-sufficient. Needs good docs, clear error messages, fast paths. |
| **Contributing Developer** | Developer / Engineer | Their assigned app + platform docs (read-only) | Needs clear scope boundaries. "What can I do here?" |
| **Observer / Reviewer** | Reviewer / Auditor | All pages read-only, no write, no deploy | Needs clear dashboards and audit trails. No action buttons. |

**UX for Layer 2:** Technical language acceptable. Show code paths and file references. Dense information is OK. Assume competence.

---

## LAYER 3 — Application User (end users of apps built on CSPS)

People who USE apps built on CSPS — they never see CSPS itself.

| Role | Industry Name | Access | UX Persona |
|---|---|---|---|
| **Account Owner** | Organization Admin / Account Owner | Full billing, user management, all settings, all data | Business owner. Needs ROI visibility, cost control, team overview. |
| **Admin (Appointed)** | Admin / Workspace Admin | Manages team, settings, data. Cannot change billing or delete org. | Power user. Needs efficiency tools, team views, configuration access. |
| **Team Leader** | Manager / Team Lead | Team analytics, task assignment, team-specific reports. No org-level settings. | Middle management. Needs team dashboards, assignment tools, progress tracking. |
| **Team Member** | Member / User | Defined feature access. Creates/edits within scope. No admin functions. | Standard user. Needs clear task flow, minimal options, fast completion. |
| **Viewer** | Viewer / Read-only User | Read-only access to shared outputs and dashboards. Cannot edit or create. | Stakeholder. Needs clean summaries, visual metrics, export capability. |
| **Guest** | Guest / External Collaborator | Time-limited or content-limited access. Cannot create accounts or invite others. | Visitor. Needs clear context ("You're viewing X shared by Y"), no confusion about scope. |

**UX for Layer 3:** Plain language mandatory. No jargon. Progressive disclosure. First value moment within 60 seconds. Error messages explain what to do, not what failed.

---

## Access Matrix

| | Platform pages | App config | Create apps | Billing | Team mgmt | App features |
|---|---|---|---|---|---|---|
| Governor | ✅ Full | ✅ | ✅ | ✅ | ✅ | ✅ |
| Core Developer | ✅ Full | ✅ | ✅ | ❌ | ❌ | ✅ |
| Contributing Dev | 📖 Read | ❌ | ❌ | ❌ | ❌ | ✅ (scoped) |
| Observer | 📖 Read | 📖 Read | ❌ | ❌ | ❌ | 📖 Read |
| Account Owner | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Admin (Appointed) | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Team Leader | ❌ | ❌ | ❌ | ❌ | ✅ (team) | ✅ |
| Team Member | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (scoped) |
| Viewer | ❌ | ❌ | ❌ | ❌ | ❌ | 📖 Read |
| Guest | ❌ | ❌ | ❌ | ❌ | ❌ | 📖 (shared) |

---

## PE + Combinatorial Engine Integration

**PE scoring** applies to CSPS Developers: the platform scores which features/actions a developer needs most (based on their role and history) and surfaces them first. A Contributing Developer sees their app's PMI dashboard prominently; an Observer sees audit reports.

**Combinatorial Engine** (PIE) generates role-specific journey bundles:
- Account Owner → ONBOARDING: role-calibration + billing setup + team invite
- Team Member → ONBOARDING: context-capture + first task + habit formation
Each role maps to a different L3 journey bundle generated from the L2 option space.

---

*User Role Schema v1.0 | Ratified S059 | Opus-8*
*Update when: new role added, access scope changes, UX persona refined.*
