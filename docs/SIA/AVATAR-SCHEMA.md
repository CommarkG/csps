---
id: SIA.AVATAR-SCHEMA
name: AVATAR-SCHEMA
description: "CSPS Avatar Schema — extended BehaviorProfile.human_profile definition. Avatars are living profiles computed from behavioral signals, not static definitions. Powers voice profile selection, journey bundle generation, CIE personalization, and market research aggregation."
type: architecture
diataxis_type: reference
protection_level: protected
status: ratified
core_spines: [AI, ARCH, OPER]
core_spine: AI
schema_anchor: vault_files
version: "1.0"
session: S059
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Which avatar type is this user? How does their motivation, tech comfort, and JTBD shape the experience the platform should deliver to them?"
context_quote: "The platform does not define its users. It learns them."
inherits_from: "BehaviorHub Phase 1 + USER-ROLE-SCHEMA.md + R3-01-JOURNEY-FRAMEWORK.md + VOICE-PROFILE-SYSTEM.md"
links:
  - { rel: behavior-hub, href: ../../libs/behavior-hub/src }
  - { rel: voice-profiles, href: VOICE-PROFILE-SYSTEM.md }
  - { rel: journey-framework, href: R3-01-JOURNEY-FRAMEWORK.md }
  - { rel: user-roles, href: ../plan/pillar-0-governance/USER-ROLE-SCHEMA.md }
  - { rel: cie, href: R2-01-PLATFORM-INTELLIGENCE-ENGINE.md }
---

# Avatar Schema — CSPS Platform

> Avatars are the extended human_profile section of BehaviorProfile.
> They start as role-based archetypes and become personalized through behavior.
> NOT static persona documents — living profiles that update through the Learning Loop.
> Ratified: Opus-8 | Governor: Yariv Fink | S059

---

## Core Principle: Avatars Are Computed, Not Defined

Traditional approach: design team defines 5 personas in a workshop, uses them for 2 years unchanged.
CSPS approach: platform seeds archetypes → actual behavior confirms or refines → avatar evolves.

The Governor defines the initial archetypes. The CIE Learning Loop updates them from real signals.

---

## Avatar Schema (BehaviorProfile.human_profile)

This section extends libs/behavior-hub/ Phase 1. Home: `.csps/profiles/{userId}/{appSlug}.yaml`.

```yaml
human_profile:

  # ━━━ DEMOGRAPHIC ━━━ (who they are — functional only)
  demographic:
    age_range: "25-34"
    # Options: "under-18" | "18-24" | "25-34" | "35-44" | "45-54" | "55+"
    
    context: "professional"
    # Options: "private" | "professional" | "student" | "enterprise" | "freelance"
    
    primary_language: "en"
    # ISO 639-1. Drives RTL (he, ar) vs LTR layouts.
    
    location_region: "middle-east"
    # Broad region only. GDPR-safe. Not country-specific unless explicitly provided.
    
    cultural_context: "startup"
    # Options: "startup" | "sme" | "enterprise" | "academic" | "government" | "creative"

  # ━━━ PSYCHOGRAPHIC ━━━ (how they think)
  psychographic:
    motivation: "achievement"
    # Options: "achievement" | "security" | "belonging" | "expression" | "curiosity"
    # NOTE: This is the PRIMARY driver. Most people have multiple — one dominates.
    
    decision_style: "analytical"
    # Options: "intuitive" | "analytical" | "collaborative" | "authoritative"
    # intuitive: fast, gut-based | analytical: data-driven | collaborative: consensus-seeking
    
    tech_comfort: "expert"
    # Options: "basic" | "regular" | "advanced" | "expert"
    # Drives: cognitive load tolerance, terminology, shortcut visibility
    
    risk_tolerance: "high"
    # Options: "low" | "medium" | "high"
    # Drives: how much change to introduce in onboarding vs ease into product
    
    trust_signals: ["peer-validation", "data"]
    # What makes this person trust a product?
    # Options: "peer-validation" | "data" | "authority" | "trial" | "endorsement" | "transparency"

  # ━━━ BEHAVIORAL ━━━ (what they do — computed from usage signals)
  behavioral:
    usage_frequency: "daily"
    # Computed. Options: "sporadic" | "weekly" | "daily" | "power-user"
    
    adoption_pattern: "early-adopter"
    # Computed. Options: "early-adopter" | "pragmatist" | "conservative" | "laggard"
    
    primary_device: "desktop"
    # Computed. Options: "mobile" | "desktop" | "tablet" | "cross-device"
    
    preferred_input: "text"
    # Observed. Options: "text" | "voice" | "visual" | "structured-form"
    
    session_length: "long"
    # Computed. Options: "quick (<5min)" | "medium (5-20min)" | "long (20+min)"
    
    onboarding_preference: "self-directed"
    # Computed. Options: "guided" | "self-directed" | "skip"

  # ━━━ JOBS-TO-BE-DONE ━━━ (why they use this)
  jtbd:
    primary_job: ""
    # What are they trying to accomplish? (platform-specific)
    
    situation: ""
    # What's their context when they use this? (time-pressured, solo, collaborative)
    
    desired_outcome: ""
    # What does success look like for them? (measurable if possible)
    
    current_workaround: ""
    # What do they do today instead? (insight into switching cost)
    
    frustration: ""
    # What's the specific pain with current solutions?

  # ━━━ OPTIONAL CONTEXT ━━━ (explicit opt-in only — never inferred)
  optional_context:
    cultural_observances: []
    # For scheduling apps: ["shabbat", "ramadan", "christmas-shutdown"]
    # Functional impact only. NOT religious identity. Explicit opt-in required.
    
    accessibility_needs: []
    # ["large-text", "high-contrast", "reduced-motion", "screen-reader", "captions"]
    
    communication_preference: ""
    # "email" | "push" | "in-app" | "none"
    # Never collect: religious affiliation, political views, health data
```

