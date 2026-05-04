---
id: csps.adr.0024-deployment-platform-vercel-cloudflare-hybrid
title: ADR-0024 — Deployment platform — Vercel for Next.js apps + Cloudflare Workers for edge/sandbox
status: accepted
date: 2026-05-04
deciders: group:finky
tags: [domain:ops, type:explanation, audience:developer, audience:admin, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-1-architecture-and-stack/tech-stack.md }
  - { rel: prior-adr, href: ./0001-pick-csps-stack.md }
  - { rel: related-adr, href: ./0005-sandboxed-skill-governance.md }
  - { rel: dashboards, href: ../plan/pillar-6-operations-and-delivery/dashboards.md }
---

# ADR-0024 — Deployment platform: Vercel + Cloudflare Workers hybrid

## Context and problem statement

CSPS uses Next.js 15 App Router (per ADR-0001) for `apps/admin` and customer-facing apps; Cloudflare Workers for the skill-eval-Worker (per ADR-0005 sandboxed-skill-governance). User S005 turn 25-26 surfaced the deployment question: where do dashboards (audit-hub, CCA, AAP, drift, hotspots, AAP compliance, CCA compliance) actually run?

Currently dashboards live as **markdown leaves** under `docs/plan/pillar-0-governance/`. Week-10+ (per build-order.md) ships interactive admin dashboards as Next.js pages under `apps/admin/app/(admin)/audits/...`. **The hosting decision is needed before week-10.**

## Considered options

| # | Option | Pros | Cons |
|---|---|---|---|
| A | Vercel only (admin + customer apps + edge) | Canonical Next.js host; best DX integration (revalidate / ISR / Edge Functions); solid analytics; trivial Pro tier | Cloudflare already on stack for skill-eval-Worker; duplicating edge would split ops; Vercel pricing scales steeper than CF at high traffic |
| B | Cloudflare Workers only (Pages + Workers + Workers AI) | Already on stack; cheaper at scale; better global edge; consistent ops surface | Less Next.js-DX-optimized than Vercel; some Next.js features (ISR fine-grained) less mature |
| C | Self-host (Docker + Kubernetes / Render / Railway) | Maximum control; portable | Ops burden for solo developer; CSPS philosophy is platform-as-product not platform-as-ops-load |
| **D** | **Hybrid: Vercel for Next.js apps (admin + customer); Cloudflare Workers for edge functions + skill-eval-Worker (existing) + future sandbox isolation** | Right-tool-for-job per workload; minimal duplication (Vercel for app traffic; CF for edge/sandbox); composes with existing ADR-0005; clear ownership boundary | Two-vendor complexity; ops surface split between two dashboards |

## Decision outcome

**Chosen: Option D — Hybrid Vercel + Cloudflare Workers.**

**Reasoning:** the load-bearing factor is **right-tool-for-job per workload**:

