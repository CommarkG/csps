---
id: csps.pillar-1.slice-contract
name: slice-contract
description: The 16-check, percentage-based slice contract. Every slice scores ≥90% to merge, 100% = gold. Without this contract "is this slice done?" is subjective; with it, completeness is a number CI can check. The contract IS the definition of done.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
crosscutting:
  - reliability
  - security
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: complexity-contract, href: ./complexity-contract.md }
  - { rel: module-folder-pattern, href: ./module-folder-pattern.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
---

# The Slice Contract (16 checks, percentage-based)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The 16 checks every slice must satisfy, with their point weights and verifying tools. Slices score as a percentage of points earned. **≥90% to merge, 100% = gold badge in admin.**

## Why this exists

Without a slice contract, "is this slice done?" is subjective. With it, completeness is a number CI can check. The contract IS the definition of done.

## Why percentage-based (not absolute points)

The contract grows over time. Adding new checks shouldn't require rebalancing every existing check's weight. Percentage-based scoring lets the contract expand without breaking history.

## The 16 checks

| # | Permanent element | Points | Verified by | Why this check exists |
|---|---|---|---|---|
| 1 | ZModel definition | 10 | filesystem grep | No ZModel = no schema = nothing else can be generated |
| 2 | Base columns inherited | 10 | ZModel inheritance check | Without `tenantId` etc., RLS doesn't work and audit can't track |
| 3 | ZenStack `@@allow` policy (not `@@allow('all', true)`) | 10 | AST lint | Permissive default = data leak |
| 4 | Audit trigger attached | 8 | Postgres introspection | Without trigger, writes are invisible |
| 5 | Zod schema generated | 5 | file exists | Validation must exist at all three layers |
| 6 | Payload collection registered | 8 | Payload config introspection | No admin UI = no operational ability to fix data |
| 7 | Customer routes (`list / detail / new / edit`) | 10 | filesystem check | No customer-facing surface = unfinished feature |
| 8 | Test file with ≥1 assertion | 8 | vitest discovery | Untested = untrusted |
| 9 | Relationship pickers wired | 8 | scaffolder check | Broken FK pickers = unusable forms |
| 10 | `slice.json` manifest with required fields | 5 | parse manifest | Manifest IS the slice's identity |
| 11 | `<ActivityFeed>` drawer wired | 5 | component import check | Audit history must be visible to admins |
| 12 | Pages use registered `@csps/templates` only | 10 | `validate-template-usage.mjs` | Bespoke pages = template governance broken |
| 13 | App-schema isolation correct (`@@schema(...)`) | 3 | `validate-app-schema.mjs` | Wrong schema = extraction breaks |
| 14 | Frontmatter complete (every file passes Zod) | 5 | `validate-frontmatter.mjs` | Catalog can't index without frontmatter |
| 15 | File size + complexity within limits (per [complexity-contract.md](./complexity-contract.md)) | 5 | `validate-file-size.mjs` + `validate-complexity.mjs` | Complex files rot |
| 16 | Bundle membership declared | 3 | `validate-bundle-membership.mjs` | Orphan slices can't be retrieved |

**Total: 113 points. Threshold: ≥102 (≈ 90%) to merge. Gold = 113/113 (100%).**

## How scoring runs

`nx run-many -t slice-score` runs all slices, prints a table, exits non-zero below threshold.

Slice health is also a Payload "Slice Health" collection (read-only, computed) so the admin dashboard shows scores at a glance with red/amber/green/gold badges.

## Per-check details

### Check 1: ZModel definition

Every slice has a `<slice>.zmodel` file under `libs/policies/slices/<schema>/`. The file declares the slice's models.

### Check 2: Base columns inherited

Every model in the slice extends the `Base` mixin (per [foundation-zmodel.md](../pillar-2-data-and-schema/foundation-zmodel.md)). The mixin provides `id`, `tenantId`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `deletedAt`.

### Check 3: ZenStack `@@allow` policy

Every model declares `@@allow` policies. The default `@@allow('all', auth().tenantId == tenantId && deletedAt == null)` from the Base mixin is acceptable; **`@@allow('all', true)` is forbidden** (permissive policy = data leak).

### Check 4: Audit trigger attached

Every table has a Postgres trigger calling `audit.record()`. The slice generator (`platform:slice`) emits the migration; the audit-runner verifies via `pg_trigger` introspection.

### Check 5: Zod schema generated

ZenStack generates Zod schemas from ZModel via the Zod plugin. The check verifies the file exists at the expected path.

### Check 6: Payload collection registered

Every slice has a Payload collection registered in `apps/admin/payload.config.ts`. The check imports the config and verifies the collection appears.

### Check 7: Customer routes

Every slice has 4 customer routes:
- `apps/<scope>/<name>/(customer)/<entity>/page.tsx` — list
- `apps/<scope>/<name>/(customer)/<entity>/[id]/page.tsx` — detail
- `apps/<scope>/<name>/(customer)/<entity>/new/page.tsx` — create
- `apps/<scope>/<name>/(customer)/<entity>/[id]/edit/page.tsx` — edit

### Check 8: Test file

Vitest discovers a `<slice>.test.ts` with at least one `expect()` assertion.

### Check 9: Relationship pickers wired

For every relation declared in the ZModel, the corresponding `<EntityPicker>` is imported in the slice's form file.

### Check 10: `slice.json` manifest

```yaml
{
  "id": "csps.app-bookings.entity.booking",
  "owner": "group:finky",
  "tier": "pro",
  "version": "1.0.0",
  "featureKey": "app.bookings.entity.booking",
  "ui": {
    "list": { "template": "ListPage", "schema": "bookingListSchema" },
    "detail": { "template": "DetailPage" },
    "create": { "template": "CreateForm" },
    "edit": { "template": "EditForm" }
  }
}
```

### Check 11: `<ActivityFeed>` drawer wired

The detail page imports `<ActivityFeed entityType="<slice>" entityId={id} />`. Audit history must be visible to admins.

### Check 12: Templates only

Every `page.tsx` under the slice's customer routes imports from `@csps/templates`, never from `@csps/ui/*`, `@radix-ui/*`, or `@tremor/react` directly. (Per [pillar 3 / template-governance.md](../pillar-3-platform-services/template-governance.md).)

### Check 13: App-schema isolation

App slices declare `@@schema("app_<slug>")`. Foundation slices declare `@@schema("public")` or omit (default). Wrong schema = extraction breaks.

### Check 14: Frontmatter complete

Every `.md`, `.ts`, `.tsx`, `.zmodel` file in the slice has frontmatter passing the Zod schema (per [frontmatter-standard.md](./frontmatter-standard.md)). Includes the reuse-first contract field (`enhances:` OR `created-new-because:`).

### Check 15: File size + complexity

Every file in the slice satisfies the complexity contract limits (file ≤500 LOC, function ≤80 LOC, cognitive complexity ≤15, etc.). Per [complexity-contract.md](./complexity-contract.md).

### Check 16: Bundle membership

The slice belongs to at least one explicit Bundle OR matches a query-based View. Orphan slices can't be retrieved by AI agents or browsed in the catalog.

## Scoring example

A typical slice that's missing a test file and has a cognitive complexity violation in one function:

- 16 checks: 14 passing, 2 failing (test file + complexity)
- Lost points: 8 (test) + 5 (complexity) = 13
- Score: (113 - 13) / 113 = **88.5% → fails the 90% merge threshold**

The CI gate prevents merge until either:
- The test is added (back to 96.5%)
- The complexity violation is fixed (back to 93.8%)
- Both (100% gold)

## Reuse-first applied to slice creation

Before creating a new slice via `nx g platform:slice <Name>`:

1. The generator queries the catalog for similar artifacts and prints top-5 matches
2. User must either select an existing slice to enhance OR pass `--new` flag with `--reason "<justification>"`
3. The new slice's `slice.json` includes `enhances: <id>` or `created-new-because: <text>`
4. CI verifies the field is non-empty (per check 14 frontmatter validation)

## Sources

- Vertical Slice Architecture (Jimmy Bogard) — the slice-as-feature pattern
- Feature-Sliced Design — the slice manifest pattern
- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/) — the contract-driven scaffolder pattern
- [Roadie System Scoring](https://roadie.io/backstage/plugins/system-scoring/) — the percentage-based health scoring pattern
