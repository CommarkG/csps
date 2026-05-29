# CSPS Profile → Product Handoff Contract & Schema Governance

Version: V1  
Status: Draft for External App Presentation / Package D  
Purpose: Define how CSPS business intelligence, onboarding intelligence, and user/tenant context become safe downstream product configuration.

---

# 1. Purpose

This document defines the controlled handoff between:

- onboarding intelligence,
- business intelligence,
- user/tenant profiles,
- bundle recommendations,
- feature flags,
- templates,
- personalization tokens,
- and downstream product configuration.

It should be treated as a suggestive optimization package, not an implementation command.

The receiving app should compare this contract with its current data models, profile objects, tenant logic, feature flags, templates, bundles, and configuration systems before proposing changes.

---

# 2. Core Problem

Adaptive onboarding and AI personalization become dangerous when there is no clear boundary between:

- what the system inferred,
- what the user confirmed,
- what the tenant policy requires,
- and what the product is allowed to activate.

Without a governed handoff contract, the app risks:

- AI inference becoming product truth,
- silent configuration drift,
- inconsistent tenant behavior,
- broken feature flags,
- untraceable personalization,
- impossible rollback,
- schema mismatch between modules,
- and downstream apps consuming unstable data.

---

# 3. Core Principle

The Business Intelligence Layer may observe, infer, recommend, and prepare configuration.

But downstream product behavior should change only through a governed, versioned, schema-validated contract.

In simple terms:

> AI can suggest.  
> The contract governs what can be activated.

---

# 4. Three-Layer Handoff Model

The handoff should be separated into three layers.

```text
Layer 1 — Identity & Routing
  Deterministic, stable, account/tenant context.

Layer 2 — Intelligence Layer
  Probabilistic, confidence-scored, append-only, correctable.

Layer 3 — Configuration Contract
  Versioned, auditable product handoff consumed by downstream modules.
```

---

# 5. Layer 1 — Identity & Routing

Layer 1 contains deterministic identity and routing attributes.

AI inference may not directly modify this layer.

```json
{
  "tenant_id": "uuid",
  "user_id": "uuid",
  "persona_type": "tenant_admin | end_user | developer | agency | enterprise",
  "account_tier": "free | pro | team | enterprise",
  "entry_path": "string",
  "active_role_context": "string",
  "identity_resolved_at": "timestamp",
  "tenant_context_id": "uuid",
  "permissions_profile_id": "uuid"
}
```

## Governance Notes

- Identity and routing should be deterministic.
- Tenant context must be resolved before adaptive intelligence begins.
- Role switching must be explicit and user-controlled.
- Layer 1 should not be rewritten by AI inference.
- Pricing, billing, legal flows, and permissions must not depend on probabilistic inference.

---

# 6. Layer 2 — Intelligence Layer

Layer 2 contains probabilistic intelligence and enrichment data.

This layer is:

- confidence-scored,
- source-traced,
- correctable,
- append-only,
- and non-authoritative until promoted.

```json
{
  "domain_scores": {
    "marketing": {
      "score": 0.72,
      "confidence": 0.81,
      "last_updated": "timestamp",
      "source_signals": ["uploaded_website", "user_answer", "usage_pattern"]
    },
    "sales": {
      "score": 0.64,
      "confidence": 0.76,
      "last_updated": "timestamp",
      "source_signals": ["crm_import", "user_answer"]
    }
  },
  "inferred_attributes": {
    "primary_industry": {
      "value": "marketing_agency",
      "confidence": 0.88,
      "source_signals": ["website_text", "uploaded_proposal"],
      "status": "shadow | soft_confirmed | user_confirmed | rejected | expired",
      "last_updated": "timestamp"
    },
    "primary_pain_point": {
      "value": "client_follow_up_consistency",
      "confidence": 0.67,
      "source_signals": ["free_text_answer"],
      "status": "shadow",
      "last_updated": "timestamp"
    }
  },
  "vocabulary_profile": {
    "industry_terms": ["clients", "retainers", "campaigns"],
    "user_power_words": ["chaos", "clarity", "scale"],
    "tone": "direct | warm | analytical | visionary",
    "formality": 0.6,
    "humor_tolerance": 0.3,
    "language_preferences": ["en", "he"]
  },
  "contradiction_flags": {
    "team_size_conflict": {
      "signal_a": "user_selected_solo",
      "signal_b": "uploaded_org_chart_12_people",
      "flagged_at": "timestamp",
      "resolution_status": "unresolved | resolved | ignored"
    }
  },
  "enrichment_history": [
    {
      "attribute": "primary_industry",
      "method": "website_analysis",
      "confidence": 0.88,
      "timestamp": "timestamp"
    }
  ]
}
```

## Governance Notes

- Layer 2 is not product truth.
- Layer 2 may recommend, but should not directly configure.
- Important inferred assumptions must be correctable by the user.
- Confidence values should decay over time if not reinforced.
- Shadow inferences must pass a Promotion Gate before affecting configuration.
- Prior inferences should be superseded, not overwritten.

