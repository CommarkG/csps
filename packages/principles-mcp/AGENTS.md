# AGENTS.md — @csps/principles-mcp

Per-package AGENTS.md cascade. Extends the workspace root [AGENTS.md](../../AGENTS.md) with rules specific to this package.

## Scope

This package is the canonical MCP server exposing CSPS's principle registry. It is **read-only** — never mutates `principles.yaml`. Modifications happen via the codegen pipeline (`packages/principles/codegen.ts`), never from this server.

## Hard NOs (extend root)

- ❌ Never write to `principles.yaml` from this package — read-only access. Mutations go through `packages/principles/codegen.ts`.
- ❌ Never expose principle source-of-truth via any path other than the canonical URI scheme `principles://<id>` + the registered aliases. New aliases require an entry in `ALIASES` const + corresponding test.
- ❌ Never break the URI scheme without an ADR. Vendored copies in graduated apps reference these URIs; URI churn breaks every graduate.
- ❌ Never add transport other than stdio without an ADR. SSE transport (HTTP) introduces auth + multi-tenant concerns; deferred until production hardening.
- ❌ Never embed AI-callable side effects in resources or tools (pure read access only). Side-effect tools belong in domain-specific MCP servers (catalog-mcp / skills-mcp).
- ❌ Never write to stdout from non-MCP code paths. Stdout is reserved for the MCP transport framing; logging goes to stderr.

## When updating

1. Update `src/index.ts` (resources / tools / aliases)
2. Sync `README.md` resource + tool tables
3. Run `pnpm typecheck` from this package directory
4. Update `tests/` (when added in week-3)

## Inherited from root

All workspace AGENTS.md hard NOs apply (30+ NOs). Notably:
- B_PCR_FOR_DECISIONS: any decision about resource shape / tool surface uses Pros/Cons/Recommendation 3-block
- B_FIVE_SURFACE_ENGRAVING: new behavioral disciplines hit all 5 surfaces atomically
- B_VALIDATE_BEFORE_ASSUME: tool-call evidence in same response as assertions
