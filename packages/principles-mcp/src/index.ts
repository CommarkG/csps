/**
 * @csps-id csps.packages.principles-mcp
 * @csps-name principles-mcp
 * @csps-description MCP server entry. Reads principles.yaml at boot; exposes each principle as a queryable resource (principles://<id> + aliased shortcuts principles://reuse-first / principles://pcr / principles://fwws / principles://batched-execution); exposes check_reuse tool. Per P-META-002 + P-META-003.
 * @csps-version 0.0.1
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:agent domain:governance audience:ai-agent
 * @csps-enforces P-META-002 P-META-003 P-OP-001
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
// Principles registry — load once at boot from packages/principles/principles.yaml
// ─────────────────────────────────────────────────────────────────────────────

interface Principle {
  id: string;
  name: string;
  category: 'operating' | 'architecture' | 'meta';
  severity?: 'info' | 'warn' | 'error' | 'critical';
  statement: string;
  counterweight?: string;
  industry_lineage?: string[];
  enforcers?: Array<{ layer: string; location: string; description: string }>;
  enforcer_count?: number;
  cross_references?: string[];
  anti_patterns?: string[];
  status?: string;
}

interface PrinciplesFile {
  principles: Principle[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRINCIPLES_YAML_PATH = resolve(__dirname, '../../principles/principles.yaml');

let principles: Principle[] = [];
let principlesById: Map<string, Principle> = new Map();

async function loadPrinciples(): Promise<void> {
  const yamlText = await readFile(PRINCIPLES_YAML_PATH, 'utf8');
  const data = load(yamlText) as PrinciplesFile;
  if (!data || !Array.isArray(data.principles)) {
    throw new Error(`Invalid principles.yaml: missing top-level "principles" array`);
  }
  principles = data.principles;
  principlesById = new Map(principles.map((p) => [p.id, p]));
}

// Aliased URIs for the most-frequently-queried principles (per P-OP-001 reuse-first +
// P-OP-002 FWWS + P-OP-003 PCR + P-OP-004 batched-execution use-by-agents)
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

function resourceUriFor(p: Principle): string {
  return `principles://${p.id}`;
}

function principleByUri(uri: string): Principle | undefined {
  if (ALIASES[uri]) return principlesById.get(ALIASES[uri]);
  const m = uri.match(/^principles:\/\/(.+)$/);
  if (!m) return undefined;
  return principlesById.get(m[1]);
}

// ─────────────────────────────────────────────────────────────────────────────
// MCP server
// ─────────────────────────────────────────────────────────────────────────────

const server = new Server(
  {
    name: 'csps-principles-mcp',
    version: '0.0.1',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const aliasResources = Object.entries(ALIASES).map(([uri, id]) => {
    const p = principlesById.get(id);
    return {
      uri,
      name: p ? p.name : id,
      description: p ? p.statement.split('\n')[0].slice(0, 256) : `Alias for ${id}`,
      mimeType: 'application/json',
    };
  });
  const directResources = principles.map((p) => ({
    uri: resourceUriFor(p),
    name: `${p.id} — ${p.name}`,
    description: p.statement.split('\n')[0].slice(0, 256),
    mimeType: 'application/json',
  }));
  return { resources: [...aliasResources, ...directResources] };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const p = principleByUri(uri);
  if (!p) {
    throw new Error(`Unknown resource URI: ${uri}`);
  }
  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(p, null, 2),
      },
    ],
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Tools
// ─────────────────────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
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
      description: 'List principles by category (operating | architecture | meta).',
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
  if (name === 'check_reuse') {
    const description = String(args?.['description'] ?? '').toLowerCase();
    if (!description) {
      return {
        content: [{ type: 'text', text: 'Missing required argument: description' }],
        isError: true,
      };
    }
    // Skeleton-tier scorer: keyword-overlap on principle.name + statement.
    // Week-2 codegen + week-4 audit-runner replace with embedding-based search.
    const scored = principles
      .map((p) => {
        const hay = `${p.name} ${p.statement} ${(p.industry_lineage ?? []).join(' ')}`.toLowerCase();
        const tokens = description.split(/\W+/).filter((t) => t.length > 3);
        const hits = tokens.filter((t) => hay.includes(t)).length;
        return { id: p.id, name: p.name, score: hits / Math.max(tokens.length, 1) };
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
              note: 'Skeleton-tier keyword scorer; week-2+ replaces with semantic search.',
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
    const filtered = principles.filter((p) => p.category === category);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            filtered.map((p) => ({ id: p.id, name: p.name, severity: p.severity })),
            null,
            2
          ),
        },
      ],
    };
  }

  return {
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Entry
// ─────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  await loadPrinciples();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr only — stdout is reserved for MCP transport framing
  process.stderr.write(
    `[csps-principles-mcp] listening on stdio; ${principles.length} principles loaded; ` +
      `${Object.keys(ALIASES).length} aliased URIs registered\n`
  );
}

main().catch((err) => {
  process.stderr.write(`[csps-principles-mcp] fatal: ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(1);
});
