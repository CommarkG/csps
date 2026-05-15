// Trial expiry reminder email

type TrialExpiryInput = {
  displayName: string
  daysLeft: number
  upgradeUrl: string
}

export function trialExpiryEmail({ displayName, daysLeft, upgradeUrl }: TrialExpiryInput) {
  const urgency = daysLeft <= 1 ? 'expires today' : `expires in ${daysLeft} days`
  return {
    subject: `Your trial ${urgency}`,
    html: `
<h1>Hi ${displayName},</h1>
<p>Your free trial <strong>${urgency}</strong>. Upgrade to keep access to all features.</p>
<p><a href="${upgradeUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Upgrade Now</a></p>
<p style="color:#666;font-size:14px;">After your trial ends, your data is retained for 30 days.</p>
    `.trim(),
    text: `Hi ${displayName},\n\nYour free trial ${urgency}.\n\nUpgrade to continue: ${upgradeUrl}`,
  }
}