---

## Privacy Rules (GDPR / CCPA / Israeli Privacy Law)

| Data type | Collection | Storage | Rationale |
|---|---|---|---|
| Age range | Optional | Local YAML | UX adaptation, not identification |
| Context (professional/private) | Observed + opt-in | Local YAML | Journey differentiation |
| Cultural observances | Explicit opt-in only | Encrypted | Functional scheduling only |
| Religious identity | NEVER | NEVER | Special-category data, no legitimate product need |
| Health data | NEVER | NEVER | Special-category data |
| Motivation/psychographic | Inferred from behavior | Local YAML | Never labelled in user-facing UI |

---

## Foundation Avatars (Pre-Seeded Archetypes)

Platform-level starting points. Every new user is assigned the closest archetype at signup. Avatar refines from there.

### The Founder
```yaml
motivation: achievement | decision_style: intuitive | tech_comfort: expert
jtbd: "Ship a working product fast, validate with real users, iterate"
voice_profile: colleague  # direct, peer-level, example-driven
journey_bundle: orient-skip + plan-minimal + build-fork + evaluate-aggressive
```

### The Builder
```yaml
motivation: curiosity | decision_style: collaborative | tech_comfort: advanced
jtbd: "Learn by building, contribute to something bigger, grow skills"
voice_profile: colleague  # collaborative, supportive, learning-oriented
journey_bundle: orient-explore + plan-full + build-fork + evaluate-monitor
```

### The Operator
```yaml
motivation: security | decision_style: analytical | tech_comfort: regular
jtbd: "Reduce risk, keep team aligned, ensure reliable delivery"
voice_profile: professional  # formal, structured, criteria-based
journey_bundle: orient-read + plan-full + build-staged + evaluate-comprehensive
```

### The Manager
```yaml
motivation: belonging | decision_style: collaborative | tech_comfort: regular
jtbd: "Make team successful, visible progress, team alignment"
voice_profile: mentor  # patient, supportive, team-centered
journey_bundle: orient-explore + plan-structured + build-guided + evaluate-team
```

### The Doer
```yaml
motivation: achievement | decision_style: intuitive | tech_comfort: regular
jtbd: "Complete tasks efficiently, no friction, clear next steps always visible"
voice_profile: colleague  # direct, action-oriented, brief
journey_bundle: orient-skip + plan-minimal + build-direct + evaluate-quick
```

