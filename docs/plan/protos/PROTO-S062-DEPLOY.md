---
id: csps.protos.PROTO-S062-DEPLOY
name: PROTO-S062-DEPLOY
description: "S062-DEPLOY: 3-step deploy readiness — Component B validator + .env.example ANTHROPIC_API_KEY + Vercel deploy-checklist. Converts Vercel connect from 30-min debug to 5-min paste."
type: proto
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S062
core_spine: OPER
schema_anchor: protos
consolidation_cross_refs:
  - apps/template/.env.example
  - apps/debt-collection/.csps/deploy-checklist.md
  - tools/validators/validate-app-deploy-readiness.mjs
  - docs/plan/pillar-0-governance/external-integrations/vercel.md
---

# PROTO-S062-DEPLOY

**STATUS: ACTIVE** | Session S062-C5 | Sonnet-10 builds

---

## WHY THIS PROTO

PROTO-S062-K wet trial surfaced two deploy blockers:
- **E2E-BLOCKER-1**: apps/template missing deploy-readiness validation (Component B gap)
- **E2E-BLOCKER-2**: apps/template/.env.example missing ANTHROPIC_API_KEY — every new developer discovers this manually at first deploy

Without this proto, the Vercel connect requires 30 min of debugging. With it: 5-min paste-and-click.

---

## STEPS

### STEP 1 — validate-app-deploy-readiness.mjs (Component B)

**File:** `tools/validators/validate-app-deploy-readiness.mjs`

**What it checks (per app in apps/):**
1. `.env.example` exists (developers know what vars to set)
2. `.csps/deploy-checklist.md` exists (Vercel UI steps)
3. `package.json` has build script (required for Vercel build)
4. No `.env.local` committed (secret hygiene gate)

**Registration:** Add to `tools/verify.mjs` validator list — advisory (not blocking in week-1 since playground may not have all assets)

**ZF gate:** validator runs, reports missing items per app, exits 0 (advisory)

---

### STEP 2 — apps/template/.env.example update

**File:** `apps/template/.env.example`

**Change:** Add ANTHROPIC_API_KEY block after Stripe section:
```
# Anthropic AI (Claude API) — https://console.anthropic.com
# Required for AI features. Get key at: console.anthropic.com → API Keys
ANTHROPIC_API_KEY=sk-ant-...
```

**Why this is Component B:** survives `rm -rf apps/debt-collection/` — it lives in apps/template, inherited by all future apps

---

### STEP 3 — apps/debt-collection/.csps/deploy-checklist.md

**File:** `apps/debt-collection/.csps/deploy-checklist.md`

**Content:** 7-step Vercel UI sequence (from Gate 3 memory + vercel.md):
1. Connect GitHub repo
2. Select framework: Next.js
3. Set Root Directory: `apps/debt-collection`
4. Enable "Include source files outside of Root Directory"
5. Set env vars from .env.example
6. Click Deploy
7. Post-deploy: configure custom domain + webhook URLs (Clerk/Stripe)

**Why this is NOT Component B:** lives in apps/debt-collection/.csps/ (app-scoped, ephemeral by P-ARCH-030). The TEMPLATE is Component B; the instance is acceptable as ephemeral.

---

## COMMIT SEQUENCE

```
feat: validate-app-deploy-readiness.mjs — Component B deploy gate (PROTO-S062-DEPLOY STEP 1)
feat: apps/template/.env.example — add ANTHROPIC_API_KEY (PROTO-S062-DEPLOY STEP 2)
feat: apps/debt-collection deploy-checklist.md — 7-step Vercel UI (PROTO-S062-DEPLOY STEP 3)
```

---

## ZF GATE (post-STEP 3)

- `node tools/verify.mjs 2>&1 | tail -30` → exit_code=0
- ZF Cycle 2 cites: validate-app-deploy-readiness.mjs output + .env.example ANTHROPIC line + deploy-checklist first 3 steps
