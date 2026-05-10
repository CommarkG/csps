---
id: csps.pillar-5.persona-composition
name: persona-composition
description: Persona composition function + hybrid memory model + traits library + domain overlays + risk-class guardrail bundles. The single source of truth for how personas talk. Layered system-prompt assembly (PLATFORM_CONSTITUTION → DOMAIN_OVERLAYS → traits → renderPersonaBlock → systemPrompt → GUARDRAIL_BUNDLES → postHistoryInstructions). Hybrid memory: User.preferences (shared) + PersonaMemory (per-persona) per ADR-0009. Migrated from v1.3 §12.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - security
  - reliability
  - observability
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: mastra-setup, href: ./mastra-setup.md }
  - { rel: crisis-escalation, href: ./crisis-escalation.md }
  - { rel: skill-tier-rules, href: ../pillar-3-platform-services/sandboxed-skill-governance.md }
  - { rel: adr-one-agent, href: ../../adr/0008-one-mastra-agent-many-personas.md }
  - { rel: adr-hybrid-memory, href: ../../adr/0009-hybrid-persona-memory.md }
created-new-because: |
  No prior leaf documented the persona composition function. v1.3 §12 had the composition spec
  inline; this leaf consolidates composition + traits + overlays + memory model + risk-class
  guardrails into one DX-loadable reference. Distinct from mastra-setup (the runtime) and
  crisis-escalation (the cross-persona safety slice).
domain_path: platform
---

# Persona Composition

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The composition function (layered system-prompt assembly), the persona schema, the traits library + domain overlays, the hybrid memory model (User.preferences + PersonaMemory), the risk-class guardrail bundles, the eval discipline (drift / style / domain accuracy). Per ADR-0008 (one parameterized Mastra agent serves all personas) + ADR-0009 (hybrid memory model).

## Why this exists

Personas are first-class entities in CSPS — they get full CRUD, full audit, full slice-contract scoring. Without a single composition function, persona behavior would drift across surfaces (chat / API / wizard / scheduled task). Without a hybrid memory model, personas would either share too much (Replika failure: cross-persona bleed) or too little (Character.AI failure: cold-start every conversation).

The composition function is **the** authority on persona system-prompt assembly. Every Mastra agent invocation goes through it. No skip-paths.

## The persona schema (frontmatter + ZModel slice)

Per v1.3 §12 + agentskills.io persona conventions + CCv3 character cards:

```yaml
---
slug: spiritual-coach                       # kebab-case unique within app
domain: spiritual                           # closed enum (drives risk-class)
voice: warm-direct                          # closed enum (warm-direct / formal / playful / clinical / instructional)
risk_class: high                            # low | medium | high (drives guardrail-bundle selection)
system_prompt: |
  [the persona's identity-and-purpose block]
post_history_instructions: |
  [reinjected after every N turns to fight drift]
traits:
  - empathetic
  - boundaried
  - non-prescriptive
domain_overlays:
  - spiritual-language-discipline
  - non-clinical-disclaimer
allowed_tools: [Read, Search]               # capability declaration per pillar-3
allowed_subagents: []
sensitive_data_access: false
visibility: published                        # draft | published | retired
tier_required: pro                           # which tier can use this persona
extensions: {}                               # CCv3 forward-compat hatch
---
```

ZModel slice: `Persona` (id + slug + domain + voice + risk_class + system_prompt + post_history_instructions + traits[] + domain_overlays[] + allowed_tools[] + visibility + tier_required + extensions json + standard audit columns).

## The composition function (the layered assembly)

```typescript
// libs/personas/composition.ts
export function composePersona(personaId: string, runtimeContext: RuntimeContext): SystemPrompt {
  const persona = getPersona(personaId);
  const overlays = persona.domain_overlays.map(getDomainOverlay);
  const traits = persona.traits.map(getTrait);
  const guardrails = getGuardrailBundle(persona.risk_class);

  return [
    PLATFORM_CONSTITUTION,                    // 1. Universal constitution (refusal patterns, safety, identity)
    ...overlays.map(o => o.preamble),         // 2. Domain overlays (spiritual / clinical / legal language discipline)
    renderTraitBlock(traits),                 // 3. Trait composition (empathetic + boundaried + non-prescriptive)
    renderPersonaBlock(persona),              // 4. Persona identity (system_prompt body)
    persona.system_prompt,                    // 5. Persona-specific instructions
    ...guardrails.preamble,                   // 6. Risk-class guardrails (high-risk = strictest)
    persona.post_history_instructions,        // 7. Drift-fight reinjection (every N turns)
  ].join("\n\n");
}
```

**Order matters.** Constitution first (highest authority). Persona-specific instructions middle (can extend, cannot contradict constitution). Post-history instructions last (most-recent reinjection has highest attention weight in transformer architectures).

## The traits library

`libs/personas/libraries.ts` — composable trait definitions:

| Trait | Effect on system prompt |
|---|---|
| `empathetic` | "Acknowledge feelings before solutions" |
| `boundaried` | "Decline scope-creep; cite the boundary explicitly" |
| `non-prescriptive` | "Suggest, don't prescribe; offer options not orders" |
| `concise` | "Keep responses ≤200 words unless explicitly asked for more" |
| `professorial` | "Explain reasoning; assume curiosity" |
| `playful` | "Light humor permissible; never at user's expense" |

Adding a new trait requires `created-new-because:` justification (per pillar-5 README reuse-first reminder).

## The domain overlays

Domain overlays inject domain-specific language discipline + disclaimers. Examples:

