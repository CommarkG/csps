// CSPS Routing Config — The Threshold Wizard Template Library
// Governor directive S023: every input must be classified before work begins.
// "Accurate goal setting prevents multiple drifts."
//
// These templates are VERIFIED — they represent ratified paths through the platform.
// Each template specifies: steps, pillars, protocols, UX principles.
// Templates are Governor-editable (add/modify here → all wizards update automatically).

export type ThresholdRoute =
  | 'developer.new-entity'
  | 'developer.new-page'
  | 'developer.api-integration'
  | 'business.billing'
  | 'business.permissions'
  | 'ux.onboarding-flow'
  | 'platform.governance'
  | 'personal.tracking'
  | 'knowledge.documentation'
  | 'none';

export interface WizardStep {
  order: number;
  title: string;
  description: string;
  protocol?: string;          // which protocol governs this step
  required: boolean;
  acceptance_criterion: string; // how do we know this step is DONE
}

export interface WizardTemplate {
  id: ThresholdRoute;
  label: string;
  jtbd_outcome_prompt: string; // "What will success look like?" framing
  pillars: number[];           // which schema pillars to consult in order
  ux_principle: string;        // primary UX principle for this path
  steps: WizardStep[];
  clarifying_questions: string[]; // 1-3 questions AI asks to confirm this template
  intent_signals: string[];       // keywords that trigger this template
}

