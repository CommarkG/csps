---
id: csps.pillar-3.template-governance
name: template-governance
description: The 22-template catalog + wizard-as-data manifest + 4-layer enforcement (no-restricted-imports + slice-scorecard + Storybook+Chromatic + generator-only-page-creation) + AI discipline (CATALOG.md as Claude Skill + PreToolUse hook). Every page in every CSPS app composes from a registered template; bespoke pages require template-request PR before merge. Migrated from v1.3 §11.5.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:ui
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - performance
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: customer-kit, href: ./customer-kit.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: adr-template-only, href: ../../adr/0004-template-only-page-creation.md }
domain_path: platform
---

# Template Governance

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The 22-template catalog + wizard-as-data + 4-layer enforcement + AI discipline that mechanically prevents bespoke `page.tsx` files in any CSPS app. Per ADR-0004, this is the load-bearing mechanism that makes a solo dev viable across 30 apps.

## The 22-template catalog

Each template is a registered file in `packages/templates/<template-id>/`:

| ID | Pattern | Purpose |
|---|---|---|
| `landing-hero` | Landing page with hero + CTA | Marketing/login pages |
| `dashboard-overview` | Tremor grid of KPI cards | Admin / customer dashboards |
| `entity-list` | Wraps `<EntityList>` from customer-kit | Index pages |
| `entity-detail` | Wraps `<EntityDetail>` | Single-record pages |
| `entity-form` | Wraps `<EntityForm>` | Create / edit pages |
| `wizard-multi-step` | Wizard-as-data driven; renders via manifest | Onboarding, complex forms |
| `settings-tabs` | Tabbed settings layout | User / org settings |
| `auth-signin` | Clerk-integrated signin | Login flow |
| `auth-signup` | Clerk-integrated signup + Org creation | Registration flow |
| `billing-tiers` | Stripe-integrated tier comparison + checkout | Upgrade flow |
| `billing-portal` | Stripe Customer Portal embed | Subscription management |
| `report-table` | Sortable / exportable table for reports | Reporting surfaces |
| `report-chart` | Tremor chart with date range | Analytics surfaces |
| `notification-feed` | Activity feed with infinite scroll | Notifications |
| `chat-shell` | Mastra agent chat interface | AI persona surfaces |
| `error-page` | 404 / 500 / 403 with branded recovery | Error handling |
| `empty-state` | Reusable "nothing here yet" with CTA | Empty lists |
| `audit-log-viewer` | Time-ordered audit events for entity | Compliance / debugging |
| `data-export` | Export modal with format + scope | GDPR / data portability |
| `support-form` | Support ticket creation | Help surfaces |
| `legal-policy` | Markdown-rendered policy pages | ToS, privacy, cookies |
| `confirmation-dialog` | Destructive-action confirmation | Delete flows |

Each template has: `template.yaml` manifest + React component + Storybook story + Chromatic snapshot + tests + AI prompt template (for `nx g platform:page`).

## Wizard-as-data manifest

Wizards are NOT custom-coded per use. The `wizard-multi-step` template reads a manifest:

```yaml
# apps/booking/wizards/onboarding.wizard.yaml
id: onboarding
title: "Welcome to Booking"
steps:
  - id: org-info
    schema: BookingOrgInfo            # Zod schema reference
    fields: [name, timezone, industry]
  - id: first-customer
    schema: BookingCustomer
    fields: [name, email, phone]
  - id: confirmation
    type: confirmation
    summary_fields: [orgInfo.name, customer.name]
on_complete:
  action: redirect
  target: "/dashboard"
```

The wizard template renders this manifest. Adding a new wizard = adding a manifest + Zod schemas + tRPC mutations. NO new components.

## 4-layer enforcement (the mechanical spine)

### Layer 1 — `no-restricted-imports` ESLint rule

```js
// eslint.config.ts
{
  rules: {
    'no-restricted-imports': ['error', {
      paths: [
        { name: '@radix-ui/*', message: 'Use @csps/templates' },
        { name: '@tremor/react', message: 'Use @csps/templates' },
        { name: '@csps/ui/*', message: 'Use @csps/templates' },
      ],
    }],
  },
}
```

Apps cannot import primitives directly. Only `@csps/templates` and `@csps/customer-kit` can.

### Layer 2 — Slice contract check #12

`tools/validators/validate-template-usage.mjs` walks every `page.tsx` in `apps/*/app/**`; verifies it imports from `@csps/templates` OR `@csps/customer-kit`. Fails PR if any page is bespoke.

### Layer 3 — Storybook + Chromatic

Every template has a Storybook story. Chromatic runs on every PR; visual regression flags any drift.

### Layer 4 — Generator-only page creation

```bash
nx g platform:page --template=entity-list --slice=Booking
```

The generator refuses unknown templates. Override via `--new` requires `--justification` (stored as `created-new-because:` frontmatter). Hard-blocked from raw `page.tsx` creation.

## AI discipline (mechanical AI compliance)

### `CATALOG.md` as Claude Skill

`packages/templates/CATALOG.md` is loaded as a Claude Skill (per Anthropic Skills spec). When Claude is asked to "create a booking page", the skill's RAG router loads CATALOG.md; AI sees the 22 templates + their match patterns; chooses one or proposes a new-template request.

### PreToolUse hook for `Write`

`.claude/hooks/pre-tool-use-page-write.sh`:

```bash
# Intercept any Write to **/page.tsx
if [[ "$TOOL" == "Write" && "$PATH" == *"page.tsx" ]]; then
  if [[ ! -f "$DIR/__generated_by_template.txt" ]]; then
    echo "[block] page.tsx must be created via 'nx g platform:page'"
    exit 2  # block
  fi
fi
```

Generator writes `__generated_by_template.txt` marker; manual writes blocked.

## New-template request workflow

When AI / dev determines no existing template fits:

1. PR proposes new template: `packages/templates/<new-id>/template.yaml` + component + Storybook
2. PR description: "Existing template considered: [list]; why insufficient: [reason]"
3. Reviewer evaluates: does an existing template + flag suffice? Is this genuinely novel?
4. If approved: template merged + catalog regenerated + ESLint/CATALOG.md auto-update via codegen
5. Future pages can use it via `nx g platform:page --template=<new-id>`

The 4-eyes review (per checkpoint-8-categories) is mandatory.

## Anti-patterns

1. **Bespoke `page.tsx`** — blocked at 4 layers. PR fails.
2. **Inline Radix usage** — ESLint blocks. PR fails.
3. **One mega-template with conditional rendering** — refused at template-PR review (becomes Frankenstein over time).
4. **Bypassing the generator** — PreToolUse hook blocks; pre-commit catches; CI catches.
5. **Skipping new-template-request PR** — slice-scorecard catches missing template registration.

## Enforcement

- `principles.yaml#P-ARCH-017` (template-first reuse-first; severity critical, 4 enforcers)
- `eslint.config.ts` (no-restricted-imports — layer 1)
- `validate-template-usage.mjs` (slice contract #12 — layer 2)
- `storybook-coverage` audit (layer 3)
- `tools/generators/page/index.ts` (layer 4)
- `.claude/hooks/pre-tool-use-page-write.sh` (AI discipline)
- `packages/templates/CATALOG.md` (Claude Skill)

## Sources

- [pillar-3/customer-kit.md](./customer-kit.md)
- [adr/0004-template-only-page-creation.md](../../adr/0004-template-only-page-creation.md)
- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/)
- [Spotify Golden Paths](https://backstage.io/discover/golden-paths/)
- [Anthropic Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