- **Admin app + customer-facing apps** (Next.js 15 App Router; ISR; revalidation; admin sessions; impersonation) → **Vercel**. Vercel was built for this; the DX integration with Next.js is canonical (per Vercel's Next.js authorship). Tremor + shadcn rendering + admin sessions get optimized first-class support.
- **Edge functions** (auth-gate / RLS-context-injection / per-tenant rate-limiting) → **Cloudflare Workers**. Already on the stack. Better global edge.
- **Skill-eval-Worker** (per ADR-0005 — community/vendored skill execution sandbox) → **Cloudflare Workers**. Already running.
- **Future Mastra agents at edge** (week-6+) → **Cloudflare Workers** as sandbox; Vercel for the app shell.

**Composition with existing ADRs:**
- ADR-0001 stack: confirms Next.js 15 (Vercel) + Cloudflare Workers (sandbox) — no change
- ADR-0005 sandboxed-skill-governance: skill-eval-Worker stays on Cloudflare — no change
- ADR-0007 postgres-trigger-based-audit: audit data lives in Supabase; consumed by Vercel-hosted admin dashboards via Prisma — clean

**What would flip the recommendation:**

If Vercel pricing becomes prohibitive at scale (>$10k/mo for the platform), migrate admin app to Cloudflare Pages (which has improved Next.js compatibility throughout 2025-2026). Re-evaluate at S015+ when actual traffic data exists. Until then, Option D's developer-experience benefit dominates.

## Consequences

**Deployment topology (week-10+ when admin app ships):**

| Component | Host | Why |
|---|---|---|
| `apps/admin` (Next.js 15) | **Vercel** (Pro tier; ~$20/mo seat) | Canonical Next.js DX; admin dashboards (audit-hub / CCA / AAP / drift / hotspots) |
| `apps/customer-shell` (Next.js 15) | **Vercel** | Customer-facing apps |
| Per-tenant app instances (multi-app foundry — weeks 11+) | **Vercel** with subdomain-routing OR per-app deployment | Per per-app graduation pipeline |
| `apps/skill-eval-worker` | **Cloudflare Workers** (existing) | Sandboxed skill execution; community-tier isolation |
| Edge auth/RLS-context middleware (week-6+) | **Cloudflare Workers** | Global edge + zero cold start |
| Future: Mastra agents at edge | **Cloudflare Workers** + Vercel app shell | Sandbox + agent context isolation |
| Postgres database | **Supabase** (existing per ADR-0001) | Multi-schema; RLS; audit triggers |
| Static assets / docs | **Vercel** (admin app)  + **GitHub Pages** (public docs subset) | Canonical |

**Dashboard hosting (per audit-hub.md week-10 plan):**

```
apps/admin/app/(admin)/audits/
  page.tsx                   ── Audit Hub overview
  pipeline/[name]/page.tsx   ── Per-pipeline drill-down
  check/[slug]/page.tsx      ── Per-audit detail + run history
  drift/page.tsx             ── Continuous drift signals
  hotspots/page.tsx          ── Adam Tornhill churn × complexity
  aap/page.tsx               ── Per-skill AAP frontmatter status
  cca/page.tsx               ── Per-session QG compliance
  closing-summaries/page.tsx ── Per-session §10.0/§10.11b/§10.13b coverage
```

All hosted on **Vercel**. Data source: Supabase audit tables.

**Cost model (estimate; revise at S015+):**

- Vercel Pro: ~$20/mo per seat for solo dev; $150-300/mo at modest scale (10-50k MAU)
- Cloudflare Workers: ~$5-30/mo at modest scale; scales linearly + cheap
- Supabase: $25/mo Pro tier

**Total at week-10 launch:** ~$50-80/mo. At S100+ with 30 apps live: ~$500-1500/mo. Still cheap relative to revenue from paying customers.

**Forward-prevention:**

- New hosting decisions (Edge functions / data store / queue / etc.) decide via PCR; Option D extends the rule via a default-Vercel-for-Next.js-default-Cloudflare-for-Workers-default
- Migration triggers documented (>$10k/mo scale; vendor lock-in concerns; perf data shifts)

## Enforcement

- `pillar-1/tech-stack.md` updated to reflect deployment platform decision (lifecycle docs)
- `apps/admin/vercel.json` + `apps/admin/.vercel/project.json` (week-10 ship)
- `apps/skill-eval-worker/wrangler.toml` (existing per ADR-0005)
- New audit (week-10): `vercel-config-fresh` — verifies Vercel project config matches ADR-0024 spec
- New audit (week-10): `cloudflare-worker-config-fresh` — verifies Workers config matches ADR-0005 + ADR-0024

## Sources

- [Vercel Next.js docs](https://vercel.com/docs/frameworks/nextjs)
- [Cloudflare Workers + Pages Next.js compatibility](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- ADR-0001 stack pick (Next.js 15 + Cloudflare Workers)
- ADR-0005 sandboxed-skill-governance (skill-eval-Worker on Cloudflare)
- pillar-6/dashboards.md week-10 admin app plan
- audit-hub.md dashboard spec (S005 turn 26)
- User S005 turn 25 question — "will involving Vercel be useful? where are you creating the dashboards?"