---

# 7. Layer 3 — Configuration Contract

Layer 3 is the versioned output consumed by downstream product modules.

It translates validated intelligence into:

- bundles,
- templates,
- feature flags,
- personalization tokens,
- dashboard setup,
- onboarding path selection,
- and safe product configuration.

```json
{
  "contract_id": "uuid",
  "tenant_id": "uuid",
  "user_id": "uuid",
  "contract_version": "semver",
  "generated_at": "timestamp",
  "generated_from_profile_hash": "string",
  "bundle_id": "agency_scaling_kit",
  "bundle_version": "1.4.2",
  "feature_flags": {
    "show_advanced_analytics": {
      "value": true,
      "source": "default | tenant_policy | profile | user_override",
      "confidence": 0.91,
      "requires_confirmation": false
    },
    "enable_automated_invoicing": {
      "value": false,
      "source": "default",
      "confidence": null,
      "requires_confirmation": false
    }
  },
  "template_prefills": {
    "creative_brief_v4": {
      "industry_label": "Marketing Agency",
      "customer_label": "Client",
      "default_goal": "Improve client follow-up consistency"
    }
  },
  "personalization_tokens": {
    "customer_label": "client",
    "project_label": "campaign",
    "main_goal_phrase": "create more clarity and consistency"
  },
  "recommended_templates": [
    "creative_brief_v4",
    "agency_p_and_l_dashboard"
  ],
  "audit_metadata": {
    "created_by": "system | user | admin",
    "confirmation_required": true,
    "confirmation_status": "pending | confirmed | rejected",
    "prior_contract_version": "1.0.0"
  }
}
```

## Governance Notes

- Layer 3 must be versioned on every change.
- Layer 3 changes that alter active product behavior require confirmation.
- Every feature flag must include a source.
- User overrides take precedence over profile-driven values.
- Contracts must be schema-validated before activation.
- Prior contract versions must be retained for rollback.

---

# 8. Schema Registry Governance

The Profile → Product contract should be governed by a schema registry.

## Suggested Rules

### A. Schema Registry as SSOT

All profile objects, configuration contracts, bundle mappings, feature flag structures, and downstream routing payloads should be registered.

### B. Versioned Contracts

Every schema should be versioned.

- Breaking change → major version.
- Backward-compatible addition → minor version.
- Documentation or metadata-only change → patch version.

### C. No Unregistered Field Consumption

Downstream modules should not consume unregistered profile fields.

Ad-hoc AI-generated fields should not become production inputs.

### D. Compatibility Checks

Before a Layer 3 contract is activated, validate compatibility with:

- active bundle version,
- product module version,
- tenant policy,
- feature flag schema,
- template schema,
- and permission model.

### E. AI Cannot Modify Schema

AI may recommend schema evolution.

AI should not create, delete, or mutate production schema autonomously.

---

# 9. Confidence Thresholds

Suggested default confidence framework:

```text
CS >= 0.85
  High confidence.
  May write to shadow profile and support low-risk content adaptation.
  May not mutate deterministic state.

0.60 <= CS < 0.85
  Medium confidence.
  Use soft confirmation or inline correction.

0.35 <= CS < 0.60
  Low confidence.
  Ask one justified question if necessary.

CS < 0.35 or contradiction exists
  Freeze adaptation and use baseline defaults.
```

## Important Constraint

Silent high-confidence adaptation should be restricted to low-risk content and shadow-state behavior.

Operational configuration still requires governance.

---

# 10. Promotion Gate

An inference may move from shadow state toward product impact only when all requirements pass.

```text
Promotion Gate Requirements:

1. Confidence threshold satisfied
2. Minimum signal count satisfied
3. Contradiction check passed
4. Schema compatibility passed
5. Tenant policy compatibility passed
6. User confirmation obtained when required
7. Audit event created
8. Rollback path exists
```

## Promotion Does Not Equal Activation

Promotion into validated intelligence does not automatically activate product configuration.

Layer 3 activation remains separately governed.

---

# 11. Source Precedence

Suggested precedence order:

```text
1. User override
2. Deterministic tenant policy
3. Confirmed profile intelligence
4. High-confidence shadow recommendation
5. Platform default
```

User override remains sovereign until the user explicitly changes or resets it.

---

# 12. Safe Baseline Rule

If any of the following occurs, the system should render baseline product behavior:

- insufficient confidence,
- contradiction detected,
- schema validation failure,
- tenant context unclear,
- role context unclear,
- extraction failure,
- missing promotion gate requirement,
- incompatible contract version,
- unresolved user override conflict.

Baseline behavior should remain functional, predictable, and non-punitive.

---

# 13. Audit & Diff Requirements

Every Layer 3 contract change should generate a diff.

Audit entries should include:

