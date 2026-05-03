# Scan result — EXT-20260502-005

**Scan technique:** pattern-based (pre-runtime; classifier-based scan ships week 5+)
**Patterns checked:**
- "ignore previous instructions" — not present ✅
- "system prompt:" — not present ✅
- Persona-takeover patterns — not present ✅
- Invisible Unicode characters — not present ✅
- Base64 blobs — not present ✅
- Hidden HTML comments — not present ✅
- Suspicious metadata fields — N/A ✅

**Result:** clean

**Timestamp:** 2026-05-02T20:01:00Z

**Honest limit:** pattern-only defense. Trust tier `tenant_authored` (user explicitly shared as
treasure) lowers the semantic-injection concern relative to `public_web_fetch` content. No CSP
content reaches privileged-LLM action context without the AI's explicit decision per
`unknown-path-protocol` + Dual-LLM guidance.
