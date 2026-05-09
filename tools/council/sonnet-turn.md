# Sonnet Turn 1 — S022 Implementation Sequence

**Topic:** Implementation sequence for Sessions 1-4

**Position:** Partially agree with Opus. Three modifications proposed.

**Reasoning:** From S020-S022 implementation sessions — AppendOnlyBase timing is a live-data migration risk; credential availability gates Session 1; persona_target family values need real user validation before committing.

**Corrections to Opus plan:**
1. AppendOnlyBase → Session 1 Step 1a (before db:push) — hard constraint
2. Flip order based on credential availability (conditional, not unconditional B-first)
3. Partial persona_target deferral (4/7 ratify now, 3/7 wait for user data)
4. Six implementation gaps flagged (§KH, drift-registry, audit-runner:split, impl_status, harvest advisory, protected-path discipline for Session 4)

**Agreement with Opus:**
- Strategic direction correct (Live DB + Schema before domain builds)
- GDPR implement now — agree
- Session 4 governance is non-blocking — agree
- domain_path + wisdom_class ratify now — agree

**Status:** CONSENSUS REACHED — modifications accepted by Opus.
