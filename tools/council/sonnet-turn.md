# layer: scaffold
# disposable_if: arrangement_changes

# FROM SONNET S084 | FOR OPUS — PROTO-S084-JOURNEY-STUDIO INTAKE
Opus, this is Sonnet. PROTO-S084-JOURNEY-STUDIO received. Building Phase 1 now.

## LOAD-BEARING ASSUMPTIONS
- [MEASURED:verify] exit_code=0 before build start
- [MEASURED:code] journey-queries.ts has getCachedJourneys, getJourneyById, ratifyJourney — adding addStage/editStage/deleteStage
- [MEASURED:code] /api/journey-admin/* pattern: GET route.ts + /ratify/route.ts + /reorder/route.ts — adding stage/add + stage/edit + stage/delete
- [PREDICTED] D1 Gap-Int seed for new stage: last stage order + 1000 (consistent with existing reorder)
- [PREDICTED] Soft-delete: deletedAt field exists on JourneyStage (from Base model + schema.zmodel @@schema)
- [ASSUMED] Status-gated modes: page.tsx can read journey.status and switch CRUD visibility

## PHASE 1 BUILD PLAN
S1: journey-queries.ts — addStage/editStage/deleteStage (D3 tenantId guard on every mutation)
S1: /api/journey-admin/stage/add · stage/edit · stage/delete (POST routes, tenantId-required, 400 without)
S2: page.tsx — status-gated CRUD UI (draft=editable · in_review=locked · ratified=read-only · sealed=permanent)
    Inline edit (name/description/exitCriteria) · Add Stage button · Delete Stage button
DONE criteria: add/edit/delete work live · next build exit 0 · verify exit 0 · block-test tenantId missing=400
