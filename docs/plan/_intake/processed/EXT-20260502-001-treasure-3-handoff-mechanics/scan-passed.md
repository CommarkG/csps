# Scan result — EXT-20260502-001

**Scan technique:** pattern-based (pre-runtime; classifier-based scan ships week 5+)
**Patterns checked:**
- "ignore previous instructions" — not present ✅
- "system prompt:" — not present ✅
- "you are now" / persona-takeover — not present ✅
- Invisible Unicode characters — not present ✅
- Base64 blobs — not present ✅
- Hidden HTML comments — not present ✅
- White-on-white text — N/A (chat content, not visual) ✅
- Suspicious metadata — N/A (not a structured file) ✅

**Result:** clean

**Timestamp:** 2026-05-02T15:01:00Z

**Honest limit:** pattern-only defense; semantic prompt injection NOT detected at this layer.
However, since trust_tier is `tenant_authored` (user's own text in their own session), the
semantic-injection concern is lower than for `public_web_fetch` content. This trust-tier-aware
calibration is consistent with the Dual-LLM / CaMeL pattern recommendations in
`external-inputs-plan.md` (privileged-LLM-with-tools never sees the raw content directly when
trust-tier is below `tenant_authored`).
