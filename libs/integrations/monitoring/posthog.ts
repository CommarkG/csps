// libs/integrations/monitoring/posthog.ts
// wiring_deferred_until: S040 (requires pnpm add posthog-node + POSTHOG_API_KEY)
// Stub: no-op until posthog-node installed + env var set

export function track(
  _distinctId: string,
  _event: string,
  _properties?: Record<string, unknown>
): void {
  // no-op until posthog-node installed
}

export function identify(
  _distinctId: string,
  _properties: Record<string, unknown>
): void {
  // no-op until posthog-node installed
}

export function groupIdentify(
  _groupType: string,
  _groupKey: string,
  _properties: Record<string, unknown>
): void {
  // no-op until posthog-node installed
}

export async function shutdownPostHog(): Promise<void> {
  // no-op until posthog-node installed
}
