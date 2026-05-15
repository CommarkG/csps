---
id: csps.pillar-4.generators
name: generators
description: The 10 platform generators (slice / split / page / app / agent / skill / persona / wizard / skill-import / skill-promote / skill-upgrade) — Nx generators + Hygen templates. Catalog-first UX (search before scaffold). Atomic dual-registration (file + catalog manifest in same write per B_ATOMIC_DUAL_REGISTRATION). The mechanical enforcer of P-OP-001 reuse-first. Migrated from v1.3 §10.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:dx
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle-reuse-first, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: principle-batched, href: ../pillar-0-governance/operating-principles.md }
  - { rel: catalog, href: ../pillar-3-platform-services/catalog-bundle-system.md }
  - { rel: skill-ingestion, href: ./skill-ingestion-contract.md }
  - { rel: contracts, href: ../pillar-0-governance/behavioral-contracts.md }
created-new-because: |
  No existing generator-spec leaf exists. v1.3 §10 had inline generator descriptions; this leaf
  consolidates them with the dual-registration discipline + catalog-first UX + per-generator
  acceptance criteria. The pillar-3 catalog-bundle-system leaf documents the catalog SIDE; this
  leaf documents the GENERATOR side that writes to it. Distinct concerns.
domain_path: platform
core_spine: AI
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Generators (the platform's golden-path scaffolders)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The 10 platform generators (`nx g platform:*`), the catalog-first UX every generator implements, the atomic dual-registration write (file + catalog manifest in the same transaction), per-generator acceptance criteria, the AI-prompt-addendum binding that routes Claude/Cursor through generators rather than free-form file writes.

## Why this exists

A solo developer cannot scaffold 30 apps × 16 slices × 5 layers (DB + admin + customer + tests + audit) by hand without invariants drifting. Generators turn the slice contract into mechanical scaffolding.

But generators are also where **the reuse-first principle becomes mechanical**. Free-form file writing is the universal failure mode (`fs.writeFile`, "I'll just create a new component," ad-hoc scripts). Generators short-circuit this: the catalog-first UX prints existing matches BEFORE scaffolding a new artifact. The user must explicitly type `--new` and supply a `created-new-because:` justification to override.

Per AGENTS.md hard NO ("Never create files outside the schema-aligned tree"): the only sanctioned scaffolding path is `nx g platform:*`. Free-form `fs.writeFile` calls fail the slice scorecard.

## The 10 generators

| Generator | Purpose | Source / Output |
|---|---|---|
| `platform:slice <Name>` | Scaffolds a full vertical slice (ZModel + Zod + Payload + UI + tests + audit trigger + frontmatter + catalog manifest) | Slice contract (16 checks) |
| `platform:split <slice> --into=<list>` | Splits an oversized slice into N smaller ones; preserves audit history + catalog cross-refs | Module-folder pattern + complexity contract |
| `platform:page <Name>` | Scaffolds a customer-facing page using a registered template (template-only-page-creation per ADR-0004) | Template governance |
| `platform:app <Name>` | Scaffolds a new app inside CSPS (apps/<name>/ + schema-per-app + Clerk org + tier defaults + extraction-readiness scaffolding) | Schema-per-app per ADR-0002 |
| `platform:agent <Name>` | Scaffolds a Mastra agent persona-binding (NOT a new agent — reuses the one parameterized agent per Pillar 5) | Mastra setup |
| `platform:skill <Name>` | Scaffolds a platform-owned skill (`packages/skills/<Name>/SKILL.md`) | Skills package |
| `platform:persona <Name>` | Scaffolds a persona definition (slug + composition function inputs + eval baseline stub) | Persona composition |
| `platform:wizard <Flow>` | Scaffolds a multi-step wizard flow with per-step validators + state machine | Customer kit |
| `platform:skill-import --source=<url> --sha=<hash>` | Imports a community skill into `vendor/quarantine/`; SHA-pins; updates `skills.lock.yaml` | Skill ingestion contract |
| `platform:skill-promote --skill=<id> --tier=<vendored\|platform>` | Promotes a quarantined skill through trust tiers; requires eval-Worker pass | Skill ingestion contract |
| `platform:skill-upgrade --skill=<id> --to=<sha>` | Bumps a vendored/platform skill to a new SHA; re-runs eval; updates lock | Skill ingestion contract |

## The catalog-first UX (the killer enforcer)

Every `platform:*` generator implements this UX before scaffolding:

```
$ nx g platform:slice Booking
Searching catalog for similar artifacts...

Top matches:
  1. csps.app-bookings.entity.reservation     (similarity: 0.87)
  2. csps.app-events.entity.appointment       (similarity: 0.71)
  3. csps.feature-pack.scheduling.session     (similarity: 0.62)

Enhance one of these? Or proceed with a new slice?
  [1-3] enhance match
  [n] new (requires --new flag + justification)
  [q] quit and search more
```

Tied to the AI prompt addendum (engraved in `AGENTS.md` + workspace `CLAUDE.md`):

> **Before proposing creation of any artifact (slice, skill, agent, page, ZModel pattern, validator, prose), query the catalog (`packages/catalog/catalog.json`, exposed as MCP resources) for existing matches and cite the closest. If you propose new, justify why enhancement of the closest match is wrong. Generators (`nx g platform:*`) are the only sanctioned scaffolding path.**

## Atomic dual-registration (per B_ATOMIC_DUAL_REGISTRATION)

Every generator writes the artifact file **and** registers it in the catalog manifest in the same transactional operation. Not two separate steps. This contract closes the **registration-drift gap** (file exists but catalog doesn't see it; or catalog row exists but file is gone).

The generator's `index.ts`:

```typescript
export default async function (tree: Tree, options: SliceOptions) {
  // 1. Generate file content
  generateFiles(tree, joinPathFragments(__dirname, "files"), targetPath, options);

  // 2. Register in catalog manifest (SAME tree mutation)
  updateJson(tree, "packages/catalog/catalog.json", (catalog) => {
    catalog.entries[options.id] = {
      id: options.id,
      path: targetPath,
      generated_by: "platform:slice",
      generated_at: new Date().toISOString(),
    };
    return catalog;
  });

  // 3. Single formatFiles call commits both
  await formatFiles(tree);
}
```

If catalog write fails, file write rolls back (Nx tree atomicity). If file write fails, catalog write rolls back.

Audit `dual-registration-drift` (PR-blocking, error severity) scans for orphan files (in tree, not in catalog) and orphan catalog rows (in catalog, not in tree). Either is a hard fail.

## Per-generator acceptance criteria (each fails CI if violated)

- **`platform:slice`** — 16-check slice contract scored ≥90% on first generation; all required files present (ZModel + Zod + Payload + UI + tests + audit trigger + frontmatter + catalog manifest)
- **`platform:split`** — pre-split slice's audit history retained; catalog cross-refs updated atomically; both new slices score ≥90% post-split
- **`platform:page`** — uses a `RegisteredTemplate` (template-only-page-creation per ADR-0004); fails if requested template not in template registry
- **`platform:app`** — schema-per-app boundary established (no shared `public.*` writes); Clerk org provisioned; tier defaults set; extraction-readiness scaffolding present
- **`platform:agent`** — binds to the existing parameterized Mastra agent (does NOT create a new agent process per Pillar 5 lock)
- **`platform:skill`** — `SKILL.md` frontmatter complete (allowed_tools / allowed_subagents / allowed_outbound_hosts / allowed_db_operations / sensitive_data_access per pillar-3 sandboxed-skill-governance)
- **`platform:persona`** — composition function inputs validated; eval baseline stub generated; sensitive-data-access flag explicit
- **`platform:wizard`** — every step has a Zod input schema + a state-machine transition validator; resumable via partial state
- **`platform:skill-import`** — SHA-pinned (no tag-pinning per pillar-3 sandboxed-skill-governance); `skills.lock.yaml` row added; quarantine tier assigned
- **`platform:skill-promote`** — eval-Worker pass required; tier transition logged to audit; capability declarations frozen at promotion
- **`platform:skill-upgrade`** — eval re-run on new SHA; capability diff surfaced; capability creep blocked by `skill-capability-drift` audit

## Hygen templates (the inner mechanism)

Nx generators delegate template rendering to Hygen for the actual file content. Templates live at `tools/generators/<name>/files/`. EJS-style placeholder syntax. Per template:

- Variables are typed (TypeScript interface in the generator's `schema.json`)
- Default values minimize prompt fatigue
- `--dry-run` always supported (writes nothing, prints diff)
- `--interactive` enables the catalog-first UX (default for `platform:*`)

## Anti-patterns

1. **Free-form `fs.writeFile`** — refused; AGENTS.md hard NO; `audit-orphan-file` (PR-blocking) catches files not produced by a sanctioned generator
2. **Skipping catalog-first search** — refused; the generator's first action IS the search; cannot be skipped
3. **Generator that writes file but not catalog row** — refused; audit `dual-registration-drift` (error severity) catches
4. **Generator added without ADR** — every new generator requires an ADR explaining why an option flag on an existing generator won't suffice (reuse-first applied to generators themselves)
5. **`--new` flag without `created-new-because:` justification** — refused; `validate-frontmatter.mjs` fails CI
6. **Generator that mutates files outside its declared output paths** — refused; `audit-generator-side-effect` (planned week 4)

## Enforcement

- `principles.yaml#P-OP-001` (reuse-first; severity error; ≥4 enforcers — generator catalog-first UX is enforcer #4)
- `principles.yaml#P-OP-004` (batched-execution; generator batch operations atomically)
- `principles.yaml#P-ARCH-005` (generators-carry-the-load)
- `principles.yaml#P-ARCH-008` (AI-readable-architecture; every generated file has frontmatter)
- `audit-runner.md#dual-registration-drift` (PR-blocking; error severity)
- `audit-runner.md#orphan-file` (PR-blocking; error severity)
- `audit-runner.md#generator-test-coverage` (warn; every generator has a test fixture)
- `tools/generators/<name>/index.ts` (the generators themselves)
- `tools/generators/<name>/schema.json` (typed input contract per generator)
- `behavioral-contracts.md#B_ATOMIC_DUAL_REGISTRATION` (the contract this leaf encodes)
- `AGENTS.md` (the "Generators are the only sanctioned scaffolding path" hard NO)

## Generator-output triggers B_POSITIVE_VALUE_EXTRACTION cycle (added S005 turn 22)

Per `B_POSITIVE_VALUE_EXTRACTION` ([behavioral-contracts.md](../pillar-0-governance/behavioral-contracts.md#B_POSITIVE_VALUE_EXTRACTION)) + amended P-META-006 trigger-cadence: **every generator/wizard output batch is a "generator-output" positive-significant event** that triggers the cycle. Generator emits N artifacts → cycle fires:

1. **RZF on the produced batch** — validators run on the generated artifacts (slice-score / frontmatter / dual-registration-drift / etc.). Output: structured cycle evidence.
2. **CEC walk for cross-pillar applications** — does the new artifact's essence apply elsewhere? E.g., new persona generated → walk for places that should reference the persona's domain overlay.
3. **Walk-trail entry in closing-summary §10.11b** — every generator invocation surfaced this session has a walk-trail row.

**Why this matters:** generators are the canonical artifact-emission point in CSPS. Skipping the cycle on generator output means: a generator emits 25 files; those files might fail audits OR might enable cross-pillar applications that go un-walked. The amended P-META-006 explicitly names "generator/wizard output batch" as a trigger; this leaf documents the integration point. Forward-prevention: `generator-test-coverage` audit (already registered) extended week-3+ to also verify post-generation cycle ran.

## Sources

- [Nx Generators](https://nx.dev/extending-nx/recipes/local-generators)
- [Hygen](https://www.hygen.io/)
- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/)
- [Spotify Backstage golden paths](https://backstage.io/docs/getting-started/concepts/)
- [pillar-1/slice-contract.md](../pillar-1-architecture-and-stack/slice-contract.md) — the 16-check contract enforced at slice generation
- [pillar-3/catalog-bundle-system.md](../pillar-3-platform-services/catalog-bundle-system.md) — the catalog manifest the generators write to
- [pillar-3/sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md) — skill tier/capability rules the import/promote generators enforce
- [docs/adr/0004-template-only-page-creation.md](../../adr/0004-template-only-page-creation.md)
