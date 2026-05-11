// Clerk webhook payload types — subset used by CSPS handlers.
// S022 Session 3: extended with user.deleted, organization.deleted,
// organizationMembership.updated, organizationMembership.deleted events.

export type ClerkWebhookEvent =
  | UserCreatedEvent
  | UserDeletedEvent
  | OrgCreatedEvent
  | OrgDeletedEvent
  | OrgMembershipCreatedEvent
  | OrgMembershipUpdatedEvent
  | OrgMembershipDeletedEvent

export interface UserCreatedEvent {
  type: 'user.created'
  data: {
    id: string
    email_addresses: Array<{ email_address: string; id: string }>
    first_name: string | null
    last_name: string | null
  }
}

export interface UserDeletedEvent {
  type: 'user.deleted'
  data: { id: string }
}

export interface OrgCreatedEvent {
  type: 'organization.created'
  data: {
    id: string
    name: string
    slug: string | null
    created_by: string
  }
}

export interface OrgDeletedEvent {
  type: 'organization.deleted'
  data: { id: string }
}

export interface OrgMembershipCreatedEvent {
  type: 'organizationMembership.created'
  data: {
    organization: { id: string; name: string }
    public_user_data: { user_id: string }
    role: string
  }
}

export interface OrgMembershipUpdatedEvent {
  type: 'organizationMembership.updated'
  data: {
    organization: { id: string; name: string }
    public_user_data: { user_id: string }
    role: string
  }
}

export interface OrgMembershipDeletedEvent {
  type: 'organizationMembership.deleted'
  data: {
    organization: { id: string; name: string }
    public_user_data: { user_id: string }
  }
}
