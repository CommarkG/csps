# SONNET IMPLEMENTATION BRIEF — Schema Documentation Page + Threshold Routing
## Written by: OPUS-1 | For: Sonnet Builder tab | S022 | 2026-05-11
## Scope: New public page in apps/task-mgmt at /schema + 7 pillar sub-pages

---

> **Governor directive:** Platform documentation with audits on each part. Everything connects
> to the Threshold. Free text routing → developer/business/personal/platform domains.
> Schema page with Mini Tree Architecture: expandable pillars + sub-pages. UX/UI rules applied.

---

## §0 — WHAT YOU ARE BUILDING

**One schema overview page** at `/schema` — public (no auth required):
- Top: Threshold routing diagram (free text → intent → domain → schema)
- Middle: 7 pillars as expandable blocks (Mini Tree Architecture)
- Each block: title + status badge + description + expand → shows audit questions + sub-categories
- Click pillar title → navigates to pillar sub-page

**Seven pillar sub-pages** at `/schema/[pillar-id]`:
- Full pillar documentation
- Audit checklist (what questions must be answered for this pillar)
- Sub-categories (expandable, 2-3 levels)
- Connections to other pillars

---

## §1 — ROUTE SETUP

### Middleware exception (auth bypass for schema pages)

In `apps/task-mgmt/src/middleware.ts`, add `/schema` to the public routes list:
```typescript
const publicRoutes = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/schema',         // ADD
  '/schema/(.*)',    // ADD — all pillar sub-pages
];
```

### File structure to create

```
apps/task-mgmt/src/app/schema/
  page.tsx                           ← /schema overview
  [pillarId]/
    page.tsx                         ← /schema/pillar-0, /schema/pillar-1, etc.
  _data/
    pillars.ts                       ← all pillar definitions (single source of truth)
  _components/
    ThresholdDiagram.tsx             ← routing flow visualization
    PillarTree.tsx                   ← the expandable Mini Tree
    PillarBlock.tsx                  ← one pillar, collapsible
    AuditChecklist.tsx               ← audit questions with status badges
    SubCategoryTree.tsx              ← recursive sub-category tree
    StatusBadge.tsx                  ← reusable status indicator
```

---

## §2 — DATA STRUCTURE (single source of truth)

Create `apps/task-mgmt/src/app/schema/_data/pillars.ts`:

