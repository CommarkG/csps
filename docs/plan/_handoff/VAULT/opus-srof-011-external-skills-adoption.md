---
id: csps.handoff.vault.opus-srof-011-external-skills-adoption
name: opus-srof-011-external-skills-adoption
description: >
  SROF-011: Deep dive on localizing external skills/agents safely.
  When to adopt vs build, safe absorption pipeline, never in core,
  external resource usage framework, sweet spot of absorption.
  PE=68. Prepared S028. Governor directive while working on Vercel.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
core_spines: [AI, GVRN, ARCH]
schema_anchor: opus_consultations
diataxis_type: explanation
session: S028
scope_level: S1
pe: 68
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: sandboxed-skill-governance, href: ../../pillar-3-platform-services/sandboxed-skill-governance.md }
  - { rel: aap, href: ../../pillar-0-governance/agent-alignment-protocol.md }
  - { rel: mastra-setup, href: ../../pillar-5-ai-systems/mastra-setup.md }
---

# SROF-011: External Skills & Agent Adoption Architecture
## Safe Absorption Without Core Contamination
## PE=68 | Scheduled S028 | Governor directive

> **Governor's questions:**
> - Localizing external skills/agents: find them, want their qualities, but under NO condition let them into the core
> - How and when can we use external resources safely?
> - When is it useful to avoid refining everything in-house?
> - What's the sweet spot of absorption?
> - How can the platform help within predefined pipelines?

---

## §A — What CSPS Already Has

### A.1 — The Existing Safety Architecture

**sandboxed-skill-governance.md** — the primary document. Defines:
- Tier 1 (Quarantine): external skill under evaluation, isolated execution
- Tier 2 (Vendored): vetted, copied into CSPS, dependencies frozen
- Tier 3 (Platform-owned): fully absorbed, maintained by CSPS team

**Agent Alignment Protocol (AAP)** — Class A/B/C/D:
- Class A: CSPS-native skills (SKILL.md with full frontmatter)
- Class B: Claude Code built-in subagents (alignment preamble required)
- Class C: Mastra runtime agents (capability + composition enforcement)
- Class D: Third-party (Quarantine → Vendored → Platform-owned)

**The current gap:** The Quarantine → Vendored → Platform-owned pipeline is DOCUMENTED but not MECHANICALLY ENFORCED. There's no validator that blocks Class D agents from being invoked without completing the quarantine step.

---

## §B — The Core Contamination Problem

### B.1 — What "Entering the Core" Means

The CSPS core (scope_level: S0/S1) consists of:
- `libs/policies/` — schema + security (S0/S1)
- `packages/principles/` — principles registry (S0)
- `.claude/hooks/` — behavioral enforcement (S0)
- `docs/plan/pillar-0-governance/` — governance doctrine (S0)
- `tools/validators/` — platform validators (S1)

**An external skill "enters the core" when:**
1. Its code modifies S0/S1 artifacts directly
2. Its output is used to generate S0/S1 artifacts without review
3. Its principles replace or contradict CSPS principles
4. It has write access to governance artifacts

**An external skill "stays outside the core" when:**
1. It operates within S2/S3 (app-specific, tenant-specific)
2. Its outputs are reviewed before touching S0/S1
3. Its principles are explicitly mapped to CSPS equivalents
4. It runs in Quarantine context (no direct write access)

### B.2 — The Absorption Spectrum

```
PURE EXTERNAL → QUARANTINE → VENDORED → ADAPTED → PLATFORM-OWNED → CORE NATIVE
  (blocked)      (isolated)   (frozen)  (modified) (maintained)     (sealed)
```

Each stage has different risks and checks. The Governor wants to know: **what's the sweet spot?**

---

## §C — When to Adopt External vs Build In-House

### C.1 — The Build-vs-Adopt Decision Tree

