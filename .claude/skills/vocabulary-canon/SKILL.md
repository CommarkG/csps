---
name: vocabulary-canon
description: When authoring frontmatter OR naming a new artifact OR amending closed-enum fields — load naming-policy 4-rules + frontmatter-closed-enums canonical reference + glossary lookup + B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK. Triggers on "name", "naming", "filename", "frontmatter", "lifecycle", "lifecycle_state", "maturity", "domain", "type", "tier", "audience", "tags", "rename", "glossary".
allowed_tools: [Read, Grep, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-ARCH-029
backed_by_contract: B_NAMING_POLICY
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_NAMING_POLICY
  - B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK
  - B_STRUCTURAL_PREVENTION_DISCIPLINE
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-naming-or-frontmatter-validation
  max_tokens: 2000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: true
---

# /vocabulary-canon — Naming + Frontmatter Reference

## When to invoke

- Naming a new file / folder / artifact
- Authoring frontmatter (especially closed-enum fields)
- Renaming an existing artifact
- Amending validators that introduce new closed-enum values

## Naming policy 4 rules (per B_NAMING_POLICY)

| Rule | Pattern | Example |
|---|---|---|
| **1 Always-current** | `<noun>.md` (no -S<NNN> / -v<N> / -L<N> / -final / -latest / -current / -new / -old) | `OVERVIEW.md` / `naming-policy.md` |
| **2 Per-session** | `<type>-S<NNN>.md` (immutable historical) | `closing-summary-S007.md` / `governor-prompts/S007.md` |
| **3 Per-topic** | `<topic-id>.md` (multi-session arc; latest state) | `topic-plans/token-optimization.md` |
| **4 Layer-prefixed** | `L1_CORE_<SPINE>` / `L2_DOMAIN_<SPINE>_<DOMAIN>` / `L3_INSTANCES_<SPINE>` | `L1_CORE_GVRN.md` |

## Vocabulary rules

1. **English over abbreviations** — `template-registry.md` not `tmpl-reg.md`
2. **Engraved canonical terms preserved** — P-META / B_ / FSE / RZF / CEC / HPFA / MUV / AAP / CCA / ZModel / BaseAgent / RLS / PCR — do not rename
3. **Industry-standard preferred** — slice / template / audit / validator / registry / manifest / schema / pillar
4. **No synonym drift** — once chosen, use consistently
5. **Glossary-pinned for domain entities** — Booking's Customer ≠ CRM's Customer (per ADR-0023 schema-per-app)

## Frontmatter closed enums (per [frontmatter-closed-enums.md](../../../docs/plan/pillar-0-governance/frontmatter-closed-enums.md))

| Field | Closed enum |
|---|---|
| `lifecycle:` | experimental / beta / production / deprecated |
| `lifecycle_state:` | active / pending-review / pending-protocol / promoted / resolved / deprecated / validated / closed |
| tag `domain:` | billing / persona / bookings / auth / admin / ai / infra / shared / crisis / audit / governance / architecture / data / dx / ops / planning / ui / platform |
| tag `type:` | feature / ui / data-access / util / schema / doc / skill / agent / bundle / template / reference / tutorial / how-to / explanation |
| tag `tier:` | free / pro / business / enterprise / internal |
| tag `audience:` | end-user / admin / developer / ai-agent |
| tag `maturity:` | draft / review / stable / frozen / deprecated |

**K=2 drift catalog (S006 + S007):**
- `lifecycle_state: draft` ✗ → `lifecycle_state: active` + `tags: [maturity:draft]`
- `maturity: active` ✗ → `maturity: draft` (or stable / review / frozen / deprecated)

## Renaming protocol (B_NAMING_POLICY ALL-rules-during-rename mandate)

1. Apply ALL 4 rules + vocabulary rules (not just suffix removal)
2. `git mv <old> <new>` (preserves history)
3. Update internal frontmatter `id:` and `name:` fields
4. Grep for inbound references; update each cross-reference in same commit
5. Validator must PASS before commit
6. Document rename chain in frontmatter description if multi-renamed

## No-invention precedent check

Before introducing any new format/name/structure:
1. Search existing CSPS
2. Search user's prior platforms (CSP carry-forwards)
3. Search industry research

If precedent: enhance (P-OP-001 reuse-first). If no precedent: declare absence + propose-with-PCR. New artifacts MUST carry `precedent_checked:` frontmatter field.

## Backed by

P-ARCH-029 + B_NAMING_POLICY (S006 turn 24 user directive: "names are simple and clear for human users while using industry standard vocabulary"). Composes with B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK (S002 turn 7) + B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 K=2 closed-enum drift fix (S007 turn 5). Full canonical: [naming-policy.md](../../../docs/plan/pillar-0-governance/naming-policy.md) + [frontmatter-closed-enums.md](../../../docs/plan/pillar-0-governance/frontmatter-closed-enums.md).
