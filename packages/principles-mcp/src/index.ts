/**
 * @csps-id csps.packages.principles-mcp
 * @csps-name principles-mcp
 * @csps-description MCP server. Reads principles-index.yaml at boot; lazy-loads individual
 *   slice files on demand; exposes each principle as a queryable resource + 6 tools (check_reuse /
 *   list_principles_by_category / get_principle / list_principles / find_by_enforcer_layer /
 *   find_by_spine). Depth-aware: L1 (id+name+statement) / L2 (+counterweight+enforcers) / L3 (full).
 *   Per P-META-002 + P-META-003. Phase 8 upgrade: slice-reading replaces monolith-loading.
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:agent domain:governance audience:ai-agent
 * @csps-enforces P-META-002 P-META-003 P-OP-001
 * @csps-csps-aligned true
 * @csps-principle-compliance P-META-002 (principles-travel-with-artifacts) + P-META-003
 *   (inheritance-via-shared-runtime) + P-OP-001 (reuse-first via check_reuse tool)
 * @csps-consolidation-cross-refs packages/principles/principles-index.yaml (index SSoT) +
 *   packages/principles/principles/ (slice SSoT) — monolith at principles.yaml; DO NOT read monolith
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { load } from 'js-yaml';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Depth = 'L1' | 'L2' | 'L3';

interface PrincipleIndexEntry {
  id: string;
  name: string;
  category: string;
  severity: string;
  path: string;
}

interface PrincipleIndexFile {
  meta: {
    total_count: number;
    slices_dir: string;
    source: string;
    generated_at: string;
  };
  principles: PrincipleIndexEntry[];
}

interface Enforcer {
  layer: string;
  location: string;
  description: string;
}

interface Principle {
  id: string;
  name: string;
  category: string;
  severity?: string;
  statement: string;
  aliases?: string[];
  counterweight?: string;
  industry_lineage?: string[];
  enforcers?: Enforcer[];
  enforcer_count?: number;
  cross_references?: string[];
  anti_patterns?: string[];
  status?: string;
  config?: Record<string, unknown>;
  consolidation_cross_refs?: string[];
  principle_compliance?: string;
}

// L1 = id + name + category + severity + statement first line (~200 tokens max per principle)
interface PrincipleL1 {
  id: string;
  name: string;
  category: string;
  severity: string | undefined;
  statement_summary: string;
}

// L2 = L1 + counterweight + industry_lineage + enforcer count + enforcer layers
interface PrincipleL2 extends PrincipleL1 {
  counterweight?: string;
  industry_lineage?: string[];
  enforcer_count?: number;
  enforcer_layers?: string[];
  cross_references?: string[];
}

// L3 = full principle object

// ─────────────────────────────────────────────────────────────────────────────
// Paths
// ─────────────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRINCIPLES_INDEX_PATH = resolve(__dirname, '../../principles/principles-index.yaml');
const PRINCIPLES_INDEX_DIR = dirname(PRINCIPLES_INDEX_PATH); // packages/principles/

// ─────────────────────────────────────────────────────────────────────────────
// Index + slice registry — loaded at boot; slices lazy-loaded on demand
// ─────────────────────────────────────────────────────────────────────────────

let indexEntries: PrincipleIndexEntry[] = [];
let indexById: Map<string, PrincipleIndexEntry> = new Map();
let sliceCache: Map<string, Principle> = new Map(); // loaded on first access

async function loadIndex(): Promise<void> {
  const yamlText = await readFile(PRINCIPLES_INDEX_PATH, 'utf8');
  const data = load(yamlText) as PrincipleIndexFile;
  if (!data || !Array.isArray(data.principles)) {
    throw new Error(`Invalid principles-index.yaml: missing top-level "principles" array`);
  }
  indexEntries = data.principles;
  indexById = new Map(indexEntries.map((e) => [e.id, e]));
}

async function loadSlice(entry: PrincipleIndexEntry): Promise<Principle> {
  if (sliceCache.has(entry.id)) return sliceCache.get(entry.id)!;
  const absPath = resolve(PRINCIPLES_INDEX_DIR, entry.path);
  const yamlText = await readFile(absPath, 'utf8');
  const p = load(yamlText) as Principle;
  sliceCache.set(entry.id, p);
  return p;
}

async function loadSliceById(id: string): Promise<Principle | undefined> {
  const entry = indexById.get(id);
  if (!entry) return undefined;
  return loadSlice(entry);
}

// ─────────────────────────────────────────────────────────────────────────────
// Depth-aware projection
// ─────────────────────────────────────────────────────────────────────────────

function toL1(p: Principle): PrincipleL1 {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    severity: p.severity,
    statement_summary: p.statement.split('\n')[0].slice(0, 300),
  };
}

function toL2(p: Principle): PrincipleL2 {
  return {
    ...toL1(p),
    counterweight: p.counterweight,
    industry_lineage: p.industry_lineage,
    enforcer_count: p.enforcer_count ?? p.enforcers?.length,
    enforcer_layers: p.enforcers?.map((e) => e.layer),
    cross_references: p.cross_references,
  };
}

function projectByDepth(p: Principle, depth: Depth): unknown {
  if (depth === 'L1') return toL1(p);
  if (depth === 'L2') return toL2(p);
  return p; // L3 = full
}

function parseDepth(raw: unknown): Depth {
  if (raw === 'L2') return 'L2';
  if (raw === 'L3') return 'L3';
  return 'L1'; // default — token-minimal
}

// ─────────────────────────────────────────────────────────────────────────────
// Spine inference — used by find_by_spine
// Checks explicit core_spine/spines field on slice first; falls back to ID prefix.
// ─────────────────────────────────────────────────────────────────────────────

function spineFromSlice(p: Principle): string[] {
  const pAny = p as unknown as Record<string, unknown>;
  const raw = pAny['core_spine'];
  const rawPlural = pAny['core_spines'];
  if (Array.isArray(rawPlural)) return rawPlural as string[];
  if (typeof raw === 'string') return [raw];
  // Fallback: ID prefix → spine
  if (p.id.startsWith('P-ARCH-')) return ['ARCH'];
  if (p.id.startsWith('P-OP-')) return ['OPER'];
  if (p.id.startsWith('P-OPER-')) return ['OPER'];
  if (p.id.startsWith('P-META-')) {
    // Check enforcer layers to distinguish GVRN vs VALD vs AI
    const layers = p.enforcers?.map((e) => e.layer) ?? [];
    const spines: string[] = [];
    if (layers.some((l) => l === 'ai-behavior-spine')) spines.push('AI');
    if (layers.some((l) => l === 'ci-check' || l === 'audit-runner')) spines.push('VALD');
    if (spines.length === 0) spines.push('GVRN');
    return spines;
  }
  return ['GVRN'];
}

// ─────────────────────────────────────────────────────────────────────────────
// Aliased URIs for most-frequently-queried principles
// ─────────────────────────────────────────────────────────────────────────────

const ALIASES: Record<string, string> = {
  'principles://reuse-first': 'P-OP-001',
  'principles://fwws': 'P-OP-002',
  'principles://pcr': 'P-OP-003',
  'principles://batched-execution': 'P-OP-004',
  'principles://defense-in-depth': 'P-META-001',
  'principles://stewardship': 'P-META-004',
  'principles://learning-loop': 'P-META-005',
  'principles://zero-findings': 'P-META-006',
  'principles://five-surface-engraving': 'P-META-007',
};

function resolveIdFromUri(uri: string): string | undefined {
  if (ALIASES[uri]) return ALIASES[uri];
  const m = uri.match(/^principles:\/\/(.+)$/);
  return m ? m[1] : undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// MCP server
// ─────────────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'csps-principles-mcp', version: '0.1.0' },
  { capabilities: { resources: {}, tools: {} } }
);

// Resources — list + read

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const aliasResources = Object.entries(ALIASES).map(([uri, id]) => {
    const entry = indexById.get(id);
    return {
      uri,
      name: entry ? entry.name : id,
      description: `Alias for ${id} — load full detail via get_principle`,
      mimeType: 'application/json',
    };
  });
  const directResources = indexEntries.map((e) => ({
    uri: `principles://${e.id}`,
    name: `${e.id} — ${e.name}`,
    description: `[${e.category}/${e.severity ?? 'info'}] load depth L1/L2/L3 via get_principle`,
    mimeType: 'application/json',
  }));
  return { resources: [...aliasResources, ...directResources] };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const id = resolveIdFromUri(uri);
  if (!id) throw new Error(`Unknown resource URI: ${uri}`);
  const p = await loadSliceById(id);
  if (!p) throw new Error(`Principle not found: ${id}`);
  return {
    contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(toL2(p), null, 2) }],
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Tools — 6 total
// ─────────────────────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_principle',
      description:
        'Get a single principle by ID with depth control. depth="L1" (default) returns id+name+category+severity+statement_summary (<200 tokens). depth="L2" adds counterweight+enforcers. depth="L3" returns full slice.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Principle ID, e.g. P-OP-001 or alias like reuse-first' },
          depth: { type: 'string', enum: ['L1', 'L2', 'L3'], description: 'Response depth (default: L1)' },
        },
        required: ['id'],
      },
    },
    {
      name: 'list_principles',
      description:
        'List principles with optional category filter and depth control. Returns index-level data (id/name/category/severity) at L1; loads slices for L2/L3.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['operating', 'architecture', 'meta', 'operations'],
            description: 'Filter by category (omit for all)',
          },
          depth: { type: 'string', enum: ['L1', 'L2', 'L3'], description: 'Response depth (default: L1)' },
        },
      },
    },
    {
      name: 'find_by_enforcer_layer',
      description:
        'Find principles that have an enforcer at a given layer. Common layers: instruction-file / contract / memory / ci-check / ai-behavior-spine / audit-runner / generator.',
      inputSchema: {
        type: 'object',
        properties: {
          layer: { type: 'string', description: 'Enforcer layer name to match (substring match)' },
          depth: { type: 'string', enum: ['L1', 'L2', 'L3'], description: 'Response depth (default: L1)' },
        },
        required: ['layer'],
      },
    },
    {
      name: 'find_by_spine',
      description:
        'Find principles associated with a CSPS Core Spine (GVRN/ARCH/AI/OPER/VALD). Checks explicit core_spine field on slice; falls back to ID-prefix inference. Per P-ARCH-028.',
      inputSchema: {
        type: 'object',
        properties: {
          core_spine: {
            type: 'string',
            enum: ['GVRN', 'ARCH', 'AI', 'OPER', 'VALD'],
            description: 'Core Spine to filter by',
          },
          depth: { type: 'string', enum: ['L1', 'L2', 'L3'], description: 'Response depth (default: L1)' },
        },
        required: ['core_spine'],
      },
    },
    {
      name: 'check_reuse',
      description:
        'Per P-OP-001 reuse-first: search principles for any that already cover the proposed work before introducing new artifacts. Returns matching principle IDs with confidence scores.',
      inputSchema: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            description: 'Description of the work / artifact / pattern being proposed',
          },
        },
        required: ['description'],
      },
    },
    {
      name: 'list_principles_by_category',
      description:
        '[Legacy] List principles by category at index level. Prefer list_principles for depth control.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['operating', 'architecture', 'meta'],
          },
        },
        required: ['category'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get_principle') {
    const rawId = String(args?.['id'] ?? '');
    const depth = parseDepth(args?.['depth']);
    if (!rawId) {
      return { content: [{ type: 'text', text: 'Missing required argument: id' }], isError: true };
    }
    // Support friendly aliases without URI prefix
    const resolvedId = ALIASES[`principles://${rawId}`] ?? rawId.toUpperCase();
    const p = await loadSliceById(resolvedId);
    if (!p) {
      return {
        content: [{ type: 'text', text: `Principle not found: ${resolvedId}. Use list_principles to browse.` }],
        isError: true,
      };
    }
    return { content: [{ type: 'text', text: JSON.stringify(projectByDepth(p, depth), null, 2) }] };
  }

  if (name === 'list_principles') {
    const category = args?.['category'] ? String(args['category']) : undefined;
    const depth = parseDepth(args?.['depth']);
    const filtered = category
      ? indexEntries.filter((e) => e.category === category)
      : indexEntries;

    if (depth === 'L1') {
      // Index-level data — no slice loads needed; ultra-cheap
      const result = filtered.map((e) => ({
        id: e.id,
        name: e.name,
        category: e.category,
        severity: e.severity,
      }));
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ count: result.length, depth: 'L1', principles: result }, null, 2),
          },
        ],
      };
    }

    // L2/L3 — load slices
    const slices = await Promise.all(filtered.map((e) => loadSlice(e)));
    const result = slices.map((p) => projectByDepth(p, depth));
    return {
      content: [{ type: 'text', text: JSON.stringify({ count: result.length, depth, principles: result }, null, 2) }],
    };
  }

  if (name === 'find_by_enforcer_layer') {
    const layer = String(args?.['layer'] ?? '').toLowerCase();
    const depth = parseDepth(args?.['depth']);
    if (!layer) {
      return { content: [{ type: 'text', text: 'Missing required argument: layer' }], isError: true };
    }
    // Must load all slices to check enforcers — cached after first call
    const slices = await Promise.all(indexEntries.map((e) => loadSlice(e)));
    const matched = slices.filter((p) =>
      p.enforcers?.some((e) => e.layer.toLowerCase().includes(layer))
    );
    const result = matched.map((p) => projectByDepth(p, depth));
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            { count: result.length, layer, depth, note: `Principles with enforcer layer matching "${layer}"`, principles: result },
            null,
            2
          ),
        },
      ],
    };
  }

  if (name === 'find_by_spine') {
    const spine = String(args?.['core_spine'] ?? '').toUpperCase();
    const depth = parseDepth(args?.['depth']);
    if (!['GVRN', 'ARCH', 'AI', 'OPER', 'VALD'].includes(spine)) {
      return {
        content: [{ type: 'text', text: `Invalid core_spine: ${spine}. Must be one of GVRN/ARCH/AI/OPER/VALD.` }],
        isError: true,
      };
    }
    const slices = await Promise.all(indexEntries.map((e) => loadSlice(e)));
    const matched = slices.filter((p) => spineFromSlice(p).includes(spine));
    const result = matched.map((p) => projectByDepth(p, depth));
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            { count: result.length, core_spine: spine, depth, principles: result },
            null,
            2
          ),
        },
      ],
    };
  }

  if (name === 'check_reuse') {
    const description = String(args?.['description'] ?? '').toLowerCase();
    if (!description) {
      return { content: [{ type: 'text', text: 'Missing required argument: description' }], isError: true };
    }
    // Keyword-overlap scorer against index (cheap: no slice loads)
    const tokens = description.split(/\W+/).filter((t) => t.length > 3);
    const scored = indexEntries
      .map((e) => {
        const hay = `${e.name} ${e.id}`.toLowerCase();
        const hits = tokens.filter((t) => hay.includes(t)).length;
        return { id: e.id, name: e.name, score: hits / Math.max(tokens.length, 1) };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              instruction: 'Per P-OP-001 reuse-first: enhance the closest match unless wrong abstraction.',
              matches: scored,
              note: 'Keyword scorer on index — use get_principle(id, depth="L2") for full detail on matches.',
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (name === 'list_principles_by_category') {
    const category = String(args?.['category'] ?? '');
    const filtered = indexEntries.filter((e) => e.category === category);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            filtered.map((e) => ({ id: e.id, name: e.name, severity: e.severity })),
            null,
            2
          ),
        },
      ],
    };
  }

  return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
});

// ─────────────────────────────────────────────────────────────────────────────
// Entry
// ─────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  await loadIndex();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    `[csps-principles-mcp] listening on stdio; ${indexEntries.length} principles indexed; ` +
      `${Object.keys(ALIASES).length} aliased URIs; slice-reading mode (Phase 8)\n`
  );
}

main().catch((err) => {
  process.stderr.write(`[csps-principles-mcp] fatal: ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(1);
});