```
Does CSPS already have this capability? → YES: enhance what exists (P-OP-001 reuse-first)
                                        ↓ NO
Is the capability S0/S1 (constitutional/platform)?
  → YES: build in-house (core cannot be externally sourced)
  ↓ NO (S2+ scope)
Does an external solution exist that:
  a) Has quality evidence (stars, maintenance, community)?
  b) Has compatible licensing (MIT, Apache — not GPL for embedded)?
  c) Has alignment with CSPS principles (not contradicting)?
  → YES on all 3: adopt via Quarantine pipeline
  ↓ NO on any
Build in-house or defer
```

### C.2 — Categories Where External Makes Sense

**S2/S3 scope where external is appropriate:**
- UI component libraries (shadcn — already in stack)
- Stripe, Clerk, Supabase SDKs (managed in libs/integrations — vendored)
- Mastra (already vendored as the agent runtime)
- Test frameworks, linting tools

**Categories where external is NEVER appropriate (S0):**
- Behavioral contracts (B_* — must be CSPS-native)
- Core principles (P-* — must be CSPS-native)
- Governance validators (validate-*.mjs — must be CSPS-native)
- AI behavioral overrides (inner-ai-defaults — must be CSPS-native)

**The sweet spot for external adoption:**
- **Layer:** S2 (app-specific) and S3 (tenant-specific) infrastructure
- **Type:** Well-maintained libraries with frozen versions (not dynamic dependencies)
- **Integration:** Through libs/integrations/ (vendored, reviewed, tested)
- **Not:** Direct calls from app code to external AI services without governance wrapper

### C.3 — When External Resources Save Time

**External beats in-house when:**
1. The capability is a standard problem with a standard solution (auth → Clerk)
2. The maintenance burden would exceed the governance benefit
3. The external solution is battle-tested at scale (Supabase → 100k+ customers)
4. The integration can be isolated behind a CSPS wrapper (libs/integrations/)

**In-house beats external when:**
1. The capability is core to CSPS's unique value (governance, behavioral enforcement)
2. The external solution would create S2 logic in S0 territory
3. The external solution contradicts CSPS principles
4. The capability is 30 lines of code that we can own forever

---

## §D — The Safe Absorption Pipeline (Platform Service)

### D.1 — Proposed Pipeline as Platform Feature

`tools/scripts/absorb-external-skill.mjs` — a platform script that:

1. **Intake:** accepts GitHub URL or npm package + purpose description
2. **Alignment Check:** maps external skill's capabilities to CSPS contracts
   - "Does this skill do X? CSPS has B_X for that."
   - "Does this skill assume Y? CSPS principle P-Y contradicts that."
3. **Quarantine deploy:** runs skill in isolated container (no file access)
4. **Test matrix:** runs 5 test cases from CSPS sample-library against it
5. **Alignment report:** generates frontmatter + scope_level for the adapted version
6. **Governor decision:** PCR — adopt as Tier 2 / adapt + adopt as Tier 3 / reject

**The key principle:** External skills never REPLACE. They INFORM. The CSPS team decides what to absorb, rewrite, or reject.

### D.2 — Platform Pipelines for Safe Use

**Pipeline 1: Read-only consultation**
```
External AI service → CSPS wrapper → read-only response
                   ← Governor reviews ← context injection
                   ← Sonnet interprets per CSPS principles
```
Use case: "Ask GPT-4 what it would do differently" → Governor evaluates → Sonnet decides if CSPS agrees.

**Pipeline 2: Skill quality evaluation**
```
External skill → Quarantine container → 5 alignment tests → 
  alignment_score: [0-100]
  if score > 80: propose Tier 2 adoption
  if score 50-80: propose adapt + adopt
  if score < 50: reject with specific conflicts documented
```

**Pipeline 3: Library absorption**
```
npm package → security audit (npm audit) → license check →
  CSPS wrapper (libs/integrations/{name}/) →
  version frozen in package.json →
  validate-layer-boundary.mjs gates imports →
  Governor approves the wrapper API
```

