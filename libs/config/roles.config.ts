// CSPS Role Permissions Configuration
// Governor flexibility doctrine (S022): every permission boundary is in config, not hardcoded.
// Adding a new permission or changing a role boundary = edit ROLE_PERMISSIONS here only.
//
// Q-04 ratified: project creation — any member (owner/admin/member)
// Q-05 ratified: project archive — admin+ only (owner/admin)
// Q-06 ratified: member invitation — admin+ only (owner/admin)
// Q-07 ratified: task reassignment — any member
// Q-18 ratified: audit log read — admin+ only

export type MembershipRole = 'owner' | 'admin' | 'member';

export const ROLE_PERMISSIONS = {
  projectCreate:  ['owner', 'admin', 'member'] as MembershipRole[],  // Q-04: any member
  projectArchive: ['owner', 'admin'] as MembershipRole[],            // Q-05: admin+
  memberInvite:   ['owner', 'admin'] as MembershipRole[],            // Q-06: admin+
  taskReassign:   ['owner', 'admin', 'member'] as MembershipRole[],  // Q-07: any member
  auditRead:      ['owner', 'admin'] as MembershipRole[],            // Q-18: admin+
} as const;

export type PermissionKey = keyof typeof ROLE_PERMISSIONS;

export function hasPermission(role: MembershipRole, permission: PermissionKey): boolean {
  return (ROLE_PERMISSIONS[permission] as readonly string[]).includes(role);
}

export function requirePermission(role: MembershipRole, permission: PermissionKey): void {
  if (!hasPermission(role, permission)) {
    throw new PermissionDeniedError(permission, role);
  }
}

export class PermissionDeniedError extends Error {
  readonly statusCode = 403;
  readonly code = 'permission_denied' as const;

  constructor(permission: PermissionKey, role: MembershipRole) {
    super(`Role '${role}' does not have permission '${permission}'`);
  }
}
