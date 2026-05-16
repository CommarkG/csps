// S033-B: Send welcome email when a new user is created.
// Triggered by event "user/created" (fired from Clerk webhook handler).
// Retries 3× on failure. Also publishes realtime notification (S035-B).

import { inngest } from '../inngest'
import { sendEmail, welcomeEmail } from '../../index'
import { publishNotification } from '../../realtime/publisher'

export const sendWelcomeEmailFn = inngest.createFunction(
  {
    id: 'send-welcome-email',
    name: 'Send Welcome Email',
    retries: 3,
  },
  { event: 'user/created' },
  async ({ event }) => {
    const { userId, email, displayName, appName, dashboardUrl, tenantId } = event.data as {
      userId: string
      email: string
      displayName?: string
      appName: string
      dashboardUrl: string
      tenantId?: string
    }

    const template = welcomeEmail({
      displayName: displayName ?? email,
      appName,
      dashboardUrl,
    })

    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    // Publish realtime notification (if tenantId available)
    if (tenantId) {
      await publishNotification({
        type: 'user.welcomed',
        payload: { appName, dashboardUrl },
        tenantId,
        userId,
      })
    }

    return { userId, success: result.success, emailId: result.id }
  }
)