```typescript
export type Status = 'complete' | 'in-progress' | 'planned';
export type Priority = 'critical' | 'important' | 'advisory';
export type AuditStatus = 'answered' | 'pending' | 'blocked';

export interface AuditQuestion {
  id: string;
  question: string;
  status: AuditStatus;
  answeredBy?: string;  // file path or artifact name that answers this
  priority: Priority;
}

export interface SubCategory {
  id: string;
  title: string;
  description: string;
  status: Status;
  children?: SubCategory[];  // Mini Tree: recursive, max 3 levels
}

export interface Pillar {
  id: string;               // 'pillar-0' through 'pillar-6'
  number: number;
  title: string;            // short: 'Governance'
  fullTitle: string;        // 'Pillar 0 — Governance'
  tagline: string;          // one sentence: what this pillar does
  description: string;      // 2-3 sentences: full explanation
  status: Status;
  icon: string;             // emoji
  subCategories: SubCategory[];
  auditQuestions: AuditQuestion[];
  connections: string[];    // pillar IDs this depends on or feeds into
}

export const PILLARS: Pillar[] = [
  {
    id: 'pillar-0',
    number: 0,
    title: 'Governance',
    fullTitle: 'Pillar 0 — Governance',
    tagline: 'The rules that govern every decision in every app build.',
    description:
      'Governance defines the behavioral contracts, principles, and validators that ' +
      'ensure every session and every app follows the same rules. It is the constitutional ' +
      'layer — the only pillar that every other pillar inherits from.',
    status: 'complete',
    icon: '⚖️',
    connections: ['pillar-1', 'pillar-2', 'pillar-3', 'pillar-4', 'pillar-5', 'pillar-6'],
    subCategories: [
      {
        id: 'p0-principles',
        title: 'Principles',
        description: '55 P-META / P-ARCH / P-OP principles governing all decisions.',
        status: 'complete',
        children: [
          { id: 'p0-p-meta', title: 'P-META (Meta Governance)', description: 'How the platform governs itself.', status: 'complete' },
          { id: 'p0-p-arch', title: 'P-ARCH (Architecture)', description: 'Structural integrity principles.', status: 'complete' },
          { id: 'p0-p-op', title: 'P-OP (Operations)', description: 'Operational discipline principles.', status: 'complete' },
        ],
      },
      {
        id: 'p0-contracts',
        title: 'Behavioral Contracts',
        description: '52 B_* contracts with mechanical enforcement at R1-R4 levels.',
        status: 'complete',
      },
      {
        id: 'p0-validators',
        title: 'Validators',
        description: '61 active validators running in pnpm verify.',
        status: 'complete',
      },
      {
        id: 'p0-council',
        title: 'Mini Internal Council',
        description: '6-member review system + Opus ratification sealing protocol.',
        status: 'in-progress',
        children: [
          { id: 'p0-council-core', title: 'Core Council', description: 'Full review + Opus seal for depth-5 plans.', status: 'complete' },
          { id: 'p0-council-mini', title: 'Mini Council', description: '2-3 member quick review.', status: 'complete' },
          { id: 'p0-council-external', title: 'External Council', description: 'Sonnet + external AI systems.', status: 'planned' },
        ],
      },
      {
        id: 'p0-zf',
        title: 'Zero Findings Protocol',
        description: 'RZF + CEC + FSE — mechanical verification discipline.',
        status: 'complete',
      },
    ],
    auditQuestions: [
      { id: 'p0-a1', question: 'Is pnpm verify exit_code=0 with all 61 validators passing?', status: 'answered', answeredBy: 'tools/verify.mjs', priority: 'critical' },
      { id: 'p0-a2', question: 'Are all behavioral contracts at ≥ R1 with mechanical enforcement?', status: 'answered', answeredBy: 'tools/council/opus-turn.md Turn 2', priority: 'critical' },
      { id: 'p0-a3', question: 'Is the Priority Engine scoring current and connected to PE dashboard?', status: 'pending', priority: 'important' },
      { id: 'p0-a4', question: 'Are all VLTs in session-state.json either RESOLVED or tracked?', status: 'answered', answeredBy: 'tools/session-state.json', priority: 'critical' },
      { id: 'p0-a5', question: 'Does every Opus turn have a ## RZF VERIFICATION section?', status: 'answered', answeredBy: 'validate-opus-turn-rzf.mjs', priority: 'important' },
      { id: 'p0-a6', question: 'Is the consolidation pass running on all new comprehensive guides?', status: 'pending', priority: 'advisory' },
    ],
  },
  {
    id: 'pillar-1',
    number: 1,
    title: 'Architecture & Stack',
    fullTitle: 'Pillar 1 — Architecture & Stack',
    tagline: 'The structural contracts every artifact and app must conform to.',
    description:
      'Architecture defines the Core Spines, naming conventions, frontmatter schema, ' +
      'and layer boundaries that make the platform coherent at scale. Every artifact ' +
      'declares its spine; every app inherits the structural contract.',
    status: 'in-progress',
    icon: '🏗️',
    connections: ['pillar-0', 'pillar-2', 'pillar-4'],
    subCategories: [
      {
        id: 'p1-spines',
        title: '5 Core Spines',
        description: 'GVRN / ARCH / AI / VALD / OPER with L0/L1/L2/L3 doctrine.',
        status: 'complete',
        children: [
          { id: 'p1-gvrn', title: 'GVRN Spine', description: 'Governance and decision rights.', status: 'complete' },
          { id: 'p1-arch', title: 'ARCH Spine', description: 'Data model and schema.', status: 'complete' },
          { id: 'p1-ai', title: 'AI Spine', description: 'AI behavior and inner defaults.', status: 'complete' },
          { id: 'p1-vald', title: 'VALD Spine', description: 'Validation and coverage discipline.', status: 'complete' },
          { id: 'p1-oper', title: 'OPER Spine', description: 'Operations and delivery.', status: 'complete' },
        ],
      },
      { id: 'p1-naming', title: 'Naming Policy', description: '4-rule naming policy (B_NAMING_POLICY) with validator.', status: 'complete' },
      { id: 'p1-frontmatter', title: 'Frontmatter Schema', description: 'Closed-enum frontmatter standard for all governed artifacts.', status: 'complete' },
      { id: 'p1-layers', title: 'Layer Boundaries', description: 'CORE layer (libs/tools/) vs APP layer (apps/) — never cross.', status: 'in-progress' },
      { id: 'p1-primitives', title: 'Core Primitives', description: 'CCG-gated functional capabilities sealed at L1 (DNA Element 14).', status: 'planned' },
    ],
    auditQuestions: [
      { id: 'p1-a1', question: 'Does every governed artifact declare core_spine + schema_anchor?', status: 'pending', priority: 'critical' },
      { id: 'p1-a2', question: 'Are the 5 L1 Core Spine files sealed (no edits without ADR)?', status: 'answered', answeredBy: '.claude/core-spines/', priority: 'critical' },
      { id: 'p1-a3', question: 'Is validate-layer-boundary.mjs running and passing?', status: 'pending', priority: 'important' },
      { id: 'p1-a4', question: 'Does every new plan include §0 CONSOLIDATION CHECK?', status: 'pending', priority: 'important' },
      { id: 'p1-a5', question: 'Is the Core Primitives CCG gate active for new feature proposals?', status: 'pending', priority: 'advisory' },
    ],
  },
  {
    id: 'pillar-2',
    number: 2,
    title: 'Data & Schema',
    fullTitle: 'Pillar 2 — Data & Schema',
    tagline: 'Multi-tenant data isolation, ZenStack enforcement, and schema integrity.',
    description:
      'Data defines the ZModel schema, Prisma migrations, tenant isolation policies, ' +
      'and audit event patterns. ZenStack enforces @@allow rules at the ORM layer. ' +
      'Postgres RLS enforces at the DB layer. Defense in depth from day one.',
    status: 'complete',
    icon: '🗄️',
    connections: ['pillar-1', 'pillar-3'],
    subCategories: [
      {
        id: 'p2-schema',
        title: 'Foundation Schema',
        description: 'User / Tenant / UserTenant / AuditEvent — the 4 foundation slices.',
        status: 'complete',
        children: [
          { id: 'p2-user', title: 'User Model', description: 'Clerk-linked, soft-delete, PII fields.', status: 'complete' },
          { id: 'p2-tenant', title: 'Tenant Model', description: 'Multi-tenant root, subscription status, calendar config.', status: 'complete' },
          { id: 'p2-audit', title: 'AuditEvent (AppendOnlyBase)', description: 'Immutable event log. No UPDATE/DELETE at DB level.', status: 'complete' },
        ],
      },
      { id: 'p2-zenstack', title: 'ZenStack Policies', description: 'ORM-layer @@allow rules enforced via enhance(prismaClient).', status: 'in-progress' },
      { id: 'p2-rls', title: 'Postgres RLS', description: 'DB-level row isolation via Supabase policies.', status: 'complete' },
      { id: 'p2-gdpr', title: 'GDPR Erasure', description: 'eraseUser() in libs/integrations/gdpr.ts. EU-ready.', status: 'in-progress' },
      { id: 'p2-drift', title: 'Schema Drift Detection', description: 'validate-foundation-schema-drift.mjs in pnpm verify.', status: 'complete' },
    ],
    auditQuestions: [
      { id: 'p2-a1', question: 'Is validate-foundation-schema-drift.mjs passing (ZModel ≈ Prisma)?', status: 'answered', answeredBy: 'validate-foundation-schema-drift.mjs', priority: 'critical' },
      { id: 'p2-a2', question: 'Is enhance(prismaClient) active in all API routes (no bypass)?', status: 'pending', priority: 'critical' },
      { id: 'p2-a3', question: 'Is the AuditEvent Postgres trigger preventing UPDATE/DELETE?', status: 'pending', priority: 'critical' },
      { id: 'p2-a4', question: 'Is eraseUser() exported from libs/integrations and covering notification logs?', status: 'pending', priority: 'important' },
      { id: 'p2-a5', question: 'Does every new entity extend Base (soft-delete) or AppendOnlyBase (immutable)?', status: 'pending', priority: 'important' },
    ],
  },
  {
    id: 'pillar-3',
    number: 3,
    title: 'Platform Services',
    fullTitle: 'Pillar 3 — Platform Services',
    tagline: 'Auth, billing, webhooks, notifications — inherited by every app.',
    description:
      'Platform Services is everything an app needs to run in production: Clerk auth, ' +
      'Stripe billing, webhook handling, subscription enforcement, and the GDPR erasure path. ' +
      'Every app inherits these from libs/ — no re-implementation.',
    status: 'in-progress',
    icon: '⚙️',
    connections: ['pillar-2', 'pillar-4', 'pillar-6'],
    subCategories: [
      {
        id: 'p3-auth',
        title: 'Auth (Clerk)',
        description: 'JWT custom claims (tenantId + role), webhook lifecycle, session context.',
        status: 'complete',
        children: [
          { id: 'p3-webhooks', title: 'Clerk Webhooks', description: 'user.created/deleted, org.created/deleted, membership.created/updated/deleted', status: 'in-progress' },
          { id: 'p3-jwt', title: 'JWT Claims', description: 'tenantId + role in every session token.', status: 'complete' },
        ],
      },
      {
        id: 'p3-billing',
        title: 'Billing (Stripe)',
        description: 'Subscription lifecycle, seat limits, trial logic, feature gating.',
        status: 'in-progress',
        children: [
          { id: 'p3-subscription', title: 'Subscription State Machine', description: 'free→trialing→active→cancelled with config at libs/config/.', status: 'complete' },
          { id: 'p3-seats', title: 'Seat Limits', description: 'getMaxSeats() from SUBSCRIPTION_CONFIG — all values in config.', status: 'pending' },
        ],
      },
      { id: 'p3-notifications', title: 'Notifications', description: 'CCG-scored CORE candidate. Thin wrapper around Resend. GDPR hook required.', status: 'planned' },
      { id: 'p3-errors', title: 'Standard Error Format', description: 'libs/integrations/errors.ts — CspsError { error, message, details? }', status: 'pending' },
    ],
    auditQuestions: [
      { id: 'p3-a1', question: 'Do ALL Clerk webhook events have handlers (including membership.updated)?', status: 'pending', priority: 'critical' },
      { id: 'p3-a2', question: 'Is subscription enforcement active on all write routes?', status: 'pending', priority: 'critical' },
      { id: 'p3-a3', question: 'Is webhook idempotency implemented (isProcessed/markProcessed)?', status: 'pending', priority: 'important' },
      { id: 'p3-a4', question: 'Are seat limits enforced at invitation time?', status: 'pending', priority: 'important' },
      { id: 'p3-a5', question: 'Is trial conversion wired to Stripe Checkout?', status: 'pending', priority: 'important' },
    ],
  },
  {
    id: 'pillar-4',
    number: 4,
    title: 'Developer Experience',
    fullTitle: 'Pillar 4 — Developer Experience',
    tagline: 'The template, guides, and generators that make building App #2 fast.',
    description:
      'Developer Experience defines everything the second developer (or the Governor building App #2) ' +
      'needs to start: a working template, import patterns via @csps/integrations and @csps/config, ' +
      'and the CSPS Developer Guide explaining every pattern.',
    status: 'planned',
    icon: '👩‍💻',
    connections: ['pillar-1', 'pillar-3'],
    subCategories: [
      { id: 'p4-template', title: 'App Template', description: 'apps/template/ — fork to build any new CSPS app.', status: 'planned' },
      { id: 'p4-imports', title: 'Import Patterns', description: '@csps/integrations + @csps/config + @csps/core (future).', status: 'in-progress' },
      { id: 'p4-guide', title: 'CSPS Developer Guide', description: 'CSPS_DEVELOPER_GUIDE.md: 5 critical patterns every app dev must know.', status: 'planned' },
      { id: 'p4-generators', title: 'Generators', description: 'nx g platform:page / :skill / :agent etc.', status: 'planned' },
    ],
    auditQuestions: [
      { id: 'p4-a1', question: 'Does apps/template/ exist and does pnpm dev work out of the box?', status: 'pending', priority: 'critical' },
      { id: 'p4-a2', question: 'Are @csps/integrations and @csps/config importable from any app via tsconfig paths?', status: 'in-progress', priority: 'important' },
      { id: 'p4-a3', question: 'Does CSPS_DEVELOPER_GUIDE.md explain: isolation, auth, DB, webhooks, ZF?', status: 'pending', priority: 'important' },
      { id: 'p4-a4', question: 'Is the schema page at /schema accessible without auth?', status: 'pending', priority: 'advisory' },
    ],
  },
  {
    id: 'pillar-5',
    number: 5,
    title: 'AI Systems',
    fullTitle: 'Pillar 5 — AI Systems',
    tagline: 'The governed AI collaboration layer: council, personas, alignment, session memory.',
    description:
      'AI Systems governs how AI models collaborate on the platform: inner-AI-defaults registry, ' +
      'council architecture (Opus/Sonnet/Haiku roles), behavioral contract enforcement, ' +
      'and the session-to-session memory that makes the platform smarter over time.',
    status: 'in-progress',
    icon: '🤖',
    connections: ['pillar-0', 'pillar-6'],
    subCategories: [
      {
        id: 'p5-council',
        title: 'Council Architecture',
        description: '3 model tiers + 6-member review council + OPUS MODE BRIEF standard.',
        status: 'complete',
        children: [
          { id: 'p5-opus', title: 'Opus Advisor', description: 'Strategic review, plan ratification, Opus seal.', status: 'complete' },
          { id: 'p5-sonnet', title: 'Sonnet Builder', description: 'Implementation, validators, commits.', status: 'complete' },
          { id: 'p5-haiku', title: 'Haiku Scanner', description: 'Tier 3 file scan, pattern detection, structured return.', status: 'complete' },
        ],
      },
      { id: 'p5-defaults', title: 'Inner-AI Defaults', description: '39 entries across 5 categories — override/keep/adjust per CSPS DNA.', status: 'in-progress' },
      { id: 'p5-rzf', title: 'ZF on Opus Output', description: 'validate-opus-turn-rzf.mjs — every Opus turn must have RZF evidence.', status: 'complete' },
      { id: 'p5-contracts', title: 'R1-R5 Contract Classification', description: '52 contracts classified — R1 stays in AGENTS.md, R2-R4 moves to CDAB layers.', status: 'in-progress' },
    ],
    auditQuestions: [
      { id: 'p5-a1', question: 'Is enforcement_rate ≥ 29% (% of behavioral contracts with live validators)?', status: 'answered', answeredBy: 'session-state.json enforcement_rate: 29%', priority: 'important' },
      { id: 'p5-a2', question: 'Is the inner-ai-defaults registry current for claude-sonnet-4-6[1m]?', status: 'pending', priority: 'important' },
      { id: 'p5-a3', question: 'Does validate-opus-turn-rzf.mjs pass (all turns have RZF evidence)?', status: 'answered', answeredBy: 'validate-opus-turn-rzf.mjs', priority: 'critical' },
      { id: 'p5-a4', question: 'Is the Council Architecture documented and templates created?', status: 'answered', answeredBy: 'tools/council/council-architecture.md', priority: 'important' },
      { id: 'p5-a5', question: 'Is sessions_since_opus_review < 10 (next Opus due at S029)?', status: 'answered', answeredBy: 'session-state.json sessions_since_opus_review: 2', priority: 'advisory' },
    ],
  },
  {
    id: 'pillar-6',
    number: 6,
    title: 'Operations & Delivery',
    fullTitle: 'Pillar 6 — Operations & Delivery',
    tagline: 'Zero laptop dependency, graduation tracking, multi-machine parity.',
    description:
      'Operations defines how the platform stays alive across sessions: auto-push at session close, ' +
      'Codespaces for zero-laptop-dependency, the graduation trigger at $1K MRR, ' +
      'and the build order that prevents apps from being built on an incomplete foundation.',
    status: 'in-progress',
    icon: '🚀',
    connections: ['pillar-0', 'pillar-4'],
    subCategories: [
      { id: 'p6-git', title: 'Git Discipline', description: 'Auto-push at session close. All work on GitHub before handoff write.', status: 'complete' },
      { id: 'p6-codespaces', title: 'Zero Laptop Dependency', description: 'devcontainer.json + bootstrap.ps1 for any machine.', status: 'in-progress' },
      { id: 'p6-graduation', title: 'Graduation Tracker', description: '$1K MRR trigger per app → graduation to standalone product.', status: 'planned' },
      { id: 'p6-build-order', title: 'Build Order', description: 'Bedrock first, foundation before apps, FOUNDATION_EXIT_GATE.', status: 'complete' },
    ],
    auditQuestions: [
      { id: 'p6-a1', question: 'Is git push to origin running before every handoff write?', status: 'pending', priority: 'critical' },
      { id: 'p6-a2', question: 'Does devcontainer.json have pnpm + node versions locked?', status: 'pending', priority: 'important' },
      { id: 'p6-a3', question: 'Is the graduation tracker defined with a measurable $1K MRR check?', status: 'pending', priority: 'advisory' },
      { id: 'p6-a4', question: 'Is validate-phase-exit-criteria.mjs passing (FOUNDATION_EXIT_GATE)?', status: 'answered', answeredBy: 'validate-phase-exit-criteria.mjs', priority: 'critical' },
    ],
  },
];

export const THRESHOLD_ROUTES = [
  { domain: 'Developer', icon: '👩‍💻', example: 'Build a task list feature', target: 'Pillar 1→2→4' },
  { domain: 'Business', icon: '💼', example: 'Add team billing for my SaaS', target: 'Pillar 3→2→6' },
  { domain: 'Personal', icon: '👤', example: 'Track my daily habits', target: 'Pillar 2→3 (personal domain)' },
  { domain: 'Platform', icon: '⚖️', example: 'Add a new governance contract', target: 'Pillar 0→1' },
  { domain: 'Knowledge', icon: '📚', example: 'Document an architecture decision', target: 'Pillar 0→4' },
  { domain: 'Social', icon: '🤝', example: 'Build a community feature', target: 'Pillar 2→3 (social domain)' },
];
```

