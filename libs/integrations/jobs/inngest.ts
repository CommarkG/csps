// libs/integrations/jobs/inngest.ts
// wiring_deferred_until: S040 (requires 'inngest' package + INNGEST_SIGNING_KEY)

type FnConfig = { id: string; name?: string; retries?: number; [key: string]: unknown }

/* eslint-disable @typescript-eslint/no-explicit-any */
export const inngest = {
  id: 'csps' as const,
  send: async (_event: { name: string; data?: unknown }): Promise<void> => {
    if (!process.env.INNGEST_SIGNING_KEY) return
    console.warn('[csps/jobs] inngest.send: package not installed')
  },
  createFunction: (
    _config: FnConfig,
    _trigger: any,
    _handler: (...args: any[]) => Promise<any>
  ): any => ({ id: _config.id }),
}
