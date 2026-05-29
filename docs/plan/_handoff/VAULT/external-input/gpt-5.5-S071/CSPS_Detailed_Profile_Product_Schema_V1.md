# CSPS Detailed Profile → Product Schema

Version: V1  
Status: Working Schema Draft  
Purpose: Define the structured handoff between CSPS onboarding / BI intelligence and downstream product configuration.

---

# 1. Schema Purpose

This schema defines how user, tenant, business, and intelligence signals are organized before they can influence product behavior.

The schema separates:

1. Deterministic identity and routing data
2. Probabilistic business intelligence
3. Governed product configuration output

The purpose is to prevent AI inference from directly mutating product truth.

---

# 2. Core Layer Model

```text
Layer 1 — Identity & Routing
  Deterministic, stable, account/tenant context.

Layer 2 — Intelligence Layer
  Probabilistic, confidence-scored, append-only, correctable.

Layer 3 — Configuration Contract
  Versioned, auditable product handoff consumed by downstream modules.
```

---

# 3. Layer 1 — Identity & Routing

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
- Role switching must be explicit and user-controlled.
- Tenant context must be resolved before adaptive intelligence begins.
- Layer 1 should not be rewritten by AI.

---

# 4. Layer 2 — Intelligence Layer

Layer 2 contains probabilistic intelligence and enrichment data.

This layer is confidence-scored, source-traced, correctable, and append-only.

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
      "status": "soft_confirmed | user_confirmed | shadow | rejected",
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
- Layer 2 may recommend but should not directly configure.
- Important inferred assumptions must be correctable by the user.
- Confidence values should decay over time if not reinforced.
- Shadow inferences must pass a Promotion Gate before affecting configuration.

---

# 5. Layer 3 — Configuration Contract

Layer 3 is the versioned output consumed by downstream product modules.

It translates validated intelligence into bundles, templates, feature flags, and personalization tokens.

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

---

# 6. Confidence Thresholds

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

---

# 7. Promotion Gate

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

---

# 8. Source Precedence

```text
1. User override
2. Deterministic tenant policy
3. Confirmed profile intelligence
4. High-confidence shadow recommendation
5. Platform default
```

---

# 9. Safe Baseline Rule

If any of the following occurs, the system should render baseline product behavior:

- insufficient confidence
- contradiction detected
- schema validation failure
- tenant context unclear
- role context unclear
- extraction failure
- missing promotion gate requirement

---

# 10. Open Areas for Future Expansion

- exact schema registry structure
- event log format
- profile hash generation method
- tenant-level inheritance model
- role-switching state machine
- bundle resolver algorithm
- feature flag compatibility matrix
- user-facing profile transparency screen
- profile export format
