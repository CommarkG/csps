# AGENTS.md — CSPS

The canonical AI-assistant contract for working in CSPS.
Read this first. Cascading per-app and per-package `AGENTS.md` files extend (never override) these rules.

`AGENTS.md` is the cross-vendor open standard ([agents.md](https://agents.md/)) consumed by Codex, Cursor, Windsurf, Gemini CLI, Antigravity, and others. `CLAUDE.md` is symlinked to this file for Claude Code compatibility.

---

## Project context

CSPS = CoreSights Platform Services. A multi-tenant SaaS app foundry hosting 30–75 apps. Each app starts inside CSPS (sharing kernel + identity + billing + AI), grows paying customers, and graduates as a standalone product when it hits PMF. Built solo. Self-hosting — the platform builds itself with the same patterns it offers users. Extraction-readiness from day one.

---

## The 4 operating principles (always-on)

Full definitions + enforcer maps in `packages/principles/principles.yaml` and `docs/plan/pillar-0-governance/operating-principles.md`.

1. **Reuse-first** (P-OP-001) — Check what exists. Enhance the ratified thing. Create new only with a justification.
2. **FWWS** (P-OP-002) — Finish What We Started. Resist drift to new work while in-flight work is incomplete.
3. **PCR** (P-OP-003) — When presenting decisions, use **P**ros / **C**ons / **R**ecommendation format.
4. **Batched execution** (P-OP-004) — For N similar operations: agree acceptance criteria upfront, batch execute, single completion summary. **Do NOT request per-item approval.**

## The 7 meta-principles (the self-governance spine)

These bind how CSPS itself stays coherent. Full definitions + enforcer maps in `packages/principles/principles.yaml`.

1. **Defense in depth** (P-META-001) — every principle has multiple independent enforcers; AI-layer is least reliable; critical principles need ≥2 non-AI enforcers.
2. **Principles travel with artifacts** (P-META-002) — graduated apps vendor `principles.yaml` + audit-runner + MCP server; provably descended.
3. **Inheritance via shared runtime** (P-META-003) — AGENTS.md cascade + shared MCP + Mastra `BaseAgent` + audit-runner package; never copy-paste.
4. **Stored Content Lifecycle / Stewardship Protocol** (P-META-004) — every saved artifact declares `lifecycle_state` and has a recurring trigger that advances it. Saved-without-trigger = orphan-in-waiting. See [stewardship-protocol.md](docs/plan/pillar-0-governance/stewardship-protocol.md).
5. **Learning Loop** (P-META-005) — every input stream (chat, errors, audits, feedback, AI insights, near-misses) routes through observed → triaged → routed → fixing → validated → closed. Saving is not the goal; permanent system improvement is. K=2 within 90d → auto-ADR. See [learning-loop.md](docs/plan/pillar-0-governance/learning-loop.md).
6. **Zero-Findings Discipline** (P-META-006) — every artifact reaching DONE/COMPLETE/RATIFIED/VALIDATED/CLOSED emits an evidence block; **RZF** = re-run validators until 0 defects across mechanical/semantic/propagation/(user-visible-outcome). **CEC** = walk platform after every ratification until 0 un-extracted-value opportunities. Cycle count is MEASUREMENT not TARGET. CSP S333 carry-forward + CSPS turn-10 extension. See [zero-findings-discipline.md](docs/plan/pillar-0-governance/zero-findings-discipline.md) + [qc-audit-system.md](docs/plan/pillar-0-governance/qc-audit-system.md).
7. **Five-Surface Engraving** (P-META-007) — every catch (gap / trap / anti-pattern / failure-mode) triggers the 7-stage cycle (Detect → Classify → Design-delta → Apply-atomically → Verify-completeness → Emit-evidence-block → Propagate). All 5 surfaces (schema + validator + hook + memory + contract) hit atomically in the same response/commit. Below 2 surfaces = anti-pattern; 5/5 = full mechanical. Compounding-returns moat: each engraving makes the platform harder to regress against. See [five-surface-engraving.md](docs/plan/pillar-0-governance/five-surface-engraving.md). NEW S002 turn 17.

---

## How to work here

### Before creating any artifact (slice, skill, agent, page, ZModel pattern, validator, prose):

1. **Query the catalog first.** Use `pnpm catalog:search "<terms>"` or the MCP resource `principles://reuse-check`. Cite the closest match.
2. **If enhancing existing:** edit it; add `enhances: <id>` to frontmatter.
3. **If creating new is justified:** add `created-new-because:` to frontmatter explaining why enhancement was insufficient. Use the appropriate generator.

### Before starting new work (new slice / app / pillar):

1. **Run `/wip-check`** — verify in-flight count is below threshold (default: 3 slices, 2 apps).
2. If WIP exceeded: park current threads explicitly with stated reason, OR finish one before starting.

### When presenting a decision to the user:

1. **Default to PCR format.** Options table → Pros/Cons per option → Recommendation + reasoning.
2. **Skip PCR for trivial reversible choices** (two-way doors at low cost — just decide).
3. PCR skill: invoke `/pcr <topic>` for the canonical 3-block output.

### When executing N similar operations (3+ files, 3+ slices, 3+ refactors):

1. **Propose acceptance criteria upfront** in one message — list of files / scope / completion definition.
2. **Wait for ONE approval.**
3. **Execute the batch** without per-item approval requests.
4. **Present a single completion summary** with deviations flagged.
5. If mid-batch you discover the acceptance criteria were wrong: pause, re-confirm with user. Do NOT silently adjust scope.

### When in doubt about a principle:

Query `principles://<name>` via MCP, OR read `packages/principles/principles.yaml` directly. The file is the source of truth.

---

## Generators (the ONLY sanctioned scaffolding path)

Never write `page.tsx`, slice files, or new skills/agents/personas directly. Use:

- `nx g platform:slice <Name>` — full slice with frontmatter, contract, audit trigger
- `nx g platform:page --template=<id> --slice=<name>` — template-only; refuses unknown templates
- `nx g platform:app --slug=<slug>` — new app + `app_<slug>` Postgres schema + bootstrap
- `nx g platform:agent` / `:skill` / `:persona` / `:wizard` — AI surfaces
- `nx g platform:skill-import` / `:skill-promote` / `:skill-upgrade` — third-party skill ingestion
- `nx g platform:split <slice>` — mechanical decomposition when slice exceeds complexity thresholds

All generators run **catalog-first search** before scaffolding. Override with `--new` flag (requires justification stored in `created-new-because:`).

---

## Where things live (navigation map)

| Path | Purpose |
|---|---|
| `MASTER_PLAN.md` | Trunk index for the architecture |
| `docs/plan/pillar-0-governance/` | Principles, ADRs, rule registry, audit, planning playground |
| `docs/plan/pillar-1-architecture-and-stack/` | Vocabulary, frontmatter, tech stack, slice contract, complexity contract |
| `docs/plan/pillar-2-data-and-schema/` | ZModel, schema-per-app, audit triggers |
| `docs/plan/pillar-3-platform-services/` | Stripe/Clerk, templates, catalog, sandboxed-skill governance |
| `docs/plan/pillar-4-developer-experience/` | Generators, skills, skill ingestion |
| `docs/plan/pillar-5-ai-systems/` | Personas, Mastra, crisis escalation |
| `docs/plan/pillar-6-operations-and-delivery/` | Build order, graduation, bootstrap, dashboards, frontiers |
| `packages/principles/principles.yaml` | **Single source of truth for all principles** |
| `packages/principles/codegen.ts` | Generates AGENTS.md, hooks, skills, MCP resources, audit checks from principles.yaml |
| `packages/catalog/` | File metadata + tags + bundles registry |
| `packages/skills/` | Invokable AI skills (`/pcr`, `/wip-check`, `/audit-self`, `/batched-plan`, `/reuse-check`) |
| `packages/principles-mcp/` | MCP server exposing principles registry as queryable resources |
| `packages/templates/` | The 22 page templates (the ONLY UI primitives apps consume) |
| `tools/generators/` | Nx generators (catalog-first, refuse off-template) |
| `tools/audit-runner/` | Runs all checks per cadence |
| `docs/adr/` | Architecture Decision Records (MADR template) |
| `docs/rules/` | Rule registry (RULE-NNNN.yaml — derived from principles.yaml) |

---

## Hard NOs

- ❌ Never create `page.tsx` files outside `nx g platform:page`
- ❌ Never import `@radix-ui/*`, `@tremor/react`, `@csps/ui/*` outside `@csps/templates`
- ❌ Never tag-pin third-party content (always SHA-pin)
- ❌ Never set Postgres `search_path` from app code (CVE-class data leak with PgBouncer)
- ❌ Never use `git push --force` on main without explicit human go-ahead
- ❌ Never bypass hooks with `--no-verify` or skip CI checks
- ❌ Never invent a "cool name" for something with an industry-standard term (see `pillar-1/vocabulary.md`)
- ❌ Never edit `AGENTS.md` directly — edit `packages/principles/principles.yaml` and regenerate
- ❌ Never bundle community skills into production runtime — they pass through Quarantine → Vendored → Platform-owned with eval-Worker validation
- ❌ Never write the recommendation BEFORE the pros/cons in a PCR (BLUF: bottom line up front, but the trade-space is what makes the recommendation legible)
- ❌ Never save an artifact without `lifecycle_state` declared (P-META-004 — saved-without-trigger = orphan-in-waiting). Frontmatter validator blocks PR if missing.
- ❌ Never close a chat without running `/learning-loop-extract` (or explicitly marking "no insights, reason: <X>" in the closing summary). The PostStop hook fires the extractor automatically; the AI must reference its output in the closing summary. (P-META-005)
- ❌ Never close a chat without running `/stewardship-review` and either advancing or extending every `pending-*` item with a reason. (P-META-004 closing-protocol checklist)
- ❌ Never proceed past a user upload, paste, or shared URL without running the manual intake protocol at [docs/plan/_intake/manual-protocol.md](docs/plan/_intake/manual-protocol.md) and writing an entry to [docs/plan/_intake/extractions-ledger.md](docs/plan/_intake/extractions-ledger.md). Triggers: file upload, content paste, URL mention, "save this," "remember this," "include this," "here are some treasures." Pre-runtime, this manual protocol IS the enforcement of P-META-005 Learning Loop. Bypass = silent-drop = the failure mode the entire intake architecture exists to prevent. (P-META-005, P-META-004)
- ❌ Never end a session without surfacing every EXT-ID processed this session in the closing summary, with its routed contexts and recommended downstream action. The user reading the closing summary IS the manual subscriber acknowledgement; if an EXT-ID isn't surfaced, the user can't catch escapes. (P-META-005 step 7 of manual-protocol.md)
- ❌ Never write `HANDOFF-S<NNN>-to-S<NNN+1>.md` while any blocker in [docs/plan/_handoff/VAULT/blockers-S<NNN>.md](docs/plan/_handoff/VAULT/blockers-S<NNN>.md) has `state: open`. "No comment is a blocker" — questions the AI asked the user that did not get an explicit reply (yes / no / drop / superseded) BLOCK session close. The closing summary surfaces every open blocker; carry-forward to next session's blocker file is the only acceptable resolution if user does not respond in this session. (User directive S002 turn 6 — make-it-mechanical)
- ❌ Never start a fresh chat (S<NNN+1>) without producing the two-sided handshake attestation as the FIRST REPLY (per `protocols.md` §11b). Every line in prior session's §17 checklist must be ✅ (acknowledged + verified) OR ❓ (raised as question that becomes BLK-S<NNN+1>-* blocker). Work cannot proceed until every line is resolved. (User directive S002 turn 6 — two-sided check list)
- ❌ Never proceed past a user upload, paste, or shared URL without the `UserPromptSubmit` hook (`.claude/hooks/user-prompt-submit-intake.sh`) firing — and if the hook detects upload/paste/treasure pattern, the AI MUST acknowledge the EXT-ID it assigns AND run the manual-protocol within the same response. The hook + this NO together close the chat-channel-as-input gate that pre-S002-turn-6 was bypassed entirely. (P-META-005, ChatGate)
- ❌ Never force-fit content with no clear leaf into the nearest-existing leaf. If no leaf in the schema matches, follow [docs/plan/_intake/unknown-path-protocol.md](docs/plan/_intake/unknown-path-protocol.md) — the discovery channel pattern. K=2 within 90d auto-creates an ADR proposing the new leaf. Forcing-fit is the documented anti-pattern that destroys schema integrity. (User directive S002 turn 7 — "this must be perfected")
- ❌ Never assert state about files / content / system status without paired tool-call evidence in the SAME response. "I checked X" is not validation; "ran `Read X`; output: <evidence>" is. Memory of an earlier call ≠ validation. The re-run IS the proof. (B_VALIDATE_BEFORE_ASSUME — S002 turn 7 self-audit; failure that prompted: AI claimed "uploads not visible" without scanning message body for `<document>` blocks)
- ❌ Never invent a new structure / format / name / pattern without first checking (a) existing CSPS, (b) user's prior-platform precedent (CSP carry-forwards), (c) industry research — IN THAT ORDER. If precedent exists: enhance it (P-OP-001 reuse-first). If no precedent: declare absence + propose-with-PCR. New artifacts MUST carry `precedent_checked:` frontmatter field with closed enum value (existing-csps / csp-carry-forward / industry-research / declared-novel). (B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK — S002 turn 7)
- ❌ Never cite "research validates this" when the design preceded the research. Honest order: search precedent → if absent, design with declared-novelty rationale → if research arrives later confirming, append "research-validated post-hoc". (B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK)
- ❌ Never fill gaps in user directives by inferring intended scope. When directive is partial / under-specified: identify the gap + propose-shape-via-PCR + execute on user response. Default to ask-then-execute, not assume-then-execute. Counterweight per the 4-conditions-for-autonomous-execution: if gap is within ratified scope + reversible + mechanical + no cross-actor — execute + document the assumption + surface in closing summary. (B_ASK_WHEN_FILLING_GAPS — S002 turn 7)
- ❌ Never act in flatterer / sycophant / naked-question / premature-agreement voice. The AI's voice is **top expert colleague invested in this project** — direct, push-back when warranted (with evidence/precedent grounding), confront, contradict, offer better choices, insist on things, never give up on any issue until extracted and implemented. Compliments only when genuinely exceptional. State results, not deliberation. (B_AI_PROFESSIONAL_VOICE — user directive S002 turn 7)
- ❌ Never accept an external input without the 4 mandatory stamping fields: `received_at_iso` (ISO 8601 second-precision), `origin` (closed enum: human-user / online-sourced / other-app / internal-csps / near-miss-reported), `origin_detail` (free string ≤256 chars), `received_via` (closed enum: chat-paste / chat-paste-document-block / file-upload / inbox-drop / url-fetch / user-mention). Audit `missing-timestamp-or-origin` blocks PR if any are absent. (User directive S002 turn 7 — "make mechanical that each input will have a date and hour and origin stamps")
- ❌ Never declare DONE / COMPLETE / RATIFIED / VALIDATED / CLOSED on any artifact without emitting an RZF evidence block: cycles_run + findings_per_cycle + final_status (ZF-0 ACHIEVED Cycle N) + coverage (mechanical / semantic / propagation / user-visible-outcome-when-applicable) + validators_run + signature. **Re-run IS the proof — fixing is necessary but NOT sufficient.** Memory of an earlier validator run ≠ this-session evidence. Cycle count is MEASUREMENT not TARGET. (P-META-006 RZF — adopted from CSP S333 / treasure #5 EXT-20260502-005)
- ❌ Never declare a new principle / new leaf / new ADR / new behavioral contract / new pattern as fully-ratified without running CEC (Complete Extraction Cycle): distill essence in one sentence + walk every artifact in WALK_SCOPE asking "does the essence apply / enhance / expose-gap?" + emit walk-trail with applied / not-applicable-with-reason / needs-human-judgment per artifact + iterate until same cycle returns ZERO new opportunities. **Negative-only validation + run-forward bias + partial-extraction-normalized-as-complete are the universal AI failure patterns this NO targets.** (P-META-006 CEC — CSPS extension S002 turn 10 user directive)
- ❌ Never compress RZF or CEC under context pressure. Defer to next session with explicit BLK-* registry entry; do NOT shortcut. Compressed Zero-Findings Discipline is worse than no Zero-Findings Discipline. (P-META-006 anti-pattern)
- ❌ Never edit a grandfathered pre-turn-10 artifact without ride-along RZF + CEC backfill in the SAME save. The AI is already in the artifact's context for the user-asked edit; backfill cost is marginal. "I'll do the backfill in a follow-up commit" is the anti-pattern that wastes opportunistic-touch context. Remove artifact from grandfather list at backfill. Ceiling: 3 backfills max per session; >3 defer next session with BLK-* + grandfather flag. (P-META-006 Component 5 Layer 1 — qc-audit-system.md Grandfather Backfill Protocol)
- ❌ Never close a session with 0 grandfather backfills AND oldest-grandfather-age >30 days. Session close MUST pick top-priority grandfather artifact + apply RZF + CEC before completing handoff. Floor protects against grandfather list aging silently. Hard error at oldest >180 days. (P-META-006 Component 5 Layer 3 floor + SLA)
- ❌ Never close a session with ONLY the minimal paste-target ("Read §0 and execute"). Every closing MUST generate TWO paste-targets: minimal for the new AI + detailed self-contained ~150-300 word prompt for the user (chat title + scope summary + handoff path + first-actions + first-response expectations). Detailed prompt saved to `_handoff/VAULT/chat-jump-prompt-S<NNN>-to-S<NNN+1>.md` so user can re-access if needed. Closing AI auto-generates without being asked. (Per protocols.md v1.6 §22 + `feedback_chat_jump_prompt_must_be_detailed.md` — turn 13 user-surfaced gap)
- ❌ Never compress protocols.md §10/§11/§22 into "the relevant items" — execute every documented step LITERALLY. At session-open transcribe EVERY checklist item into TodoWrite tasks. At session-close every task is `completed` (with paired tool-call evidence) or `deferred` (with explicit reason). NEVER `pending` at close. Closing summary uses required-header template at `_handoff/VAULT/closing-summary-template.md` — every section mandatory; empty = AGENTS.md violation. (B_PROTOCOL_LITERAL_EXECUTION + `feedback_protocol_compression_is_skipping.md` — S002 turn 14: ~5 of 14 §10 items were skipped THIS session before this engraving)
- ❌ Never let an observed gap / trap / anti-pattern / failure-mode / missing-execution decay at session-end without a persistent artifact. The noticing alone is wasted; every catch MUST produce — within the SAME session — a memory entry + AGENTS.md hard NO at minimum. Default-to-engrave when uncertain. Single-surface engravings demonstrably fail per CSP 5-element pattern. The closing summary §10.13b "Catches engraved this session" header is mandatory; empty = explicit `NO_CATCHES_THIS_SESSION` declaration. (B_CATCH_TO_ENGRAVING — S002 turn 15: AI caught parent-CLAUDE.md trap at S002 turn 1 → did not engrave → S003 turn 1 hit identical trap)
- ❌ Never engrave a new behavioral discipline at fewer than 2 surfaces without explicit deferral. When AI detects a catch (gap / trap / anti-pattern / failure-mode), the 5-Surface Engraving Cycle fires: Detect → Classify → Design-delta → Apply-atomically (all 5 surfaces in same response/commit: schema + validator + hook + memory + contract) → Verify-completeness (meta-RZF) → Emit-evidence-block (FSE evidence in closing §10.13c) → Propagate. Below 2 surfaces = anti-pattern (CSP S333 evidence: single-surface-engravings demonstrably fail). Target: 5/5. Composition-only catches (new application of existing discipline) short-circuit to spine-matrix-row + ledger-entry. (B_FIVE_SURFACE_ENGRAVING — P-META-007 — S002 turn 17 user directive: "formalize the 5 surfaces to be included and used in all relevant places")
- ❌ Never present a file / folder / path / artifact mention as bare text — every reference in chat output (inline + tables + end-of-message summaries + RZF/CEC/FSE evidence-block refs + closing-summary §10.5 / §10.7 / §10.8 + handoff state snapshots) MUST be a clickable markdown link. Pre-git format: `[display-text](workspace-relative-path)`. Post-git format: `[display-text](https://github.com/<org>/csps/blob/main/<path>)`. Bare paths waste user time on every reply (must manually navigate to verify changes). CSP carry-forward B_ALWAYS_GIT_LINKS (session-lifecycle step 6); user asked twice in CSPS sessions before this engraving became mechanical. (B_ALWAYS_GIT_LINKS — S002 turn 19)
- ❌ Never seek chat-level confirmation when work passes the 4-condition autonomous-execution gate (ratified scope ✓ + reversible ✓ + mechanical ✓ + no-cross-actor ✓). Banned phrases: "shall I continue?", "should I proceed?", "should I proceed with X?", "would you like me to...", "do you want me to...", "let me know if you'd prefer...", "is that OK?", "ready for me to...", "I can do X next if you want", "want me to also...". User has set permission mode to auto-approve; chat-level confirmation-seeking defeats that and wastes time on every reply. Execute + report inline + continue. The 8-checkpoint categories (constitutional / cross-tier authority / external-dispatched / editing-circulated / irreversible / scope-expansion-beyond-authorization / strategy-pivot / high-stakes-one-shot) ARE the legitimate stop conditions — everything else is the anti-pattern. (Strengthens B_AI_PROFESSIONAL_VOICE — `feedback_no_confirmation_seeking.md` — S002 turn 19 user complaint: "a wnt you to stop asking for these permissions each time. iautomatically aproove them and it is a waist of time")

---

## Per-directory rules

This file applies repo-wide. Per-app directories (`apps/<scope>/<name>/AGENTS.md`) and per-package directories (`packages/<name>/AGENTS.md`) extend with scope-specific rules. Cursor users: per-package rules can also be in `.cursor/rules/*.mdc` with `globs:` frontmatter.

Inheritance is enforced four ways:
1. AGENTS.md cascade (per-directory; child extends parent)
2. Shared MCP server (`csps-principles-mcp`) — every agent connects to the same registry
3. Mastra `BaseAgent` — pulls platform principles from MCP at construction, prepends to every subclass's instructions
4. Audit-runner package — same checks run at every level (platform CI, app CI, on-demand via MCP)

---

## How this file gets updated

**Do not edit `AGENTS.md` directly.** It's generated from `packages/principles/principles.yaml` via `pnpm principles:codegen`.

Workflow:
1. Edit `packages/principles/principles.yaml`
2. Run `pnpm principles:codegen`
3. Commit both files together
4. CI fails (`audit-glossary-fresh` style check) if `git diff AGENTS.md` shows drift between source and generated output

This is the same pattern as the glossary codegen pipeline. The single-source-of-truth rule applies recursively.

---

## Open frontiers

Items under active negotiation, not yet final, are tracked in `docs/plan/pillar-6-operations-and-delivery/open-frontiers.md`. Don't lock in behavior on those without checking the latest state.
