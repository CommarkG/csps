---
name: EP-ERR-009
description: 'Error pattern registry: premature-done-on-tsc — declaring a build fix complete after tsc --noEmit passes without running the actual next build.'
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
id: EP-ERR-009
pattern_name: premature-done-on-tsc
first_observed: S039
recurrence_count: 1
trigger: Any build-fix directive resolved by running only `tsc --noEmit` without `pnpm --filter @csps/[app] build`
sample_incident: "Commit 6174a56 declared Budget Planner build clean after tsc --noEmit passed. Actual next build still failed due to webpack CJS/ESM module resolution errors and next.config.js issues not caught by tsc alone."
mechanical_prevention: Rule 11 in communication-protocol-shared.md — verification tail must include `pnpm --filter @csps/[app] build`
principle_reference: P-ARCH-031
related_error: EP-ERR-001
status: mechanically_prevented
session: S040
scope_level: S3
links:
  - { rel: related, href: EP-ERR-001-done-equals-committed.md }
  - { rel: prevention, href: ../../../../tools/council/communication-protocol-shared.md }
---

# EP-ERR-009 — Premature Done on TSC

**Training default:** Claude treats `tsc --noEmit` passing as proof that the build is fixed.

**CSPS override:** A build fix is DONE only when `pnpm --filter @csps/[app] build` completes without error. TypeScript type-checking is a necessary but insufficient condition.

**What tsc misses:**
- webpack module resolution failures (CJS `require()` of TypeScript ESM modules)
- Next.js config errors (next.config.js crashing at load time, not type-checked by tsc)
- Missing packages that are masked by type stubs in `deferred-packages.d.ts`
- Dynamic import resolution failures at bundle time

**Prevention:** Rule 11 in [communication-protocol-shared.md](../../../../tools/council/communication-protocol-shared.md) — every build-related directive verification tail must include `pnpm --filter @csps/[app] build → 0 errors`.

**Enforcement trio status:**
- T1: none (future: hook detecting build-fix directives without `next build` in verification tail)
- T2: this EP-ERR registration (visible in error-registry-coverage validator)
- T3: Rule 11 in communication-protocol-shared.md (session-injected context)
