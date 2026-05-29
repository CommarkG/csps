# CSPS Phase 2 — Package B
## Business Intelligence Layer

Version: V1
Status: Draft for External App Presentation
Package Type: Specific Architecture Package

---

# 1. Purpose

This package introduces the Business Intelligence Layer concept.

It is a suggestive optimization package, not an implementation command.

The receiving app should compare this package with its current profile, tenant, configuration, analytics, onboarding, and personalization systems before proposing changes.

The goal is not to turn the app into a generic BI platform. The goal is to help the app understand users, tenants, roles, and use cases in order to configure the right product experience safely.

---

# 2. Core Reframe

Onboarding is not merely setup. It is the beginning of a governed Business Intelligence Layer for product configuration.

The app should gradually build structured understanding of:

- who the user is
- what tenant or organization they belong to
- what role they are acting in
- what they are trying to accomplish
- what business context matters
- what product bundle fits them
- which templates, workflows, and features should be suggested
- what remains unknown until confirmed

---

# 3. What This Layer Is — and Is Not

## It Is

A controlled intelligence layer supporting:

- product configuration
- onboarding continuation
- bundle recommendations
- profile enrichment
- personalization
- feature suggestions
- template prefills
- user context preservation
- tenant-specific adaptation

## It Is Not

A generic business analytics product.

It should not automatically produce:

- broad business health scores
- financial forecasts
- competitor intelligence
- legal analysis
- medical analysis
- investment advice
- full operational reporting

unless those are separate approved product modules.

Safest scope:

> business intelligence for product configuration.

---

# 4. Core Problem

Many apps collect onboarding data and then fail to use it meaningfully. Other apps use AI inference too aggressively and risk incorrect personalization.

Common problems:

- profile data disconnected from product behavior
- repeated questions
- no structured user understanding
- hidden AI assumptions
- personalization without governance
- no audit trail
- weak user/tenant separation
- unclear profile-to-product handoff
- data collected without clear downstream purpose

---

# 5. Core Principles

## A. Intelligence Must Serve Configuration

Every collected or inferred signal should map to at least one downstream use:

- product routing
- bundle recommendation
- feature suggestion
- template prefill
- UX adaptation
- onboarding continuation
- support routing
- monetization timing

## B. Do Not Confuse Inference With Truth

AI inference is not product truth. It should be confidence-scored, logged, correctable, reversible, and separated from deterministic state.

## C. User and Tenant Context Must Be Separate

User context includes role, working style, vocabulary, preferences, and personal onboarding progress.

Tenant context includes organization type, plan tier, approved features, compliance constraints, team structure, and default templates.

## D. Profile Understanding Should Be Visible and Correctable

If profile knowledge influences product experience, users should be able to inspect and correct important assumptions.

## E. Intelligence Improves Over Time

The layer improves through answers, uploads, website/context ingestion, workflow behavior, corrections, confirmations, and repeated usage patterns.

---

# 6. Suggested Responsibilities

## A. Identity Context

Determine user ID, tenant ID, role, account tier, entry path, and active context.

## B. Business Context

Capture or infer industry, business type, customer type, operational model, maturity level, major use case, and main pain point.

## C. Product Context

Translate understanding into recommended bundle, suggested workflow, template recommendation, feature flag suggestion, onboarding path, and dashboard setup.

## D. Communication Context

Capture tone preference, vocabulary, terminology, language, industry phrasing, and directness level.

## E. Governance Context

Maintain source signals, confidence values, audit history, corrections, overrides, profile freshness, and contradictions.

---

# 7. Suggested Layered Model

## Layer 1 — Deterministic Identity and Routing

Examples: user ID, tenant ID, role, plan tier, permissions, entry path.

AI must not modify this directly.

## Layer 2 — Probabilistic Intelligence

Examples: likely industry, maturity, tone, likely challenge, domain confidence, inferred workflow needs.

Must be confidence-scored and correctable.

## Layer 3 — Configuration Output

Examples: bundle recommendation, template prefill, feature flag suggestion, dashboard setup suggestion, onboarding path.

Must be governed, versioned, and auditable.

---

# 8. Profile Summary Concept

Consider a user-facing profile summary:

- What we know from you
- What we inferred
- What we are not sure about
- What this affects
- What you can correct
- What currently personalizes your experience

This reduces hidden AI behavior and builds trust.

---

# 9. Data Freshness and Revalidation

Business context changes. Inferences should not remain trusted forever.

Possible rules:

- confidence decay after inactivity
- revalidation after usage shift
- recheck after role or tenant change
- recheck after contradiction
- recheck before product configuration changes

---

# 10. Safe Use of Uploaded Assets

If assets are supported, extracted data should be classified as:

- explicit fact
- probable inference
- unsupported signal
- sensitive attribute
- draft prefill

Uploading a document for one task should not authorize broad unrelated profiling.

---

# 11. Receiving App Assessment

Assess:

- existing user/tenant/org profiles
- which profile data is user-provided or inferred
- feature flags, templates, bundles, segments, dashboards
- AI influence on product state
- correction paths
- confidence scoring
- logging
- auditability
- reset/export/correction options
- tenant/user boundaries

---

# 12. Lowest-Risk Integration Suggestions

Start with:

1. Map current profile fields as deterministic vs inferred.
2. Separate user-level from tenant-level context.
3. Add source metadata to important fields.
4. Add correction for the most important assumptions.
5. Create a simple profile summary.
6. Define which fields affect product behavior.
7. Prevent AI from mutating permissions, pricing, or billing.
8. Add confidence tracking only for fields that affect recommendations.

---

# 13. Anti-Patterns

Avoid:

- collecting business data without downstream use
- using AI inference as truth
- hiding assumptions
- profile-based pricing
- mixing user and tenant context
- stale inferences forever
- premature business health scores
- silent configuration from weak signals
- broad profiling from unrelated uploads

---

# 14. Required Three-Pass Review

1. Understanding — explain what this package introduces.
2. Compatibility — compare to current profile/configuration systems.
3. Optimized Suggestion — suggest safest adaptation path.

---

# 15. Requested Response Format

1. Understanding of this package
2. What profile / tenant / configuration systems already exist
3. What overlaps
4. What conflicts
5. What should be preserved
6. Missing foundations
7. Lowest-risk integration path
8. Suggested improvements
9. Open questions before implementation
10. Readiness score from 1 to 5

---

# 16. Final Reminder

This package is not an instruction to rebuild. First inspect what exists, preserve what works, and suggest the smallest stable path toward a governed BI/configuration layer.
