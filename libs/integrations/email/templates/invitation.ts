// Team invitation email

type InvitationInput = {
  inviterName: string
  tenantName: string
  acceptUrl: string
  expiresAt: Date
}

export function invitationEmail({ inviterName, tenantName, acceptUrl, expiresAt }: InvitationInput) {
  const expiry = expiresAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return {
    subject: `${inviterName} invited you to join ${tenantName}`,
    html: `
<h1>You're invited!</h1>
<p><strong>${inviterName}</strong> has invited you to join <strong>${tenantName}</strong>.</p>
<p><a href="${acceptUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Accept Invitation</a></p>
<p style="color:#666;font-size:14px;">This invitation expires on ${expiry}.</p>
    `.trim(),
    text: `${inviterName} invited you to join ${tenantName}.\n\nAccept here: ${acceptUrl}\n\nExpires: ${expiry}`,
  }
}