| Overlay | Injected text |
|---|---|
| `spiritual-language-discipline` | "Use the user's own spiritual vocabulary; never impose tradition. Decline to authenticate spiritual claims." |
| `non-clinical-disclaimer` | "If the user describes symptoms suggesting a mental-health condition, recommend a licensed clinician." |
| `legal-non-counsel` | "You do not provide legal advice. Recommend a licensed attorney for jurisdiction-specific questions." |
| `medical-non-counsel` | "You do not diagnose or prescribe. Recommend a licensed clinician." |
| `financial-non-counsel` | "You do not provide financial advice. Recommend a licensed advisor for investment decisions." |

## The hybrid memory model (per ADR-0009)

**Two complementary stores.** Neither alone is correct.

| Store | Scope | Contents | Schema |
|---|---|---|---|
| `User.preferences` (Json) | Per-user, cross-persona | Shared facts (name, language, accessibility, time zone, opted-out personas) | Single Json field on User |
| `PersonaMemory` | Per-(user × persona) | Per-persona conversational summaries (NOT raw transcript) + drift correction notes + last-N-turn-summary | Dedicated slice |

**Rationale:**
- Replika model (one shared memory) → cross-persona bleed (spiritual coach knows tax preferences)
- Character.AI model (per-character only) → cold-start every conversation; user repeats their name 8 times
- **Hybrid:** User's *self* is shared; personas' *relationship-with-user* is per-persona

**Audit:** every memory write goes through audit trigger; drift evals read PersonaMemory to detect topic-drift over rolling window.

## Risk-class guardrail bundles

Per persona's `risk_class`:

| Risk class | Bundle | Constraints |
|---|---|---|
| `low` | bundle-low | Standard content filter; standard refusal patterns |
| `medium` | bundle-medium | + topic restriction (no prescriptive medical/legal/financial); + escalation-link injection on triggers |
| `high` | bundle-high | + crisis-escalation slice always-on; + post-history reinjection every 3 turns; + 100% audit retention; + nightly drift eval |

**Spiritual = highest risk** per research: the "Spiralism" cult phenomenon (documented in Rolling Stone) shows AI personas in spiritual domains can reinforce delusional thinking patterns at scale. Guardrails-bundle-high is mandatory for `domain: spiritual`.

## Eval discipline

Per pillar-5 README + ADR-0006:

- **Drift evals** — nightly run on production personas; topic-drift detected over rolling-7-day window; PR-blocking if drift > threshold
- **Style evals** — voice consistency check (warm-direct persona doesn't drift to formal); manual review weekly
- **Domain accuracy** — per-overlay test corpus; persona answers compared to ground-truth; regressions block PROMOTED transitions
- **Crisis-escalation eval** — every persona's risk_class=high triggers test-corpus run for crisis-detector recall (must = 100% on test corpus)

Eval baselines stored in `libs/personas/<slug>/evals/`. Generated by `nx g platform:persona`.

## Anti-patterns

1. **Per-persona Mastra agent instance** — refused per ADR-0008 (one parameterized agent serves all personas via `runtimeContext.get("personaId")`)
2. **Skipping composition function** in any Mastra dispatch — refused; PreToolUse hook + dispatcher middleware both check for composition-function invocation
3. **New domain overlay duplicating existing overlay** — refused at platform:persona generator catalog-first UX
4. **Trait composition that contradicts platform constitution** — refused; constitution-precedence audit catches
5. **PersonaMemory writes outside audit trigger** — refused; trigger is enforced at DB layer
6. **Promoting persona to PUBLISHED without eval baseline** — refused; platform:persona generator + slice-scorecard CI gate enforce
7. **Using sensitive_data_access without ADR** — refused per pillar-3 sandboxed-skill-governance
8. **Domain overlay missing non-counsel disclaimer for clinical/legal/medical/financial** — refused; overlay-completeness audit catches

## Enforcement

- `principles.yaml#P-OP-001` (reuse-first; persona / trait / overlay creation gated by catalog search)
- `principles.yaml#P-ARCH-021` (one-agent-many-personas — corresponds to ADR-0008)
- `principles.yaml#P-ARCH-022` (hybrid-persona-memory — corresponds to ADR-0009)
- `principles.yaml#P-ARCH-023` (composition-function-single-authority)
- `audit-runner.md#persona-composition-skip` (PR-blocking; every dispatch hits composition)
- `audit-runner.md#persona-eval-baseline` (PR-blocking; PUBLISHED personas have eval baseline)
- `audit-runner.md#persona-drift-detection` (nightly; warn on drift > threshold)
- `audit-runner.md#persona-overlay-completeness` (warn; clinical/legal/medical/financial domains have non-counsel disclaimer)
- `libs/personas/composition.ts` (the function)
- `libs/personas/libraries.ts` (traits + overlays library)
- `tools/generators/persona/index.ts` (`platform:persona` generator)

## Sources

- [docs/adr/0006-crisis-escalation-load-bearing.md](../../adr/0006-crisis-escalation-load-bearing.md)
- [docs/adr/0008-one-mastra-agent-many-personas.md](../../adr/0008-one-mastra-agent-many-personas.md)
- [docs/adr/0009-hybrid-persona-memory.md](../../adr/0009-hybrid-persona-memory.md)
- [Anthropic Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [CCv3 Character Card spec](https://github.com/kwaroran/character-card-spec-v3) — extensions{} forward-compat
- [Mastra Dynamic Agents](https://mastra.ai/) — runtimeContext-parameterized agent pattern
- [Replika / Character.AI memory analyses] — informs the hybrid-not-either-extreme decision
- [Rolling Stone — Spiralism phenomenon](https://www.rollingstone.com/) — informs spiritual=high-risk-class default