### The Observer
```yaml
motivation: security | decision_style: analytical | tech_comfort: basic
jtbd: "Trust the output, verify before acting, understand without building"
voice_profile: mentor  # patient, explanatory, trust-building
journey_bundle: orient-full + plan-review + build-none + evaluate-dashboard
```

---

## How Avatars Drive Platform Behavior

### → Voice Profile Selection
```
motivation=achievement + tech_comfort=expert → professional or colleague
motivation=security + tech_comfort=basic → mentor
motivation=curiosity + decision_style=collaborative → mentor or colleague
```

### → Journey L3 Bundle Generation (R3-01 §5)
The Combinatorial Engine (CIE) uses avatar weights to select from the L2 option space:
```
The Founder: scores ORIENT/skip=0.9, PLAN/minimal=0.8, EVALUATE/aggressive=0.9
The Observer: scores ORIENT/full=0.9, PLAN/review=0.8, EVALUATE/dashboard=0.9
Different L3 bundles → completely different experiences from the same platform
```

### → CIE Relay Engine Personalization
```
Governor avatar: achievement + analytical + expert
→ CIE Relay surfaces: architectural tradeoffs, PE rankings, open gaps
→ Does NOT surface: basic explanations, reassurances, excess context

End user avatar: security + collaborative + regular
→ CIE Relay surfaces: team impacts, risk indicators, progress signals
→ Does NOT surface: technical implementation details
```

### → UX Engine Cognitive Load
```
tech_comfort=expert → dense information OK, show technical details by default
tech_comfort=basic → minimal information, everything else collapsed
decision_style=analytical → show data, metrics, before/after comparisons
decision_style=intuitive → show recommendations, hide the reasoning
```

### → Market Research (the moat)
Aggregated anonymous avatar data enables:
- "73% of invoicing app users are professional context, 35-44, security-motivated"
- "achievement-motivated users retain 2.3x longer on average"
- "tech_comfort=expert users complete onboarding 40% faster regardless of app complexity"

This is live market research from actual behavior — no survey, no focus group, no lag.

---

## The Learning Loop for Avatars

Avatars are not static. They update through the CIE Learning Loop:

```
User takes action
  ↓
Threshold: type=behavioral_signal, source=session_harvest
  ↓
BehaviorHub: update behavioral fields (frequency, session_length, preferred_input)
  ↓
Learning Loop: K≥2 consistent pattern → confidence_level: confirmed
  ↓
Avatar field updated
  ↓
CIE uses updated avatar → behavior changes accordingly
  ↓
Next interaction is more personalized
```

**Confidence levels** (how much to trust the avatar data):
- `inferred`: one observation, tentative
- `consistent`: K≥2 same pattern, likely correct
- `confirmed`: K≥5, behavioral test passed, high confidence
- `explicit`: user directly declared this (highest trust)

---

## Connection to Existing Systems

| System | How Avatar connects |
|---|---|
| [libs/behavior-hub/](https://github.com/CommarkG/csps/tree/main/libs/behavior-hub/src) | Avatar IS the human_profile section of BehaviorProfile |
| [tools/config/voice-profiles.yaml](https://github.com/CommarkG/csps/blob/main/tools/config/voice-profiles.yaml) | Avatar drives voice profile selection dynamically |
| [docs/SIA/R3-01-JOURNEY-FRAMEWORK.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/R3-01-JOURNEY-FRAMEWORK.md) | Avatar provides persona_weights for L3 bundle generation |
| [docs/SIA/R2-01-PLATFORM-INTELLIGENCE-ENGINE.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/R2-01-PLATFORM-INTELLIGENCE-ENGINE.md) | CIE Relay Engine reads Avatar for session personalization |
| [docs/SIA/R1-04-THRESHOLD.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/R1-04-THRESHOLD.md) | Avatar tags on behavioral signals enable typed market research |
| [docs/plan/pillar-0-governance/USER-ROLE-SCHEMA.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/USER-ROLE-SCHEMA.md) | Role defines access scope; Avatar defines experience within that scope |

---

*Avatar Schema v1.0 | RATIFIED S059 | Opus-8*
*Update when: new avatar field added, new archetype discovered, privacy regulation changes.*
*Avatars are living profiles — the schema is the structure, behavior fills the content.*
