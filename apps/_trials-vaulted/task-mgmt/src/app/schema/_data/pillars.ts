export type Status = 'complete' | 'in-progress' | 'planned';
export type Priority = 'critical' | 'important' | 'advisory';
export type AuditStatus = 'answered' | 'pending' | 'blocked';

export interface AuditQuestion {
  id: string;
  question: string;
  status: AuditStatus;
  answeredBy?: string;
  priority: Priority;
}

export interface SubCategory {
  id: string;
  title: string;
  description: string;
  status: Status;
  children?: SubCategory[];
}

export interface Pillar {
  id: string;
  number: number;
  title: string;
  fullTitle: string;
  tagline: string;
  description: string;
  status: Status;
  icon: string;
  subCategories: SubCategory[];
  auditQuestions: AuditQuestion[];
  connections: string[];
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
      { id: 'p0-contracts', title: 'Behavioral Contracts', description: '53 B_* contracts with mechanical enforcement at R1-R4 levels.', status: 'complete' },
      { id: 'p0-validators', title: 'Validators', description: '61 active validators running in pnpm verify.', status: 'complete' },
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
      { id: 'p0-zf', title: 'Zero Findings Protocol', description: 'RZF + CEC + FSE — mechanical verification discipline.', status: 'complete' },
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
      { id: 'p1-a4', question: 'Does every new plan include §0 CONSOLIDATION CHECK?', status: 'answered', answeredBy: 'validate-consolidation-check.mjs', priority: 'important' },
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
      { id: 'p2-rls', title: 'Postgres RLS', description: 'DB-level row isolation via Supabase policies on 7 tables.', status: 'complete' },
      { id: 'p2-gdpr', title: 'GDPR Erasure', description: 'eraseUser() in libs/integrations/gdpr.ts. EU-ready.', status: 'in-progress' },
      { id: 'p2-drift', title: 'Schema Drift Detection', description: 'validate-foundation-schema-drift.mjs in pnpm verify.', status: 'complete' },
    ],
    auditQuestions: [
      { id: 'p2-a1', question: 'Is validate-foundation-schema-drift.mjs passing (ZModel ≈ Prisma)?', status: 'answered', answeredBy: 'validate-foundation-schema-drift.mjs', priority: 'critical' },
      { id: 'p2-a2', question: 'Is enhance(prismaClient) active in all API routes (no bypass)?', status: 'pending', priority: 'critical' },
      { id: 'p2-a3', question: 'Is the AuditEvent Postgres trigger preventing UPDATE/DELETE?', status: 'answered', answeredBy: 'libs/policies/audit-triggers.sql', priority: 'critical' },
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
          { id: 'p3-webhooks', title: 'Clerk Webhooks', description: 'user.created/deleted, org.created/deleted, membership.created/updated/deleted — all idempotent.', status: 'in-progress' },
          { id: 'p3-jwt', title: 'JWT Claims', description: 'tenantId + role in every session token via Clerk JWT template.', status: 'complete' },
        ],
      },
      {
        id: 'p3-billing',
        title: 'Billing (Stripe)',
        description: 'Subscription lifecycle, seat limits, trial logic, feature gating.',
        status: 'in-progress',
        children: [
          { id: 'p3-subscription', title: 'Subscription State Machine', description: 'free→trialing→active→cancelled with config at libs/config/.', status: 'complete' },
          { id: 'p3-seats', title: 'Seat Limits', description: 'getMaxSeats() from SUBSCRIPTION_CONFIG — all values in config.', status: 'planned' },
        ],
      },
      { id: 'p3-notifications', title: 'Notifications', description: 'CCG-scored CORE candidate. Thin wrapper around Resend. GDPR hook required.', status: 'planned' },
      { id: 'p3-errors', title: 'Standard Error Format', description: 'libs/integrations/errors.ts — CspsError { error, message, details? }', status: 'complete' },
    ],
    auditQuestions: [
      { id: 'p3-a1', question: 'Do ALL Clerk webhook events have handlers (including membership.updated)?', status: 'answered', answeredBy: 'libs/integrations/clerk/webhook-handler.ts', priority: 'critical' },
      { id: 'p3-a2', question: 'Is subscription enforcement active on all write routes?', status: 'answered', answeredBy: 'apps/task-mgmt/src/lib/subscription.ts', priority: 'critical' },
      { id: 'p3-a3', question: 'Is webhook idempotency implemented (isProcessed/markProcessed)?', status: 'answered', answeredBy: 'libs/integrations/webhook-idempotency.ts', priority: 'important' },
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
      { id: 'p4-generators', title: 'Generators', description: 'add-consolidation-section.mjs + future: nx g platform:page.', status: 'in-progress' },
    ],
    auditQuestions: [
      { id: 'p4-a1', question: 'Does apps/template/ exist and does pnpm dev work out of the box?', status: 'pending', priority: 'critical' },
      { id: 'p4-a2', question: 'Are @csps/integrations and @csps/config importable via tsconfig paths?', status: 'pending', priority: 'important' },
      { id: 'p4-a3', question: 'Does CSPS_DEVELOPER_GUIDE.md explain: isolation, auth, DB, webhooks, ZF?', status: 'pending', priority: 'important' },
      { id: 'p4-a4', question: 'Is the schema page at /schema accessible without auth?', status: 'answered', answeredBy: 'apps/task-mgmt/src/middleware.ts', priority: 'advisory' },
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
      { id: 'p6-a1', question: 'Is git push to origin running before every handoff write?', status: 'answered', answeredBy: 'post-stop-session-close-gate.sh', priority: 'critical' },
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