```json
{
  "event_id": "uuid",
  "tenant_id": "uuid",
  "user_id": "uuid",
  "prior_contract_version": "1.0.0",
  "new_contract_version": "1.1.0",
  "changed_fields": ["feature_flags.show_advanced_analytics"],
  "triggering_event": "user_confirmation | profile_update | admin_action | system_migration",
  "confirmation_status": "not_required | pending | confirmed | rejected",
  "created_at": "timestamp",
  "rollback_available": true
}
```

---

# 14. Bundle Resolution Logic

The handoff contract may recommend a bundle, but should not activate it silently if it changes active product behavior.

## Suggested Bundle Resolution Inputs

- persona type
- tenant type
- industry
- account tier
- use case
- domain scores
- confirmed pain points
- tenant policy
- available modules
- plan entitlements
- compliance constraints

## Suggested Bundle Resolution Outputs

- recommended bundle ID
- confidence score
- reason summary
- required confirmations
- conflicting constraints
- safe fallback bundle
- optional add-ons

---

# 15. Template Prefill Governance

Template prefills are lower risk than feature activation, but still require traceability.

Suggested rules:

- Prefills may be generated from confirmed or high-confidence profile intelligence.
- The user should be able to edit prefills before final use.
- Sensitive prefills require confirmation.
- Prefills should not overwrite user-created content without explicit action.

---

# 16. Feature Flag Governance

Feature flags must distinguish source.

Suggested source values:

- default
- tenant_policy
- profile
- user_override
- admin_override
- experiment

Suggested source precedence:

1. admin_override, where legally/contractually valid
2. user_override
3. tenant_policy
4. profile
5. experiment
6. default

The receiving app should adapt this order to its own permission model.

---

# 17. User-Facing Transparency

If profile intelligence affects product behavior, the user should be able to see:

- what profile assumptions exist,
- what was inferred,
- what was explicitly provided,
- what confidence exists,
- what affected configuration,
- and what can be corrected.

A simple profile transparency screen may be enough for early versions.

---

# 18. Receiving App Assessment Checklist

Before proposing implementation, inspect:

## A. Existing Profile Objects

- Is there a user profile object?
- Is there a tenant/org profile object?
- Are inferred fields separated from confirmed fields?
- Is source metadata stored?

## B. Existing Configuration Logic

- Are there feature flags?
- Are there templates?
- Are there bundles?
- Are there tenant-level defaults?
- Are there role-specific configurations?

## C. Existing Schema Governance

- Are schemas versioned?
- Are downstream modules consuming stable contracts?
- Are schema changes reviewed?
- Is rollback possible?

## D. Existing AI Behavior

- Does AI infer business context?
- Does AI write to product state?
- Is confidence tracked?
- Can users correct assumptions?

## E. Existing Auditability

- Are configuration changes logged?
- Are contract changes diffed?
- Can users see what changed and why?

---

# 19. Lowest-Risk Integration Suggestions

The receiving app should consider starting with these low-risk steps:

1. Inventory existing profile fields.
2. Classify each field as deterministic, inferred, confirmed, or user override.
3. Separate user context from tenant context.
4. Add source metadata to important fields.
5. Define a minimal Layer 3 contract object.
6. Add versioning to product configuration outputs.
7. Add a basic audit log for configuration changes.
8. Prevent AI from directly mutating billing, pricing, permissions, or active product configuration.
9. Add a profile transparency screen later, once the profile model is stable.

---

# 20. Anti-Patterns to Avoid

Avoid:

- AI directly activating product configuration,
- unversioned profile-to-product handoff,
- feature flags without source fields,
- profile data influencing pricing,
- downstream products consuming unregistered AI fields,
- overwriting user overrides,
- silent reconfiguration of active product behavior,
- stale inferences remaining trusted forever,
- file uploads triggering broad unrelated profiling,
- no rollback path after configuration change.

---

# 21. Required Three-Pass Review

Before responding, please complete three internal passes.

## Pass 1 — Understanding

Explain what this handoff contract is trying to achieve.

## Pass 2 — Compatibility

Compare it to the current app’s profile, tenant, feature flag, template, bundle, and schema systems.

## Pass 3 — Optimized Suggestion

Suggest the safest way to adapt this contract into the current app.

Do not propose implementation until this pass is complete.

---

# 22. Requested Response Format

Please respond with:

## 1. Understanding of This Package

## 2. Existing Profile / Tenant / Configuration Structures

## 3. Existing Schema or Contract Systems

## 4. Overlaps

## 5. Conflicts

## 6. Missing Foundations

## 7. What Should Be Preserved

## 8. Lowest-Risk Integration Path

## 9. Suggested Schema Adjustments for This App

## 10. Open Questions Before Implementation

## 11. Readiness Score from 1 to 5

---

# 23. Final Reminder

This package is not an implementation command.

It is a suggestive optimization framework.

Please first inspect what already exists, preserve what works, identify conflicts, and suggest the smallest stable path toward a governed profile-to-product handoff.