export const WIZARD_TEMPLATES: Record<ThresholdRoute, WizardTemplate> = {
  'developer.new-entity': {
    id: 'developer.new-entity',
    label: 'Build a new data entity / domain model',
    jtbd_outcome_prompt: 'When this is done, what new data can the app store that it couldn\'t before?',
    pillars: [2, 1, 4],
    ux_principle: 'progressive-disclosure',
    clarifying_questions: [
      'Does this entity belong to a tenant (is it tenant-scoped)?',
      'Is this a new concept or an extension of an existing model?',
    ],
    intent_signals: ['model', 'entity', 'schema', 'database', 'table', 'field', 'store', 'save', 'data'],
    steps: [
      { order: 1, title: '§0 CONSOLIDATION CHECK', description: 'Search schema.zmodel for similar entities. Never create what already exists.', required: true, acceptance_criterion: 'No similar entity found OR existing entity confirmed insufficient' },
      { order: 2, title: 'CCG Assessment', description: 'Score this entity: is it CORE (≥7.0), DEVELOPER LAYER (4-6.9), or APP LAYER (<4)?', protocol: 'core-primitives-architecture.md §4.2', required: true, acceptance_criterion: 'CCG score computed, classification declared in plan frontmatter' },
      { order: 3, title: 'Schema Design', description: 'Add to libs/policies/schema.zmodel with: extends Base, tenantId, @@allow policies, @@deny delete', required: true, acceptance_criterion: 'Entity in schema.zmodel, zenstack generate passes' },
      { order: 4, title: 'Prisma Mirror', description: 'Mirror in apps/[app]/prisma/schema.prisma with correct column names', required: true, acceptance_criterion: 'validate-foundation-schema-drift.mjs exit_code=0' },
      { order: 5, title: 'API Routes', description: 'POST (create) + GET (list) + PUT (update) — each with subscription check + ZenStack + AuditEvent', required: true, acceptance_criterion: 'All routes return correct errors, AuditEvent written for each mutation' },
      { order: 6, title: 'Verify + ZF', description: 'pnpm verify exit_code=0, pnpm zf:deep ZF ACHIEVED', required: true, acceptance_criterion: 'Both pass with evidence pasted' },
    ],
  },

  'developer.new-page': {
    id: 'developer.new-page',
    label: 'Build a new user-facing page or screen',
    jtbd_outcome_prompt: 'When this page exists, what can a user accomplish that they couldn\'t before?',
    pillars: [4, 3, 2],
    ux_principle: 'jtbd-outcome-first',
    clarifying_questions: [
      'Is this for an admin (owner/admin role) or any member?',
      'Does this page need to exist at a fixed URL or is it part of a flow?',
    ],
    intent_signals: ['page', 'screen', 'view', 'UI', 'dashboard', 'display', 'show', 'list', 'form'],
    steps: [
      { order: 1, title: 'JTBD Outcome Statement', description: 'Write: "When this page is done, [user type] can [accomplish what]"', required: true, acceptance_criterion: 'jtbd_outcome: declared in plan frontmatter' },
      { order: 2, title: 'UX Principle Declaration', description: 'Choose governing UX principle for this screen', required: true, acceptance_criterion: 'ux_principle: declared in page.tsx comment' },
      { order: 3, title: 'Mobile-First Spec', description: 'Describe the smallest viable version of this screen (phone viewport)', required: true, acceptance_criterion: 'Mobile layout described before desktop' },
      { order: 4, title: 'Progressive Disclosure Plan', description: 'What is visible immediately? What is revealed on interaction?', required: true, acceptance_criterion: 'Two-level disclosure documented' },
      { order: 5, title: 'Role Gate', description: 'Which roles can access? Check hasPermission() from roles.config.ts', required: true, acceptance_criterion: 'Role check implemented or explicitly N/A' },
      { order: 6, title: 'Verify + ZF', description: 'TypeScript 0 errors + pnpm verify exit_code=0 + pnpm zf:deep', required: true, acceptance_criterion: 'All pass with evidence' },
    ],
  },

  'developer.api-integration': {
    id: 'developer.api-integration',
    label: 'Add an API endpoint or external integration',
    jtbd_outcome_prompt: 'When this integration works, what can the app do that requires talking to an external service?',
    pillars: [3, 2, 6],
    ux_principle: 'none',
    clarifying_questions: [
      'Is this inbound (webhook from external) or outbound (CSPS calls external)?',
      'Does this affect tenant data or is it stateless?',
    ],
    intent_signals: ['API', 'webhook', 'integrate', 'connect', 'external', 'endpoint', 'route', 'handler'],
    steps: [
      { order: 1, title: 'Idempotency Design', description: 'Use withIdempotency() from libs/integrations/webhook-idempotency.ts for inbound webhooks', required: true, acceptance_criterion: 'Idempotency key defined + handler is safe to call twice' },
      { order: 2, title: 'Subscription Gate', description: 'Add requireWriteSubscription() to all write-side routes', required: true, acceptance_criterion: 'Cancelled tenants get 402 with subscription_inactive' },
      { order: 3, title: 'AuditEvent', description: 'Write AuditEvent for every state-changing call', required: true, acceptance_criterion: 'writeAuditEvent() called with correct action name' },
      { order: 4, title: 'Error Format', description: 'Use createError() from libs/integrations/errors.ts — never raw JSON errors', required: true, acceptance_criterion: 'All error responses use CspsError shape' },
      { order: 5, title: 'Verify + ZF', description: 'pnpm verify exit_code=0 + pnpm zf:deep', required: true, acceptance_criterion: 'Both pass with evidence' },
    ],
  },

  'business.billing': {
    id: 'business.billing',
    label: 'Add or modify billing, subscriptions, or pricing',
    jtbd_outcome_prompt: 'When this billing change is live, what can paying customers do that free users cannot?',
    pillars: [3, 2, 6],
    ux_principle: 'progressive-disclosure',
    clarifying_questions: [
      'Is this changing what free users can do, what paid users can do, or both?',
      'Does this require a Stripe product/price change or just config?',
    ],
    intent_signals: ['billing', 'subscription', 'payment', 'stripe', 'price', 'plan', 'trial', 'upgrade', 'seat'],
    steps: [
      { order: 1, title: 'SUBSCRIPTION_CONFIG Update', description: 'Modify libs/config/subscription.config.ts — never hardcode billing values', required: true, acceptance_criterion: 'All values in config, no hardcoded numbers in business logic' },
      { order: 2, title: 'Stripe Product/Price', description: 'Create or update Stripe product in dashboard if needed', required: false, acceptance_criterion: 'STRIPE_TEAM_PRICE_ID matches new price in .env.local' },
      { order: 3, title: 'Webhook Coverage', description: 'Ensure subscription.created + subscription.updated + subscription.deleted all handled', required: true, acceptance_criterion: 'All 3 Stripe events update subscriptionStatus correctly' },
      { order: 4, title: 'Write Route Gates', description: 'requireWriteSubscription() on all routes that respect new tier boundaries', required: true, acceptance_criterion: 'Cancelled tenant blocked, active tenant allowed' },
      { order: 5, title: 'Verify + ZF', description: 'pnpm verify exit_code=0 + pnpm zf:deep', required: true, acceptance_criterion: 'Both pass with evidence' },
    ],
  },

  'business.permissions': {
    id: 'business.permissions',
    label: 'Change what roles can do in the platform',
    jtbd_outcome_prompt: 'When this permission change is live, what can admins do that members cannot (or vice versa)?',
    pillars: [3, 2],
    ux_principle: 'example-driven',
    clarifying_questions: [
      'Which role is gaining or losing access: owner, admin, or member?',
      'Is this a new action or changing an existing permission boundary?',
    ],
    intent_signals: ['permission', 'role', 'admin', 'owner', 'member', 'access', 'restrict', 'allow', 'gate'],
    steps: [
      { order: 1, title: 'ROLE_PERMISSIONS Update', description: 'Modify libs/config/roles.config.ts — never hardcode role checks in business logic', required: true, acceptance_criterion: 'Permission key added to ROLE_PERMISSIONS object' },
      { order: 2, title: 'API Route Gate', description: 'Add hasPermission(role, permissionKey) check in the relevant route', required: true, acceptance_criterion: 'Non-admin gets 403 with permission_denied + required: field' },
      { order: 3, title: 'JWT Role Present', description: 'Confirm role is in JWT claims (Clerk JWT template includes org.membership.role)', required: true, acceptance_criterion: 'mapClerkJwtRole() called, role passed to getEnhancedDb()' },
      { order: 4, title: 'Verify + ZF', description: 'pnpm verify exit_code=0 + pnpm zf:deep', required: true, acceptance_criterion: 'Both pass with evidence' },
    ],
  },

  'ux.onboarding-flow': {
    id: 'ux.onboarding-flow',
    label: 'Improve first-time user experience or onboarding',
    jtbd_outcome_prompt: 'When this onboarding improvement is live, how quickly can a brand new user create their first [core action]?',
    pillars: [4, 3, 2],
    ux_principle: 'wizard-of-oz-validated',
    clarifying_questions: [
      'Where exactly does the user get stuck today? (Sign-up, first login, first action, or inviting teammates?)',
      'Is this for solo users or team users?',
    ],
    intent_signals: ['onboarding', 'first-time', 'signup', 'welcome', 'activation', 'conversion', 'solo', 'new user'],
    steps: [
      { order: 1, title: 'Wizard-of-Oz Simulation', description: 'Manually simulate the new flow 3 times with realistic test cases before building', required: true, acceptance_criterion: '3 simulations run, deviations documented' },
      { order: 2, title: 'solo_user_flow Declaration', description: 'Declare solo_user_flow: auto_org | manual | not_applicable in webhook route', required: true, acceptance_criterion: 'Comment present in route.ts' },
      { order: 3, title: 'JTBD Outcome Statement', description: 'Write: "A new user with no prior context can [accomplish X] within [Y minutes]"', required: true, acceptance_criterion: 'jtbd_outcome: declared in plan frontmatter with time target' },
      { order: 4, title: 'Progressive Disclosure Spec', description: 'Map each screen to one decision — no screen asks more than one thing', required: true, acceptance_criterion: 'Screen map documented: screen → one question → next screen' },
      { order: 5, title: 'Verify + ZF', description: 'pnpm verify + TypeScript 0 errors', required: true, acceptance_criterion: 'All pass with evidence' },
    ],
  },

  'platform.governance': {
    id: 'platform.governance',
    label: 'Add or modify platform governance (validator, contract, principle)',
    jtbd_outcome_prompt: 'When this governance change is live, what behavior is now mechanically prevented that was previously only asked for?',
    pillars: [0, 1],
    ux_principle: 'none',
    clarifying_questions: [
      'Is this a new behavioral contract (B_*), principle (P-*), or validator (validate-*.mjs)?',
      'What specific failure mode does this prevent? (What happened that made this necessary?)',
    ],
    intent_signals: ['validator', 'contract', 'principle', 'governance', 'rule', 'enforce', 'hook', 'audit', 'ZF', 'protocol'],
    steps: [
      { order: 1, title: '§0 CONSOLIDATION CHECK', description: 'Search behavioral-contracts.md and audit-runner.md — never duplicate what exists', required: true, acceptance_criterion: 'No existing contract covers this + search evidence documented' },
      { order: 2, title: 'DNA Gate (P-META-016)', description: 'Check all 14 DNA elements — does this change affect any of them?', required: true, acceptance_criterion: '14 elements checked, affected ones noted' },
      { order: 3, title: 'FSE 5-Surface Plan', description: 'Identify all 5 surfaces: schema + validator + hook + memory + contract', required: true, acceptance_criterion: '5/5 surfaces identified before building any' },
      { order: 4, title: 'Build 5 surfaces atomically', description: 'All 5 surfaces built in same commit — no partial engravings', required: true, acceptance_criterion: 'All 5 in single commit or justified split with explicit linking' },
      { order: 5, title: 'Verify + ZF', description: 'pnpm verify exit_code=0 + pnpm zf:deep ZF ACHIEVED', required: true, acceptance_criterion: 'Both pass with evidence pasted' },
    ],
  },

  'personal.tracking': {
    id: 'personal.tracking',
    label: 'Build a personal domain app feature (habits, health, journaling)',
    jtbd_outcome_prompt: 'When this feature is live, what can a person track about themselves that they couldn\'t track before?',
    pillars: [2, 3, 4],
    ux_principle: 'mobile-first',
    clarifying_questions: [
      'Is this for a single user only, or can it be shared with others?',
      'How often will a user interact with this? (Daily, weekly, on-demand?)',
    ],
    intent_signals: ['track', 'habit', 'health', 'log', 'journal', 'daily', 'personal', 'myself', 'routine'],
    steps: [
      { order: 1, title: 'Solo User Flow Declaration', description: 'This is personal domain → solo_user_flow: auto_org in webhook route', required: true, acceptance_criterion: 'Auto-org creation implemented or explicitly deferred with ticket' },
      { order: 2, title: 'Mobile-First Screen Design', description: 'Design for phone first — the primary capture device for personal tracking', required: true, acceptance_criterion: 'Mobile layout documented, desktop is enhancement not baseline' },
      { order: 3, title: 'Frequency-Aware Schema', description: 'Schema must handle the interaction frequency (daily logs need indexes on date)', required: true, acceptance_criterion: 'Appropriate indexes on date/timestamp fields' },
      { order: 4, title: 'Personal Domain Stamp', description: 'domain_path: personal.[subtype] on all artifacts', required: true, acceptance_criterion: 'frontmatter validated, domain_path present' },
      { order: 5, title: 'Verify + ZF', description: 'pnpm verify + pnpm zf:deep', required: true, acceptance_criterion: 'Both pass' },
    ],
  },

  'knowledge.documentation': {
    id: 'knowledge.documentation',
    label: 'Document architecture, write a guide, or create an ADR',
    jtbd_outcome_prompt: 'When this documentation exists, who will read it and what decision will it help them make?',
    pillars: [0, 4],
    ux_principle: 'progressive-disclosure',
    clarifying_questions: [
      'Is this capturing a decision that was already made, or helping make a future decision?',
      'Who is the primary reader: AI session, developer, or Governor?',
    ],
    intent_signals: ['document', 'write', 'guide', 'explain', 'ADR', 'decision', 'architecture', 'record', 'note'],
    steps: [
      { order: 1, title: 'Reader Identification', description: 'Declare: audience: [ai-agent | developer | governor] in frontmatter', required: true, acceptance_criterion: 'audience field set correctly' },
      { order: 2, title: 'ADR Check', description: 'If this captures an architectural decision → use tools/templates/adr.template.md', required: false, acceptance_criterion: 'ADR template used if applicable' },
      { order: 3, title: 'JTBD Framing', description: 'Opening sentence = outcome: "After reading this, [reader] can [do what]"', required: true, acceptance_criterion: 'First paragraph is outcome-framed, not process-framed' },
      { order: 4, title: 'Frontmatter Complete', description: 'All mandatory frontmatter: id, name, description, version, owner, lifecycle, lifecycle_state, core_spine, schema_anchor, domain_path', required: true, acceptance_criterion: 'validate-frontmatter.mjs errors=0' },
      { order: 5, title: 'Verify', description: 'pnpm verify exit_code=0', required: true, acceptance_criterion: 'Passes' },
    ],
  },

  'none': {
    id: 'none',
    label: 'Explicitly exempt from Threshold routing',
    jtbd_outcome_prompt: 'N/A',
    pillars: [],
    ux_principle: 'none',
    clarifying_questions: [],
    intent_signals: [],
    steps: [
      { order: 1, title: 'Document exemption reason', description: 'Add a comment explaining why this work is exempt from routing', required: true, acceptance_criterion: 'Reason documented inline' },
    ],
  },
};

// AI CLARIFICATION ENGINE
// The initial question is always open: "What's on your plate today?"
// Then AI generates targeted questions to classify intent.
// These are the question templates the AI uses:

export const CLARIFICATION_LOGIC = {
  initialQuestion: "What's on your plate today? (or: What will we work on?)",
  maxClarifyingQuestions: 3,
  classificationThreshold: 0.75, // confidence needed to declare a template match

  // When user says X, check these signals to narrow template space
  signalToTemplateMap: Object.entries(WIZARD_TEMPLATES)
    .filter(([id]) => id !== 'none')
    .reduce((acc, [id, template]) => {
      template.intent_signals.forEach(signal => {
        if (!acc[signal]) acc[signal] = [];
        acc[signal].push(id as ThresholdRoute);
      });
      return acc;
    }, {} as Record<string, ThresholdRoute[]>),
} as const;
