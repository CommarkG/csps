---
extraction_id: EXT-20260505-006-B
parent_input_id: EXT-20260505-006
section_label: "§1 Principle (edge cases as signals) + §3 7 forward-going patterns + §4 Single rule"
source_type: AI_OTHER
confidence: 0.97
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T05:35:00Z
pipeline_state: routed
routed_to: behavioral-contracts.md edge-case-handling subsection (S009 PCR) + Pattern A IMMEDIATELY engraved + Patterns B-G scheduled
next_review_at: 2026-05-06T05:35:00Z
risk: low
trust_tier: external_ai_export
tags: [domain:governance, domain:ops, type:reference, audience:ai-agent, audience:developer, maturity:draft]
mini_tree_layer: L1+L2+L3 (essence + 7 patterns full preserved + single rule)
deep_dive_schedule: |
  - Pattern A → IMMEDIATELY engraved THIS BATCH (feedback_diff_before_protected_path_writes.md)
  - Patterns B-G → S009-S012 per natural fit with each phase
priority_for_10_phase_completion: 🔥 HIGH (Pattern A enforced immediately; Patterns B-G inform Phase 5-10 execution)
consolidation_cross_refs:
  - feedback_diff_before_protected_path_writes.md (Pattern A engraved THIS BATCH)
  - feedback_no_settings_edits_unless_asked.md (memory entry 38; Pattern G analog)
  - feedback_no_confirmation_seeking.md (memory entry 16; composes with Pattern A — when to ask vs not ask)
inherited_from_input: [source_type:AI_OTHER, risk:low]
---

# Extract B — 7 forward-going patterns + single rule (edge cases as signals)

## Essence (THE OPERATING PHILOSOPHY)

**The single rule (§4):** *"Treat every edge case as a governance signal, not a bug to bypass. When a popup or block appears: read what it says + diagnose root cause + honor the discipline + document the resolution."*

## 7 forward-going patterns (preserved verbatim L3)

| Pattern | Trigger | Discipline |
|---|---|---|
| **A. Permission popups for new file paths** | Write/Edit on `.claude/hooks/*` or `.claude/settings.json` | Prepare diff first; ask explicit; WAIT for "yes" — **CSPS ENGRAVED THIS BATCH** as `feedback_diff_before_protected_path_writes.md` |
| **B. Validator findings during execution** | Validator fires YELLOW/RED mid-batch | Fix same-batch; re-run validator; surface AFTER attempted fix (per `feedback_fix_before_report` analog) |
| **C. Mid-session model switches** | Governor invokes `/model opus` mid-task | Acknowledge cache cost; suggest task boundary OR `/clear` first (per B_TOKEN_BUDGET R2 already in CSPS) |
| **D. Auto-compaction at 95% context** | Context approaches 95% | Strategic `/compact` at IMPL_BATCH boundaries proactively (per B_TOKEN_BUDGET R3 already in CSPS) |
| **E. HEREDOC multi-line commit messages** | Complex commit with code blocks/special chars | `cat > h_msg.tmp <<'EOF'` ... `git commit -F h_msg.tmp` pattern (CSPS already practices via Bash) |
| **F. System reminder noise** | TodoWrite reminders + MCP cross-pollution every turn | Reminders are advisory; CSPS discipline takes precedence; ignore reactive compliance |
| **G. Settings.json writes** | Write/Edit on settings.json | Special permission gate; explicit per-edit approval (CSPS already engraved as `feedback_no_settings_edits_unless_asked.md` memory entry 38) |

## CSPS state per pattern

- **A:** ✅ ENGRAVED THIS BATCH (S008 turn 11 per user explicit directive)
- **B:** ⏳ Implicit via B_PRE_CLOSE_VERIFICATION; explicit memory candidate S009
- **C:** ✅ Engraved via B_TOKEN_BUDGET R2 (memory entry 40)
- **D:** ✅ Engraved via B_TOKEN_BUDGET R3 (memory entry 40)
- **E:** ✅ Practiced (Bash HEREDOC pattern used in S008 commits)
- **F:** ⏳ Pattern recognized; CSPS-specific memory candidate
- **G:** ✅ Engraved via memory entry 38

**4 of 7 patterns already in CSPS; 1 engraved this batch (A); 2 candidates (B + F) for S009-S012**

## Recommended downstream action

1. **S009 candidate:** `feedback_fix_before_report.md` memory (Pattern B CSPS-specific naming)
2. **S009-S012 reference:** Patterns C/D/E/G already engraved; consult as needed during Phase 5-10
3. **Continuous:** apply single rule (signal-not-bug) at every popup/block encountered

## Engraving readiness
✅ Pattern A DONE this batch. Patterns B + F = S009 candidates. Others already in CSPS.
