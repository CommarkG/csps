// Plan upgrade confirmation email

type UpgradeInput = {
  displayName: string
  planName: string
  manageUrl: string
}

export function upgradeEmail({ displayName, planName, manageUrl }: UpgradeInput) {
  return {
    subject: `You're now on ${planName}`,
    html: `
<h1>Welcome to ${planName}, ${displayName}!</h1>
<p>Your plan has been upgraded. All ${planName} features are now active.</p>
<p><a href="${manageUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Manage Subscription</a></p>
<p style="color:#666;font-size:14px;">You can manage your plan or cancel anytime from settings.</p>
    `.trim(),
    text: `Welcome to ${planName}, ${displayName}!\n\nAll ${planName} features are now active.\n\nManage your plan: ${manageUrl}`,
  }
}