---

## §3 — COMPONENTS

### 3.1 StatusBadge

```tsx
// apps/task-mgmt/src/app/schema/_components/StatusBadge.tsx
import type { Status } from '../_data/pillars';

const STATUS_CONFIG: Record<Status, { label: string; classes: string }> = {
  complete:    { label: 'Complete', classes: 'bg-green-100 text-green-800 border border-green-200' },
  'in-progress': { label: 'In Progress', classes: 'bg-amber-100 text-amber-800 border border-amber-200' },
  planned:     { label: 'Planned', classes: 'bg-slate-100 text-slate-600 border border-slate-200' },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, classes } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
```

### 3.2 AuditChecklist

```tsx
// apps/task-mgmt/src/app/schema/_components/AuditChecklist.tsx
import type { AuditQuestion } from '../_data/pillars';

const PRIORITY_ICON: Record<string, string> = {
  critical: '🔴',
  important: '🟡',
  advisory: '🔵',
};

const STATUS_ICON: Record<string, string> = {
  answered: '✅',
  pending:  '⏳',
  blocked:  '❌',
};

export function AuditChecklist({ questions }: { questions: AuditQuestion[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
        Audit Questions
      </h3>
      <ul className="space-y-2">
        {questions.map((q) => (
          <li key={q.id} className="flex items-start gap-3 text-sm">
            <span className="shrink-0 mt-0.5">{STATUS_ICON[q.status]}</span>
            <span className="flex-1 text-slate-700">{q.question}</span>
            <span className="shrink-0">{PRIORITY_ICON[q.priority]}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-400 pt-1">
        🔴 Critical · 🟡 Important · 🔵 Advisory
      </p>
    </div>
  );
}
```

