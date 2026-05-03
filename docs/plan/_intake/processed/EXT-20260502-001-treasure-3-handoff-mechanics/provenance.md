# Provenance — EXT-20260502-001

**Origin:** S002 turn-6 chat message from user (Finky).

**User's framing:** Within a multi-part message, the user explicitly labeled the inline
proposals as "treasure #3" alongside two file uploads they claimed (BLK-S002-004 — not
visible in the AI's context).

**Trust tier rationale:** `tenant_authored` — the user is the tenant's author and the
content originates in this session. Despite the citation to "feedback_corrections_must_be_mechanical
CONSTITUTIONAL S192" (which is from a different platform — CSP), the citation is being
used HERE as the user's directive, so trust applies to the user's framing of it, not
to the cited memory's authority.

**Risk profile rationale:** `low` — chat-channel content from authenticated user; pattern-based
prompt-injection scan ran clean (no "ignore previous instructions" / "system prompt" /
invisible Unicode / b64 blob). Limit acknowledged: pattern-only; semantic injection not
caught at this layer.

**Schema-gap signal:** YES, partial. The proposals concern handoff-protocol mechanics.
The current schema has no `governance/handoff-protocol-mechanics/` leaf — handoff mechanics
live in `_handoff/VAULT/protocols.md` (a vault artifact, not a pillar leaf). This triggers
the unknown-path-protocol with K=1; if a similar concern recurs within 90 days (e.g., a
future treasure proposes more handoff mechanics), K=2 will auto-create an ADR proposing
a new `governance/handoff-protocol` leaf or a promotion of `protocols.md` to a pillar leaf.

**Routing decision:** multi-section parent with 4 sub-IDs:
- A → cross-cutting governance (intent-to-impact ripples to stewardship + learning-loop + adr-process)
- B → cross-cutting governance (two-sided handshake ripples to stewardship + learning-loop)
- C → governance/learning-loop + insights vault (constitutional principle reinforcement)
- D → operations/dashboards + intake (dashboard plan; routes both because pillar-6 dashboards leaf doesn't exist yet AND it's an intake-plane surface)

**State at receipt:** all 4 sub-IDs `pipeline_state: triaged`, `lifecycle_state: pending-review`.
Sections A and B are FAST-CLOSE candidates because the AI's recommendation in chat
(STRONG YES on both) was acted upon: protocols.md v1.1 → v1.2 was already updated in
this same turn. The work the extraction proposed is already shipped; thus extractions
A and B can transition `triaged → routed → fixing → validated → closed` rapidly within
this session.
