// libs/integrations/jobs/inngest.ts
// S060: wiring_deferred from S040 — now using real Inngest SDK.
// INNGEST_SIGNING_KEY required in prod. In dev without key, events are no-ops.

import { Inngest } from 'inngest'

export const inngest = new Inngest({ id: 'csps' })