### 3.3 SubCategoryTree (recursive Mini Tree)

```tsx
// apps/task-mgmt/src/app/schema/_components/SubCategoryTree.tsx
'use client';
import { useState } from 'react';
import type { SubCategory } from '../_data/pillars';
import { StatusBadge } from './StatusBadge';

function SubCategoryNode({ node, depth = 0 }: { node: SubCategory; depth?: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-4 border-l border-slate-100 pl-3' : ''}`}>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`w-full flex items-start gap-2 py-2 text-left group
          ${hasChildren ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {hasChildren && (
          <span className="shrink-0 mt-0.5 text-slate-400 group-hover:text-slate-600 transition-colors">
            {expanded ? '▾' : '▸'}
          </span>
        )}
        {!hasChildren && <span className="shrink-0 mt-0.5 w-4" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-800">{node.title}</span>
            <StatusBadge status={node.status} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{node.description}</p>
        </div>
      </button>
      {expanded && hasChildren && (
        <div className="mt-1">
          {node.children!.map((child) => (
            <SubCategoryNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SubCategoryTree({ categories }: { categories: SubCategory[] }) {
  return (
    <div className="divide-y divide-slate-50">
      {categories.map((cat) => (
        <SubCategoryNode key={cat.id} node={cat} />
      ))}
    </div>
  );
}
```

