// Clerk webhook payload types — subset used by CSPS handlers.
// Mirrors Clerk's WebhookEvent shape without the @clerk/nextjs dependency.
// Replace with: import type { WebhookEvent } from '@clerk/nextjs/server'
// once @clerk/nextjs is installed in the consuming app.

export type ClerkWebhookEvent =
  | UserCreatedEvent
  | OrgCreatedEvent
  | OrgMembershipCreatedEvent

export interface UserCreatedEvent {
  type: 'user.created'
  data: {
    id: string
    email_addresses: Array<{ email_address: string; id: string }>
    first_name: string | null
    last_name: string | null
  }
}

export interface OrgCreatedEvent {
  type: 'organization.created'
  data: {
    id: string
    name: string
    slug: string | null
    created_by: string   // Clerk user ID of the creator
  }
}

export interface OrgMembershipCreatedEvent {
  type: 'organizationMembership.created'
  data: {
    organization: { id: string; name: string }
    public_user_data: { user_id: string }
    role: string   // 'org:admin' | 'org:member' | 'org:owner' etc.
  }
}
