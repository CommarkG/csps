// libs/integrations/monitoring/posthog.ts
// S033-C: Server-side PostHog analytics helpers.
// Graceful passthrough when POSTHOG_API_KEY not set.
//
// For client-side analytics: install posthog-js in each app — server-side only here.
// Default host: https://app.posthog.com (EU: https://eu.posthog.com)

import { PostHog } from 'posthog-node'

let client: PostHog | null = null

function getClient(): PostHog | null {
  const apiKey = process.env.POSTHOG_API_KEY
  if (!apiKey) return null

  if (!client) {
    client = new PostHog(apiKey, {
      host: process.env.POSTHOG_HOST ?? 'https://app.posthog.com',
      flushAt: 20,
      flushInterval: 10000,
    })
  }
  return client
}

export function track(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
): void {
  const ph = getClient()
  if (!ph) return
  ph.capture({ distinctId, event, properties })
}

export function identify(
  distinctId: string,
  properties: Record<string, unknown>
): void {
  const ph = getClient()
  if (!ph) return
  ph.identify({ distinctId, properties })
}

export function groupIdentify(
  groupType: string,
  groupKey: string,
  properties: Record<string, unknown>
): void {
  const ph = getClient()
  if (!ph) return
  ph.groupIdentify({ groupType, groupKey, properties })
}

/** Call at process exit to flush remaining events */
export async function shutdownPostHog(): Promise<void> {
  if (client) {
    await client.shutdown()
    client = null
  }
}