### 3.4 PillarBlock

```tsx
// apps/task-mgmt/src/app/schema/_components/PillarBlock.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Pillar } from '../_data/pillars';
import { StatusBadge } from './StatusBadge';
import { AuditChecklist } from './AuditChecklist';
import { SubCategoryTree } from './SubCategoryTree';

export function PillarBlock({ pillar }: { pillar: Pillar }) {
  const [expanded, setExpanded] = useState(false);
  const answeredCount = pillar.auditQuestions.filter((q) => q.status === 'answered').length;
  const totalCount = pillar.auditQuestions.length;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-2xl shrink-0">{pillar.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-base font-semibold text-slate-900">{pillar.fullTitle}</h2>
            <StatusBadge status={pillar.status} />
            <span className="text-xs text-slate-400">
              {answeredCount}/{totalCount} audit questions answered
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-0.5">{pillar.tagline}</p>
        </div>
        <span className="shrink-0 text-slate-400 text-lg">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-6">
          {/* Description */}
          <p className="text-sm text-slate-700 leading-relaxed">{pillar.description}</p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Sub-categories (Mini Tree) */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Sub-Categories
              </h3>
              <SubCategoryTree categories={pillar.subCategories} />
            </div>

            {/* Audit questions */}
            <AuditChecklist questions={pillar.auditQuestions} />
          </div>

          {/* Connections */}
          {pillar.connections.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Connects To
              </h3>
              <div className="flex gap-2 flex-wrap">
                {pillar.connections.map((connId) => (
                  <Link
                    key={connId}
                    href={`/schema/${connId}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs
                      bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    {connId.replace('pillar-', 'Pillar ')} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Link to full sub-page */}
          <Link
            href={`/schema/${pillar.id}`}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800
              font-medium hover:underline"
          >
            View full {pillar.title} documentation →
          </Link>
        </div>
      )}
    </div>
  );
}
```

### 3.5 ThresholdDiagram

```tsx
// apps/task-mgmt/src/app/schema/_components/ThresholdDiagram.tsx
import { THRESHOLD_ROUTES } from '../_data/pillars';

