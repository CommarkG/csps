---
id: SIA.PROFILING-HUB-SCHEMA
name: PROFILING-HUB-SCHEMA
description: "Schema definition for the CSPS Profiling Hub — developers, external users, and AI system profiles"
type: doc
protection_level: protected
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [AI, ARCH, GVRN]
context_question: "How are developers, users, and AI systems profiled in CSPS, and what structure does each profile share?"
context_quote: "Know the profile. Design the interaction. Never guess."
---

# Profiling Hub Schema

---

## 1. Profile Architecture — Core and External Layers

All profiles share a **universal core layer** (same fields for everyone), then extend with a **profile-type layer** (different for each category).

```yaml
# Universal core — every profile has these
profile_core:
  id:               # unique identifier
  name:             # display name
  type:             # developer | external_user | ai_system
  created_at:       # timestamp
  last_modified_at: # timestamp
  status:           # active | inactive | archived
  tags:             # free-form array
  context_question: # "What does this profile tell us about how to work with this entity?"
  context_quote:    # a recurring phrase that captures this profile's essence
```

---

## 2. Developer Profile (Governor and team)

```yaml
developer_profile:
  # inherits profile_core
  role:              # governor | opus-advisor | sonnet-builder | contributor
  expertise_areas:   # list of domains
  csps_session_count: # how many sessions active
  communication_style:
    prefers:         # direct | detailed | visual | conceptual
    avoid:           # [list of patterns to avoid]
  working_patterns:
    session_types_used:  # ARCH-SESSION | MIXED-SESSION | EXEC-SESSION
    typical_session_length: # short (<30min) | medium | long (>2hr)
  ai_interaction_notes: # how the AI should adapt for this developer
```

**Governor profile (pre-filled):**
- Role: governor
- Prefers: direct, visual, conceptual thinking before execution
- Avoid: sycophancy, confirmation-seeking, wild implementation
- Notes: "Big questions first. Context is the palace. Never freestyle with sacred files."

---

## 3. External User Profile (persona archetypes)

```yaml
user_profile:
  # inherits profile_core
  persona_archetype: # cognitive-offload-professional | contractor | ...
  jtbd:              # job to be done (one sentence)
  friction_points:   # list of known frictions
  first_value_moment: # what earns this user's trust
  journey_bundle:    # which L2 options are activated for this persona
  calibration_questions: # the 3 onboarding questions used for this persona
```

---

## 4. AI System Profile

```yaml
ai_profile:
  # inherits profile_core
  model_id:          # claude-opus-4-7 | claude-sonnet-4-6 | etc.
  role_in_csps:      # architectural-advisor | builder | external-consultant
  triggers:          # list of inputs that activate unwanted defaults
  defaults:          # list of default behaviors when not directed
  satisfaction_points: # list of where this model stops pushing
  compensation_protocols: # how to write instructions that work with this model
  known_good_patterns:    # what works well with this model
```

---

## 5. Hub Structure in Playground

```
/platform/profiles/
  /                     → hub landing page (all profile types listed)
  /developers/          → list of developer profiles
  /developers/[id]/     → individual developer profile
  /developers/governor/ → Governor's profile (pre-populated)
  /users/               → list of user persona archetypes
  /users/[id]/          → individual user persona
  /ai-systems/          → list of AI system profiles
  /ai-systems/[id]/     → individual AI profile
```

---

## 6. Open Questions (for next ARCH-SESSION)

1. Should AI system profiles be in the same hub as developer/user profiles, or in a separate AI Behavioral Profile registry (R1.6)?
2. How do user profiles connect to the Journey Framework (R3)? Is a user profile the same as a persona archetype, or different?
3. Should the Governor profile be public (visible to all CSPS users) or private?

---

*CSPS — Profiling Hub Schema | S050 | Protection: protected*
