# [EXT-2026-06-23-08] CSP S344 — UX Consistency Audit Handback (Sonnet→Opus)

**Source:** Cross-project AI handback — CSP (Core Sights Platform) session S344  
**Date:** 2026-06-23  
**Source type:** external-ai-handback (QUARANTINE until spot-checked per CS9)  
**Pipeline entry:** `tools/data/external-research-pipeline.yaml → ext-2026-06-23-08`  
**Status:** P2-swift-scanned | PARK-S088-CSP-UX-AUDIT  
**Canonical source:** github.com/CommarkG/core-sights-platform — marketing-and-sales-engine/

---

## HANDBACK SUMMARY

**Session:** CSP S344  
**Artifact:** `.claudecode/handshake/S344_DISPATCH_UX_CONSISTENCY_AUDIT.md`  
**Commits:** 5cfdcf85 (report + next_tab_state), 5aff822f (screenshots)  
**Report:** marketing-and-sales-engine/UX_CONSISTENCY_AUDIT_S344.md  
**Scope:** 19 user-facing pages × 5 axes × real Selenium screenshots

---

## GATE VERDICT: COMPLETE — all conditions met. STOPPED before fixes.

---

## KEY FINDINGS (Governor ratification needed)

### 🔴 P0 — MUST FIX (3)
- **F1:** Home `/` has NO topbar, NO progress bar — first impression entirely disconnected from pipeline
- **F2:** `/studio` has topbar loaded but ORPHANED from nav — working page, unreachable
- **F3:** `/review` (Review Queue) ORPHANED from nav AND overlaps /confirm-products

### 🟠 P1 — HIGH (3)
- **F4:** `/governor-console` browser title = "TGVI — Terminal Governor Voice Interface" (retired acronym — Naming Gate violation)
- **F5:** `/corespines` orphaned from nav — valuable governance docs unreachable
- **F6:** `/visual-baseline-compare` has no topbar (dev tool — Governor decides if acceptable)

### 🟡 P2 — MEDIUM (4)
- **F7:** Browser title format inconsistent across 13 pages ("CsMSE — X" vs "X" vs "CSP X Dashboard")
- **F8:** product-definitions back-href still "/batch-review" (stale route name)
- **F9:** Progress bar "Enrich" step has no link/page (shows a stage with no destination)
- **F10:** `/dropdown-dashboard` URL is opaque — "dropdown" = mechanism not domain

### 🟢 P3 — LOW (2)
- **F11:** "Image Prep" unnumbered in Pipeline (novice can't tell if required)
- **F12:** Export page no empty-state when export_count=0

---

## OVERLAP MAP VERDICTS
- **/confirm-products vs /review** → CLARIFY-BOUNDARY (set-based vs single-image: different units, both needed; add /review to Pipeline nav)
- **/image-prep vs /studio** → CLARIFY-BOUNDARY (manual vs auto: different automation levels; add Studio to nav, clarify labels)

---

## PIPELINE VERDICT: PARTIAL YES — 3 gaps
- G1: Home page has no pipeline orientation (F1)
- G2: Studio + Review Queue orphaned (F2, F3)
- G3: "Enrich" step in progress bar has no destination (F9)

---

## SWIFT SCAN (CSPS context)

**Connection to CSPS B_UX_UI_DISCIPLINE:**
The 12 fixes map directly onto CSPS UX-DNA laws:
- F1 (no topbar/progress): LAW 1 violation (no value/context before extraction)
- F3 (orphaned page): LAW 4 violation (no navigation continuity = lost-for-later)
- F9 (Enrich step no destination): LAW 4 violation (no save-for-later path)
- F4 (retired acronym): NAMING POLICY violation (same as B_UX_UI_DISCIPLINE LAW 5 clarity)

**SWIFT items (low blast radius, this project is CSP not CSPS):**
- S1: Note that CSP UX audit confirms CSPS UX-DNA laws are critical → triangulation
- S2: The 12-fix prioritization framework (P0/P1/P2/P3 by severity) matches CSPS PE scoring

**Parked items (require CSP Governor ratification):**
- All 12 fixes: this is a CSP project artifact — fixes must be applied IN CSP, not CSPS
- PARK-S088-CSP-UX-AUDIT references this file for CSP work tracking

---

## CROSS-PROJECT NOTE

This artifact is from the CSP (Core Sights Platform) project, not CSPS (this repo).
Fixes F1-F12 should be applied to CommarkG/core-sights-platform.
CSPS role: park + cross-reference + note UX-DNA validation.
