// Weekly digest email

type DigestInput = {
  displayName: string
  weekSummary: string[]
  appName: string
  dashboardUrl: string
}

export function digestEmail({ displayName, weekSummary, appName, dashboardUrl }: DigestInput) {
  const items = weekSummary.map(item => `<li style="margin:4px 0;">${item}</li>`).join('\n')
  const textItems = weekSummary.map(item => `  • ${item}`).join('\n')

  return {
    subject: `Your ${appName} week in review`,
    html: `
<h1>Hi ${displayName},</h1>
<p>Here's what happened this week in <strong>${appName}</strong>:</p>
<ul style="padding-left:20px;color:#333;">${items}</ul>
<p><a href="${dashboardUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">View Dashboard</a></p>
    `.trim(),
    text: `Hi ${displayName},\n\nHere's your week in ${appName}:\n\n${textItems}\n\nView your dashboard: ${dashboardUrl}`,
  }
}
