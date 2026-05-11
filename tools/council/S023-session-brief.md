# S023 Session Brief — Next Session Plan
## Written by: Sonnet Builder (closing S022) | 2026-05-11

---

## THE ONE SENTENCE

SONNET-S023: S022 closed (67 validators, bedrock 22/22, schema page live). Confirm domain choice (Business vs Personal) then build App #2 OR continue platform work. Read HANDOFF-S022-to-S023.md first.

---

## NORTH STAR ALIGNMENT

**CSPS North Star:** 30 governed SaaS apps, each reaching $1K MRR and graduating to standalone products. The platform provides the foundation — apps prove the value.

**S023 position in the arc:**
```
[S001-S014] Research + Foundation design
[S015-S018] First app scaffolded (task-mgmt) + ZenStack + methodology
[S019-S021] Enforcement uplift + drift coverage + core alignment
[S022]      ← Enterprise core COMPLETE. Sessions 0-D excellence COMPLETE.
[S023]      → App #2 BEGINS (or final platform polish before it)
[S024-S029] App #2 built, proven, reaching initial users
[S030+]     Graduation pattern validated. App #3 follows.
```

**Schema alignment (7 pillars → S023 priorities):**

| Pillar | S022 status | S023 priority |
|---|---|---|
| Pillar 0 — Governance | ✅ Complete | Maintain: 67 validators pass every session |
| Pillar 1 — Architecture | In progress | Core Primitives Phase 0 in progress (CCG gate active) |
| Pillar 2 — Data & Schema | ✅ Complete | Extend for App #2 domain entities |
| Pillar 3 — Platform Services | In progress | Solo user flow fix (GAP-A1) in App #2 |
| Pillar 4 — DX | 📋 Planned | **THIS IS S023** — App template fully operational |
| Pillar 5 — AI Systems | In progress | Opus review at S029 (7 sessions away) |
| Pillar 6 — Operations | In progress | Codespaces setup + graduation tracker |

---

## THE DECISION TREE (Governor resolves at S023 open)

```
OPTION A: App #2 BUILD (PE 6.8, Band-2 HIGH)
  Prerequisites: ✅ All met (Sessions 0-D complete, template scaffold exists)
  Domain choice: Governor decides from domain-taxonomy.md Tier 1:
    business → task management, CRM, invoicing (proven with task-mgmt)
    personal → health tracking, habits, journaling (tests solo user flow)
    social → community features (tests social domain)
    knowledge → notes, WisdomVault (tests AI integration)
  First action: Create PE-scored topic-plan for chosen app
  Time to first user: 3-5 sessions

OPTION B: Platform polish first (1 session) then App #2
  Remaining items:
    - validate-orphaned-processes.mjs TYPE-6/7 detection (Session C remainder)
    - validate-documentation-template.mjs (Session C planned)
    - AGENTS.md R1-only refactor (Opus Turn 2 recommendation)
  Advantage: cleaner foundation before App #2
  Disadvantage: delays first real user another session

RECOMMENDED: OPTION A — platform is enterprise-grade. Real user feedback > more polish.
```

---

## S023 EXECUTION PLAN (if Option A chosen)

### §PRE-IMPLEMENTATION PROTOCOL (mandatory — read all before starting)

1. READ `docs/plan/_handoff/VAULT/inner-ai-defaults/README.md` — load active overrides
2. READ `docs/plan/pillar-0-governance/pe-situation-registry.md` — confirm APP_BUILD_MODE active
3. RUN `node tools/validators/validate-session-harvest-readiness.mjs` — confirm S022 DONE
4. RUN `pnpm verify` → confirm exit_code=0 (67 validators)
5. READ `docs/plan/pillar-0-governance/domain-taxonomy.md` — for domain choice
6. READ `docs/plan/pillar-1-product/app-build-guide.md` (if exists) — build process

### CHECK WHAT EXISTS (§0 CONSOLIDATION CHECK)

Before building anything for App #2:
- Check apps/ directory — what's there?
- Check libs/integrations/ — what patterns can be reused?
- Check libs/config/ — what values need extending?
- Check apps/template/ — is the scaffold sufficient?
- Check docs/plan/pillar-1-product/ — what planning artifacts exist?

### STEP S23-1: App domain decision + topic-plan creation

Governor declares: "I choose [domain] for App #2"

Sonnet creates `docs/plan/_handoff/VAULT/topic-plans/app-[name]-plan.md` with:
- PE score (computed from B, D, I, Bn, PAS)
- §0 CONSOLIDATION CHECK (per validate-consolidation-check.mjs)
- §PRE-IMPLEMENTATION PROTOCOL
- §KH (know-how consultation)
- zf_required_level: 3
- ccg_assessment (for any new functional capabilities)
- depth_chosen: 4 (standard app build)
- Detailed session-by-session spec

### STEP S23-2: Fork apps/template/

```bash
# Copy template to new app directory
cp -r apps/template apps/[app-name]
# Configure .env.local with credentials
# pnpm exec prisma db push
# pnpm dev
```

### STEP S23-3: Extend schema for domain entities

Add domain-specific entities to libs/policies/schema.zmodel:
- Each entity extends Base (soft-delete) or AppendOnlyBase (immutable)
- @@allow("read", auth().tenantId == tenantId) minimum
- @@deny("delete", true) — soft-delete only
- Run: zenstack generate + pnpm verify + pnpm db:push

### STEP S23-4: Build domain-specific API routes

For each entity:
- POST (create) + GET (list) + PUT (update) + DELETE (soft)
- Each route: subscription check + ZenStack + AuditEvent
- Use @csps/integrations, @csps/config paths
- Q-04: any member can create; Q-05: admin+ can archive

### STEP S23-5: Solo user flow fix (GAP-A1 closure)

In libs/integrations/clerk/webhook-handler.ts user.created:
```typescript
// Auto-create personal org so solo users can immediately use the app
// (requires @clerk/backend SDK in libs/integrations — install first)
```

### STEP S23-6: Verify + ZF + Harvest (mandatory close gates)

```bash
pnpm verify                                    # 67 validators must pass
node tools/zf-orchestrator.mjs --level 3      # ZF ACHIEVED required
node tools/validators/validate-session-harvest-readiness.mjs  # HARVEST_DONE required
```

---

## WHAT MAKES S023 OPTIMAL

1. **Real users first** — Every session after App #2 has a live user to learn from
2. **Solo user flow fixed** — Fixes #1 conversion gap before first user ever sees it
3. **Platform inherits** — App #2 gets 67 validators, ZenStack, RLS, GDPR, audit — free
4. **Evidence-based** — App #2 will prove or disprove CCG scores, domain taxonomy, Core Primitives timing

---

## MECHANICALLY ENFORCED SESSION DISCIPLINE (reminder — now automated)

The following fire automatically without being asked:
- pnpm verify at every AI stop (post-stop-pnpm-verify.sh)
- pnpm zf:deep when close detected (post-stop-session-close-gate.sh)
- Harvest check on close (same hook)
- Advisory at >15 verify iterations without ZF deep (post-stop-pnpm-verify.sh)

**The AI cannot skip ZF or harvesting anymore. It's structural, not optional.**

---

*S023 Session Brief | 2026-05-11 | Sonnet Builder*
*North Star: 30 governed SaaS apps. S023 builds App #2.*
