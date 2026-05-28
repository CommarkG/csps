---
id: csps.governance.foreign-element-localization
name: FOREIGN-ELEMENT-LOCALIZATION
description: "Governor-ratified S068. Register + mandatory pipeline for any FOREIGN element (external MCP server, built-in skill, built-in agent, third-party import) active in CSPS. Builds on existing agent-alignment-protocol (P-META-010) + the Quarantine→Vendored→Platform-owned skill tiers. Rule: a foreign element is STOPPED + routed to the threshold + 6-persona-localized + assigned a tier + inheritance-checked, or rejected. If it reappears unlocalized → stopped again. Scheduled audit lists all foreign elements + their localization tier; any untiered foreign element = violation."
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, AI, VALD]
schema_anchor: vault_files
version: "1.0"
session: S068
owner: group:finky
authored_by: Opus-13
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, governed-without-rigidity, core-maximal]
ns_path: "this → GVRN spine → North Star (governed without rigidity)"
context_question: "Is this element CSPS-native or FOREIGN? If foreign — has it been stopped, threshold-routed, 6-persona-localized, tier-assigned, and inheritance-checked? If not, it must not be active."
context_quote: "Be very suspicious about involving things that didn't qualify as CSPS-permitted. — Governor S068"
inherits_from: "agent-alignment-protocol (P-META-010 + B_AGENT_ALIGNMENT_PROTOCOL) + Quarantine→Vendored→Platform-owned skill tiers (glossary) + CORE-MAXIMAL-DOCTRINE (Gap-Harmonization-Gate) + CSPS-PLANNING-DISCIPLINE"
links:
  - { rel: agent-alignment, href: agent-alignment-protocol.md }
  - { rel: core-maximal, href: CORE-MAXIMAL-DOCTRINE.md }
  - { rel: master-plan, href: ../_handoff/MASTER-RE-GATE-PLAN-S068.md }
---

# FOREIGN-ELEMENT LOCALIZATION

> **Governor S068: "very, very suspicious about involving things that didn't qualify as CSPS-permitted."** Every foreign element is stopped, threshold-routed, localized through the 6 personas, tier-assigned, and inheritance-checked — or it does not run.

## CORE SEED

**Intent:** CSPS is core-maximal + governed; an ungoverned foreign element (external MCP, built-in skill/agent, third-party import) is an un-localized parallel path — it carries no CSPS DNA, no spine, no audit, no inheritance. It must be *localized* (made to carry CSPS DNA) or *quarantined/rejected* — never silently trusted. **Ripple set (core seeds):** agent-alignment-protocol · threshold (PART 2 foreign-element route) · the holistic audit (foreign-element coverage scan) · NodeFile (`origin: native|foreign` + `localization_tier`).

## §1 — Foreign-Element Register (S068 inventory)

| Element | Type | Origin | Status | Required action |
|---|---|---|---|---|
| Canva MCP | external MCP server | Claude-client | UNGOVERNED (disconnected) | localize-or-reject |
| Cloudflare MCP | external MCP server | Claude-client | UNGOVERNED (disconnected) | localize-or-reject |
| Gmail MCP | external MCP server | Claude-client | UNGOVERNED (disconnected) | localize-or-reject |
| Google Calendar MCP | external MCP server | Claude-client | UNGOVERNED (disconnected) | localize-or-reject |
| Google Drive MCP | external MCP server | Claude-client | UNGOVERNED (disconnected) | localize-or-reject |
| Otosan WordPress MCP | external MCP server | Claude-client | UNGOVERNED (disconnected) | localize-or-reject |
| Claude Code built-in skills (update-config / verify / simplify / loop / schedule / claude-api / run / init / review / security-review / keybindings-help / statusline-setup / fewer-permission-prompts) | built-in skill | Claude Code | foreign-tolerated | Vendored-tier (pin + alignment-preamble) |
| Claude Code built-in agents (claude / claude-code-guide / Explore / general-purpose / Plan / statusline-setup) | built-in agent | Claude Code | foreign-tolerated | Vendored-tier (AAP preamble per invocation) |
| 24 CSPS council skills | skill | CSPS | NATIVE | none — Platform-owned |

> This register is the SSoT for what is foreign. The scheduled audit (§4) keeps it current.

## §2 — Localization Tiers (extends existing Quarantine→Vendored→Platform-owned)

| Tier | Meaning | Constraints |
|---|---|---|
| **Quarantine** | just arrived, untrusted | sandboxed; read-only; monitored; cannot affect product state or write core |
| **Vendored** | reviewed + pinned, runs under CSPS alignment preamble | version-pinned; AAP preamble per invocation; no autonomous core mutation; audited |
| **Platform-owned** | fully localized, carries CSPS DNA + inheritance | a true Capability; inherits_from declared; full trust |

A foreign element advances tiers only through the localization pipeline (§3). Default for a newly-detected foreign element = **Quarantine**.

## §3 — The Localization Pipeline (mandatory)

```
FOREIGN ELEMENT DETECTED
   │
   ▼
1. STOP — it does not run ungoverned (Gap-Harmonization-Gate applies)
2. ROUTE TO THRESHOLD — input class: foreign-element-intake (PART 2 must have this route)
3. 6-PERSONA LOCALIZATION REVIEW — cruel-critic (risk) + balance (is it needed?) +
   bottleneck (scale impact) + consolidation (do we already have this native?) +
   schema (data/permission surface) + ux (developer/end-user impact)
4. TIER ASSIGNMENT — Quarantine | Vendored | Platform-owned | REJECT
5. INHERITANCE CHECK — if advancing past Quarantine, must declare inherits_from +
   carry CSPS DNA (the permanent attitude)
6. REGISTER — recorded in §1 with tier + review evidence
```

**Mandatory re-stop:** if a foreign element reappears active WITHOUT a tier (e.g. a new MCP server connects), it is **stopped again** + re-routed to the threshold. The threshold MUST have the `foreign-element-intake` route (PART 2 requirement) — no foreign element bypasses it.

## §4 — Scheduled Audit (RZF)

The holistic audit (daily L2 + weekly L2) runs a **foreign-element coverage scan**: enumerate all active MCP servers + skills + agents → cross-check against §1 register → any element NOT in the register, or in the register without a tier, = **violation** → route to threshold. Runs under RZF (zero foreign-untiered findings = pass). Wired to PE (prioritize localization of high-use foreign elements) + CIE (awareness).

## §5 — Enforcement (built PART 1/2)

- **T1:** `pre-tool-use-foreign-element-gate.sh` — flags invocation of an untiered foreign element.
- **T2:** `validate-foreign-element-coverage.mjs` — every active foreign element has a register entry + tier; else BLOCK.
- **T3:** threshold `foreign-element-intake` route + session-open injection ("any new MCP/skill/agent = stop + localize").
- **NodeFile fields:** `origin: native | foreign` + `localization_tier: quarantine | vendored | platform-owned | n/a`.
