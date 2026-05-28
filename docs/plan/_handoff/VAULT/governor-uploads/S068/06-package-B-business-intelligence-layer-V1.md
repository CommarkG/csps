---
id: csps.vault.governor-uploads.S068.06-package-B-business-intelligence-layer
name: 06-package-B-business-intelligence-layer-V1
description: "Governor-uploaded S068 Phase 2 Package B. Business Intelligence Layer. Onboarding = beginning of governed BI Layer for product configuration (NOT generic BI). 'business intelligence for product configuration.' Intelligence must serve configuration (every signal maps to ≥1 downstream use). User vs Tenant context separation (critical). Profile understanding visible+correctable. 5 responsibilities (Identity/Business/Product/Communication/Governance context). Same 3-layer model. Profile summary/transparency concept. Data freshness/revalidation. Safe uploaded-asset use. Maps to PART 3 + PART 7."
type: vault_files
protection_level: protected
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S068
authored_by: Governor (uploaded, via GPT-5.5 external arch process)
absorbed_by: Opus-12
date: 2026-05-28
core_spine: ARCH
core_spines: [ARCH, AI, GVRN]
schema_anchor: vault_files
inherits_from: "Profile-Product Handoff [[02-profile-product-handoff-contract-V1]] + Package A [[05-package-A-dynamic-onboarding-V1]] + existing CIE (libs/intelligence) + User/Tenant/UserTenant entities"
links:
  - rel: master-plan
    href: ../../../MASTER-RE-GATE-PLAN-S068.md
  - rel: companion
    href: 05-package-A-dynamic-onboarding-V1.md
context_question: "Before any inferred signal is stored: does it map to ≥1 downstream configuration use? Is it scoped User vs Tenant correctly? Is it confidence-scored + correctable?"
---

# CSPS Phase 2 — Package B
## Business Intelligence Layer

Version: V1 | Status: Draft for External App Presentation | Maps to: PART 3 (schema) + PART 7 (onboarding)

---

# Core Reframe

Onboarding is not merely setup. It is the **beginning of a governed Business Intelligence Layer for product configuration.**

Build structured understanding of: who the user is / what tenant they belong to / what role / what they're accomplishing / what business context matters / what product bundle fits / which templates+workflows+features to suggest / what remains unknown until confirmed.

# What It Is / Is Not

**IS:** controlled intelligence layer for product configuration / onboarding continuation / bundle recommendations / profile enrichment / personalization / feature suggestions / template prefills / context preservation / tenant adaptation.
**IS NOT:** generic business analytics. Must NOT auto-produce business health scores / financial forecasts / competitor intel / legal / medical / investment advice / operational reporting (unless separate approved modules).
**Safest scope:** *business intelligence for product configuration.*

# Core Principles

- **A. Intelligence Must Serve Configuration** — every collected/inferred signal maps to ≥1 downstream use (routing / bundle / feature / prefill / UX / continuation / support / monetization timing).
- **B. Do Not Confuse Inference With Truth** — confidence-scored, logged, correctable, reversible, separated from deterministic state.
- **C. User and Tenant Context MUST Be Separate** — User context = role, working style, vocabulary, preferences, personal onboarding progress. Tenant context = org type, plan tier, approved features, compliance, team structure, default templates.
- **D. Profile Understanding Should Be Visible and Correctable.**
- **E. Intelligence Improves Over Time** — answers, uploads, context ingestion, behavior, corrections, confirmations, usage.

# 5 Responsibilities

- **A. Identity Context** — user ID, tenant ID, role, account tier, entry path, active context (deterministic, Layer 1)
- **B. Business Context** — industry, business type, customer type, operational model, maturity, use case, pain point (Layer 2, per-Tenant)
- **C. Product Context** — recommended bundle, workflow, template, feature flag, onboarding path, dashboard setup (Layer 3)
- **D. Communication Context** — tone, vocabulary, terminology, language, phrasing, directness (Layer 2, per-User)
- **E. Governance Context** — source signals, confidence, audit history, corrections, overrides, freshness, contradictions

# 3-Layer Model (same as Doc 02)

Layer 1 deterministic identity/routing (AI must not modify) / Layer 2 probabilistic intelligence (confidence-scored, correctable) / Layer 3 configuration output (governed, versioned, auditable).

# Profile Summary Concept (transparency screen)

Show: What we know from you / What we inferred / What we're not sure about / What this affects / What you can correct / What currently personalizes your experience. Reduces hidden AI behavior, builds trust.

# Data Freshness & Revalidation

Inferences should not remain trusted forever: confidence decay after inactivity / revalidation after usage shift / recheck after role or tenant change / recheck after contradiction / recheck before config changes.

# Safe Use of Uploaded Assets

Classify extracted data: explicit fact / probable inference / unsupported signal / sensitive attribute / draft prefill. Uploading a doc for one task should NOT authorize broad unrelated profiling.

# Lowest-Risk Integration

1. Map current profile fields deterministic vs inferred. 2. Separate user-level from tenant-level. 3. Add source metadata. 4. Add correction for important assumptions. 5. Create simple profile summary. 6. Define which fields affect product behavior. 7. Prevent AI mutating permissions/pricing/billing. 8. Add confidence tracking only for fields affecting recommendations.

# Anti-Patterns

collecting business data without downstream use / inference as truth / hidden assumptions / profile-based pricing / mixing user+tenant context / stale inferences forever / premature business health scores / silent config from weak signals / broad profiling from unrelated uploads.

# Final Reminder

Not an instruction to rebuild. Inspect what exists, preserve what works, suggest smallest stable path toward governed BI/configuration layer.
