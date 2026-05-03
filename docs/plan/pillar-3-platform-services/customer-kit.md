---
id: csps.pillar-3.customer-kit
name: customer-kit
description: The 4-component customer-kit primitives — <EntityList>, <EntityDetail>, <EntityForm>, <EntityPicker> — that compose every customer-facing entity surface in CSPS. Backed by ZenStack-generated Zod schemas + RLS-enforced data access + RelationshipPicker for FK navigation. Apps compose customer surfaces from these primitives; never write bespoke entity-display components. Migrated from v1.3 §11.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:ui
  - type:ui
  - audience:developer
  - audience:end-user
  - maturity:stable
crosscutting:
  - reliability
  - performance
  - multi-tenant
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: template-governance, href: ./template-governance.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: adr-stack, href: ../../adr/0001-pick-csps-stack.md }
---

# Customer Kit

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The 4-component primitive set in `@csps/customer-kit` that every CSPS app composes its customer-facing entity surfaces from. No bespoke entity-display components allowed; the kit primitives + 22 page templates (per `template-governance.md`) cover 100% of customer surfaces.

## The 4 primitives

| Primitive | Purpose | Backed by |
|---|---|---|
| `<EntityList>` | Paginated, filterable, sortable table of entities | ZenStack-generated Zod schema + tRPC list query + customizable columns |
| `<EntityDetail>` | Full read-only view of a single entity | ZenStack schema + relations expanded |
| `<EntityForm>` | Create/edit form with validation | Zod schema → react-hook-form → tRPC mutation |
| `<EntityPicker>` | Searchable picker for FK relationships | EntityList in modal + selected callback |

These 4 primitives × 22 page templates × 16 starter slices = the bulk of customer-facing UI in CSPS.

## Why these specific 4

A solo-dev cannot maintain bespoke list/detail/form/picker components per slice across 30 apps. The 4 primitives are the **minimum complete set** for entity-CRUD surfaces:

- **List** — index view ("show me bookings")
- **Detail** — single-record view ("show me booking #123")
- **Form** — create or edit ("add a booking" / "update booking #123")
- **Picker** — FK selection ("which user?" inside another form)

Cover 90% of customer-facing entity surfaces. The remaining 10% (dashboards, reports, custom flows) compose from page templates per `template-governance.md`.

## Per-primitive contract

### `<EntityList entity="..." />`

Auto-generated columns from ZenStack model frontmatter; user-customizable via `<EntityList columns={...}>`. Defaults:
- Pagination: 25 rows; cursor-based (not offset — perf)
- Sorting: any indexed column
- Filtering: any column with `@@meta.filterable: true`
- Bulk operations: opt-in via `bulkActions` prop
- Export: opt-in CSV/JSON; audit-logged

### `<EntityDetail entity="..." id="..." />`

Renders all fields per ZenStack `@@meta.detailable` setting. Relations expanded inline (1-to-1) or as nested EntityList (1-to-many).

### `<EntityForm entity="..." id="..." />`

`id` optional — when present, edit mode; when absent, create mode. Uses `react-hook-form` + Zod schema generated from ZenStack. Submit calls tRPC mutation.

Per-field rendering uses `@@meta.formInput` directive: `text` | `textarea` | `select` | `multiselect` | `relationship-picker` | `file-upload` | `date` | `boolean` | `markdown`.

### `<EntityPicker entity="..." onSelect={...} />`

Modal with EntityList. Selected row passed to `onSelect`. Used inside EntityForm for FK fields. Supports `multi` for multi-select.

## How apps compose

```tsx
// apps/booking/app/customer/bookings/page.tsx
import { EntityList } from '@csps/customer-kit';

export default function BookingsListPage() {
  return (
    <EntityList
      entity="Booking"
      columns={['id', 'customer.name', 'date', 'status']}
      filters={['status', 'date']}
    />
  );
}
```

The `entity="Booking"` reference is resolved via the catalog (per `catalog-bundle-system.md`); Booking's ZenStack schema drives the rest.

## Why no bespoke `<BookingList>` allowed

If apps were allowed to write `<BookingList>` directly:
- Visual drift across apps (each looks different)
- Refactoring cost (change column behavior → touch every app)
- AI generation drifts (Claude/Cursor invent new patterns per app)

The customer-kit + template-governance pair MECHANICALLY prevents this:
- ESLint rule blocks raw `@radix-ui/*` / `@tremor/react` imports outside `@csps/templates`
- Page generator (`nx g platform:page`) refuses bespoke implementations; routes through templates only
- Slice contract check #12 verifies every page imports from `@csps/templates` or `@csps/customer-kit`

## The customer-kit IS the only path

For entity-CRUD surfaces, customer-kit is the **single way**. No "exception" path. New entity surface = 4 primitives composed. New page pattern = template request PR (per `template-governance.md`).

## Anti-patterns

1. **Bespoke list components** (`<MyList>`) — refused by ESLint + slice-scorecard; PR fails.
2. **Direct Radix imports** — refused at ESLint level; only `@csps/templates` may import Radix.
3. **Forgetting RLS** — customer-kit enforces RLS via tRPC procedure middleware; bypass is impossible from app code.
4. **Synchronous list-load** without pagination — refused; cursor-based pagination is mandatory.

## Enforcement

- `principles.yaml#P-ARCH-017` (template-first reuse-first; severity critical, 4 enforcers)
- ESLint `no-restricted-imports` (Radix/Tremor blocked outside templates)
- Slice contract check #12 — `validate-template-usage.mjs` requires `@csps/customer-kit` or `@csps/templates`
- Storybook coverage — every customer-kit primitive has Storybook story + Chromatic visual regression

## Sources

- [pillar-3/template-governance.md](./template-governance.md)
- [pillar-1/slice-contract.md](../pillar-1-architecture-and-stack/slice-contract.md)
- [shadcn/ui DataTable](https://ui.shadcn.com/docs/components/data-table) (the underlying component)
- [react-hook-form](https://react-hook-form.com/)
- [ZenStack auto-generated Zod schemas](https://zenstack.dev/docs/reference/zmodel-language)
