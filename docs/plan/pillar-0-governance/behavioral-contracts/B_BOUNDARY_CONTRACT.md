---
enforcement_trio:
  t1:
    tier: hook
    path: .claude/hooks/pre-tool-use-context-bundle-gate.sh
    status: pending
    note: "S088-A2: T1 hook stubs at pre-spawn (AgentTool/TaskCreate tool-use). Fires when spawn is attempted without a valid context bundle. Build after PROTO-S088-BOUNDARY-CONTRACT B_BOUNDARY_CONTRACT ratified."
  t2:
    tier: validator
    path: tools/validators/validate-context-bundle.mjs
    status: active
    note: "BLOCKING: schema complete + no-navigation + paths-exist-at-HEAD + tenant_id + budget + DoD-evidence mapped. Plus advisory Grok understanding-test check."
  t2b:
    tier: validator
    path: tools/validators/validate-director-seal-packet.mjs
    status: active
    note: "C5 seal verifier: transcript-blind, stateless. BLOCKS: forbidden fields (chat_transcript etc.), failed block-tests, tree_hash mismatch, builder==sealer. Labels C5-sealed vs C4.5-reproduced."
  t3:
    tier: session
    path: session-open injection (SEED-B expanded)
    status: active
    note: "Every session open: boundary-contract reminder + schema links in context."
---
[//]: # (B_BOUNDARY_CONTRACT — PROTO-S088-BOUNDARY-CONTRACT. S088 Governor-approved.)

## B_BOUNDARY_CONTRACT — every AI-to-AI spawn carries a typed, blocking context bundle + C5 director seal (S088 CONSTITUTIONAL — highest council priority, unanimous)

**Canonical:** Before any AI-to-AI spawn (Haiku scout, subagent, external agent, loop iteration), the spawning party MUST supply a `context-bundle.schema.json`-compliant bundle. The bundle is the ONLY communication channel — no inline prose "see §X", no relative paths, no navigation refs. The director SEAL uses a `seal-packet.schema.json`-compliant packet that is transcript-BLIND (receiver sees ONLY: tree_hash, green-receipt snapshot, DoD, block-tests).

**Rationale:** Without a typed bundle schema + blocking validator, every spawn is a "loose cannon" — the receiving agent starts from its training defaults, not from CSPS governance. The 5-source external council (unanimous) confirmed this is the load-bearing primitive that every other multi-agent mechanism depends on. C5 seal being transcript-blind closes the correlated-failure blind spot where builder and sealer share context.

---

**Bundle schema** (`schemas/context-bundle.schema.json`) required fields:
- `governing_intent` — WHY. One precise sentence. No navigation refs.
- `DoD` — criteria (measurable) + evidence (proof-spec per criterion)
- `block_test` — planted_defect + expected_exit=1 + test_file
- `inline_critical_content` — files (path+content verbatim) + key_decisions
- `read_allowlist` / `write_allowlist` — absolute paths only (no `../../`)
- `head_sha` — git HEAD at spawn time
- `session_id` — CSPS session (S001..S999)
- `tenant_id` — required; "platform" for platform-level work
- `budget` — `{tokens, tool_calls, wall_clock_seconds, cost_usd}` — all four, no defaults
- `challenge_clause` — paraphrase-DoD request (Grok understanding test; advisory if < 20 chars)
- `output_contract` — `{format, required_fields, forbidden_patterns}`

**FORBIDDEN** in inline_critical_content + governing_intent:
- "see §", "../", "refer to earlier/above/prior", "as I mentioned"
- Relative path traversals (../../)

**Seal packet** (`schemas/seal-packet.schema.json`):
- Director receives ONLY: `{tree_hash, green_receipt_snapshot, DoD, block_tests, sealed_at_head}`
- FORBIDDEN in packet: `loop_artifacts`, `chat_transcript`, `session_context`, `builder_session_state`
- C5-sealed = transcript-blind (these fields absent, director independently re-runs block-tests)
- C4.5-reproduced = in-tab (director remembers build context; cannot be C5)
- builder!=sealer: git authorship check on sealed files

**Enforcement:**
- T2 (active): `validate-context-bundle.mjs` BLOCKS pre-spawn (blocking=1 if any check fails)
- T2b (active): `validate-director-seal-packet.mjs` BLOCKS seal on contamination / failed tests
- T1 (pending): `pre-tool-use-context-bundle-gate.sh` — fires on Agent/subagent tool-use
- T3 (active): session-open injection

**Block-tests (behavioral):**
- `validate-context-bundle.mjs --block-test` (4/4 PASS S088):
  - A: missing governing_intent → exit 1
  - B: "see §X" in governing_intent → exit 1
  - C: missing tenant_id → exit 1
  - D: clean bundle → exit 0
- `validate-director-seal-packet.mjs --block-test` (4/4 PASS S088):
  - A: chat_transcript in packet → exit 1 (C5 contaminated)
  - B: block_test passed=false → exit 1
  - C: clean packet → exit 0
  - D: builder==sealer → BLOCKING detected

**Ratified standards entries:** see `tools/data/ratified-standards.yaml` boundary-contract entries.

**Related:** B_BOUNDARY_ALIGNMENT_PROTOCOL (UNDERSTANDING/ALIGNMENT block format) · B_TWO_PARTY_SEAL (director counter-sign) · AI-COUNCIL-COMMUNICATION-SPINE.md L2 role-pair contracts
