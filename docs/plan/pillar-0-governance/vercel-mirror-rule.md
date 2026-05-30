---
id: csps.governance.vercel-mirror-rule
name: vercel-mirror-rule
description: >
  Vercel mirror scope rule (M3 Facet B S071). Governs which CSPS artifacts
  get a playground mirror page at /platform/<slug>. Scope: ratifiable artifacts
  with user-facing audience OR files on the user-facing journey. Internal
  infra/tools/validators are NOT mirrored (anti-spam). Wired into the
  ratification-pipeline INSPECT step + pre-tool-use-ux-creation-gate.sh advisory.
type: governance
diataxis_type: reference
protection_level: protected
status: draft
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, AI, OPER]
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S071
owner: group:finky
authored_by: OPUS-14
lifecycle: production
lifecycle_state: active
governing_principle: P-META-028
context_question: >
  Before ratifying any artifact: does it have a /platform/<slug> mirror?
  If it is ratifiable + user-facing AND lacks a mirror → INSPECT step flags it
  before ratification proceeds.
context_quote: >
  "Mirror every ratifiable / user-facing element" — scoped to avoid mirror-spam.
  The anti-spam rule is explicit: internal infra files are not ratifiable content.
  — PLAN-S069 ADDENDUM §Facet B
inherits_from: >
  PLAN-S069-COMMS-AND-JOURNEY.md ADDENDUM Facet B + ratification-pipeline INSPECT step
  + pre-tool-use-ux-creation-gate.sh (element-creation advisory)
links:
  - { rel: ratification-pipeline, href: ../_handoff/PLAN-S069-COMMS-AND-JOURNEY.md }
  - { rel: creation-gate-hook, href: ../../../.claude/hooks/pre-tool-use-ux-creation-gate.sh }
  - { rel: cornerstone, href: ../../../packages/principles/principles/P-META-028-context-refined-communication.yaml }
---

# Vercel Mirror Rule (Facet B)

> **One sentence:** Every ratifiable, user-facing CSPS artifact gets a `/platform/<slug>` playground mirror. Internal infra files (tools, validators, hooks, backend configs) do NOT get mirrors.

## 1 · Scope: what TRIGGERS a mirror requirement

An artifact triggers the mirror requirement when ALL of the following are true:

1. **Status is ratifiable** — frontmatter `status: draft | ratified | protected` (i.e., not a runtime-generated file or a temp artifact)
2. **Audience is user-facing** — frontmatter `audience:` field includes any of: `developer` · `external-developer` · `account-owner-admin` · `team-leader` · `end-user` (i.e., any human actor, not just `ai-agent`)
3. **OR the artifact lives on the user-facing journey** — a step, tool, or page that a human participant navigates during onboarding, handoff, session, or app-build

## 2 · Anti-spam: what is explicitly NOT mirrored

The following artifact types are NEVER mirrored, even if ratified:

| Type | Reason |
|---|---|
| `tools/validators/*.mjs` | Internal CI tooling — no human reads these |
| `.claude/hooks/*.sh` | AI hook scripts — hook output surfaces to AI, not users |
| `tools/scripts/*.mjs` | Build/generator scripts — dev tooling, not product |
| `packages/principles/principles/*.yaml` | Principle slices — consumed by AI session context, not users |
| Backend schema files (`.prisma`, ZModel) | Architecture artifacts, not user surfaces |
| `tools/data/*.json` | Runtime data files — internal diagnostics |

## 3 · The mirror format

A playground mirror for ratifiable artifact `X`:
- Lives at `apps/csps-playground/src/app/platform/<slug>/page.tsx`
- Renders the artifact's key content in human-readable form
- Includes an editor + governed-path download (write-back pattern from M3/M4)
- Declares `pageDNA.communication_situation` (per comms-schema — AD-NOT-REPLACE)

Example mirrors already built (S070-S071):
- `communication-schema.yaml` → `/platform/communication` (M3 S070)
- `JOURNEY-DOCTRINE.md` → `/platform/developer-journey` §Journey Doctrine section (M4 S070)
- `RZF-LATEST.md` → `/platform/rzf` §RZF-LATEST section (M1 S071)

## 4 · Enforcement

| Surface | Mechanism | Status |
|---|---|---|
| **T1 (advisory)** | `pre-tool-use-ux-creation-gate.sh` — advises when creating a ratifiable/user-facing artifact without a mirror | advisory S071 |
| **T2 (advisory)** | `validate-vocabulary-coverage.mjs` catches dev-term leakage in user-facing content | advisory S071 |
| **T3 (session)** | INSPECT step in ratification-pipeline — requires dashboard URL before ratify proceeds | session S071 |

## 5 · Ratification pipeline INSPECT step (wired)

Before an artifact moves from `status: draft → ratified`, the INSPECT step verifies:
1. Dashboard URL exists (if applicable per this rule)
2. The mirror renders the correct content
3. The mirror is accessible at `/platform/<slug>`

Format: `INSPECT — /platform/<slug> renders correctly → proceed to RIPPLE-QC`

If no mirror is required (artifact is internal infra per §2), INSPECT skips the dashboard check.

## 6 · Build order for new mirrors

1. Author the artifact (`status: draft`)
2. Build the `/platform/<slug>` mirror page (SSR-bundled JSON, governed-path write-back, ADD-only)
3. INSPECT: verify the mirror renders
4. RATIFY via governed-path commit

Numbers in this document are sample/tunable per P-META-028 cornerstone.

*Draft — Governor ratification pending. Wired into S071 M3.*
