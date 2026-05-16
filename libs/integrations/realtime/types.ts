// libs/integrations/realtime/types.ts
// S035-B: Platform realtime notification event type.

export type NotificationEvent = {
  type: string
  payload: Record<string, unknown>
  tenantId: string
  userId: string
  timestamp?: number
}
