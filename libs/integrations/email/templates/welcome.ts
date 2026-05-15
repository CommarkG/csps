// Welcome email — sent when a new user joins an app

type WelcomeEmailInput = {
  displayName: string
  appName: string
  dashboardUrl: string
}

export function welcomeEmail({ displayName, appName, dashboardUrl }: WelcomeEmailInput) {
  return {
    subject: `Welcome to ${appName}`,
    html: `
<h1>Welcome, ${displayName}!</h1>
<p>Your account for <strong>${appName}</strong> is ready.</p>
<p><a href="${dashboardUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Open Dashboard</a></p>
<p style="color:#666;font-size:14px;">If you have any questions, reply to this email.</p>
    `.trim(),
    text: `Welcome, ${displayName}!\n\nYour account for ${appName} is ready.\n\nOpen your dashboard: ${dashboardUrl}`,
  }
}