---

## §E — The "Never in the Core" Enforcement

### E.1 — What "Never in the Core" Means Mechanically

**Current enforcement:**
- `validate-layer-boundary.mjs` — blocks S1 (libs/) from importing S2 (apps/)
- `validate-laptop-patterns.mjs` — blocks local dev patterns in procedure docs

**Missing enforcement:**
- No validator checks if external code appears in S0 governance artifacts
- No validator checks if an external principle is being applied without CSPS mapping
- No validator blocks a new validator from calling external APIs directly

**Proposed:** `validate-core-contamination.mjs`
- Scans `.claude/hooks/*.sh` for calls to external APIs
- Scans `tools/validators/*.mjs` for `fetch()` or `http.get()` (validators shouldn't call external)
- Scans `packages/principles/principles.yaml` for principles citing external sources as canonical
- BLOCKING for: external API calls in hooks/validators

---

## §F — 12 Questions for Opus Review

1. The Quarantine → Vendored → Platform-owned pipeline is documented but not enforced. Should `validate-quarantine-compliance.mjs` be built to block Class D agents that haven't completed the pipeline?

2. "Never in the core" — is this S0 (constitutional: no external code ever touches S0) or S1 (platform-wide: external code may touch S1 if properly wrapped)?

3. The sweet spot for external adoption appears to be S2 infrastructure behind CSPS wrappers. Is this the right boundary, or should CSPS control more of S2 in-house?

4. Mastra is already vendored as the agent runtime. When Mastra releases breaking changes, how does CSPS decide to absorb vs. maintain a frozen fork?

5. The proposed `absorb-external-skill.mjs` pipeline — is this PE-worthy to build now (PE=68 from Governor request), or should it wait until there are concrete external skills to absorb?

6. External AI services (GPT-4, Gemini, etc.) are VAULT_DEFER by default in CSPS. Under what conditions, if any, should CSPS permit external AI service calls? What governance would be required?

7. The alignment test matrix (5 cases from sample-library) — is this sufficient to determine if an external skill aligns with CSPS? What would a false-negative look like?

8. Community skills (npm packages, GitHub repos) vs. enterprise skills (commercial SDKs) — should they have different absorption pipelines and governance requirements?

9. The "qualities of external skills" the Governor wants to adopt — most of these qualities are already encoded in CSPS's inner-ai-defaults and principles. Is the real need a better discovery mechanism for CSPS's own capabilities?

10. Anti-pattern detection: some external skills would look aligned on the surface but violate CSPS principles under pressure (like local dev patterns that look reasonable). How does the alignment test catch this?

11. When a vendored library receives a security update, CSPS currently has no automated mechanism to flag and review the update before applying it. Should this be added to the absorption pipeline?

12. The platform's value proposition to external developers: "your app inherits all platform guarantees." If platform absorbs an external skill with different guarantees, does that dilute the platform's promise?

---

## One Sentence for Opus (SROF-011)

**CSPS has the Quarantine→Vendored→Platform-owned pipeline documented in sandboxed-skill-governance.md and Class A/B/C/D classification in AAP, but no mechanical enforcement blocks Class D invocation before quarantine completion, and no automated absorption pipeline exists for evaluating external skills against CSPS principles — the Governor asks: when is external better than in-house (answer: S2 infrastructure behind CSPS wrappers, never for S0/S1 governance), what's the sweet spot (answer: well-maintained libraries with frozen versions absorbed through libs/integrations/), and how can the platform assist (answer: build absorb-external-skill.mjs with 5-test alignment matrix + validate-core-contamination.mjs) — but the constitutional question is whether the "never in core" boundary is structurally enforced (requiring validate-core-contamination.mjs as BLOCKING) or governance-enforced (current state: behavioral contract only).**

*SROF-011 | PE=68 | Prepared S028 | Governor directive: "localizing skills/agents safely"*