export function ThresholdDiagram() {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">The Threshold</h2>
      <p className="text-sm text-slate-600 mb-5">
        Every input — free text, feature request, or directive — enters through The Threshold.
        It classifies intent and routes to the correct domain before any implementation begins.
      </p>

      {/* Flow diagram */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="w-full max-w-sm bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Free text input</p>
          <p className="text-sm font-medium text-slate-700 italic">
            "I want to work on a landing page element..."
          </p>
        </div>
        <div className="text-slate-300 text-xl">↓</div>
        <div className="bg-indigo-600 text-white rounded-lg px-6 py-3 text-center shadow">
          <p className="text-xs uppercase tracking-widest mb-1 opacity-75">Classify intent</p>
          <p className="text-sm font-bold">THE THRESHOLD</p>
        </div>
        <div className="text-slate-300 text-xl">↓</div>
      </div>

      {/* Domain grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {THRESHOLD_ROUTES.map((route) => (
          <div
            key={route.domain}
            className="rounded-lg border border-slate-200 bg-white p-3 hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{route.icon}</span>
              <span className="text-sm font-semibold text-slate-800">{route.domain}</span>
            </div>
            <p className="text-xs text-slate-500 italic mb-2">"{route.example}"</p>
            <p className="text-xs text-indigo-600 font-medium">{route.target}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## §4 — PAGES

### 4.1 Overview page: /schema/page.tsx

```tsx
// apps/task-mgmt/src/app/schema/page.tsx
import { PILLARS } from './_data/pillars';
import { ThresholdDiagram } from './_components/ThresholdDiagram';
import { PillarBlock } from './_components/PillarBlock';

export const metadata = {
  title: 'CSPS Schema — Platform Documentation',
  description: 'The complete CSPS platform architecture: 7 pillars, audit questions, and routing.',
};

export default function SchemaPage() {
  const complete = PILLARS.filter((p) => p.status === 'complete').length;
  const inProgress = PILLARS.filter((p) => p.status === 'in-progress').length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Hero */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">CSPS Platform Schema</h1>
          <p className="text-slate-600 max-w-2xl">
            The complete architecture of the CoreSights Platform Services. Every pillar answers
            specific audit questions. Everything connects through The Threshold.
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="text-green-700 font-medium">✅ {complete} complete</span>
            <span className="text-amber-700 font-medium">⏳ {inProgress} in progress</span>
            <span className="text-slate-500">7 pillars total</span>
          </div>
        </div>

        {/* Threshold routing */}
        <ThresholdDiagram />

        {/* Pillars (Mini Tree Architecture) */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Platform Pillars</h2>
          <div className="space-y-3">
            {PILLARS.map((pillar) => (
              <PillarBlock key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-400 text-center pb-4">
          CSPS Platform Documentation · Auto-generated from pillar definitions ·{' '}
          <a href="https://github.com/CommarkG/csps" className="hover:underline">
            github.com/CommarkG/csps
          </a>
        </p>
      </div>
    </main>
  );
}
```

### 4.2 Pillar sub-page: /schema/[pillarId]/page.tsx

```tsx
// apps/task-mgmt/src/app/schema/[pillarId]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PILLARS } from '../_data/pillars';
import { StatusBadge } from '../_components/StatusBadge';
import { AuditChecklist } from '../_components/AuditChecklist';
import { SubCategoryTree } from '../_components/SubCategoryTree';

export async function generateStaticParams() {
  return PILLARS.map((p) => ({ pillarId: p.id }));
}

export async function generateMetadata({ params }: { params: { pillarId: string } }) {
  const pillar = PILLARS.find((p) => p.id === params.pillarId);
  if (!pillar) return {};
  return { title: `${pillar.fullTitle} — CSPS Schema` };
}

export default function PillarPage({ params }: { params: { pillarId: string } }) {
  const pillar = PILLARS.find((p) => p.id === params.pillarId);
  if (!pillar) notFound();

  const connectedPillars = PILLARS.filter((p) => pillar.connections.includes(p.id));
  const answeredCount = pillar.auditQuestions.filter((q) => q.status === 'answered').length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500">
          <Link href="/schema" className="hover:text-slate-900 hover:underline">Schema</Link>
          {' / '}
          <span className="text-slate-900">{pillar.title}</span>
        </nav>

        {/* Hero */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{pillar.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{pillar.fullTitle}</h1>
                <StatusBadge status={pillar.status} />
              </div>
              <p className="text-base text-slate-600 italic mb-3">{pillar.tagline}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{pillar.description}</p>
            </div>
          </div>
        </div>

        {/* Audit status summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Audit Status</h2>
            <span className="text-sm text-slate-500">
              {answeredCount} / {pillar.auditQuestions.length} answered
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
            <div
              className="bg-green-500 rounded-full h-2 transition-all"
              style={{ width: `${(answeredCount / pillar.auditQuestions.length) * 100}%` }}
            />
          </div>
          <AuditChecklist questions={pillar.auditQuestions} />
        </div>

        {/* Sub-categories (Mini Tree) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Components</h2>
          <SubCategoryTree categories={pillar.subCategories} />
        </div>

        {/* Connected pillars */}
        {connectedPillars.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Connected Pillars</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {connectedPillars.map((conn) => (
                <Link
                  key={conn.id}
                  href={`/schema/${conn.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200
                    hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-2xl">{conn.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700">
                      {conn.fullTitle}
                    </p>
                    <p className="text-xs text-slate-500">{conn.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <Link
          href="/schema"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          ← Back to all pillars
        </Link>
      </div>
    </main>
  );
}
```

---

## §5 — EVIDENCE GATES

After implementing:

```bash
# Compile check
cd apps/task-mgmt && npx tsc --noEmit
```
PASTE output — zero errors required.

```bash
# Verify
pnpm verify
```
PASTE output — exit_code=0 required.

**Functional evidence:**
```
[SCHEMA-E1] /schema: loads without auth, shows all 7 pillars
[SCHEMA-E2] Pillar block: click expands, shows sub-categories + audit questions
[SCHEMA-E3] Sub-category: recursive expand works (3 levels)
[SCHEMA-E4] /schema/pillar-0: loads, shows full audit checklist with progress bar
[SCHEMA-E5] /schema/pillar-2: shows Data & Schema with correct status badges
[SCHEMA-E6] Connected pillars: links navigate to correct pillar sub-pages
[SCHEMA-E7] Mobile: accordion works on small screen, no horizontal overflow
```

---

## §6 — UIUX RULES APPLIED

Per CSPS UX standards:
- **BLUF:** page title + tagline immediately communicate value — no preamble
- **Progressive disclosure:** expand blocks, not all-visible — reduces cognitive load
- **Status indicators:** StatusBadge on every item — state is never hidden
- **Audit questions:** every pillar has explicit "what must be answered" — nothing implied
- **Connections visible:** related pillars surfaced in every view
- **Public access:** no auth required — documentation is for everyone including developers
- **Deep linking:** each pillar is a URL — shareable
- **Mini Tree:** max 3 levels deep — beyond that, create a new page

---

## §FLEXIBILITY MAP

| When feedback arrives | Edit this file | Change |
|---|---|---|
| "Add a new audit question to Pillar 2" | `pillars.ts` PILLARS[2].auditQuestions | Add AuditQuestion object |
| "Mark an audit question as answered" | `pillars.ts` | Change status: 'answered', add answeredBy |
| "Add a new sub-category" | `pillars.ts` PILLARS[N].subCategories | Add SubCategory object |
| "Change pillar status" | `pillars.ts` PILLARS[N].status | Change to 'complete'/'in-progress'/'planned' |
| "Add Threshold routing domain" | `pillars.ts` THRESHOLD_ROUTES | Add route object |
| "Add a new pillar" | `pillars.ts` PILLARS array | Add Pillar object, create sub-page auto (generateStaticParams) |

---

## RZF VERIFICATION
Cycles run: 3 | Gaps surfaced: 2 | Critical gaps: 0
Cycle 1: Did I miss anything in the spec?
  Findings: 2 — (a) auth middleware not specified for public route, (b) mobile accordion
Cycle 2: Both addressed? Yes — middleware section in §1, mobile class in §3.4 PillarBlock.
Cycle 3: 0 new findings.
Status: ZF ACHIEVED

---

*Schema Documentation Page — OPUS MODE BRIEF*
*Sonnet: read §0 first, then §1 (middleware), then §2 (data), then §3-4 (components + pages)*
*OPUS-1 | S022 | 2026-05-11*
